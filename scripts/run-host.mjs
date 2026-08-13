#!/usr/bin/env node
// The external host runner: polls the app for queued blends and generates
// them through the `claude` CLI in print mode — no Anthropic API key, just
// the machine's existing Claude Code OAuth login. OpenClaw/Hermes can run
// this same loop (or reimplement it) against the same two endpoints.
//
// Usage:  node scripts/run-host.mjs [--loop <seconds>]
// Env:    APP_URL (default http://localhost:3000)
//         CRON_SECRET (read from .env.local when unset)
//         HOST_CLI_MODEL (optional --model for the claude CLI, e.g. "opus")

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

function envFromDotLocal(name) {
  if (process.env[name]) return process.env[name];
  if (!existsSync(".env.local")) return undefined;
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const idx = line.indexOf("=");
    if (idx > 0 && line.slice(0, idx) === name) return line.slice(idx + 1).trim();
  }
  return undefined;
}

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const SECRET = envFromDotLocal("CRON_SECRET");
if (!SECRET) {
  console.error("CRON_SECRET not found (env or .env.local)");
  process.exit(1);
}
const AUTH = { authorization: `Bearer ${SECRET}` };

function extractJson(text) {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no JSON object in CLI output");
  return JSON.parse(trimmed.slice(start, end + 1));
}

function generate(systemPrompt, payload) {
  const prompt = [
    systemPrompt,
    "",
    "<input>",
    JSON.stringify(payload),
    "</input>",
    "",
    "Respond with the JSON object only.",
  ].join("\n");

  const args = ["-p", "--output-format", "json"];
  const model = process.env.HOST_CLI_MODEL;
  if (model) args.push("--model", model);

  const res = spawnSync("claude", args, {
    input: prompt,
    encoding: "utf8",
    timeout: 10 * 60 * 1000,
    maxBuffer: 32 * 1024 * 1024,
  });
  if (res.status !== 0) {
    throw new Error(`claude CLI exited ${res.status}: ${(res.stderr || "").slice(0, 300)}`);
  }
  const wrapper = JSON.parse(res.stdout);
  if (wrapper.is_error) throw new Error(`claude CLI error: ${String(wrapper.result).slice(0, 300)}`);
  return extractJson(String(wrapper.result));
}

async function runOnce() {
  const res = await fetch(`${APP_URL}/api/host/pending`, { headers: AUTH });
  if (!res.ok) throw new Error(`pending fetch failed: HTTP ${res.status}`);
  const { systemPrompt, jobs } = await res.json();
  if (!jobs.length) {
    console.log("no pending blends");
    return 0;
  }

  for (const job of jobs) {
    const label = `blend ${job.blendId.slice(0, 8)} (circle ${job.circleId.slice(0, 8)}, ${job.trigger})`;
    console.log(`→ ${label}: ${job.payload.members.length} members, ${job.payload.items.length} items`);
    let body;
    try {
      const output = generate(systemPrompt, job.payload);
      body = { blendId: job.blendId, circleId: job.circleId, model: "claude-cli", output };
    } catch (err) {
      console.error(`  generation failed: ${err.message}`);
      body = { blendId: job.blendId, circleId: job.circleId, model: "claude-cli", failed: String(err.message).slice(0, 480) };
    }
    const done = await fetch(`${APP_URL}/api/host/complete`, {
      method: "POST",
      headers: { ...AUTH, "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await done.json();
    console.log(`  ← ${done.status}: ${JSON.stringify(result)}`);
  }
  return jobs.length;
}

const loopIdx = process.argv.indexOf("--loop");
if (loopIdx !== -1) {
  const seconds = Number(process.argv[loopIdx + 1] || 300);
  console.log(`host runner looping every ${seconds}s against ${APP_URL}`);
  for (;;) {
    try {
      await runOnce();
    } catch (err) {
      console.error(err.message);
    }
    await new Promise((r) => setTimeout(r, seconds * 1000));
  }
} else {
  await runOnce();
}

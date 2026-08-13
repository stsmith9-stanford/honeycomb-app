import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: this repo lives inside a git worktree next to
  // other lockfiles, which Turbopack would otherwise infer as the root.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

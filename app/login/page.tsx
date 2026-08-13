import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { BrandMark } from "@/components/brand-mark";

import "../auth.css";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — Honeycomb",
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <Link className="auth-brand" href="/">
        <BrandMark />
        Honeycomb
      </Link>
      <div className="auth-card">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

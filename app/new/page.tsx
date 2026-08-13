import type { Metadata } from "next";

import { AppHeader } from "@/components/app-header";

import "../app.css";
import { NewCircleForm } from "./new-circle-form";

export const metadata: Metadata = {
  title: "Start a circle — Honeycomb",
};

export default function NewCirclePage() {
  return (
    <div className="app-page">
      <AppHeader />
      <main className="app-main app-main--center">
        <div className="app-wrap app-wrap--narrow">
          <NewCircleForm />
        </div>
      </main>
    </div>
  );
}

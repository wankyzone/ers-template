import type { ReplayProfile } from "./replaySeedDb";
import { replaySeedDb } from "./replaySeedDb";
import fetch from "node-fetch";

export async function runReplaySeedForProfile(profile: ReplayProfile) {

  await replaySeedDb(profile);
  const orchestratorUrl = process.env.ORCHESTRATOR_INTERNAL_URL;
  if (!orchestratorUrl) {
    console.warn("⚠️ ORCHESTRATOR_INTERNAL_URL not set, skipping job replay.");
    return;
  }

  const resp = await fetch(`${orchestratorUrl}/internal/replay-seed-jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile }),
  });

  if (!resp.ok) {
    console.error(
      "❌ Orchestrator replay error:",
      resp.status,
      await resp.text()
    );
  }
}
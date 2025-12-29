import { createClient } from "@supabase/supabase-js";
import { enqueueJob } from "../queueClient"; // your existing enqueue helper
import { randomUUID } from "node:crypto";

export type ReplayProfile = "light" | "medium" | "heavy";

export async function replaySeedJobs(profile: ReplayProfile = "medium") {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let limit = 20;
  if (profile === "light") limit = 5;
  if (profile === "medium") limit = 20;
  if (profile === "heavy") limit = 60;

  const pattern =
    profile === "light"
      ? "seed-light-%"
      : profile === "heavy"
      ? "seed-heavy-%"
      : "seed-%";

  const { data, error } = await supabase
    .from("orchestrator_retry_log")
    .select("queue_name, job_id, status, error_message, created_at")
    .like("job_id", pattern)
    .limit(limit);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    console.warn(
      `⚠️ No seed retry logs found to replay for profile "${profile}".`
    );
    return;
  }

  for (const row of data) {
    const newJobId = `replay-${profile}-${randomUUID()}`;

    const payload = {
      replay_source_job_id: row.job_id,
      replay_profile: profile,
      replay_seed: true,
      created_at_original: row.created_at,
      error_message_original: row.error_message,
    };

    await enqueueJob(row.queue_name, {
      id: newJobId,
      payload,
    });
  }
}
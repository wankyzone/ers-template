import { createClient } from "@supabase/supabase-js";
import { enqueueJob } from "../dist/queueClient.js"; // adjust path
import { randomUUID } from "node:crypto";
import { replaySeedJobs } from "../dist/services/replaySeedJobs.js";


function parseArgs() {
  const args = process.argv.slice(2);
  let profile = "medium";
  for (const arg of args) {
    if (arg.startsWith("--profile=")) {
      profile = arg.split("=")[1];
    }
  }
  if (!["light", "medium", "heavy"].includes(profile)) {
    console.warn(`⚠️ Unknown profile "${profile}", falling back to "medium"`);
    profile = "medium";
  }
  return { profile };
}

async function main() {
  const { profile } = parseArgs();

  const {
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  console.log(`🔍 Fetching seed retry logs for replay (profile="${profile}")...`);

  let limit = 20;
  if (profile === "light") limit = 5;
  if (profile === "medium") limit = 20;
  if (profile === "heavy") limit = 60;

  const { data, error } = await supabase
    .from("orchestrator_retry_log")
    .select("queue_name, job_id, status, error_message, created_at")
    .like("job_id", profile === "light" ? "seed-light-%" :
                   profile === "heavy" ? "seed-heavy-%" :
                   "seed-%")
    .limit(limit);

  if (error) {
    console.error("❌ Error loading seed logs:", error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("⚠️ No seed retry logs found to replay for this profile.");
    return;
  }

  console.log(`📦 Replaying ${data.length} synthetic jobs into orchestrator...`);

  for (const row of data) {
    const newJobId = `replay-${profile}-${randomUUID()}`;

    const payload = {
      replay_source_job_id: row.job_id,
      replay_profile: profile,
      replay_seed: true,
      created_at_original: row.created_at,
      error_message_original: row.error_message,
    };

    console.log(
      `➡️ Enqueue into ${row.queue_name} as ${newJobId} (from ${row.job_id}, profile=${profile})`
    );

    try {
      await enqueueJob(row.queue_name, {
        id: newJobId,
        payload,
      });
    } catch (err) {
      console.error(`❌ Failed to enqueue job into ${row.queue_name}:`, err);
    }
  }

  console.log("✅ Replay jobs enqueued. Watch orchestrator + dashboards.");
}

main();

function parseArgs() {
  const args = process.argv.slice(2);
  let profile = "medium";
  for (const arg of args) {
    if (arg.startsWith("--profile=")) {
      profile = arg.split("=")[1];
    }
  }
  if (!["light", "medium", "heavy"].includes(profile)) {
    console.warn(`⚠️ Unknown profile "${profile}", falling back to "medium"`);
    profile = "medium";
  }
  return { profile };
}

(async () => {
  const { profile } = parseArgs();
  console.log(`📦 Replay seed jobs profile="${profile}"`);
  await replaySeedJobs(profile);
  console.log("✅ Done.");
})();

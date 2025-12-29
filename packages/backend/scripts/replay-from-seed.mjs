import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";
import { replaySeedDb } from "../dist/services/replaySeedDb.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs() {
  const args = process.argv.slice(2);
  let profile = "medium"; // default

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
    DATABASE_URL,
    SUPABASE_DB_URL, // optional alias if you use that
  } = process.env;

  const dbUrl = SUPABASE_DB_URL || DATABASE_URL;

  if (!dbUrl) {
    console.error("❌ DATABASE_URL or SUPABASE_DB_URL is required");
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
  });

  console.log(`🔄 Connecting to DB with profile "${profile}"...`);
  await client.connect();

  try {
    // 1) Run reset script
    const resetPath = path.join(
      __dirname,
      "..",
      "supabase",
      "seed",
      "000_reset_orchestrator_analytics.sql"
    );
    const resetSql = fs.readFileSync(resetPath, "utf8");

    console.log("🧹 Truncating analytics + DLQ tables...");
    await client.query(resetSql);
    console.log("✅ Reset done.");

    // 2) Run seed script(s) depending on profile
    let seedFiles = [];

    if (profile === "light") {
      seedFiles = [
        "010_seed_orchestrator_retry_light.sql",
      ];
    } else if (profile === "medium") {
      seedFiles = [
        "020_seed_orchestrator_retry_medium.sql",
      ];
    } else if (profile === "heavy") {
      seedFiles = [
        "020_seed_orchestrator_retry_medium.sql",
        "030_seed_orchestrator_retry_heavy.sql",
      ];
    }

    for (const fileName of seedFiles) {
      const seedPath = path.join(
        __dirname,
        "..",
        "supabase",
        "seed",
        fileName
      );
      if (!fs.existsSync(seedPath)) {
        console.warn(`⚠️ Seed file not found: ${seedPath}, skipping.`);
        continue;
      }
      const seedSql = fs.readFileSync(seedPath, "utf8");
      console.log(`🌱 Applying seed file: ${fileName} ...`);
      await client.query(seedSql);
    }

    console.log(`🎉 Replay-from-seed (DB layer) complete for profile "${profile}".`);
  } catch (err) {
    console.error("❌ Error during replay-from-seed:", err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
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
  console.log(`🔁 DB replay-from-seed profile="${profile}"`);
  await replaySeedDb(profile);
  console.log("✅ Done.");
})();
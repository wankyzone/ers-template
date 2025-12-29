#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
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

  console.log("🔄 Connecting to DB...");
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

    // 2) Run seed script
    const seedPath = path.join(
      __dirname,
      "..",
      "supabase",
      "seed",
      "001_seed_orchestrator_retry_log.sql"
    );
    const seedSql = fs.readFileSync(seedPath, "utf8");

    console.log("🌱 Seeding retry analytics data...");
    await client.query(seedSql);
    console.log("✅ Seed done.");

    console.log("🎉 Replay-from-seed (DB layer) complete.");
  } catch (err) {
    console.error("❌ Error during replay-from-seed:", err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();

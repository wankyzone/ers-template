import fs from "node:fs";
import path from "node:path";
import { Client } from "pg";

export type ReplayProfile = "light" | "medium" | "heavy";

export async function replaySeedDb(profile: ReplayProfile = "medium") {
  const {
    DATABASE_URL,
    SUPABASE_DB_URL, // optional alias
  } = process.env;

  const dbUrl = SUPABASE_DB_URL || DATABASE_URL;

  if (!dbUrl) {
    throw new Error("DATABASE_URL or SUPABASE_DB_URL is required");
  }

  const client = new Client({
    connectionString: dbUrl,
  });

  await client.connect();

  try {
    const baseSeedDir = path.join(process.cwd(), "supabase", "seed");

    // Reset
    const resetPath = path.join(
      baseSeedDir,
      "000_reset_orchestrator_analytics.sql"
    );
    const resetSql = fs.readFileSync(resetPath, "utf8");
    await client.query(resetSql);

    // Profile-specific seed files
    let seedFiles: string[] = [];

    if (profile === "light") {
      seedFiles = ["010_seed_orchestrator_retry_light.sql"];
    } else if (profile === "medium") {
      seedFiles = ["020_seed_orchestrator_retry_medium.sql"];
    } else if (profile === "heavy") {
      seedFiles = [
        "020_seed_orchestrator_retry_medium.sql",
        "030_seed_orchestrator_retry_heavy.sql",
      ];
    }

    for (const fileName of seedFiles) {
      const seedPath = path.join(baseSeedDir, fileName);
      if (!fs.existsSync(seedPath)) continue;
      const seedSql = fs.readFileSync(seedPath, "utf8");
      await client.query(seedSql);
    }
  } finally {
    await client.end();
  }
}

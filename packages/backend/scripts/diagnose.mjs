import { execSync } from "child_process";
import dotenv from "dotenv";
import chalk from "chalk";
import { createClient } from "@supabase/supabase-js";
import Redis from "ioredis";
import fs from "fs";

// Load env variables
dotenv.config();

console.log(chalk.cyan.bold("\n🚦 ERS Diagnostic Script Starting...\n"));

const checks = [];

async function runCheck(name, fn) {
  process.stdout.write(chalk.yellow(`→ ${name}... `));
  try {
    await fn();
    console.log(chalk.green("OK"));
    checks.push({ name, status: "ok" });
  } catch (err) {
    console.log(chalk.red("FAILED"));
    console.error(chalk.redBright("  ↳ " + (err.message || err)));
    checks.push({ name, status: "failed" });
  }
}

// --- 1. Workspace integrity check
await runCheck("PNPM workspace integrity", () => {
  const yamlExists = fs.existsSync("./pnpm-workspace.yaml");
  if (!yamlExists) throw new Error("Missing pnpm-workspace.yaml at root.");
  execSync("pnpm -v", { stdio: "ignore" });
});

// --- 2. TypeScript compile sanity check
await runCheck("TypeScript compile check", () => {
  execSync("pnpm -r tsc --noEmit", { stdio: "ignore" });
});

// --- 3. Redis connection
await runCheck("Redis connection", async () => {
  if (!process.env.REDIS_URL && !process.env.REDIS_HOST)
    throw new Error("Missing Redis connection info in .env");

  const redis =
    process.env.REDIS_URL
      ? new Redis(process.env.REDIS_URL)
      : new Redis({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT || 6379,
        });

  const pong = await redis.ping();
  if (pong !== "PONG") throw new Error("Redis not responding");
  redis.disconnect();
});

// --- 4. Supabase connection
await runCheck("Supabase connection", async () => {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)
    throw new Error("Missing Supabase credentials in .env");

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await supabase.from("profiles").select("*").limit(1);
  if (error) throw error;
});

// --- 5. Env consistency
await runCheck("Environment variable consistency", () => {
  const required = [
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "REDIS_URL",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) throw new Error(`Missing env vars: ${missing.join(", ")}`);
});

// --- 6. Worker & backend presence
await runCheck("Backend and worker packages", () => {
  const backendExists = fs.existsSync("./apps/backend/package.json");
  const notifExists = fs.existsSync("./apps/notifications/package.json");
  if (!backendExists || !notifExists)
    throw new Error("Missing backend or notifications package.json");
});

console.log("\n📋 Diagnostic Summary:");
checks.forEach((c) => {
  const symbol = c.status === "ok" ? "✅" : "❌";
  console.log(` ${symbol} ${c.name}`);
});

const failed = checks.filter((c) => c.status === "failed");
if (failed.length === 0) {
  console.log(chalk.green.bold("\n🎉 All systems operational!\n"));
  process.exit(0);
} else {
  console.log(
    chalk.red.bold(`\n⚠️ ${failed.length} checks failed. Fix before continuing.\n`)
  );
  process.exit(1);
}

import { execSync } from "child_process";

const colors = {
  cyan: (t: string) => `\x1b[36m${t}\x1b[0m`,
  green: (t: string) => `\x1b[32m${t}\x1b[0m`,
  red: (t: string) => `\x1b[31m${t}\x1b[0m`,
  bold: (t: string) => `\x1b[1m${t}\x1b[0m`,
};

function run(command: string, description: string) {
  console.log(colors.cyan(`\n🔹 ${description}`));
  try {
    execSync(command, { stdio: "inherit" });
    console.log(colors.green(`✅ ${description} completed successfully.`));
  } catch (err) {
    console.error(colors.red(`❌ ${description} failed.`));
  }
}

async function main() {
  console.log(colors.bold("\n🚦 Running ERS Monorepo Healthcheck..."));

  run("pnpm install --recursive", "Installing and linking dependencies");
  run("pnpm dedupe", "Deduplicating dependencies");
  run("pnpm outdated", "Checking for outdated packages");
  run("pnpm --recursive exec tsc --noEmit", "TypeScript integrity check");
  run("pnpm --recursive run lint", "Running linter across all workspaces");
  run("pnpm list --depth -1", "Listing linked internal packages");

  console.log(colors.cyan("\n🔹 Validating environment variables..."));
  const requiredEnv = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "REDIS_URL",
    "SERVICE_ROLE_KEY",
  ];

  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.log(colors.red(`❌ Missing environment variables: ${missing.join(", ")}`));
  } else {
    console.log(colors.green("✅ All required environment variables found."));
  }

  console.log(colors.bold("\n🚀 Healthcheck complete.\n"));
}

main();

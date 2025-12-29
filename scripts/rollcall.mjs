#!/usr/bin/env node
import { execSync } from "child_process";
import chalk from "chalk";

const steps = [
  {
    name: "Clean old builds",
    cmd: "pnpm -r run clean || true",
  },
  {
    name: "Check TypeScript across all workspaces",
    cmd: "pnpm -r tsc --noEmit",
  },
  {
    name: "Run ESLint and auto-fix issues",
    cmd: "pnpm -r eslint . --ext .ts,.tsx --fix",
  },
  {
    name: "Format with Prettier",
    cmd: "pnpm -r prettier --write .",
  },
  {
    name: "Reinstall dependencies",
    cmd: "pnpm install --prefer-offline",
  },
  {
    name: "Rebuild all packages",
    cmd: "pnpm -r build",
  },
];

console.log(chalk.cyan.bold("\n🧾 Running ERS Code Roll Call...\n"));

for (const step of steps) {
  process.stdout.write(chalk.yellow(`→ ${step.name}... `));
  try {
    execSync(step.cmd, { stdio: "ignore" });
    console.log(chalk.green("OK"));
  } catch (err) {
    console.log(chalk.red("FAILED"));
    console.error(chalk.redBright("  ↳ " + err.message));
  }
}

console.log(chalk.green.bold("\n✅ Code Roll Call Complete!\n"));

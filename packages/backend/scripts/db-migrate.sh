#!/usr/bin/env bash
set -e

# Detect environment type
if [ -n "$CI" ]; then
  echo "🔹 Running in CI mode — using GitHub's Postgres service..."
  export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
else
  echo "🔹 Running locally — using .env DATABASE_URL..."
  export DATABASE_URL=$(grep DATABASE_URL .env | cut -d '=' -f2-)
fi

# Validate connection string
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not found! Make sure .env is configured or CI vars are set."
  exit 1
fi

# Apply Supabase migrations
echo "🚀 Pushing migrations to database..."
supabase db push --db-url "$DATABASE_URL" --include-all --debug

echo "✅ Migrations completed successfully!"

#!/usr/bin/env bash
set -e

# Auto-detect environment
if [ -n "$CI" ]; then
  echo "🔹 Running in CI mode — using GitHub's Postgres service..."
  export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
else
  echo "🔹 Running locally — using .env DATABASE_URL..."
  export DATABASE_URL=$(grep DATABASE_URL .env | cut -d '=' -f2-)
fi

# Run migrations
echo "🚀 Pushing migrations to database..."
supabase db push --db-url "$DATABASE_URL" --include-all --debug

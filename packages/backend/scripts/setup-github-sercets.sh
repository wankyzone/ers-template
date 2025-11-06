#!/bin/bash
# scripts/setup-github-secrets.sh
# Auto-uploads .env values to GitHub Actions secrets for this repo.

set -e

REPO="wankyzone/ers-template" # Automatically target your repo
ENV_PATH="../../.env"

echo "Initializing GitHub Actions secret sync for $REPO..."

if [ ! -f "$ENV_PATH" ]; then
  echo "ERROR: .env file not found at $ENV_PATH"
  exit 1
fi

if ! command -v gh &> /dev/null; then
  echo "GitHub CLI not installed. Installing..."
  sudo apt update && sudo apt install gh -y
fi

echo "Authenticating with GitHub..."
gh auth status || gh auth login

echo "Reading $ENV_PATH and pushing secrets to $REPO..."

while IFS='=' read -r key value; do
  # Skip comments and empty lines
  if [[ -z "$key" || "$key" =~ ^# ]]; then
    continue
  fi

  # Trim whitespace
  key=$(echo "$key" | xargs)
  value=$(echo "$value" | xargs)

  # Push to GitHub Secrets
  gh secret set "$key" --body "$value" --repo "$REPO" >/dev/null 2>&1
  echo "Secret synced: $key"
done < "$ENV_PATH"

echo "All secrets have been successfully uploaded to $REPO"

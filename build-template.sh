#!/bin/bash
# build-template.sh
# Usage: ./scripts/build-template.sh <template-slug>
# Example: ./scripts/build-template.sh template-001

set -e

TEMPLATE=$1

if [ -z "$TEMPLATE" ]; then
  echo "ERROR: Missing template slug"
  echo "Usage: ./scripts/build-template.sh <template-slug>"
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "[$(date +%T)] Building $TEMPLATE..."
cd $REPO_ROOT
pnpm --filter $TEMPLATE build
echo "[$(date +%T)] ✓ Build complete → apps/templates/$TEMPLATE/dist/"

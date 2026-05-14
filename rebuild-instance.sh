#!/bin/bash
# rebuild-instance.sh
# Rebuilds the template and redeploys static files for an existing instance.
# Usage: ./rebuild-instance.sh <template-slug> <instance-slug>

set -e

TEMPLATE=$1
SLUG=$2

if [ -z "$TEMPLATE" ] || [ -z "$SLUG" ]; then
  echo "ERROR: Missing arguments"
  echo "Usage: ./rebuild-instance.sh <template-slug> <instance-slug>"
  exit 1
fi

REPO_ROOT=/var/www/farhty
INSTANCES_ROOT=/var/www/instances
INSTANCE_DIR=$INSTANCES_ROOT/$SLUG

if [ ! -d "$INSTANCE_DIR" ]; then
  echo "ERROR: Instance directory not found: $INSTANCE_DIR"
  exit 1
fi

echo "[$(date +%T)] Rebuilding $TEMPLATE → $SLUG.farhty.online"

# Step 1: Build the template
echo "[$(date +%T)] Building $TEMPLATE..."
cd $REPO_ROOT
pnpm --filter $TEMPLATE build
echo "[$(date +%T)] Build complete ✓"

# Step 2: Copy build output (overwrite existing files)
echo "[$(date +%T)] Copying dist to $INSTANCE_DIR..."
cp -r $REPO_ROOT/apps/templates/$TEMPLATE/dist/* $INSTANCE_DIR/

# Step 3: Refresh config.json (keeps slug + apiBase current)
echo "[$(date +%T)] Refreshing config.json..."
cat > $INSTANCE_DIR/config.json << EOF
{
  "slug": "$SLUG",
  "template": "$TEMPLATE",
  "apiBase": "https://api.farhty.online"
}
EOF

# Step 4: Reload nginx to pick up any changed static files
echo "[$(date +%T)] Reloading nginx..."
systemctl reload nginx

echo "[$(date +%T)] ✓ Rebuild complete"
echo "[$(date +%T)] Live at → https://$SLUG.farhty.online"

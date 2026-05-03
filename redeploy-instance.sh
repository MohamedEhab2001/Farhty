#!/bin/bash
# redeploy-instance.sh
# Rebuild a template and push to an existing instance folder.
# Usage: ./redeploy-instance.sh <template-slug> <instance-slug>
# Example: ./redeploy-instance.sh template-001 ahmed-sara

set -e

TEMPLATE=$1
SLUG=$2

if [ -z "$TEMPLATE" ] || [ -z "$SLUG" ]; then
  echo "ERROR: Missing arguments"
  echo "Usage: ./redeploy-instance.sh <template-slug> <instance-slug>"
  exit 1
fi

REPO_ROOT=/var/www/farhty
INSTANCES_ROOT=/var/www/instances
INSTANCE_DIR=$INSTANCES_ROOT/$SLUG

echo "[$(date +%T)] Redeploying $TEMPLATE → $SLUG.farhty.online"

# Step 1: Build
echo "[$(date +%T)] Building $TEMPLATE..."
cd $REPO_ROOT
pnpm --filter $TEMPLATE build
echo "[$(date +%T)] Build complete ✓"

# Step 2: Backup old config (preserve slug/apiBase)
BACKUP_CONFIG=$(cat $INSTANCE_DIR/config.json 2>/dev/null || echo '{}')

# Step 3: Overwrite instance folder
echo "[$(date +%T)] Copying build to $INSTANCE_DIR..."
rm -rf $INSTANCE_DIR
mkdir -p $INSTANCE_DIR
cp -r $REPO_ROOT/apps/templates/$TEMPLATE/dist/* $INSTANCE_DIR/

# Step 4: Restore config (slug/template/apiBase must stay correct)
echo "[$(date +%T)] Restoring instance config..."
cat > $INSTANCE_DIR/config.json << EOF
{
  "slug": "$SLUG",
  "template": "$TEMPLATE",
  "apiBase": "https://api.farhty.online"
}
EOF

echo "[$(date +%T)] ✓ Redeployment complete"
echo "[$(date +%T)] Live at → https://$SLUG.farhty.online"

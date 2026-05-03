#!/bin/bash
# deploy-instance.sh
# Usage: ./scripts/deploy-instance.sh <template-slug> <instance-slug>
# Example: ./scripts/deploy-instance.sh template-001 ahmed-sara

set -e

TEMPLATE=$1
SLUG=$2

if [ -z "$TEMPLATE" ] || [ -z "$SLUG" ]; then
  echo "ERROR: Missing arguments"
  echo "Usage: ./scripts/deploy-instance.sh <template-slug> <instance-slug>"
  exit 1
fi

REPO_ROOT=/var/www/farhty
INSTANCES_ROOT=/var/www/instances
INSTANCE_DIR=$INSTANCES_ROOT/$SLUG

echo "[$(date +%T)] Starting deployment of $TEMPLATE → $SLUG.farhty.online"

# Step 1: Build the template
echo "[$(date +%T)] Building $TEMPLATE..."
cd $REPO_ROOT
pnpm --filter $TEMPLATE build

echo "[$(date +%T)] Build complete ✓"

# Step 2: Create instance directory
echo "[$(date +%T)] Preparing $INSTANCE_DIR..."
mkdir -p $INSTANCE_DIR

# Step 3: Copy build output
echo "[$(date +%T)] Copying build to $INSTANCE_DIR..."
cp -r $REPO_ROOT/apps/templates/$TEMPLATE/dist/* $INSTANCE_DIR/

# Step 4: Write instance config (overrides the empty config.json from build)
echo "[$(date +%T)] Writing instance config..."
cat > $INSTANCE_DIR/config.json << EOF
{
  "slug": "$SLUG",
  "template": "$TEMPLATE",
  "apiBase": "https://api.farhty.online"
}
EOF

# Step 5: Create Nginx configuration
echo "[$(date +%T)] Creating Nginx configuration..."
NGINX_CONF="/etc/nginx/sites-available/$SLUG.farhty.online"
cat > $NGINX_CONF << EOF
server {
    listen 80;
    server_name $SLUG.farhty.online;

    root $INSTANCE_DIR;
    index index.html;

    location / {
        try_files \\$uri \\$uri/ /index.html;
    }
}
EOF

# Step 6: Enable Nginx configuration
echo "[$(date +%T)] Enabling Nginx site..."
ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
systemctl reload nginx

# Step 7: Issue SSL Certificate
echo "[$(date +%T)] Provisioning SSL with Certbot..."
certbot --nginx -d $SLUG.farhty.online

echo "[$(date +%T)] ✓ Deployed successfully"
echo "[$(date +%T)] Live at → https://$SLUG.farhty.online"

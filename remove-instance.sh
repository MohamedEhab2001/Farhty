#!/bin/bash
# remove-instance.sh
# Usage: ./remove-instance.sh <instance-slug>

set -euo pipefail

SLUG=$1

if [ -z "$SLUG" ]; then
  echo "ERROR: Missing slug argument"
  echo "Usage: ./remove-instance.sh <instance-slug>"
  exit 1
fi

INSTANCES_ROOT=/var/www/instances
INSTANCE_DIR=$INSTANCES_ROOT/$SLUG
NGINX_AVAILABLE="/etc/nginx/sites-available/$SLUG.farhty.online"
NGINX_ENABLED="/etc/nginx/sites-enabled/$SLUG.farhty.online"

echo "[$(date +%T)] Removing instance: $SLUG"

# Remove nginx symlink (sites-enabled)
if [ -L "$NGINX_ENABLED" ]; then
  rm "$NGINX_ENABLED"
  echo "[$(date +%T)] Removed nginx symlink: $NGINX_ENABLED"
else
  echo "[$(date +%T)] No nginx symlink found, skipping"
fi

# Remove nginx config (sites-available)
if [ -f "$NGINX_AVAILABLE" ]; then
  rm "$NGINX_AVAILABLE"
  echo "[$(date +%T)] Removed nginx config: $NGINX_AVAILABLE"
else
  echo "[$(date +%T)] No nginx config found, skipping"
fi

# Reload nginx if available
if command -v nginx &>/dev/null; then
  nginx -t && systemctl reload nginx
  echo "[$(date +%T)] Nginx reloaded"
else
  echo "[$(date +%T)] nginx not found, skipping reload"
fi

# Remove instance build directory
if [ -d "$INSTANCE_DIR" ]; then
  rm -rf "$INSTANCE_DIR"
  echo "[$(date +%T)] Removed instance directory: $INSTANCE_DIR"
else
  echo "[$(date +%T)] No instance directory found, skipping"
fi

echo "[$(date +%T)] Done: $SLUG removed"

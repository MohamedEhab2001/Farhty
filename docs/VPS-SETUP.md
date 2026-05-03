# VPS Setup Guide — farhty.online

Full guide to deploy the Farhty platform on your VPS from scratch.

**Assumptions:**
- VPS running Ubuntu 22.04
- Nginx already installed
- Your domain: `farhty.online`
- VPS IP: `YOUR_VPS_IP`

---

## 1. DNS Records

Set these on your domain provider (do this first — DNS takes time to propagate):

| Type | Name | Value |
|---|---|---|
| A | `farhty.online` | `YOUR_VPS_IP` |
| A | `www.farhty.online` | `YOUR_VPS_IP` |
| A | `api.farhty.online` | `YOUR_VPS_IP` |
| A | `*.farhty.online` | `YOUR_VPS_IP` |

The wildcard `*.farhty.online` is critical — it catches all customer subdomains automatically.

---

## 2. Server Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

---

## 3. MongoDB

If not already installed:

```bash
# Install MongoDB 7
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## 4. Clone the Repo

```bash
sudo mkdir -p /var/www/farhty
sudo chown $USER:$USER /var/www/farhty
git clone https://github.com/yourname/farhty.git /var/www/farhty
cd /var/www/farhty
```

---

## 5. Environment Variables

```bash
cp apps/api/.env.example apps/api/.env
nano apps/api/.env
```

Fill in:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/farhty
JWT_SECRET=your_very_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=bcrypt_hash_of_your_password
```

---

## 6. Install & Build

```bash
cd /var/www/farhty

# Install all dependencies
pnpm install

# Build the API
pnpm --filter api build

# Build the store
pnpm --filter store build

# Build the admin
pnpm --filter admin build
```

---

## 7. Instances Folder

```bash
# Create the folder where all customer template instances will be served from
sudo mkdir -p /var/www/instances
sudo chown $USER:$USER /var/www/instances
```

---

## 8. Start the API with PM2

```bash
cd /var/www/farhty
pm2 start apps/api/dist/index.js --name farhty-api
pm2 save
pm2 startup
# copy and run the command it outputs
```

Verify it's running:
```bash
pm2 status
curl http://localhost:3001/health
```

---

## 9. Nginx Configuration

Create the Nginx config:

```bash
sudo nano /etc/nginx/sites-available/farhty
```

Paste this entire config:

```nginx
# Store — farhty.online
server {
    listen 80;
    server_name farhty.online www.farhty.online;
    root /var/www/farhty/apps/store/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /admin {
        alias /var/www/farhty/apps/admin/dist;
        try_files $uri $uri/ /index.html;
    }
}

# API — api.farhty.online
server {
    listen 80;
    server_name api.farhty.online;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;

        # Required for SSE (deploy log streaming)
        proxy_buffering off;
        proxy_read_timeout 300s;
    }
}

# All customer subdomains — wildcard
server {
    listen 80;
    server_name ~^(?<slug>.+)\.farhty\.online$;

    root /var/www/instances/$slug;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/farhty /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 10. SSL — Wildcard Certificate

This covers `farhty.online` and all subdomains `*.farhty.online` with one certificate.

```bash
sudo certbot --nginx \
  -d farhty.online \
  -d www.farhty.online \
  -d api.farhty.online \
  -d *.farhty.online \
  --email your@email.com \
  --agree-tos
```

> **Note:** Wildcard certs require DNS challenge. Certbot will ask you to add a TXT record to your DNS. Add it, wait 30 seconds, then press Enter.

After SSL, Certbot updates your Nginx config automatically to redirect HTTP → HTTPS.

Verify auto-renewal:
```bash
sudo certbot renew --dry-run
```

---

## 11. Make Deploy Script Executable

```bash
chmod +x /var/www/farhty/scripts/deploy-instance.sh
chmod +x /var/www/farhty/scripts/build-template.sh
```

---

## 12. Verify Everything Works

```bash
# API health
curl https://api.farhty.online/health

# Store
# Open https://farhty.online in browser

# Admin
# Open https://farhty.online/admin in browser

# PM2 status
pm2 status

# Nginx status
sudo systemctl status nginx

# MongoDB status
sudo systemctl status mongod
```

---

## 13. Deploying Updates

When you push new code to the repo:

```bash
cd /var/www/farhty

# Pull latest
git pull origin main

# Rebuild what changed
pnpm install
pnpm --filter api build
pnpm --filter store build
pnpm --filter admin build

# Restart API
pm2 restart farhty-api
```

Store and admin are static — Nginx serves the new dist files immediately after build, no restart needed.

---

## 14. Deploying a New Template to the VPS

After you test a template locally and it passes the checklist in `TEMPLATE-GUIDE.md`:

```bash
cd /var/www/farhty

# Pull the new template code
git pull origin main

# Install new template dependencies
pnpm install

# The deploy pipeline handles the rest from the admin dashboard
# Go to admin → Instances → Deploy New Instance
```

The deploy script builds the template and copies it to `/var/www/instances/[slug]/` automatically.

---

## 15. Useful Commands

```bash
# View API logs
pm2 logs farhty-api

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Restart everything
pm2 restart farhty-api
sudo systemctl reload nginx

# MongoDB shell
mongosh farhty
```

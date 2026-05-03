# Phase 5 — The Deploy Pipeline

## Purpose

When you click Deploy in the admin dashboard, this pipeline:
1. Builds the target template app
2. Copies the build to the correct instance folder on the VPS
3. Writes a config.json with the instance slug and API base
4. Saves the instance record to MongoDB
5. Streams every step back to the admin dashboard in real time via SSE

---

## Flow

```
Admin dashboard → POST /api/admin/instances
                       ↓
              deploy.service.ts
                       ↓
         spawns deploy-instance.sh
                       ↓
         stdout streamed via SSE → admin DeployLog component
                       ↓
         on exit code 0 → update Instance status → send "DONE"
         on exit code 1 → send "FAILED"
```

---

## deploy-instance.sh

Location: `scripts/deploy-instance.sh`

```bash
#!/bin/bash
# Usage: ./scripts/deploy-instance.sh <template-slug> <instance-slug>

set -e

TEMPLATE=$1
SLUG=$2
REPO_ROOT=/var/www/farhty
INSTANCES_ROOT=/var/www/instances

echo "[$(date +%T)] Starting deployment: $TEMPLATE → $SLUG.farhty.online"

echo "[$(date +%T)] Building $TEMPLATE..."
cd $REPO_ROOT
pnpm --filter $TEMPLATE build

echo "[$(date +%T)] Build complete ✓"
echo "[$(date +%T)] Copying to $INSTANCES_ROOT/$SLUG/..."

mkdir -p $INSTANCES_ROOT/$SLUG
cp -r apps/templates/$TEMPLATE/dist/* $INSTANCES_ROOT/$SLUG/

echo "[$(date +%T)] Writing instance config..."
cat > $INSTANCES_ROOT/$SLUG/config.json << EOF
{
  "slug": "$SLUG",
  "template": "$TEMPLATE",
  "apiBase": "https://api.farhty.online"
}
EOF

echo "[$(date +%T)] ✓ Deployed → https://$SLUG.farhty.online"
```

---

## deploy.service.ts

Location: `apps/api/src/services/deploy.service.ts`

```typescript
import { spawn } from 'child_process'
import { Response } from 'express'
import path from 'path'

export function deployInstance(
  templateSlug: string,
  instanceSlug: string,
  res: Response
) {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const send = (msg: string) => {
    res.write(`data: ${msg}\n\n`)
  }

  const scriptPath = path.resolve(process.cwd(), '../../scripts/deploy-instance.sh')

  const script = spawn('bash', [scriptPath, templateSlug, instanceSlug])

  script.stdout.on('data', (data: Buffer) => {
    send(data.toString().trim())
  })

  script.stderr.on('data', (data: Buffer) => {
    send(`ERROR: ${data.toString().trim()}`)
  })

  script.on('close', (code: number) => {
    if (code === 0) {
      send('DONE')
    } else {
      send('FAILED')
    }
    res.end()
  })
}
```

---

## API Route — POST /api/admin/instances

```typescript
router.post('/', adminAuth, async (req, res) => {
  const { templateId, slug, password, isPreview } = req.body

  // Validate slug is unique
  const existing = await Instance.findOne({ slug })
  if (existing) {
    return res.status(400).json({ error: 'Slug already in use' })
  }

  // Get template record
  const template = await Template.findById(templateId)
  if (!template) {
    return res.status(404).json({ error: 'Template not found' })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Save instance to MongoDB
  const instance = await Instance.create({
    templateId,
    slug,
    password: hashedPassword,
    isPreview: isPreview ?? false,
    data: {},
    deployedAt: new Date(),
    lastUpdatedAt: new Date()
  })

  // Stream deploy log via SSE
  deployInstance(template.slug, slug, res)
  // Note: res is now owned by SSE — do not call res.json() after this
})
```

---

## Nginx — Wildcard Config (set up once on VPS)

```nginx
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

The `$slug` variable is captured from the subdomain. Every new instance folder dropped into `/var/www/instances/` is immediately served — no Nginx restart needed.

---

## SSL — Wildcard Certificate (set up once)

```bash
sudo certbot --nginx \
  -d farhty.online \
  -d www.farhty.online \
  -d api.farhty.online \
  -d *.farhty.online \
  --email your@email.com \
  --agree-tos
```

All current and future subdomains are HTTPS automatically.

---

## Redeploying an Existing Instance

When a template is updated and you need to push to all existing instances:

```bash
# From admin dashboard: Instances → filter by template → Redeploy All
# Or manually:
./scripts/deploy-instance.sh template-001 ahmed-sara
./scripts/deploy-instance.sh template-001 fatma-ali
```

This rebuilds and overwrites the dist files. The customer's data is safe in MongoDB — config.json is rewritten with the same slug.

---

## Local Dev — No Deploy Script Needed

In local development, templates run directly via Vite dev server:
```bash
pnpm --filter template-001 dev
```

The deploy script and instance folder structure are only relevant on the VPS.

---

## Instance Folder Structure on VPS After Deploy

```
/var/www/instances/
├── ahmed-sara/
│   ├── index.html
│   ├── config.json           ← { slug, template, apiBase }
│   └── assets/
│       ├── index-[hash].js
│       └── index-[hash].css
├── fatma-ali/
│   └── ...
└── preview-template-001/
    └── ...                   ← isPreview: true instance
```

---

## Notes
- The script uses `set -e` — any command failure stops the script and exits with code 1
- SSE connection stays open until script completes
- Admin dashboard should handle EventSource reconnection on network drop
- Instance passwords are bcrypt hashed before storage — the deploy script never touches passwords
- `config.json` in the deployed folder overrides the empty one from the build

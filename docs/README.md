# Farhty — Wedding Invitation Platform

Digital wedding invitation templates platform for Arabic and English markets.

**Live domains:**
- Store → `farhty.online`
- Admin → `farhty.online/admin`
- API → `api.farhty.online`
- Customer templates → `[slug].farhty.online`

---

## Monorepo Structure

```
farhty/
├── apps/
│   ├── api/                        → Express.js backend
│   ├── store/                      → Store landing page (Vite + React)
│   ├── admin/                      → Admin dashboard (Vite + React)
│   └── templates/
│       └── template-001/           → First template app (Vite + React)
│
├── packages/
│   ├── template-sdk/               → Shared SDK imported by all templates
│   └── ui/                         → Optional shared UI components
│
├── scripts/
│   ├── deploy-instance.sh          → Provisions a new customer subdomain
│   ├── build-template.sh           → Builds a specific template for production
│   └── nginx-template.conf         → Nginx config reference
│
├── docs/
│   ├── TEMPLATE-GUIDE.md           → How to build, test, and publish templates
│   ├── VPS-SETUP.md                → Full VPS + Nginx + SSL setup guide
│   └── TEMPLATE-PROMPT.md          → AI prompt to generate new templates
│
├── package.json
└── pnpm-workspace.yaml
```

---

## Quick Start (Local)

**Requirements:** Node.js 20+, pnpm 9+, MongoDB running locally

```bash
# 1. Clone the repo
git clone https://github.com/yourname/farhty.git
cd farhty

# 2. Install all dependencies
pnpm install

# 3. Set up environment variables
cp apps/api/.env.example apps/api/.env
# fill in your MongoDB URI, JWT secret, Cloudinary keys

# 4. Run everything in dev mode
pnpm dev
```

This starts:
- API on `http://localhost:3001`
- Store on `http://localhost:5173`
- Admin on `http://localhost:5174`

See `docs/TEMPLATE-GUIDE.md` to run and add templates.

---

## Available Commands

```bash
# Run all apps in parallel
pnpm dev

# Run a specific app
pnpm --filter api dev
pnpm --filter store dev
pnpm --filter admin dev

# Run a specific template
pnpm --filter template-001 dev

# Build everything
pnpm build

# Build a specific template
pnpm --filter template-001 build

# Install a package in a specific app
pnpm --filter api add express
pnpm --filter template-001 add framer-motion
```

---

## Documents

| File | Purpose |
|---|---|
| `docs/TEMPLATE-GUIDE.md` | Build, test, preview, and publish templates |
| `docs/VPS-SETUP.md` | Deploy the full system to your VPS |
| `docs/TEMPLATE-PROMPT.md` | AI prompt to generate new templates |

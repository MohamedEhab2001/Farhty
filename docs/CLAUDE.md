# Farhty — Claude Code Build Instructions

## Project Overview

You are building **Farhty** — a platform for selling Arabic and English digital wedding invitation templates.

Read all phase documents before writing any code:
- `docs/phases/PHASE-1-API.md`
- `docs/phases/PHASE-2-STORE.md`
- `docs/phases/PHASE-3-ADMIN.md`
- `docs/phases/PHASE-4-SDK.md`
- `docs/phases/PHASE-5-DEPLOY.md`

Supporting references:
- `docs/TEMPLATE-GUIDE.md`
- `docs/VPS-SETUP.md`
- `docs/TEMPLATE-PROMPT.md`

---

## Monorepo Bootstrap (Do This First)

Before any phase, set up the monorepo skeleton:

```
farhty/
├── apps/
│   ├── api/
│   ├── store/
│   ├── admin/
│   └── templates/
├── packages/
│   └── template-sdk/
├── scripts/
│   ├── deploy-instance.sh
│   ├── build-template.sh
│   └── nginx-template.conf
├── docs/
├── package.json
└── pnpm-workspace.yaml
```

Root `package.json`:
```json
{
  "name": "farhty",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel --filter './apps/*' dev",
    "build": "pnpm --recursive build"
  },
  "engines": { "node": ">=20.0.0", "pnpm": ">=9.0.0" }
}
```

`pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'apps/templates/*'
  - 'packages/*'
```

Run `pnpm install` after scaffold is created.

---

## CRITICAL RULE — DO NOT PROCEED WITHOUT PASSING TESTS

Each phase has a test gate at the end.
**You must not start the next phase until every test in the current phase passes.**
If a test fails, fix it before moving on. Do not skip tests. Do not mark a test as passed without verifying it.

---

## Phase 1 — The API

Reference: `docs/phases/PHASE-1-API.md`

### Build

Create `apps/api/` with:
- TypeScript + Express + Mongoose
- All 5 models: Template, Instance, Order, Admin, Testimonial
- All routes as specified in PHASE-1-API.md
- `adminAuth` middleware (JWT validation)
- `instanceAuth` middleware (instance session token validation)
- `deploy.service.ts` (SSE + shell script spawn)
- `cloudinary.service.ts` (signed upload URLs)
- Seed script: creates Admin from env + 3 default Testimonials on first run
- `.env.example` with all variables documented

`apps/api/package.json` scripts:
```json
{
  "dev": "ts-node-dev --respawn src/index.ts",
  "build": "tsc",
  "start": "node dist/index.ts",
  "seed": "ts-node src/seed.ts"
}
```

### Phase 1 Test Gate

Run the API: `pnpm --filter api dev`

Do not proceed to Phase 2 until ALL of these pass:

```
[ ] GET  /health                          → { status: 'ok' }

[ ] POST /api/auth/login
        body: { username: "admin", password: "your_password" }
        → { token: "..." }
        → 401 on wrong credentials

[ ] GET  /api/templates
        → [] (empty array — no templates yet)
        → 200

[ ] POST /api/admin/templates   (with JWT)
        body: minimal valid template object
        → 201 with created template

[ ] GET  /api/templates
        → array with 1 template

[ ] GET  /api/templates/:slug
        → full template record with fields array

[ ] POST /api/admin/instances   (with JWT)
        body: { templateId, slug: "test-instance", password: "123", isPreview: false }
        → SSE stream opens
        → lines print (even if deploy script fails locally — that is OK)
        → stream ends with DONE or FAILED
        → Instance record created in MongoDB

[ ] POST /api/instances/auth
        body: { slug: "test-instance", password: "123" }
        → { token: "..." }
        → 401 on wrong password

[ ] GET  /api/instances/by-domain
        Header: Host: test-instance.localhost
        Authorization: Bearer [instance token]
        → full InstanceData object

[ ] PATCH /api/instances/:id/data  (with instance token)
        body: { bride_name: "ليلى" }
        → 200
        → re-fetch by-domain → data.bride_name === "ليلى"

[ ] GET  /api/testimonials
        → 3 default testimonials (seeded)

[ ] POST /api/upload/sign   (with JWT)
        body: { folder: "test" }
        → Cloudinary signed upload params object

[ ] No unhandled promise rejections in console
[ ] No TypeScript errors: pnpm --filter api build
```

**All 13 checks must pass. Fix any failures before Phase 2.**

---

## Phase 2 — The Store Frontend

Reference: `docs/phases/PHASE-2-STORE.md`

### Build

Create `apps/store/` with:
- Vite + React 18 + TypeScript + TailwindCSS
- Single page (Home.tsx) with all sections in order
- All components listed in PHASE-2-STORE.md
- BuyModal that opens WhatsApp with pre-filled message
- FakePurchaseToast with random interval (25–45s) and hardcoded Arabic names list
- StickyMobileCTA visible only on mobile
- Fetches from `VITE_API_URL`

`apps/store/.env`:
```env
VITE_API_URL=http://localhost:3001
VITE_WHATSAPP_NUMBER=201000000000
```

### Phase 2 Test Gate

Run store: `pnpm --filter store dev`
Make sure API is also running.

Do not proceed to Phase 3 until ALL of these pass:

```
[ ] Store loads at localhost:5173 with no console errors

[ ] Templates grid renders — fetches GET /api/templates
    (create 1-2 test templates in the API first if needed)

[ ] Each template card shows: name, price, language badge, feature badges

[ ] "معاينة مباشرة" button opens preview URL in new tab

[ ] "اطلب الآن" button opens BuyModal

[ ] BuyModal shows template name + price

[ ] BuyModal "ابدأ المحادثة" button opens WhatsApp
    with correct pre-filled Arabic message containing template name and price

[ ] BuyModal opening creates a pending Order in MongoDB
    verify: GET /api/admin/orders returns the order

[ ] Fake purchase toast appears after ~30 seconds
    shows Arabic name + template reference
    auto-dismisses after 4 seconds

[ ] Sticky mobile CTA visible on 375px viewport (Chrome DevTools mobile)
    hidden on desktop viewport

[ ] All sections present when scrolling:
    Navbar → Hero → How It Works → Templates Grid →
    Testimonials → Trust Badges → FAQ → Footer

[ ] Testimonials section renders 3 cards (from API)

[ ] Page is RTL (dir="rtl" on root)

[ ] pnpm --filter store build → no TypeScript errors, build succeeds
```

**All 14 checks must pass. Fix any failures before Phase 3.**

---

## Phase 3 — The Admin Dashboard

Reference: `docs/phases/PHASE-3-ADMIN.md`

### Build

Create `apps/admin/` with:
- Vite + React 18 + TypeScript + TailwindCSS
- React Router v6
- All pages: Login, Dashboard, Templates, TemplateForm, Instances, Orders, Testimonials
- JWT stored in localStorage, axios interceptor attached
- FieldBuilder component (drag to reorder, add/delete fields inline)
- DeployModal with SSE log (terminal-style, lines animate in)
- All CRUD operations wired to API

`apps/admin/.env`:
```env
VITE_API_URL=http://localhost:3001
```

### Phase 3 Test Gate

Run admin: `pnpm --filter admin dev` (will need a different port — set to 5175 in vite.config.ts)
Make sure API is also running.

Do not proceed to Phase 4 until ALL of these pass:

```
[ ] Admin loads at localhost:5175

[ ] /login page renders
    Login with correct credentials → redirects to /
    Login with wrong credentials → shows error message
    JWT stored in localStorage as farhty_admin_token

[ ] Visiting / without JWT → redirects to /login

[ ] Dashboard page shows 4 stat cards with real numbers from API

[ ] /templates page shows templates table
    Toggle status → template status updates in API
    Delete → ConfirmDialog appears → on confirm, template removed

[ ] /templates/new → TemplateForm renders all 4 sections
    Fill all fields → submit → template created in API
    Slug auto-generates from name

[ ] FieldBuilder works:
    Add field → new row appears with all inputs
    Fill key, label, type, defaultValue, required
    Drag to reorder → order preserved on submit
    Delete field row → row removed

[ ] /templates/:id/edit → form pre-fills with existing template data
    Edit fields → save → API updated

[ ] /instances page shows instances table

[ ] "+ Deploy New Instance" → DeployModal opens
    Fill slug → preview URL shown correctly below input
    Select template → fill password → click Deploy
    SSE log appears and streams lines in terminal style
    On completion → DONE message + link to subdomain shown
    Instance appears in instances table

[ ] /orders page shows orders with status tabs
    Confirm order → status updates to confirmed

[ ] /testimonials page shows 3 default testimonials
    Add new → appears in list
    Edit → updates
    Delete → ConfirmDialog → removed

[ ] Logout clears JWT → redirects to /login

[ ] pnpm --filter admin build → no TypeScript errors, build succeeds
```

**All 15 checks must pass. Fix any failures before Phase 4.**

---

## Phase 4 — The Template SDK

Reference: `docs/phases/PHASE-4-SDK.md`

### Build

Create `packages/template-sdk/` with:
- All hooks: useTemplateData, useTemplateFields, useInstanceAuth
- All components: LoadingScreen, PasswordGate, CustomerDashboard, PreviewBanner
- Clean exports from index.ts
- No UI library dependencies — pure React + CSS

Then create `apps/templates/template-001/` — the first test template:
- Minimal but complete implementation
- Uses all SDK imports
- Shows bride name, groom name, wedding date
- Has at least one conditional feature (music or countdown)
- Arabic RTL layout
- A real design — not a blank page

`apps/templates/template-001/package.json`:
```json
{
  "name": "@farhty/template-001",
  "dependencies": {
    "@farhty/template-sdk": "workspace:*"
  }
}
```

Add this template's fields to the MongoDB Template record (via admin dashboard or API call).

### Phase 4 Test Gate

Add to `/etc/hosts`:
```
127.0.0.1   test-001.localhost
```

Update `apps/templates/template-001/public/config.json`:
```json
{
  "slug": "test-001",
  "template": "template-001",
  "apiBase": "http://localhost:3001"
}
```

Create instance in MongoDB:
```bash
curl -X POST http://localhost:3001/api/admin/instances \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{ "templateId": "YOUR_ID", "slug": "test-001", "password": "test123", "isPreview": false }'
```

Run template: `pnpm --filter template-001 dev`
Open `http://test-001.localhost:5173`

Do not proceed to Phase 5 until ALL of these pass:

```
[ ] Template loads at test-001.localhost:5173

[ ] Farhty pulsing logo loading screen appears first
    Displays for at least 800ms before content shows

[ ] Password gate appears after loading screen
    Wrong password → error message + shake animation
    Correct password (test123) → template content loads

[ ] Template session token stored in localStorage
    key: farhty_token_test-001

[ ] Template content renders with default field values
    bride_name shows default ("ليلى" or similar)
    groom_name shows default

[ ] CustomerDashboard floating panel is visible (toggle button)
    Open panel → all fields from MongoDB record render correctly
    text field → input
    image field → upload button
    date field → date picker
    color field → color picker

[ ] Edit bride_name in CustomerDashboard → click Save
    → API PATCH called
    → template re-renders with new name

[ ] Upload an image via CustomerDashboard image field
    → Cloudinary upload completes
    → URL saved to MongoDB
    → template re-renders with new image

[ ] Conditional feature: disable music in MongoDB Template record
    → reload template → MusicPlayer does not render
    Enable music → reload → MusicPlayer renders

[ ] Set instance isPreview: true in MongoDB
    → reload → PreviewBanner appears at top
    → password gate does NOT appear
    Set isPreview: false → password gate returns

[ ] pnpm --filter template-001 build → succeeds
    pnpm --filter template-001 preview → built version works correctly

[ ] pnpm --filter template-sdk build → no TypeScript errors
```

**All 12 checks must pass. Fix any failures before Phase 5.**

---

## Phase 5 — The Deploy Pipeline

Reference: `docs/phases/PHASE-5-DEPLOY.md`

### Build

- Make `scripts/deploy-instance.sh` executable and working
- Verify `deploy.service.ts` in the API correctly spawns the script and streams SSE
- Confirm the complete flow works end to end from admin dashboard

Note: Full pipeline testing requires VPS access. For local testing, verify the script runs manually and the SSE stream works.

### Phase 5 Test Gate

```
[ ] Script is executable:
    chmod +x scripts/deploy-instance.sh
    ls -la scripts/ → shows -rwxr-xr-x

[ ] Script runs manually without error:
    bash scripts/deploy-instance.sh template-001 manual-test
    → prints timestamped log lines
    → copies files to /var/www/instances/manual-test/ (create dir first)
      OR in local dev: copies to a temp test folder
    → config.json written correctly with slug + apiBase

[ ] SSE stream works from admin dashboard:
    Open DeployModal → fill slug + template + password → click Deploy
    → Terminal log panel opens
    → Lines stream in one by one in real time
    → Final line shows DONE or meaningful error
    → Instance record exists in MongoDB after completion

[ ] Redeployment works:
    Change a component in template-001
    Run deploy-instance.sh template-001 [same slug]
    → new build overwrites the old one
    → existing MongoDB instance record intact

[ ] pnpm build (all apps) → no errors:
    pnpm --filter api build
    pnpm --filter store build
    pnpm --filter admin build
    pnpm --filter template-001 build
    pnpm --filter template-sdk build
```

**All 5 checks must pass.**

---

## Phase 6 — First Generated Template

Reference: `docs/phases/PHASE-6-GENERATION.md`
Prompt: `docs/TEMPLATE-PROMPT.md`

### Task

Use the generation prompt to create a second, real, production-quality template.

Fill in the prompt with:
```
Template Name: Nour
Template Slug: template-002
Mood / Vibe: golden oriental — deep amber, gold, ivory, Arabic geometric patterns
Language: ar
Pages / Sections: 3
Music player: yes
Photo gallery: yes
RSVP: no
Countdown timer: yes
RTL: yes
Custom fields: venue name, venue address, father of bride name, father of groom name
Price: 349
Description: دعوة زفاف بتصميم شرقي فاخر مع زخارف عربية ذهبية
```

Add the generated template to the monorepo and test it following `docs/TEMPLATE-GUIDE.md`.

### Phase 6 Test Gate

```
[ ] Template passes the full checklist in docs/TEMPLATE-GUIDE.md

[ ] App.tsx follows the exact SDK pattern:
    isLoading check first → isAuthenticated check second → PreviewBanner → CustomerDashboard

[ ] All 4 SDK components used: LoadingScreen, PasswordGate, CustomerDashboard, PreviewBanner

[ ] All data accessed via get() — no hardcoded customer values

[ ] All features conditionally rendered via instance.features

[ ] MongoDB record POSTed successfully via admin dashboard

[ ] Template runs locally with a real test instance

[ ] CustomerDashboard: all fields edit and save correctly

[ ] Preview mode works (isPreview: true disables password, shows banner)

[ ] pnpm --filter template-002 build → success

[ ] Template is visually premium — genuine design quality, not generic
    (review in browser before marking this passed)

[ ] Template status set to active → appears in store templates grid
```

**All 12 checks must pass.**

---

## Final System Verification

Run this after all 6 phases pass:

```
[ ] pnpm dev → all apps start with no errors
    API on :3001
    Store on :5173
    Admin on :5175

[ ] Complete user journey works end to end:
    Visit store → browse templates → click "اطلب الآن"
    → BuyModal → WhatsApp message opens with correct content
    → Order created in MongoDB

[ ] Complete admin journey works end to end:
    Login to admin → create template → deploy instance
    → SSE log streams → instance accessible at subdomain

[ ] Complete customer journey works end to end:
    Open instance URL → loading screen → password gate
    → enter password → template renders
    → open CustomerDashboard → edit bride_name → save
    → template re-renders with new name

[ ] pnpm build (everything) → zero errors

[ ] Ready for VPS deployment (follow docs/VPS-SETUP.md)
```

---

## Notes for Claude Code

- Read all phase documents before writing any code for that phase
- Use TypeScript strictly — no `any` except where explicitly specified in the phase docs
- Environment variables always from `.env` — never hardcoded
- Every `async` function has proper error handling
- Test gates are not optional — do not skip them or self-certify without running the actual checks
- If a test fails, fix the root cause — do not patch around it
- The template-sdk is a workspace package — always use `workspace:*` in template dependencies
- Arabic text in the UI should be proper Arabic, not placeholder Latin text
- `dir="rtl"` must be on the root element of all Arabic-first components

# Template Guide — Build, Test, Preview & Publish

This guide covers everything you need to go from a generated template to a live entry in the Farhty store.

---

## 1. What a Template Is

Each template is a **standalone Vite + React app** that lives at:

```
apps/templates/[template-slug]/
```

It imports all shared logic from `@farhty/template-sdk` and focuses only on its own design, layout, and components. It never implements its own auth, data fetching, loading screen, or customer dashboard — the SDK handles all of that.

---

## 2. Generate a New Template

Use the AI prompt in `docs/TEMPLATE-PROMPT.md`.

Fill in the variables at the top of the prompt and send it to Claude. It will output:

- A complete file tree with all code written
- A MongoDB JSON record ready to POST to your API

---

## 3. Add the Template to the Monorepo

After Claude generates the code:

**3.1 Create the folder**
```bash
mkdir -p apps/templates/template-002
```

**3.2 Copy all generated files into it**

Your structure should look like:
```
apps/templates/template-002/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── index.html
├── public/
│   └── config.json
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    └── components/
        └── ...
```

**3.3 Register in the workspace**

In `pnpm-workspace.yaml` confirm this line exists (it should already):
```yaml
packages:
  - 'apps/*'
  - 'apps/templates/*'
  - 'packages/*'
```

**3.4 Install dependencies**
```bash
pnpm install
```

---

## 4. Run the Template Locally

```bash
pnpm --filter template-002 dev
```

This starts the template on `http://localhost:5173`.

---

## 5. Simulate a Real Instance Locally

The template reads its data from the API using the hostname. In local dev you need to simulate this.

**5.1 Set up a fake hostname**

Add this to your `/etc/hosts` file (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1   test-instance.localhost
```

**5.2 Set the API base in config.json**

Edit `apps/templates/template-002/public/config.json`:
```json
{
  "slug": "test-instance",
  "template": "template-002",
  "apiBase": "http://localhost:3001"
}
```

**5.3 Create a test instance in MongoDB**

Use the admin dashboard or hit the API directly:
```bash
curl -X POST http://localhost:3001/api/admin/instances \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "YOUR_TEMPLATE_ID",
    "slug": "test-instance",
    "password": "test123",
    "isPreview": false
  }'
```

**5.4 Visit the template**

Open `http://test-instance.localhost:5173`

You will see:
1. Farhty pulsing logo loading screen
2. Password gate — enter `test123`
3. The full template with default data
4. Floating customer dashboard panel to edit fields

---

## 6. Test the Customer Dashboard

Once inside the template, the floating CustomerDashboard panel (from the SDK) lets you:

- Edit all fields defined in the template's MongoDB record
- Upload images to Cloudinary (make sure your API `.env` has Cloudinary keys)
- Upload audio files if the template supports music
- Save data — it persists to MongoDB and the template re-renders live

Test that every field saves and re-renders correctly before publishing.

---

## 7. Test Preview Mode

Preview mode disables the password gate and shows the PreviewBanner.

Update the instance in MongoDB: set `isPreview: true`

Or create a separate preview instance via admin dashboard with the Is Preview toggle on.

Visit the URL — you should see the template load directly with no password prompt, and a "Buy This Template" banner at the top.

---

## 8. Build the Template for Production

```bash
pnpm --filter template-002 build
```

Output goes to `apps/templates/template-002/dist/`

Check the build output opens correctly:
```bash
pnpm --filter template-002 preview
```

---

## 9. Add the Template Record to the Store

**9.1 Upload preview images to Cloudinary**

Take screenshots of your template (at least 3):
- Hero section
- Full page view
- Mobile view

Upload them to Cloudinary under the folder `templates/template-002/previews/`

Copy the URLs.

**9.2 Optionally record a preview video**

Record a short screen recording (15-30 seconds) showing the template scrolling. Upload to Cloudinary. Copy the URL.

**9.3 POST the MongoDB record**

Take the JSON output from Claude, add the Cloudinary URLs, then POST it via the admin dashboard (Templates → New Template) or directly:

```bash
curl -X POST http://localhost:3001/api/admin/templates \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Layla",
    "slug": "template-002",
    "price": 299,
    "description": "...",
    "language": "ar",
    "features": { ... },
    "fields": [ ... ],
    "previewImages": ["https://cloudinary.com/..."],
    "previewVideo": "https://cloudinary.com/...",
    "status": "draft",
    "version": "1.0.0"
  }'
```

**9.4 Deploy the preview subdomain**

In the admin dashboard:
- Go to Instances → Deploy New Instance
- Select your template
- Slug: `preview-template-002`
- Toggle Is Preview: ON
- Click Deploy

This creates `preview-template-002.farhty.online` — the live preview linked from the store.

**9.5 Activate the template**

In the admin dashboard go to Templates → find your template → Toggle status to Active.

It now appears in the store.

---

## 10. Template Checklist Before Publishing

```
[ ] All fields tested in CustomerDashboard — save and re-render correctly
[ ] Cloudinary image upload works for image fields
[ ] Cloudinary audio upload works if music is enabled
[ ] Password gate works — wrong password shows error, correct password enters
[ ] Preview mode works — no password gate, PreviewBanner visible
[ ] Loading screen shows Farhty pulsing logo on every load
[ ] RTL renders correctly if template is Arabic
[ ] Features render conditionally — disable music in DB, MusicPlayer disappears
[ ] Mobile responsive — test on 375px width
[ ] Production build works — pnpm build then pnpm preview
[ ] Preview images uploaded to Cloudinary
[ ] MongoDB record POSTed with correct fields schema
[ ] Preview subdomain deployed and accessible
[ ] Template status set to active in admin
```

---

## 11. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Template folder | `template-NNN` | `template-003` |
| Package name | `@farhty/template-NNN` | `@farhty/template-003` |
| Preview subdomain slug | `preview-template-NNN` | `preview-template-003` |
| Cloudinary folder | `templates/template-NNN/` | `templates/template-003/` |
| MongoDB slug | same as folder | `template-003` |

---

## 12. Updating an Existing Template

When you make design changes to a template:

```bash
# 1. Make your changes in apps/templates/template-002/src/

# 2. Test locally
pnpm --filter template-002 dev

# 3. Bump the version in the template's package.json and MongoDB record

# 4. Build
pnpm --filter template-002 build

# 5. Redeploy all instances of this template from admin dashboard
#    Instances → filter by template → Redeploy
```

Redeploying copies the new build to all existing customer instance folders on the VPS.

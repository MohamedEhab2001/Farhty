# Phase 3 — The Admin Dashboard

## Stack
- Vite + React 18 + TypeScript
- TailwindCSS
- Axios with JWT interceptor
- React Router v6
- EventSource (native) for SSE deploy log

---

## Folder Structure

```
apps/admin/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Templates.tsx
│   │   ├── TemplateForm.tsx
│   │   ├── Instances.tsx
│   │   ├── Orders.tsx
│   │   └── Testimonials.tsx
│   ├── components/
│   │   ├── Layout.tsx              → sidebar + topbar wrapper
│   │   ├── Sidebar.tsx
│   │   ├── FieldBuilder.tsx        → drag & drop field editor
│   │   ├── DeployModal.tsx         → slug + password + SSE log
│   │   ├── DeployLog.tsx           → terminal-style SSE output
│   │   └── ConfirmDialog.tsx
│   ├── hooks/
│   │   ├── useAdminAuth.ts
│   │   └── useSSE.ts               → EventSource hook for deploy log
│   └── api/
│       └── client.ts               → axios with Authorization header
├── index.html
├── package.json
└── vite.config.ts
```

---

## Routes

```
/login                  → Login page (no auth required)
/                       → Dashboard overview
/templates              → Templates list
/templates/new          → TemplateForm (create)
/templates/:id/edit     → TemplateForm (edit)
/instances              → Instances list
/orders                 → Orders list
/testimonials           → Testimonials CRUD
```

All routes except `/login` protected — redirect to `/login` if no JWT in localStorage.

---

## Pages in Detail

### Login
- Username + password form
- `POST /api/auth/login` → stores JWT in localStorage as `farhty_admin_token`
- Redirects to `/` on success
- Simple centered card, Farhty logo above

---

### Dashboard
Overview cards:
- Total active templates
- Total deployed instances
- Pending orders (badge — red if > 0)
- Confirmed orders this month

No charts needed — just stat cards.

---

### Templates Page
Table columns: Name | Language | Price | Status | Version | Actions

Actions per row:
- Edit → `/templates/:id/edit`
- Toggle status (draft ↔ active)
- Open preview subdomain (external link)
- Delete (with ConfirmDialog)

"+ New Template" button → `/templates/new`

---

### TemplateForm Page
Used for both create and edit.

**Section 1 — Basic Info**
- Name (text)
- Slug (text — auto-generated from name, editable)
- Price (number, EGP)
- Description (textarea)
- Language (select: ar / en / both)
- Status (select: draft / active)
- Version (text)

**Section 2 — Features**
Toggle switches:
- Music support
- Photo gallery
- RSVP section
- Countdown timer
- RTL layout
- Pages (number input)

**Section 3 — Preview Assets**
- Upload preview images (multiple) → Cloudinary → stores URLs
- Upload preview video (optional) → Cloudinary → stores URL

**Section 4 — Field Builder**
This is the most important section.

Each field has:
- key (text — e.g. `bride_name`)
- label (text — e.g. `اسم العروسة`)
- type (select: text / image / audio / date / color / boolean)
- defaultValue (text — type-aware input)
- cloudinaryFolder (text — shown only for image/audio types)
- required (toggle)

UI:
- Fields listed as draggable rows (drag to reorder)
- "+ Add Field" button appends a new empty field row
- Each row has a delete button
- Inline editing — no separate modal per field

On submit: `POST /api/admin/templates` or `PUT /api/admin/templates/:id`

---

### Instances Page
Table columns: Slug | Template | Preview? | Deployed At | Last Updated | Actions

Actions per row:
- Open link → `https://[slug].farhty.online` (external)
- Reset password → inline form → `PATCH /api/admin/instances/:id/password`
- Delete (with ConfirmDialog)

"+ Deploy New Instance" → opens DeployModal

---

### DeployModal

Fields:
- Select template (dropdown of active templates)
- Slug input → shows live preview: `[slug].farhty.online`
- Password input (what customer uses)
- Is Preview toggle (disables password gate, shows PreviewBanner)

On click Deploy:
- `POST /api/admin/instances` (SSE endpoint)
- Modal switches to DeployLog view
- SSE stream renders line by line in terminal style
- On `data: DONE` → show success + link to subdomain
- On `data: FAILED` → show error state

---

### DeployLog Component

```
Terminal-style dark panel:
┌─────────────────────────────────────────┐
│ Deploying ahmed-sara.farhty.online...   │
│                                         │
│ [12:03:01] Building template-001...     │
│ [12:03:08] Build complete ✓             │
│ [12:03:08] Copying files...             │
│ [12:03:09] Writing config...            │
│ [12:03:09] Saving to MongoDB...         │
│ [12:03:10] ✓ Deployed successfully      │
│                                         │
│ [ Open ahmed-sara.farhty.online → ]     │
└─────────────────────────────────────────┘
```

Lines animate in one by one as SSE events arrive.

---

### Orders Page
Table columns: Phone | Template | Payment Method | Status | Date | Notes | Actions

Status tabs: All | Pending | Confirmed | Deployed

Actions per row:
- Confirm payment → `PATCH /api/admin/orders/:id/status` → confirmed
- Mark deployed → links to instance
- Add/edit notes (inline)

---

### Testimonials Page
Table: Name | Location | Rating | Text (truncated) | Actions (Edit | Delete)

"+ Add Testimonial" → inline form or modal:
- Name
- Location
- Text (textarea)
- Rating (star picker 1-5)
- Avatar (Cloudinary upload)

3 default testimonials seeded in DB — editable here.

---

## Auth Flow
- JWT stored in localStorage as `farhty_admin_token`
- Axios interceptor attaches `Authorization: Bearer [token]` to all admin requests
- On 401 response → clear token → redirect to `/login`
- Token has no expiry enforcement on client — API validates on every request

---

## Environment Variables
```env
VITE_API_URL=http://localhost:3001
```

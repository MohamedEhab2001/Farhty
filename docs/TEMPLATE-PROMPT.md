# Farhty — AI Template Generation Prompt

Copy everything inside the code block below and paste it into Claude.
Fill in the `[bracketed]` variables before sending.

---

```
You are a wedding invitation template developer for Farhty (farhty.online),
a platform that sells Arabic and English digital wedding invitation templates.

You will generate two things:
1. A complete Vite + React template app
2. A MongoDB record JSON ready to POST to the Farhty API

═══════════════════════════════════════════
TEMPLATE REQUEST
═══════════════════════════════════════════

Template Name: [e.g. "Layla"]
Template Slug: [e.g. "template-002"]
Mood / Vibe: [e.g. "dark luxury — deep navy, gold, floating rose petals"]
Language: [ar | en | both]
Pages / Sections: [number e.g. 3]
Price (EGP): [e.g. 349]
Description (store listing): [one Arabic line]

Features & Flows:
[
  Describe ANYTHING you want here — no fixed list.
  Be as specific or creative as you want.
  Examples:
  - "music player that auto-plays on enter with a mute button"
  - "photo gallery with lightbox, swipe on mobile"
  - "countdown timer to the wedding date"
  - "RSVP form — guest enters name and confirms attendance, saves to a list"
  - "multi-page with scroll snap — page 1 hero, page 2 details, page 3 location"
  - "an animated envelope that opens on first load revealing the invitation"
  - "map embed showing venue location"
  - "dress code section with icon"
  - "parents names section with decorative separator"
  - "animated falling petals or particles in the background"
  - "a shareable link button that copies the URL"
  - "day program / schedule section (ceremony time, dinner time, etc.)"
  - "video background in the hero section"
  - "a wish wall where guests can leave a message"
  - "QR code section"
  Or anything else — the system is fully dynamic.
]

Custom fields beyond bride/groom/date/hero:
[list any extra data the customer should fill — e.g. venue name, dress code, parent names]

═══════════════════════════════════════════
SYSTEM STANDARDS — READ ALL OF THIS
═══════════════════════════════════════════

MONOREPO PLACEMENT:
  apps/templates/[template-slug]/
  Package name: @farhty/[template-slug]
  Part of a pnpm monorepo.

TECH STACK:
- React 18 + Vite
- TailwindCSS (utility classes only)
- framer-motion (animations)
- @farhty/template-sdk (workspace:* — see SDK section)
- Google Fonts (imported in index.css)
- Any additional libraries ONLY if a feature genuinely requires it
  (e.g. a map embed may use leaflet, a QR code may use qrcode.react)
  If you add a library, add it to package.json dependencies.

═══════════════════════════════════════════
THE SDK — THIS IS THE LAW
═══════════════════════════════════════════

Every template imports ONLY from @farhty/template-sdk.
Never reimplement anything the SDK provides.

import {
  useTemplateData,
  useTemplateFields,
  PasswordGate,
  LoadingScreen,
  CustomerDashboard,
  PreviewBanner
} from '@farhty/template-sdk'

useTemplateData()
  → { instance, isLoading, isAuthenticated }
  instance: { instanceId, templateId, slug, isPreview, features, fields, data }

useTemplateFields()
  → { get, set, save, isSaving }
  get('key')        → customer value OR field defaultValue
  set('key', value) → local state update
  save()            → PATCH /api/instances/:id/data → MongoDB
  isSaving          → boolean

LoadingScreen     → props: bg (CSS color string)
PasswordGate      → no props
CustomerDashboard → NOT used directly — see AdminDashboard below
PreviewBanner     → props: templateName (string)

═══════════════════════════════════════════
APP.TSX — ALWAYS THIS EXACT PATTERN
═══════════════════════════════════════════

export default function App() {
  const { instance, isLoading, isAuthenticated } = useTemplateData()
  const { get } = useTemplateFields()
  const isAdminRoute = window.location.pathname === '/admin'

  // 1. Always show loading screen first — uses Farhty logo
  if (isLoading) return <LoadingScreen bg="[your template bg color]" />

  // 2. /admin route only: password gate then styled dashboard
  if (isAdminRoute) {
    if (!isAuthenticated) return <PasswordGate />
    return <AdminDashboard />
  }

  // 3. Public invitation — no auth, no admin UI ever
  return (
    <>
      {instance.isPreview && <PreviewBanner templateName={instance.templateId} />}
      {/* TEMPLATE DESIGN STARTS HERE */}
    </>
  )
}

RULES — non-negotiable:
1. isLoading ALWAYS first → <LoadingScreen bg="..." />
2. PasswordGate ONLY on /admin route — never on the public invitation
3. Public invitation never shows any admin or auth UI
4. <PreviewBanner /> always first inside public return when isPreview
5. Never build your own loading screen or password gate

═══════════════════════════════════════════
LOADING SCREEN — THE FARHTY LOGO
═══════════════════════════════════════════

The LoadingScreen SDK component shows the Farhty logo.
The logo file is always at: public/فرحتي بنفسجي.png
The SDK references it as: /فرحتي بنفسجي.png

LoadingScreen renders:
- Full screen with your template's bg color
- Farhty logo image centered, pulsing (scale + opacity CSS keyframe)
- Minimum display: 800ms — prevents flash on fast connections

RULES:
- NEVER build your own loading screen
- NEVER show content before isLoading is false
- NEVER replace or skip the Farhty logo — this is brand consistency

═══════════════════════════════════════════
ADMIN DASHBOARD — /admin ROUTE
═══════════════════════════════════════════

The /admin route is the ONLY place customers edit their data.
It is protected by PasswordGate from the SDK.
Once authenticated, render <AdminDashboard /> — a component YOU build in
src/components/AdminDashboard.tsx

AdminDashboard is a beautifully designed form. NOT a raw field dump.

DESIGN REQUIREMENTS for AdminDashboard:
- Matches the template's color palette and typography
- Arabic RTL layout if template is Arabic
- Groups fields into logical sections with styled headings:
    e.g. "بيانات العروسين" | "تفاصيل الحفل" | "الصور والوسائط" | "إعدادات"
- Each section has a visible separator or card container
- Field label above each input, styled and readable
- Proper input styling — no raw unstyled HTML
- A prominent "حفظ التغييرات" save button with loading spinner (isSaving)
- Success toast: "تم الحفظ بنجاح ✓"
- Fully mobile responsive

FIELD TYPE → INPUT MAPPING in AdminDashboard:
  text    → styled <input type="text" />
  image   → Cloudinary upload button + current image preview thumbnail
            + LOADING STATE while uploading + success/error feedback
  audio   → Cloudinary upload button + <audio> player preview
            + LOADING STATE while uploading + success/error feedback
  date    → styled <input type="date" />
  color   → styled <input type="color" /> + hex value display beside it
  boolean → styled toggle switch
  json    → styled <textarea /> with placeholder showing the expected format

UPLOAD LOADING STATES — mandatory for every image/audio upload:
  - Show a loading indicator on the upload button while uploading (e.g. "جاري الرفع...")
  - Disable the button during upload (opacity-50 + pointer-events-none)
  - Show success feedback after upload completes (e.g. "تم الرفع ✓"), auto-dismiss after 3s
  - Show error feedback on failure (e.g. "فشل الرفع"), auto-dismiss after 5s
  - Surface Cloudinary error messages to the user in a visible red banner
  - Check for empty cloud_name from the sign response (means misconfigured server)
  - Check for upData.error from Cloudinary response (e.g. "cloud_name is disabled")
  - Never let uploads fail silently — always surface the error

USE useTemplateFields() for all data:
  const { get, set, save, isSaving } = useTemplateFields()
  Each input: value={get('key')} onChange={e => set('key', e.target.value)}
  Save button: onClick={save}

RULES for AdminDashboard:
- Never render the public template content on this route
- All saves through save() → PATCH /api/instances/:id/data — no new endpoints
- Never use raw unstyled inputs
- Never show all fields in one flat unsorted list
- Every image/audio upload MUST have a loading state, success feedback, and error feedback
- Uploads must NEVER fail silently — always show errors to the user

═══════════════════════════════════════════
DYNAMIC FEATURES — HOW TO HANDLE THEM
═══════════════════════════════════════════

The features object in MongoDB is fully flexible.
You define whatever keys make sense for this template.
Every feature must be conditionally rendered using instance.features:

  {instance.features.music && <MusicPlayer src={get('music_file')} />}
  {instance.features.gallery && <Gallery images={get('gallery_images') ?? []} />}
  {instance.features.countdown && <Countdown date={get('wedding_date')} />}
  {instance.features.rsvp && <RSVPSection />}
  {instance.features.envelopeIntro && <EnvelopeReveal />}
  {instance.features.wishWall && <WishWall instanceId={instance.instanceId} />}
  {instance.features.venueMap && <VenueMap src={get('venue_map_image')} />}
  {instance.features.schedule && <DayProgram items={get('schedule_items')} />}
  {instance.features.videoBackground && <VideoBg src={get('hero_video')} />}
  {instance.features.shareButton && <ShareButton />}
  {instance.features.qrCode && <QRSection url={window.location.href} />}
  ... any feature you define follows this same pattern

RULE: If a feature needs customer-configurable data → add a field to MongoDB.
Purely decorative features need no field.

═══════════════════════════════════════════
CRUD-ONLY RULE — NO NEW ENDPOINTS EVER
═══════════════════════════════════════════

ALL data operations — including guest submissions (RSVP, wish wall) —
MUST use the existing two instance endpoints only. Never create new API routes.

Available endpoints:
  GET  /api/instances/by-domain?slug=<slug>   → read full instance data
  PATCH /api/instances/:id/data               → write/update instance data

How to store guest submissions without new endpoints:

  1. fetch('/config.json') → get apiBase + slug
  2. localStorage.getItem(`farhty_token_${slug}`) → get instance token
  3. GET by-domain → read current data
  4. Append new entry to the target array field
  5. PATCH with full merged data object (spread existing, override target field)

Example — RSVP submission:

  const config = await fetch('/config.json').then(r => r.json())
  const slug = config.slug || window.location.hostname.split('.')[0]
  const token = localStorage.getItem(`farhty_token_${slug}`)

  const res = await fetch(`${config.apiBase}/api/instances/by-domain?slug=${slug}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const current = await res.json()

  await fetch(`${config.apiBase}/api/instances/${current.instanceId}/data`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      ...current.data,
      rsvp_entries: [
        ...(current.data.rsvp_entries ?? []),
        { name, attending: true, timestamp: new Date().toISOString() }
      ]
    })
  })

  localStorage.setItem(`farhty_rsvp_submitted_${slug}`, 'true')

Add array fields to MongoDB record:
  { "key": "rsvp_entries", "label": "تأكيدات الحضور", "type": "json", "defaultValue": "[]" }
  { "key": "wish_entries", "label": "التهاني",          "type": "json", "defaultValue": "[]" }

ABSOLUTE RULE:
- Never output a section called "Additional API Endpoints Needed"
- Never suggest creating a new route, controller, or backend file
- Every feature must work within the two existing endpoints above
- If a feature seemingly requires a new endpoint → store it in instance data instead

═══════════════════════════════════════════
DATA ACCESS RULES
═══════════════════════════════════════════

ALWAYS use get() for customer data. Never hardcode. Never read instance.data directly.

Correct:
  get('bride_name') ?? 'ليلى'
  get('venue_name') ?? 'قاعة الأفراح'
  get('schedule_items') ?? []

Wrong:
  'ليلى'                     ← hardcoded
  instance.data.bride_name   ← direct access

Fallbacks must be beautiful and realistic — never empty strings for visible text.

FIELD TYPES:
  text | image | audio | date | color | boolean | json

Use type: 'json' for structured arrays (schedule, rsvp_entries, wish_entries).

═══════════════════════════════════════════
MEDIA RULES
═══════════════════════════════════════════

- All customer images/audio → Cloudinary URLs from get()
- Static decorative assets → local imports fine
- Handle image loading state and fallback gracefully
- Audio: respect browser autoplay — use user-triggered play button

═══════════════════════════════════════════
RTL / LTR
═══════════════════════════════════════════

ar   → dir="rtl", font: Tajawal or Cairo (Google Fonts)
en   → dir="ltr", font: your creative choice
both → const dir = get('language_preference') === 'en' ? 'ltr' : 'rtl'

Google Fonts always imported at top of index.css before Tailwind directives.

═══════════════════════════════════════════
VITE CONFIG
═══════════════════════════════════════════

- base: './'  ← required — never omit
- No hardcoded URLs anywhere
- public/config.json → { "slug": "", "template": "", "apiBase": "" }
  left empty — filled by deploy script at deployment time

═══════════════════════════════════════════
DESIGN DIRECTION — FULL CREATIVE FREEDOM
═══════════════════════════════════════════

Mood/Vibe: [filled by you]

You have COMPLETE creative freedom on the design.
No color restrictions. No layout restrictions. No typography restrictions.
No limits on effects, animations, or visual style.

The only requirement: the template must feel premium and be something
a couple is genuinely proud to share with their guests.

Dark or light. Minimal or maximalist. Modern or traditional.
Particles or clean white space. Scroll snap or full bleed.
Arabic calligraphy or geometric abstraction.

Make bold decisions. Commit fully. Do not go generic.

═══════════════════════════════════════════
FILE STRUCTURE TO OUTPUT
═══════════════════════════════════════════

apps/templates/[template-slug]/
├── package.json
├── vite.config.ts              ← base: './'
├── tailwind.config.ts
├── index.html
├── public/
│   ├── config.json             ← { "slug": "", "template": "", "apiBase": "" }
│   └── فرحتي بنفسجي.png       ← copy from shared assets (already in public/)
└── src/
    ├── App.tsx                 ← exact pattern: isAdminRoute check
    ├── main.tsx
    ├── index.css               ← Google Fonts + Tailwind + CSS variables
    └── components/
        ├── AdminDashboard.tsx  ← beautifully styled form
        └── [all other components — fully written, zero placeholders]

═══════════════════════════════════════════
MONGODB RECORD
═══════════════════════════════════════════

{
  "name": "",
  "slug": "",
  "price": 0,
  "description": "",
  "language": "ar|en|both",
  "features": {
    [any key: boolean — you define all keys]
    "rtl": true,
    "pages": 1
  },
  "fields": [
    {
      "key": "",
      "label": "",
      "type": "text|image|audio|date|color|boolean|json",
      "defaultValue": "",
      "cloudinaryFolder": "",
      "required": false
    }
  ],
  "previewImages": [],
  "previewVideo": "",
  "status": "draft",
  "version": "1.0.0"
}

ALWAYS include these defaults unless irrelevant:
{ "key": "bride_name",   "label": "اسم العروسة",  "type": "text",  "defaultValue": "ليلى", "required": true }
{ "key": "groom_name",   "label": "اسم العريس",   "type": "text",  "defaultValue": "كريم", "required": true }
{ "key": "wedding_date", "label": "تاريخ الزفاف", "type": "date",  "defaultValue": "",      "required": true }
{ "key": "hero_image",   "label": "صورة الغلاف",  "type": "image", "defaultValue": "",      "cloudinaryFolder": "templates/[slug]/hero", "required": true }
{ "key": "accent_color", "label": "اللون الرئيسي","type": "color", "defaultValue": "[your primary hex]", "required": false }

Every get() call in the code MUST have a matching field here.
Every instance.features.[key] MUST exist in the features object.

═══════════════════════════════════════════
OUTPUT FORMAT — DELIVER IN THIS ORDER
═══════════════════════════════════════════

## MongoDB Record
[ready-to-POST JSON]

## Template Code
[complete file tree — every file fully written, zero placeholders]

## Register in Workspace
[one pnpm command]
```

---

## How to Use

1. Copy everything inside the code block above
2. Fill in all `[bracketed]` values
3. Paste into Claude
4. Claude outputs: MongoDB record + full template code
5. Follow `docs/TEMPLATE-GUIDE.md` to add to repo, test, and publish

---

## What Changed

| # | Issue | Fix |
|---|---|---|
| 1 | Design was restricted to specific choices | Full creative freedom — no design constraints at all |
| 2 | Loading screen didn't reference actual logo | Explicitly uses `public/فرحتي بنفسجي.png` |
| 3 | PasswordGate appeared on public invitation | PasswordGate only on `/admin` via `isAdminRoute` check |
| 4 | `/admin` rendered raw unstyled CustomerDashboard | Must build styled `AdminDashboard.tsx` matching template aesthetic |
| 5 | Allowed new API endpoints | Hard rule: CRUD only via existing 2 endpoints, no new routes ever |

---

## Example Fill-In

```
Template Name: Nour
Template Slug: template-001
Mood / Vibe: golden oriental — deep amber, warm ivory, Arabic geometric patterns, shimmer
Language: ar
Pages / Sections: 3
Price (EGP): 349
Description: دعوة زفاف بتصميم شرقي فاخر مع زخارف عربية ذهبية

Features & Flows:
- Animated envelope that opens on first load revealing the invitation
- Music player: auto-plays soft oud music, floating mute button top corner
- Countdown timer to wedding date (days / hours / minutes / seconds)
- Photo gallery: masonry grid, tap to open lightbox, swipe on mobile
- Day program: vertical timeline of ceremony/dinner times
  (customer fills as JSON array of { time, label } objects)
- Falling golden particle animation in background (subtle, performant)
- Venue section: venue name, address, and map image the customer uploads
- Parents names: father of bride and father of groom displayed decoratively
- Share button: copies page URL to clipboard with Arabic toast confirmation
- RSVP: guest enters name and attendance, saves to rsvp_entries array in instance data

Custom fields: venue name, venue address, venue map image,
father of bride name, father of groom name, schedule items (json array)
```

---

## Feature Ideas Bank

**Interactive**
- Envelope reveal on first load
- Scroll snap pages
- Parallax hero with layered depth
- Animated page turn between sections

**Media**
- Auto-play music with mute button
- Video background in hero
- Photo gallery with lightbox and mobile swipe
- Before/after photo slider

**Functional**
- RSVP → saves to rsvp_entries[] in instance data (no new endpoint)
- Wish wall → saves to wish_entries[] in instance data (no new endpoint)
- Day program / schedule timeline
- Dress code section
- QR code to invitation URL

**Location**
- Venue map image (customer uploads to Cloudinary)
- Google Maps directions button

**Social**
- Share button (copy URL to clipboard)
- WhatsApp share button
- Download invitation as image

**Decorative (always-on)**
- Falling petals or particles
- Shimmer sweep animation
- Animated Arabic calligraphy reveal
- Starfield background
- Candle flicker effect
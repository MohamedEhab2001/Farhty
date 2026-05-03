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
CustomerDashboard → no props — auto-generates editors from fields schema
PreviewBanner     → props: templateName (string)

═══════════════════════════════════════════
APP.TSX — ALWAYS THIS EXACT PATTERN
═══════════════════════════════════════════

export default function App() {
  const { instance, isLoading, isAuthenticated } = useTemplateData()
  const { get } = useTemplateFields()

  if (isLoading) return <LoadingScreen bg="[your bg color]" />
  if (!isAuthenticated) return <PasswordGate />

  return (
    <>
      {instance.isPreview && <PreviewBanner templateName={instance.templateId} />}
      <CustomerDashboard />

      {/* TEMPLATE DESIGN STARTS HERE */}
      {/* Every feature and section below is your own creative work */}
    </>
  )
}

RULES — non-negotiable:
1. isLoading check ALWAYS first → <LoadingScreen />
2. isAuthenticated check ALWAYS second → <PasswordGate />
3. <PreviewBanner /> ALWAYS first inside return when isPreview
4. <CustomerDashboard /> ALWAYS rendered — never skip it
5. Never build your own loading screen or password gate

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
  {instance.features.venueMap && <VenueMap coords={get('venue_coords')} />}
  {instance.features.schedule && <DayProgram items={get('schedule_items')} />}
  {instance.features.videoBackground && <VideoBg src={get('hero_video')} />}
  {instance.features.shareButton && <ShareButton />}
  {instance.features.qrCode && <QRSection url={window.location.href} />}
  ... and so on for ANY feature you define

RULE: If a feature needs customer-configurable data, add the corresponding
field to the fields array in the MongoDB record. If it is purely decorative
(e.g. falling petals animation), it needs no field — just render it always
or gate it with instance.features.[key].

CUSTOM FLOWS:
Some features require their own API calls beyond what the SDK provides.
For example:
  - RSVP form → POST to a custom endpoint
  - Wish wall → POST/GET from a separate collection

For these, call the API directly inside the component:

  const config = await fetch('/config.json').then(r => r.json())
  const API_BASE = config.apiBase

Never hardcode https://api.farhty.online anywhere in template code.

═══════════════════════════════════════════
DATA ACCESS RULES
═══════════════════════════════════════════

ALWAYS use get() for customer data. Never hardcode. Never access instance.data directly.

Correct:
  get('bride_name') ?? 'ليلى'
  get('venue_name') ?? 'قاعة الأفراح'
  get('accent_color') ?? '#c9a96e'
  get('schedule_items') ?? []
  get('gallery_images') ?? []

Wrong:
  'ليلى'                     ← hardcoded
  instance.data.bride_name   ← direct access

Fallbacks must be beautiful and realistic — never empty strings for visible text.

FIELD TYPES available in the schema:
  text | image | audio | date | color | boolean | json

Use type: 'json' for structured data like arrays of objects
(e.g. schedule_items, wish_list, program_steps).
The customer edits json fields via a textarea in CustomerDashboard.

═══════════════════════════════════════════
MEDIA RULES
═══════════════════════════════════════════

- All customer images/audio → Cloudinary URLs from get()
- Static decorative assets (SVG patterns, overlays) → local imports are fine
- Always handle image loading state and fallback gracefully
- For audio: respect browser autoplay restrictions — use user-triggered play or
  a visible play button that the user must click first

═══════════════════════════════════════════
LOADING SCREEN — NON-NEGOTIABLE
═══════════════════════════════════════════

- if (isLoading) return <LoadingScreen bg="your bg color" />
- NEVER build your own loading screen
- NEVER show content before isLoading is false
- 800ms minimum is handled inside the SDK
- The Farhty pulsing logo appears on every template — this is brand

═══════════════════════════════════════════
RTL / LTR
═══════════════════════════════════════════

ar   → dir="rtl", font: Tajawal or Cairo (Google Fonts)
en   → dir="ltr", font: your creative choice
both → const dir = get('language_preference') === 'en' ? 'ltr' : 'rtl'
       import both font families

Google Fonts always imported at top of index.css before Tailwind directives.

═══════════════════════════════════════════
VITE CONFIG
═══════════════════════════════════════════

- base: './'  ← required — never omit this
- No hardcoded URLs anywhere
- public/config.json → { "slug": "", "template": "", "apiBase": "" }
  left empty — filled by deploy script at deployment time
  SDK reads this automatically

═══════════════════════════════════════════
FILE STRUCTURE TO OUTPUT
═══════════════════════════════════════════

apps/templates/[template-slug]/
├── package.json          ← name: "@farhty/[template-slug]", all deps listed
├── vite.config.ts        ← base: './'
├── tailwind.config.ts
├── index.html
├── public/
│   └── config.json       ← { "slug": "", "template": "", "apiBase": "" }
└── src/
    ├── App.tsx            ← exact SDK pattern
    ├── main.tsx
    ├── index.css          ← Google Fonts + Tailwind + CSS variables
    └── components/
        └── [all components — fully written, zero placeholders]

═══════════════════════════════════════════
MONGODB RECORD
═══════════════════════════════════════════

Output a ready-to-POST JSON:

{
  "name": "",
  "slug": "",
  "price": 0,
  "description": "",
  "language": "ar|en|both",
  "features": {
    [any key: boolean — whatever this template uses, you define the keys]
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

ALWAYS include these default fields unless genuinely irrelevant:
{ "key": "bride_name",   "label": "اسم العروسة",  "type": "text",  "defaultValue": "ليلى", "required": true }
{ "key": "groom_name",   "label": "اسم العريس",   "type": "text",  "defaultValue": "كريم", "required": true }
{ "key": "wedding_date", "label": "تاريخ الزفاف", "type": "date",  "defaultValue": "",      "required": true }
{ "key": "hero_image",   "label": "صورة الغلاف",  "type": "image", "defaultValue": "",      "cloudinaryFolder": "templates/[slug]/hero", "required": true }
{ "key": "accent_color", "label": "اللون الرئيسي","type": "color", "defaultValue": "[your primary hex]", "required": false }

Then add every additional field this template's features require.
Every get() call in the code MUST have a matching field entry here.
Every instance.features.[key] check MUST have that key in the features object.

═══════════════════════════════════════════
DESIGN DIRECTION
═══════════════════════════════════════════

Mood/Vibe: [filled by you]

Make bold, specific decisions:

1. Color palette → 2-3 colors max as CSS variables in index.css
   --color-primary / --color-secondary / --color-bg

2. Typography → one display font + one body font, named specifically

3. Animation personality → pick one and commit:
   slow cinematic fade | staggered entrance | parallax scroll |
   particle / petal fall | typewriter reveal | scroll snap pages |
   envelope unfold | shimmer sweep

4. Layout structure → pick one:
   full bleed scroll | scroll snap pages | centered card stack |
   split screen | layered depth sections

5. Decorative motifs → baked as SVG or CSS, never customer-editable:
   Arabic geometric tile | floral watercolor | calligraphy frame |
   golden particle field | starfield | flowing ribbon | mandala

The template must feel like a premium product couples are proud to share.
No generic layouts. Make real design decisions.

═══════════════════════════════════════════
OUTPUT FORMAT — DELIVER IN THIS ORDER
═══════════════════════════════════════════

## MongoDB Record
[ready-to-POST JSON]

## Template Code
[complete file tree — every file fully written, zero placeholders]

## Register in Workspace
[one pnpm command]

## Additional API Endpoints Needed
[only if this template needs custom endpoints beyond the standard SDK ones
e.g. RSVP submissions, wish wall — list method, route, request body, response]
```

---

## How to Use

1. Copy the full prompt above
2. Fill in all `[bracketed]` values — be as descriptive as you want in Features & Flows
3. Paste into Claude
4. Claude outputs: MongoDB record + full code + any extra API endpoints needed
5. Follow `docs/TEMPLATE-GUIDE.md` to add to repo, test, and publish

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
- RSVP form (name + attendance → saves to DB)
- Wish wall (guests leave messages → displayed as cards)
- Day program / schedule timeline
- Dress code section
- QR code to invitation URL

**Location**
- Venue map image (customer uploads)
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
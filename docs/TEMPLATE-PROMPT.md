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
  (e.g. a QR code may use qrcode.react)
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
   → { instance, isLoading, isAuthenticated, slug, fieldData, setFieldData }
   instance: { instanceId, templateId, slug, isPreview, features, fields, data }
   isAuthenticated is true ONLY when an admin token exists in localStorage.
   instance data is ALWAYS fetched on boot — public visitors see the template without auth.

useTemplateFields()
  → { get, set, save, isSaving }
  get('key')        → customer value OR field defaultValue
  set('key', value) → local state update
  save()            → PATCH /api/instances/:id/data → MongoDB (requires token)
  isSaving          → boolean
  This hook includes save() — use it for both reading AND saving field data.

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
4. Public invitation renders for ALL visitors — no token, no password, no gate
5. <PreviewBanner /> always first inside public return when isPreview
6. Never build your own loading screen or password gate
7. isAuthenticated is ONLY checked inside `if (isAdminRoute)` — nowhere else

═══════════════════════════════════════════
LOADING SCREEN — THE FARHTY LOGO
═══════════════════════════════════════════

The LoadingScreen SDK component displays the Farhty brand logo image.
The logo file MUST be at: public/فرحتي بنفسجي.png
The SDK renders it as: <img src="/فرحتي بنفسجي.png" />

LoadingScreen renders:
- Full screen with your template's bg color (passed via bg prop)
- Farhty logo IMAGE (not text, not a CSS-styled div) centered, pulsing animation
- Minimum display: 800ms — prevents flash on fast connections

IMPORTANT — every template MUST include the logo file:
  Copy the Farhty logo image into: apps/templates/[template-slug]/public/فرحتي بنفسجي.png
  This file is referenced by the SDK's LoadingScreen component at /فرحتي بنفسجي.png
  Without this file, the loading screen will show a broken image.

RULES:
- NEVER build your own loading screen — always use <LoadingScreen bg="..." /> from SDK
- NEVER show content before isLoading is false
- NEVER replace or skip the Farhty logo — this is brand consistency
- ALWAYS include the logo file in public/ — the SDK loads it as an <img> tag

═══════════════════════════════════════════
FLEXIBLE DATA MODEL — THE CORE CONCEPT
═══════════════════════════════════════════

Templates store data as flexible key-value pairs. The instance's `data`
field is a free-form Map<string, Mixed> in MongoDB. Any value type works:
strings, numbers, booleans, objects, arrays — whatever the template needs.

The `fields` array in the Template record defines the SCHEMA — it tells
the admin dashboard what inputs to render and how to display them.
The instance `data` holds the ACTUAL values saved by the customer.

get('key') returns the customer's saved value, or the field's defaultValue.
set('key', value) updates the local state with ANY value type.
save() PATCHes the entire fieldData object to the API.

This means you can store:
  - get('bride_name')       → "ليلى"           (string)
  - get('guest_count')      → 150              (number)
  - get('show_countdown')   → true             (boolean)
  - get('schedule_items')   → [{time, label}]  (array of objects)
  - get('venue_location')   → "https://..."    (URL for iframe)
  - get('wedding_date')     → "2025-06-15"     (date string)
  - get('accent_color')     → "#C9A96E"        (color hex)

The FIELD TYPE in the schema controls HOW the admin dashboard renders
the input — not what data type is stored. Choose the right field type
for the best editing UX.

═══════════════════════════════════════════
FIELD TYPES — COMPLETE REFERENCE
═══════════════════════════════════════════

The system supports these field types. Choose the most appropriate type
for each piece of data the customer needs to edit.

BASIC TYPES:
  text      → Single-line text input. For names, titles, short phrases.
  textarea  → Multi-line text input. For descriptions, messages, long text.
              Use `placeholder` for example content.
  number    → Numeric input with optional min/max. For counts, quantities.
              Use `min` and `max` for validation hints.
  url       → URL input with validation. For external links (WhatsApp, social).
              Always dir="ltr".
  iframe    → URL that renders as an embedded iframe. For maps, Google Maps,
              embedded videos. Shows URL input + live iframe preview.
              *** STRICT RULE: Any location, map, or venue map MUST use
              type "iframe" — never use type "image" for maps. ***
  select    → Dropdown with predefined options. For dress codes, categories.
              Requires `options: [{ label, value }]` in the field definition.
  time      → Time picker input (HH:MM). For ceremony times, event times.
  date      → Date picker input (YYYY-MM-DD). For wedding date, event dates.
  color     → Color picker + hex display. For accent colors, theme colors.
  boolean   → Toggle switch. For enabling/disabling features, show/hide.

MEDIA TYPES:
  image     → Cloudinary upload button + image preview thumbnail.
              Requires `cloudinaryFolder` for organized storage.
              Always shows loading/success/error states.
  audio     → Cloudinary upload button + audio player preview.
              Requires `cloudinaryFolder` for organized storage.
              Always shows loading/success/error states.

STRUCTURED TYPES:
  array     → A list of structured items with add/remove/edit per item.
              Requires `itemSchema` to define each item's fields.
              Each itemSchema entry has: { key, label, type, placeholder? }
              Supported itemSchema types: "text", "time", "number", "url"
              Example: schedule items, gallery captions, program events.
              *** USE THIS instead of "json" whenever the data is a list ***
              *** of objects with a known, consistent structure. ***
  json      → Raw JSON textarea for truly freeform structured data.
              Use ONLY when the structure cannot be predicted.
              For known structures (schedules, lists), use "array" instead.

FIELD METADATA — optional properties that enhance UX:
  group           → Section heading in admin dashboard. Fields with the
                    same group are visually grouped together.
                    e.g. "بيانات العروسين", "تفاصيل الحفل", "الوسائط"
  placeholder     → Hint text inside the input. Shows expected format.
  hint            → Help text below the field. Explains what the field does.
  options         → For "select" type only. Array of { label, value }.
  itemSchema      → For "array" type only. Defines the structure of each
                    array item. Array of { key, label, type, placeholder? }.
  min / max       → For "number" type. Numeric bounds.
  cloudinaryFolder → For "image" and "audio" types. Cloudinary storage path.

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
- Groups fields into logical sections with styled headings
    Use the field's `group` property to auto-group.
    If fields don't have groups, organize them logically:
    e.g. "بيانات العروسين" | "تفاصيل الحفل" | "الصور والوسائط" | "إعدادات"
- Each section has a visible separator or card container
- Field label above each input, styled and readable
- Hint text below fields when provided (smaller, muted color)
- Proper input styling — no raw unstyled HTML
- A prominent "حفظ التغييرات" save button with loading spinner (isSaving)
- Success toast: "تم الحفظ بنجاح"
- Fully mobile responsive

FIELD TYPE → INPUT MAPPING in AdminDashboard:
  text      → styled <input type="text" /> with placeholder
  textarea  → styled <textarea /> with placeholder and auto-height
  number    → styled <input type="number" /> with min/max and placeholder
  url       → styled <input type="url" dir="ltr" /> with link preview
  iframe    → styled <input type="url" dir="ltr" /> for embed URL
              + live iframe preview below showing the embedded content
              + hint explaining to paste a Google Maps embed link
  select    → styled <select> with options from field.options
  time      → styled <input type="time" dir="ltr" />
  date      → styled <input type="date" dir="ltr" />
  color     → styled <input type="color" /> + hex value display beside it
  boolean   → styled toggle switch with label
  image     → Cloudinary upload button + current image preview thumbnail
              + LOADING STATE while uploading + success/error feedback
  audio     → Cloudinary upload button + <audio> player preview
              + LOADING STATE while uploading + success/error feedback
  array     → Structured list editor:
              - Render each item as a card with inputs for each itemSchema field
              - "إضافة" button to add new empty item
              - Delete button (×) on each item card
              - Drag handle for reordering (optional but nice)
              - Each sub-field rendered by its type (text input, time input, etc.)
  json      → styled <textarea /> with placeholder showing expected format
              (use sparingly — prefer "array" for known structures)

SMART RENDERING RULES FOR AdminDashboard:
1. Read instance.fields and group by field.group
2. For each group, render a section card with the group name as heading
3. Inside each section, render fields in order with appropriate inputs
4. For "array" fields, render a dynamic list with add/remove
5. For "iframe" fields, show a live preview of the embedded content
6. For "image" fields, show the current image as a thumbnail
7. For "boolean" fields, use a styled toggle, not a checkbox
8. For "select" fields, render a styled dropdown from field.options
9. If a field has no group, put it in a "عام" (General) section at the end

THE DASHBOARD SHOULD BE DATA-DRIVEN:
  The AdminDashboard SHOULD read instance.fields and render inputs dynamically
  based on each field's type and metadata. This makes it automatically adapt
  to any fields defined in the MongoDB record.

  Pattern:
    const groups = groupFieldsByGroup(instance.fields)
    return groups.map(group => (
      <Section title={group.name}>
        {group.fields.map(field => <DynamicFieldInput field={field} />)}
      </Section>
    ))

  Where DynamicFieldInput switches on field.type to render the right input.
  This approach means adding a new field to MongoDB automatically shows it
  in the dashboard — no code changes needed.

UPLOAD LOADING STATES — mandatory for every image/audio upload:
  - Show a loading indicator on the upload button while uploading (e.g. "جاري الرفع...")
  - Disable the button during upload (opacity-50 + pointer-events-none)
  - Show success feedback after upload completes (e.g. "تم الرفع"), auto-dismiss after 3s
  - Show error feedback on failure (e.g. "فشل الرفع"), auto-dismiss after 5s
  - Surface Cloudinary error messages to the user in a visible red banner
  - Check for empty cloud_name from the sign response (means misconfigured server)
  - Check for upData.error from Cloudinary response (e.g. "cloud_name is disabled")
  - Never let uploads fail silently — always surface the error

UPLOAD SIGN RESPONSE — CRITICAL KEY NAMES:
  The sign endpoint returns camelCase keys. You MUST destructure with camelCase:

    const { signature, timestamp, apiKey, cloudName, folder } = signRes.data

  WRONG — will cause uploads to fail silently (undefined values):
    const { api_key: apiKey, cloud_name: cloudName } = signRes.data   ← NEVER DO THIS

  The Cloudinary upload URL must use cloudName:
    https://api.cloudinary.com/v1_1/${cloudName}/${isAudio ? 'video' : 'image'}/upload

  Always pass apiKey as the api_key form field:
    fd.append('api_key', apiKey)

COMPLETE UPLOAD FUNCTION — copy this pattern exactly into AdminDashboard:

  const [uploadStates, setUploadStates] = useState<Record<string, 'idle'|'uploading'|'success'|'error'>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})

  const handleUpload = async (key: string, file: File, folder: string, isAudio = false) => {
    setUploadStates(prev => ({ ...prev, [key]: 'uploading' }))
    try {
      const token = localStorage.getItem(`farhty_token_${slug}`)
      const signRes = await api.post('/api/upload/sign',
        { folder },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const { signature, timestamp, apiKey, cloudName } = signRes.data

      if (!cloudName) throw new Error('cloud_name missing — server misconfigured')

      const fd = new FormData()
      fd.append('file', file)
      fd.append('signature', signature)
      fd.append('timestamp', String(timestamp))
      fd.append('api_key', apiKey)
      fd.append('folder', folder)

      const upRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${isAudio ? 'video' : 'image'}/upload`,
        { method: 'POST', body: fd }
      )
      const upData = await upRes.json()
      if (upData.error) throw new Error(upData.error.message || 'Cloudinary rejected upload')

      set(key, upData.secure_url)
      setUploadStates(prev => ({ ...prev, [key]: 'success' }))
      setTimeout(() => setUploadStates(prev => ({ ...prev, [key]: 'idle' })), 3000)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed'
      setUploadStates(prev => ({ ...prev, [key]: 'error' }))
      setUploadErrors(prev => ({ ...prev, [key]: msg }))
      setTimeout(() => {
        setUploadStates(prev => ({ ...prev, [key]: 'idle' }))
        setUploadErrors(prev => { const n = { ...prev }; delete n[key]; return n })
      }, 5000)
    }
  }

  RENDER for image/audio fields — shows loading/success/error states:

    <div>
      <label className="..." style={uploadStates[key] === 'uploading' ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
        {uploadStates[key] === 'uploading' ? 'جاري الرفع...' : 'اختر صورة'}
        <input type="file" accept="image/*" style={{ display: 'none' }}
          disabled={uploadStates[key] === 'uploading'}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(key, f, folder) }} />
      </label>
      {uploadStates[key] === 'success' && <p className="text-green-500 text-sm mt-1">تم الرفع بنجاح</p>}
      {uploadStates[key] === 'error' && <p className="text-red-500 text-sm mt-1 bg-red-500/10 p-2 rounded">{uploadErrors[key]}</p>}
      {get(key) && <img src={get(key)} alt="" className="..." />}
    </div>

USE useTemplateFields() for all data:
  const { get, set, save, isSaving } = useTemplateFields()
  Each input: value={get('key')} onChange={e => set('key', e.target.value)}
  For numbers: value={get('key')} onChange={e => set('key', Number(e.target.value))}
  For booleans: checked={get('key')} onChange={e => set('key', e.target.checked)}
  For arrays: value={get('key') ?? []} with add/remove/update item logic
  Save button: onClick={save}

IMPORTANT — slug and api must be imported for uploads:
  import { api } from '@farhty/template-sdk'
  Get slug from: const { slug } = useTemplateData()

RULES for AdminDashboard:
- Never render the public template content on this route
- All saves through save() → PATCH /api/instances/:id/data — no new endpoints
- Never use raw unstyled inputs
- Never show all fields in one flat unsorted list — always group them
- Every image/audio upload MUST have a loading state, success feedback, and error feedback
- Uploads must NEVER fail silently — always show errors to the user
- ALWAYS import { api } from '@farhty/template-sdk' for upload signing
- For "array" fields, NEVER render a raw JSON textarea — always render
  structured item cards with individual inputs per itemSchema field

═══════════════════════════════════════════
SECTION VISIBILITY — MANDATORY STANDARD
═══════════════════════════════════════════

Every template section that can be shown or hidden MUST implement this system.
This is NON-NEGOTIABLE. Every generated template must follow this exactly.

RULE: For every feature-gated section, add a matching boolean field to control
per-instance visibility. The customer toggles sections from their /admin route.

NAMING CONVENTION — always section_{name}_visible:
  section_countdown_visible
  section_ourstory_visible
  section_eventdetails_visible
  section_venue_visible
  section_location_visible
  section_rsvp_visible
  section_wishwall_visible
  section_gallery_visible
  section_parents_visible
  section_dayprogram_visible
  section_music_visible
  section_share_visible
  (follow same pattern for any custom section)

FIELD DEFINITION — add to MongoDB fields array, always last, group "الأقسام":
  {
    "key": "section_gallery_visible",
    "label": "إظهار قسم معرض الصور",
    "type": "boolean",
    "defaultValue": true,
    "required": false,
    "group": "الأقسام",
    "hint": "أوقف هذا لإخفاء معرض الصور من الدعوة"
  }

RENDERING RULE — always use !== false, never just truthy:
  ✅  {instance?.features.gallery && get('section_gallery_visible') !== false && <GallerySection />}
  ❌  {get('section_gallery_visible') && <GallerySection />}
  ❌  {instance?.features.gallery && <GallerySection />}

  WHY !== false: get() returns defaultValue (true) when field is unset.
  A truthy check works the same but !== false makes intent explicit and
  handles any edge case where the field is missing from the fields array.

SECTIONS THAT MUST NEVER GET A TOGGLE (always visible):
  - Hero section
  - Couple names display
  - Wedding date display
  - Footer

SECTIONS THAT MUST ALWAYS HAVE A TOGGLE (when the feature exists):
  - Countdown timer       → section_countdown_visible
  - Gallery               → section_gallery_visible
  - RSVP form             → section_rsvp_visible
  - Wish wall             → section_wishwall_visible
  - Venue / map           → section_venue_visible (or section_location_visible)
  - Day program           → section_dayprogram_visible
  - Parents names         → section_parents_visible
  - Music player          → section_music_visible
  - Share button          → section_share_visible
  - Our story             → section_ourstory_visible
  - Event details         → section_eventdetails_visible

FIELD ORDERING: All section_*_visible fields MUST come last in the fields
array, in their own "الأقسام" group, after all content fields.

ADMIN DASHBOARD — no extra code needed for data-driven dashboards:
  Data-driven AdminDashboards (those that iterate instance.fields) automatically
  render boolean fields as toggle switches under the "الأقسام" group.

  For handcrafted AdminDashboards, add a SectionToggle component and a
  dedicated "الأقسام — إظهار وإخفاء" section before the save button:

    function SectionToggle({ label, fieldKey, get, set }) {
      const isVisible = get(fieldKey) !== false
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{label}</span>
          <button onClick={() => set(fieldKey, !isVisible)}
            style={{ width: '44px', height: '24px', borderRadius: '999px',
                     background: isVisible ? '[accent]' : '#D9D9D9', border: 'none', cursor: 'pointer',
                     position: 'relative', transition: 'background 0.25s ease' }}>
            <span style={{ position: 'absolute', top: '3px',
                           right: isVisible ? '3px' : '23px',
                           width: '18px', height: '18px', borderRadius: '50%',
                           background: 'white', transition: 'right 0.25s ease' }} />
          </button>
        </div>
      )
    }

═══════════════════════════════════════════
FOOTER — MANDATORY ON EVERY TEMPLATE
═══════════════════════════════════════════

Every template MUST end with this footer as the very last element before
the closing tag of the public invitation. No exceptions.

Required text (Arabic): صنعت لكل حب بواسطة farhty.online

The footer must:
  - Always be the last visible element of the invitation
  - Use the template's muted/faded color style (low opacity, small text)
  - Never be hidden or removable

Minimum implementation:
  <footer style={{ textAlign: 'center', padding: '2rem 1rem' }}>
    <p style={{ fontSize: '0.75rem', opacity: 0.4, fontFamily: '[template font]',
                letterSpacing: '0.08em', color: '[template muted color]' }}>
      صنعت لكل حب بواسطة farhty.online
    </p>
  </footer>

Style it to match the template — use the template's colors and fonts.
The text is fixed and must not be a customer-editable field.

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
  {instance.features.venueMap && <VenueMap src={get('venue_map_url')} />}
  {instance.features.schedule && <DayProgram items={get('schedule_items') ?? []} />}
  {instance.features.videoBackground && <VideoBg src={get('hero_video')} />}
  {instance.features.shareButton && <ShareButton />}
  {instance.features.qrCode && <QRSection url={window.location.href} />}
  ... any feature you define follows this same pattern

RULE: If a feature needs customer-configurable data → add a field to MongoDB.
Purely decorative features need no field.

═══════════════════════════════════════════
STRICT RULES FOR SPECIFIC FIELD TYPES
═══════════════════════════════════════════

LOCATION / MAP / VENUE MAP:
  *** ALWAYS use type: "iframe" for any map or location field ***
  *** NEVER use type: "image" for maps ***
  The customer pastes a Google Maps embed URL, and the template renders it
  as <iframe src={get('venue_map_url')} /> — live interactive map.
  The admin dashboard shows a URL input + live iframe preview.

  Field definition:
    {
      "key": "venue_map_url",
      "label": "رابط خريطة القاعة",
      "type": "iframe",
      "defaultValue": "",
      "group": "تفاصيل الحفل",
      "placeholder": "https://www.google.com/maps/embed?...",
      "hint": "انسخ رابط التضمين من خرائط جوجل (Share → Embed a map → Copy HTML → extract the src URL)"
    }

  Template rendering:
    {get('venue_map_url') && (
      <iframe
        src={get('venue_map_url')}
        width="100%" height="300"
        style={{ border: 'none', borderRadius: '12px' }}
        allowFullScreen loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    )}

SCHEDULE / PROGRAM:
  Use type: "array" with itemSchema, NOT type: "json".
  This gives customers a structured editor where they add/remove items
  with individual inputs — much better UX than editing raw JSON.

  Field definition:
    {
      "key": "schedule_items",
      "label": "برنامج الحفل",
      "type": "array",
      "defaultValue": [{ "time": "18:00", "label": "استقبال الضيوف" }],
      "group": "تفاصيل الحفل",
      "itemSchema": [
        { "key": "time", "label": "الوقت", "type": "time" },
        { "key": "label", "label": "الفعالية", "type": "text", "placeholder": "مثال: حفل العشاء" }
      ]
    }

GALLERY IMAGES:
  Use type: "json" for gallery_images since it's an array of URL strings
  managed by multiple individual image uploads. OR use type: "array" with
  an itemSchema that has a single "url" text field.

  Simpler approach — json array of URLs:
    {
      "key": "gallery_images",
      "label": "صور المعرض",
      "type": "json",
      "defaultValue": "[]",
      "group": "الصور والوسائط",
      "hint": "يتم إضافة الصور عبر زر الرفع في كل صورة"
    }

DRESS CODE:
  Use type: "select" with options:
    {
      "key": "dress_code",
      "label": "الدريس كود",
      "type": "select",
      "defaultValue": "formal",
      "group": "تفاصيل الحفل",
      "options": [
        { "label": "رسمي", "value": "formal" },
        { "label": "نصف رسمي", "value": "semi-formal" },
        { "label": "كاجوال", "value": "casual" },
        { "label": "تقليدي", "value": "traditional" }
      ]
    }

═══════════════════════════════════════════
API ENDPOINTS & DATA RULES
═══════════════════════════════════════════

═════════════════════════════════════════════
PUBLIC DATA ACCESS — VISITORS SEE DATA WITHOUT AUTH
═════════════════════════════════════════════

CRITICAL RULE: The public invitation page NEVER requires authentication.
Wedding guests who receive the link MUST see the full invitation immediately.
No password. No login. No token. Just open the link and see the invitation.

useTemplateData() always fetches instance data on boot, with or without a token.
If a token exists (admin who previously authenticated), it is sent along.
If no token exists (first-time visitor sharing the link), data is still fetched.

The isAuthenticated flag ONLY controls whether /admin shows the dashboard.
It does NOT gate the public invitation page. NEVER check isAuthenticated
outside of the /admin route check.

GET /api/instances/by-domain?slug=<slug>
  → Public. No Authorization header needed.
  → Returns instance data, fields, features, everything needed to render.
  → Always include slug as a query param (browsers cannot set Host header).

NEVER do this on the public route:
  if (!isAuthenticated) return <PasswordGate />   ← WRONG on public page
  if (!token) return <SomeBlockingScreen />       ← WRONG — blocks guests

The ONLY place PasswordGate appears is inside the isAdminRoute check:
  if (isAdminRoute) {
    if (!isAuthenticated) return <PasswordGate />
    return <AdminDashboard />
  }

═════════════════════════════════════════════
GUEST SUBMISSIONS — RSVP & WISH WALL
═════════════════════════════════════════════

Guest-facing interactions (RSVP, wish wall) MUST use the dedicated public endpoints.
These do NOT require authentication — visitors submit directly.

Available public endpoints for guest submissions:
  POST /api/instances/by-domain/rsvp   → { slug, name, attending, guests }
  POST /api/instances/by-domain/wish   → { slug, name, message }

Example — RSVP submission (NO auth token needed):

  const config = await fetch('/config.json').then(r => r.json())
  const slug = config.slug || window.location.hostname.split('.')[0]

  await fetch(`${config.apiBase}/api/instances/by-domain/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, name, attending: true, guests: 2 })
  })

  localStorage.setItem(`farhty_rsvp_submitted_${slug}`, 'true')

Example — Wish submission (NO auth token needed):

  const config = await fetch('/config.json').then(r => r.json())
  const slug = config.slug || window.location.hostname.split('.')[0]

  await fetch(`${config.apiBase}/api/instances/by-domain/wish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, name: 'Ahmed', message: 'Congratulations!' })
  })

Add array fields to MongoDB record:
  { "key": "rsvp_entries", "label": "تأكيدات الحضور", "type": "json", "defaultValue": "[]", "group": "الردود",
    "hint": "تُحدَّث تلقائياً عند تأكيد الضيوف — للقراءة فقط" }
  { "key": "wish_entries", "label": "التهاني",          "type": "json", "defaultValue": "[]", "group": "الردود",
    "hint": "تُحدَّث تلقائياً عند إرسال تهنئة — للقراءة فقط" }

ADMIN DASHBOARD — READABLE RENDERING FOR rsvp_entries AND wish_entries:

  These two fields MUST NOT render as a raw JSON textarea in the AdminDashboard.
  Intercept them by key BEFORE the type switch and render readable UI instead.

  In AdminDashboard.tsx, inside renderField():

    // Must come before the switch(type) block
    if (key === 'rsvp_entries') return renderRsvpEntries(val)
    if (key === 'wish_entries') return renderWishEntries(val)

  renderRsvpEntries(val):
    Parse val as { name, attending, guests }[] and render:
    - Summary bar: "✓ N سيحضر — M ضيف" (green badge) + "✗ N اعتذر" (red badge) + total count
    - One card per entry: avatar circle (✓/✗), name, guest count, attending status label
    - Empty state: "لا توجد ردود حتى الآن" placeholder

  renderWishEntries(val):
    Parse val as { name, message }[] and render:
    - Count label: "N تهنئة"
    - One card per entry: emoji icon, sender name (bold), message text
    - Empty state: "لا توجد تهاني حتى الآن" placeholder

  Both functions parse the raw JSON safely:
    Array.isArray(val) ? val : JSON.parse(val || '[]')

  These are READ-ONLY views — no editing, no save button needed for these fields.
  The data is written exclusively via the public POST endpoints.

ABSOLUTE RULES:
- Never use PATCH /api/instances/:id/data for guest submissions (that requires auth)
- Never require localStorage token for RSVP or wish wall submissions
- Always pass slug in the POST body — the backend resolves the instance
- Use localStorage only for "already submitted" local dedup (e.g. farhty_rsvp_submitted_${slug})
- Never suggest creating new API routes beyond the ones listed here
- rsvp_entries and wish_entries MUST render as readable card lists in AdminDashboard — NEVER as raw JSON textarea

═════════════════════════════════════════════
ADMIN-ONLY OPERATIONS
═════════════════════════════════════════════

These require the instance auth token (Bearer header):
  POST /api/instances/auth           → get token
  PATCH /api/instances/:id/data      → save edited fields (admin dashboard)
  POST /api/upload/sign              → get Cloudinary signed params (admin dashboard)

The AdminDashboard and CustomerDashboard handle these internally via the SDK.

═══════════════════════════════════════════
DATA ACCESS RULES
═══════════════════════════════════════════

ALWAYS use get() for customer data. Never hardcode. Never read instance.data directly.

Correct:
  get('bride_name') ?? 'ليلى'
  get('venue_name') ?? 'قاعة الأفراح'
  get('schedule_items') ?? []
  get('guest_count') ?? 150
  get('show_countdown') ?? true

Wrong:
  'ليلى'                     ← hardcoded
  instance.data.bride_name   ← direct access

Fallbacks must be beautiful and realistic — never empty strings for visible text.

VALUE TYPES by field type:
  text, textarea, url, iframe  → string
  number                       → number
  date, time                   → string (ISO format)
  color                        → string (hex)
  boolean                      → boolean
  select                       → string (the selected value)
  image, audio                 → string (Cloudinary URL)
  array                        → array of objects (matching itemSchema)
  json                         → parsed JSON (any structure)

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
│   └── فرحتي بنفسجي.png       ← REQUIRED: Farhty logo for LoadingScreen (copy from any existing template)
└── src/
    ├── App.tsx                 ← exact pattern: isAdminRoute check
    ├── main.tsx
    ├── index.css               ← Google Fonts + Tailwind + CSS variables
    └── components/
        ├── AdminDashboard.tsx  ← beautifully styled, data-driven form
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
      "type": "text|textarea|number|url|iframe|select|time|image|audio|date|color|boolean|json|array",
      "defaultValue": "",
      "cloudinaryFolder": "",
      "required": false,
      "group": "",
      "placeholder": "",
      "hint": "",
      "options": [],
      "itemSchema": [],
      "min": null,
      "max": null
    }
  ],
  "previewImages": [],
  "previewVideo": "",
  "status": "draft",
  "version": "1.0.0"
}

ALWAYS include these defaults unless irrelevant:
{ "key": "bride_name",   "label": "اسم العروسة",  "type": "text",  "defaultValue": "ليلى", "required": true,  "group": "بيانات العروسين" }
{ "key": "groom_name",   "label": "اسم العريس",   "type": "text",  "defaultValue": "كريم", "required": true,  "group": "بيانات العروسين" }
{ "key": "wedding_date", "label": "تاريخ الزفاف", "type": "date",  "defaultValue": "",      "required": true,  "group": "بيانات العروسين" }
{ "key": "hero_image",   "label": "صورة الغلاف",  "type": "image", "defaultValue": "",      "cloudinaryFolder": "templates/[slug]/hero", "required": true, "group": "الصور والوسائط" }
{ "key": "accent_color", "label": "اللون الرئيسي","type": "color", "defaultValue": "[your primary hex]", "required": false, "group": "الإعدادات" }

FIELD DEFINITION RULES:
- Every get() call in the code MUST have a matching field in the fields array.
- Every instance.features.[key] MUST exist in the features object.
- Every field MUST have a `group` value for proper admin dashboard sectioning.
- Map/location fields MUST use type: "iframe" — never "image".
- Schedule/program fields MUST use type: "array" with itemSchema — never "json".
- Dropdowns MUST use type: "select" with options — never "text" with instructions.
- Long text (descriptions, messages) MUST use type: "textarea" — never "text".
- Numeric data (counts, quantities) MUST use type: "number" — never "text".
- URLs (social links, external links) MUST use type: "url" — never "text".

═══════════════════════════════════════════
SMART FIELD SELECTION GUIDE
═══════════════════════════════════════════

When deciding what field type to use, follow this decision tree:

Is it a name, title, or short phrase?          → text
Is it a paragraph or long description?         → textarea
Is it a count or quantity?                     → number
Is it a URL/link to external site?             → url
Is it a map embed or location?                 → iframe (ALWAYS)
Is it a choice from predefined options?        → select (with options)
Is it a time (HH:MM)?                          → time
Is it a date?                                  → date
Is it a color?                                 → color
Is it a yes/no toggle?                         → boolean
Is it a customer-uploaded image?               → image (with cloudinaryFolder)
Is it a customer-uploaded audio file?          → audio (with cloudinaryFolder)
Is it a list of structured items?              → array (with itemSchema)
Is it truly freeform/unpredictable structure?  → json (last resort)

═══════════════════════════════════════════
OUTPUT FORMAT — DELIVER IN THIS ORDER
═══════════════════════════════════════════

## MongoDB Record
[ready-to-POST JSON — every field has group, appropriate type, metadata]

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

## What Changed (v2 — Smart Flexible Data Model)

| # | Issue | Fix |
|---|---|---|
| 1 | Only 7 field types — no number, textarea, url, iframe, select, time, array | 14 field types covering every data scenario with proper UX |
| 2 | Maps used image upload — static screenshot | Maps use `iframe` type — live interactive Google Maps embed |
| 3 | Schedule items stored as raw JSON with textarea editor | `array` type with `itemSchema` — structured add/remove/edit per item |
| 4 | No field metadata — no grouping, hints, placeholders | Fields now support `group`, `placeholder`, `hint`, `options`, `itemSchema`, `min/max` |
| 5 | AdminDashboard hardcoded field layout per template | Data-driven dashboard that reads field metadata and auto-renders |
| 6 | All fields dumped in flat list | Fields auto-grouped by `group` property into sectioned cards |
| 7 | Numbers stored as text strings | `number` type with min/max validation |
| 8 | URLs stored as plain text with no validation | `url` type with proper input and dir="ltr" |
| 9 | Dropdowns described in text field hints | `select` type with `options` array for proper dropdown |
| 10 | Long text crammed into single-line input | `textarea` type for descriptions and messages |
| 11 | Previous design/loading/auth/upload fixes retained | All v1 fixes preserved |

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
  (customer adds items with time + label via structured array editor)
- Falling golden particle animation in background (subtle, performant)
- Venue section: venue name, address, and Google Maps iframe embed
- Parents names: father of bride and father of groom displayed decoratively
- Share button: copies page URL to clipboard with Arabic toast confirmation
- RSVP: guest enters name and attendance, saves to rsvp_entries array in instance data

Custom fields: venue name, venue address, venue map (iframe),
father of bride name, father of groom name, schedule items (array),
tagline/welcome message (textarea)
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
- RSVP → POST /api/instances/by-domain/rsvp (public, no auth needed)
- Wish wall → POST /api/instances/by-domain/wish (public, no auth needed)
- Day program / schedule timeline (array type with itemSchema)
- Dress code section (select type with options)
- QR code to invitation URL

**Location**
- Venue map iframe embed (type: "iframe" — ALWAYS, never image)
- Google Maps directions button (type: "url")

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

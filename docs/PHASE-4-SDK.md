# Phase 4 — The Template SDK

## Purpose

The SDK is the shared package every template imports. It handles:
- Fetching instance data from the API by hostname
- Password gate (auth)
- Loading screen (Farhty pulsing logo — always)
- Customer dashboard (auto-generated field editor)
- Preview banner (for demo subdomains)

Templates never reimplement any of this. They only import and use.

---

## Package

```
packages/template-sdk/
├── src/
│   ├── index.ts                    → exports everything
│   ├── types.ts                    → all shared TypeScript types
│   ├── services/
│   │   └── api.ts                  → axios instance, reads apiBase from config.json
│   ├── hooks/
│   │   ├── useTemplateData.ts      → core hook — fetches instance by hostname
│   │   ├── useTemplateFields.ts    → get/set/save field values
│   │   └── useInstanceAuth.ts      → password gate logic
│   └── components/
│       ├── LoadingScreen.tsx        → Farhty pulsing logo — full screen
│       ├── PasswordGate.tsx         → password entry screen
│       ├── CustomerDashboard.tsx    → auto-generated floating field editor
│       └── PreviewBanner.tsx        → "Buy This Template" bar
├── package.json                    → name: "@farhty/template-sdk"
└── tsconfig.json
```

---

## Types

```typescript
// types.ts

export type FieldType = 'text' | 'image' | 'audio' | 'date' | 'color' | 'boolean'

export interface TemplateField {
  key: string
  label: string
  type: FieldType
  defaultValue: any
  cloudinaryFolder?: string
  required: boolean
}

export interface TemplateFeatures {
  music: boolean
  gallery: boolean
  rsvp: boolean
  countdownTimer: boolean
  rtl: boolean
  pages: number
}

export interface InstanceData {
  instanceId: string
  templateId: string
  slug: string
  isPreview: boolean
  features: TemplateFeatures
  fields: TemplateField[]           // schema definition
  data: Record<string, any>         // customer saved values
}
```

---

## `useTemplateData` — Core Hook

```typescript
const { instance, isLoading, isAuthenticated } = useTemplateData()
```

Behaviour on mount:
```
1. Read window.location.hostname → extract slug
2. Load public/config.json → get apiBase
3. Check localStorage for farhty_token_[slug]
4. If no token → isAuthenticated = false (PasswordGate renders)
5. If token exists → GET /api/instances/by-domain
   Headers: { Host: [hostname], Authorization: Bearer [token] }
6. Returns full InstanceData
7. While loading → isLoading = true (LoadingScreen renders)
8. Minimum loading display: 800ms (prevents flash)
```

---

## `useTemplateFields` — Data Access Hook

```typescript
const { get, set, save, isSaving } = useTemplateFields()
```

- `get('field_key')` → returns `instance.data['field_key']` or `field.defaultValue` if not set
- `set('field_key', value)` → updates local state only
- `save()` → `PATCH /api/instances/:id/data` with all current field values → persists to MongoDB
- `isSaving` → true while save() is in progress

The template never accesses `instance.data` directly. Always use `get()`.

---

## `useInstanceAuth` — Password Gate Logic

```typescript
const { authenticate, isAuthenticating, error } = useInstanceAuth()
```

- `authenticate(password)` → `POST /api/instances/auth` with `{ slug, password }`
- On success → stores token in localStorage as `farhty_token_[slug]`
- On failure → `error` is set → PasswordGate shows shake animation + error message

---

## Components

### `<LoadingScreen bg="string" />`

```
Props:
  bg: CSS color string for background (e.g. "#1a1a2e", "#fff8f0")

Renders:
  Full screen div with bg color
  Farhty logo SVG in center
  CSS keyframe pulse animation (scale + opacity)
  Minimum display enforced internally: 800ms

Rules:
  ALWAYS returned when isLoading is true
  NEVER skip this
  NEVER build a custom loading screen in a template
  This is brand consistency across all templates
```

### `<PasswordGate />`

```
Renders:
  Full screen Farhty branded password entry
  Logo at top
  "أدخل كلمة المرور" label
  Password input
  Submit button
  Error state: red message + shake animation on wrong password

Rules:
  ALWAYS returned when !isAuthenticated
  NEVER build a custom password screen in a template
```

### `<CustomerDashboard />`

```
Renders:
  Floating panel (bottom-right corner)
  Toggle button to open/close
  When open: scrollable list of field editors auto-generated from fields schema

Field type → rendered as:
  text    → <input type="text" />
  image   → Cloudinary upload widget + current image preview thumbnail
  audio   → Cloudinary upload widget + <audio> player preview
  date    → <input type="date" />
  color   → <input type="color" /> + hex value display
  boolean → toggle switch

Bottom of panel:
  "حفظ التغييرات" save button
  Calls save() from useTemplateFields
  Shows spinner while isSaving

Rules:
  ALWAYS rendered in every template — never skip it
  The template NEVER builds its own customer form
  This is the only way customers edit their data
```

### `<PreviewBanner templateName="string" />`

```
Props:
  templateName: string

Renders:
  Fixed top bar (z-index above everything)
  "هذه معاينة — اشترِ هذا القالب الآن"
  Button → links to farhty.online (store)
  Subtle pulsing or highlighted styling

Rules:
  ALWAYS rendered when instance.isPreview is true
  Position: fixed top, full width
  Does not affect template layout below it (template has padding-top to compensate)
```

---

## How a Template Imports and Uses the SDK

```typescript
// apps/templates/template-001/src/App.tsx

import {
  useTemplateData,
  useTemplateFields,
  PasswordGate,
  LoadingScreen,
  CustomerDashboard,
  PreviewBanner
} from '@farhty/template-sdk'

export default function App() {
  const { instance, isLoading, isAuthenticated } = useTemplateData()
  const { get } = useTemplateFields()

  // 1. Always first
  if (isLoading) return <LoadingScreen bg="#1a1a2e" />

  // 2. Always second
  if (!isAuthenticated) return <PasswordGate />

  return (
    <>
      {/* 3. Always first inside return */}
      {instance.isPreview && <PreviewBanner templateName={instance.templateId} />}

      {/* 4. Always rendered */}
      <CustomerDashboard />

      {/* 5. Template's own design below here */}
      <HeroSection
        brideName={get('bride_name') ?? 'ليلى'}
        groomName={get('groom_name') ?? 'كريم'}
        heroImage={get('hero_image')}
      />

      {/* 6. Features always conditional */}
      {instance.features.music && (
        <MusicPlayer src={get('music_file')} />
      )}
      {instance.features.countdownTimer && (
        <Countdown targetDate={get('wedding_date')} />
      )}
      {instance.features.gallery && (
        <Gallery images={get('gallery_images') ?? []} />
      )}
      {instance.features.rsvp && (
        <RSVPSection phone={get('rsvp_phone')} />
      )}
    </>
  )
}
```

This exact pattern is what the AI generation prompt produces for every new template.

---

## Package Registration

In `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/*'
  - 'apps/templates/*'
  - 'packages/*'         ← covers packages/template-sdk
```

In any template's `package.json`:
```json
{
  "dependencies": {
    "@farhty/template-sdk": "workspace:*"
  }
}
```

---

## Notes
- SDK has no UI library dependency — pure React + CSS
- Cloudinary uploads inside CustomerDashboard use signed URLs from `POST /api/upload/sign`
- The SDK reads `apiBase` from `/config.json` at runtime — never hardcoded
- Instance session tokens: `farhty_token_[slug]` in localStorage — one per subdomain

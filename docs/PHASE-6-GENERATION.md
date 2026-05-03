# Phase 6 — AI Template Generation

## Purpose

Once Phases 1–5 are complete and the system is running, this is how you generate unlimited new templates. You fill in a prompt with variables and Claude outputs a complete ready-to-plug-in template.

---

## What Claude Outputs

1. **MongoDB Record JSON** — ready to POST to `POST /api/admin/templates`
2. **Complete file tree** — every file fully written, no placeholders
3. **Workspace registration command** — one pnpm command to add the template

---

## How to Use

1. Open `docs/TEMPLATE-PROMPT.md`
2. Copy the full prompt
3. Fill in the `[bracketed]` variables at the top
4. Paste into Claude (claude.ai)
5. Claude outputs the MongoDB record + all template code
6. Follow `docs/TEMPLATE-GUIDE.md` to add it to the repo and publish

---

## Variables You Fill Each Time

| Variable | Example |
|---|---|
| Template Name | "Layla" |
| Template Slug | "template-002" |
| Mood / Vibe | "dark luxury — deep navy, gold accents, floating rose petals" |
| Language | ar / en / both |
| Pages / Sections | 3 |
| Music player | yes/no |
| Photo gallery | yes/no |
| RSVP section | yes/no |
| Countdown timer | yes/no |
| RTL layout | yes/no |
| Custom fields | "venue name, parent names, dress code" |
| Price (EGP) | 349 |
| Description | one line for the store listing |

---

## What the Prompt Enforces

The prompt is system-aware. It instructs Claude to:

**SDK compliance**
- Import only from `@farhty/template-sdk`
- Never reimplement LoadingScreen, PasswordGate, CustomerDashboard, PreviewBanner
- Always follow the App.tsx pattern exactly

**Data rules**
- Always use `get('field_key')` — never hardcode customer data
- Always provide beautiful Arabic/English fallback values
- All media via Cloudinary URLs from `get()`

**Feature conditionals**
- Every feature wrapped in `instance.features.[feature]` check
- No feature ever hardcoded as always-on

**Loading screen**
- Always `if (isLoading) return <LoadingScreen bg="..." />`
- Farhty pulsing logo on every template — non-negotiable

**Build config**
- `base: './'` in vite.config.ts (required for subdomain serving)
- `config.json` read at runtime for apiBase — never hardcoded

**RTL/LTR**
- `dir="rtl"` on root div for Arabic templates
- Google Fonts imported in index.css
- Correct font choices per language

**Design quality**
- Bold specific creative decisions based on the vibe
- CSS variables for color palette
- No generic layouts — premium feel

---

## Template Checklist After Generation

Before adding the generated template to the repo:

```
[ ] App.tsx follows the exact pattern (isLoading → isAuthenticated → return)
[ ] LoadingScreen is present and first
[ ] PasswordGate is present and second
[ ] PreviewBanner rendered when instance.isPreview
[ ] CustomerDashboard always rendered
[ ] All data access via get() — no hardcoded content
[ ] All features wrapped in instance.features conditionals
[ ] vite.config.ts has base: './'
[ ] public/config.json present with empty values
[ ] package.json name is @farhty/[template-slug]
[ ] Google Fonts imported correctly in index.css
[ ] dir="rtl" on root if Arabic
[ ] MongoDB record has all required default fields
[ ] MongoDB record features match what the template renders
[ ] All field keys in the record match get() calls in the code
```

---

## Vibe Reference — Examples to Inspire

| Vibe | Color Palette | Font Pairing | Animation | Motif |
|---|---|---|---|---|
| Dark Luxury | Navy + Gold + Cream | Playfair Display + Tajawal | Slow fade, floating particles | Gold geometric borders |
| Floral Romantic | Blush + Rose + White | Cormorant Garamond + Cairo | Soft spring entrance, petal fall | Watercolor flower overlays |
| Minimal Modern | White + Charcoal + Sage | DM Serif Display + Inter | Clean slide-in | Thin line dividers |
| Golden Oriental | Deep Brown + Gold + Ivory | Amiri + Tajawal | Shimmer, Arabic calligraphy reveal | Arabic geometric pattern fill |
| Garden Boho | Terracotta + Olive + Sand | Libre Baskerville + Tajawal | Parallax scroll | Leaf and vine SVG borders |
| Royal Blue | Midnight Blue + Silver + White | Cinzel + Cairo | Staggered fade entrance | Star field background |

---

## Growing the Template Library

Each new template follows the same process:

```
1. Fill prompt variables
2. Generate with Claude
3. Verify checklist
4. Add to apps/templates/[slug]/
5. pnpm install
6. Test locally (TEMPLATE-GUIDE.md section 4-7)
7. Upload preview images to Cloudinary
8. POST MongoDB record via admin
9. Deploy preview subdomain
10. Set status to active → appears in store
```

No infrastructure changes. No new Nginx config. Just code + a DB record.

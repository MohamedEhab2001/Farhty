# Phase 2 — The Store Frontend

## Stack
- Vite + React 18 + TypeScript
- TailwindCSS
- Axios
- React Router v6 (single page, hash routing)
- framer-motion (animations, fake purchase toasts)

---

## Folder Structure

```
apps/store/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── pages/
│   │   └── Home.tsx                    → single page that sells
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── TemplatesGrid.tsx
│   │   ├── TemplateCard.tsx
│   │   ├── PreviewCarousel.tsx
│   │   ├── FeatureBadges.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Testimonials.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── FAQ.tsx
│   │   ├── BuyModal.tsx
│   │   ├── FakePurchaseToast.tsx
│   │   └── StickyMobileCTA.tsx
│   ├── hooks/
│   │   ├── useTemplates.ts
│   │   └── useTestimonials.ts
│   └── api/
│       └── client.ts                   → axios → api.farhty.online
├── index.html
├── package.json
└── vite.config.ts
```

---

## Page Structure (Single Page — Top to Bottom)

```
1. Navbar
2. Hero
3. How It Works
4. Templates Grid
5. Testimonials
6. Trust & Refund Section
7. FAQ
8. Footer
[ Fake Purchase Toast — fixed position ]
[ Sticky Mobile CTA — fixed bottom, mobile only ]
```

---

## Sections in Detail

### Navbar
- Farhty logo (SVG)
- Arabic + English toggle (optional — sets page dir)
- Anchor links: Templates | How It Works | Reviews
- "اطلب الآن" CTA button → scrolls to templates grid

---

### Hero
- Strong Arabic headline: "دعوة زفافك تستحق أن تُبهر"
- Sub-headline: "تصاميم دعوات رقمية تفاعلية بتصاميم فاخرة"
- Two CTAs: "استعرض التصاميم" (scroll down) | "تواصل معنا" (WhatsApp)
- Background: dark with subtle animated pattern or gradient
- Mobile first — full viewport height

---

### How It Works
Three steps with icons:
1. اختار تصميمك المفضل
2. تواصل معنا على واتساب وأكد الدفع
3. ادخل بياناتك وشارك دعوتك

---

### Templates Grid
- Fetches `GET /api/templates` (active only)
- Renders `<TemplateCard />` for each
- Each card shows:
  - Cloudinary thumbnail image
  - Template name
  - Price (e.g. "299 جنيه")
  - Language badge (عربي / English / كلاهما)
  - Feature badges: music icon, gallery icon, timer icon, etc.
  - "معاينة مباشرة" button → opens `preview-[slug].farhty.online` in new tab
  - "اطلب الآن" button → opens BuyModal

---

### BuyModal

Triggered by "اطلب الآن". Single step:

```
Shows template name + price

"للطلب، راسلنا على واتساب"
→ Button: "ابدأ المحادثة"
  → opens wa.me/[WHATSAPP_NUMBER]?text=...
  → pre-filled message:
    "مرحبا، أنا مهتم بتصميم [template name] بسعر [price] جنيه.
     ممكن تبعتلي تفاصيل الدفع؟"

Small note below button:
"سنرد عليك خلال دقائق بتفاصيل الدفع وطرق السداد المتاحة"
```

Simultaneously:
- Creates an Order record in MongoDB: `POST /api/orders` with status: pending, customerPhone: null (filled later via WhatsApp)

---

### Testimonials
- Fetches `GET /api/testimonials`
- 3 default testimonials seeded in DB
- Each card:
  - Avatar (Cloudinary)
  - Name + Location
  - Star rating (1-5)
  - Review text
- Displayed as a horizontal scroll or 3-column grid on desktop
- Arabic text, RTL

---

### Trust & Refund Section
```
✓ ضمان استرداد المبلغ خلال 24 ساعة
✓ دعم فني مجاني بعد الشراء
✓ تسليم فوري بعد تأكيد الدفع
✓ تصاميم حصرية غير متاحة في أي مكان آخر
```
Displayed as badge grid with icons.

---

### Fake Purchase Toast
- Fixed bottom-left position
- Appears every 25–45 seconds (random interval)
- Pulled from a hardcoded list of ~15 fake purchases:
  ```
  "أحمد من القاهرة اشترى تصميم ليلى منذ 3 دقائق"
  "مريم من الإسكندرية اشترت تصميم نور منذ 7 دقائق"
  ```
- Animated slide-in from bottom-left (framer-motion)
- Auto-dismisses after 4 seconds
- Shows template thumbnail if available

---

### Sticky Mobile CTA
- Visible only on mobile (hidden md:hidden)
- Fixed to bottom of screen
- "اطلب دعوتك الآن" → scrolls to templates grid
- Disappears when user is in templates section

---

### FAQ
Questions:
- كيف أستلم الدعوة بعد الشراء؟
- هل يمكنني تعديل البيانات بنفسي؟
- ما هي طرق الدفع المتاحة؟
- كم يستغرق التسليم؟
- هل يمكنني مشاركة الدعوة على واتساب؟
- ما هو سياسة الاسترداد؟

Accordion-style expand/collapse.

---

## Design Notes
- Arabic-first RTL layout (`dir="rtl"` on root)
- Mobile is priority — most customers on phone
- Farhty brand colors defined as CSS variables (to be set during build)
- No heavy dependencies — Tailwind + framer-motion only
- All API calls use `VITE_API_URL` env variable

---

## Environment Variables
```env
VITE_API_URL=http://localhost:3001
VITE_WHATSAPP_NUMBER=201000000000
```

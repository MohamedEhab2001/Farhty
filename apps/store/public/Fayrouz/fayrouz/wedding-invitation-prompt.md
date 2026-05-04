# 🌸 Wedding Invitation — Art Direction Prompt

## Template Name: **Fayrouz**

---

## Overview

Build a **single-page Arabic RTL wedding invitation website** in the spirit of the Bridely template — a luxury, romantic, editorial aesthetic with warm cream-and-gold tones, hand-crafted floral ornaments, and cinematic scroll animations. The entire experience should feel like unfolding a beautifully hand-calligraphed letter.

**Language:** Arabic (RTL — `dir="rtl"`, `font-family` from Google Fonts: _Noto Naskh Arabic_ for body, _Amiri_ for display headings)  
**Color Palette:**

- Background: `#FAF5EE` (warm ivory)
- Primary Text: `#2C1A0E` (deep espresso brown)
- Gold Accent: `#C9A96E` (antique gold)
- Blush: `#F0D5C0` (warm rose blush)
- Cream card: `#FDF8F2`
- Deep accent: `#6B3F2A` (mahogany)

---

## Section Order

### 1. 🌹 Hero — Names & Ampersand

**Content:**

- Full-screen section with a **softly blurred background** — a lush floral/nature photograph desaturated to match the palette, with a warm ivory overlay at ~70% opacity.
- **Top center:** Small ornamental motif — two interlocking rings or a dove with an olive branch (SVG vector).
- **Center:** Groom's name in large _Amiri_ calligraphic Arabic type, followed by an ornate **`&`** (or Arabic _و_ styled decoratively between two small rose icons), then the Bride's name below in matching scale.
- **Subtext:** Wedding date in Arabic numerals and a short romantic Arabic tagline.
- **Bottom:** A delicate animated floral divider (vine + rose center) separating the hero from the next section.
- **Corner ornaments:** Floral vine vectors in all four corners, mirrored.

**Animation:**

- On load: names fade in with a slow upward drift (`translateY(40px) → 0`, `opacity 0 → 1`, `ease-out`, staggered 300ms between groom / `&` / bride).
- The `&` / _و_ symbol pulses gently with a slow `scale(1) → scale(1.06) → scale(1)` heartbeat loop (3s infinite).
- Corner ornaments draw in using SVG `stroke-dasharray` / `stroke-dashoffset` animation on page load (2s each, staggered).

---

### 2. ⏳ Countdown — العد التنازلي

**Content:**

- Full-width section with a **texture overlay** (subtle linen grain) over a deep `#6B3F2A` mahogany background.
- Title: **"العد التنازلي للحظة الكبرى"** (Countdown to the Big Moment) in gold _Amiri_.
- Four large countdown boxes arranged in a row: **الأيام / الساعات / الدقائق / الثواني** (Days / Hours / Minutes / Seconds).
- Each box is a cream card with a gold border, large number in _Amiri_ display, label below in smaller _Noto Naskh_.
- Small animated floral ornament between each box (a tiny cross/dot in gold).

**Animation:**

- On scroll-enter: boxes slide in from alternating directions — odd boxes from the right, even from the left — with `opacity 0 → 1` and `translateX(±60px) → 0` using `IntersectionObserver`.
- Numbers tick with a subtle `rotateX` flip animation on each second change (like a flip clock).
- Background has a very slow **parallax scroll** (`transform: translateY(scrollY * 0.3)`).

---

### 3. 📍 Location — خريطة الحفل

**Content:**

- Light section (ivory background).
- Title: **"مكان الاحتفال"** with a decorative floral header.
- A centered Google Maps `<iframe>` embed (rounded corners, gold border `2px solid #C9A96E`, soft box-shadow).
- Below the map: venue name, address, and a "فتح في خرائط جوجل" (Open in Google Maps) button styled in gold.
- Flanking the map: left and right small illustrated icons (a car, a compass rose) in SVG line art.

**Animation:**

- Map iframe fades in and scales up slightly (`scale(0.95) → 1`) on scroll-enter.
- The venue name has a slow **letter-spacing expand** on reveal: `letter-spacing: 0.3em → 0.05em` with `opacity 0 → 1`.

---

### 4. 💌 RSVP — تأكيد الحضور

**Content:**

- Centered card layout on a blush `#F0D5C0` section background.
- Decorative envelope SVG icon at the top of the card.
- Title: **"هل ستحضر معنا؟"** (Will you join us?)
- Form fields:
  - الاسم الكامل (Full Name) — text input
  - رقم الهاتف (Phone Number) — tel input
  - عدد الحضور (Number of Guests) — number select (1–5)
  - حضور / اعتذار radio buttons styled as two large pill buttons (gold for yes, outlined for no)
- Submit button: full-width gold gradient button with Arabic text **"تأكيد الحضور"**, hover shimmer effect.
- Corner floral ornaments on the card itself (top-right and bottom-left).

**Animation:**

- Card slides up from `translateY(80px)` to `0` with a gentle spring easing on scroll-enter.
- Input fields reveal with a staggered fade-in (50ms delay between each field).
- Submit button has a **ripple effect** on click and a checkmark success animation on submit.

---

### 5. 🕊️ Wishing Wall — حائط الأمنيات

**Content:**

- Full-width ivory section.
- Title: **"حائط الأمنيات"** with a speech-bubble icon SVG and floral divider.
- Subtitle: **"اتركوا لنا كلمة من القلب"** (Leave us a word from the heart).
- Input area: a large textarea styled as a decorative notecard with dotted lines (like stationery), gold border, placeholder in Arabic.
- Name field + **"أرسل أمنيتك"** (Send Your Wish) submit button.
- Below: a **masonry/grid display** of submitted wishes — each wish displayed as a small cream card with a gold accent corner, sender name, and the message. Soft drop shadows.
- Floating dove SVG ornament positioned absolutely at the top-right of the section, slowly drifting with CSS animation.

**Animation:**

- Wish cards cascade in on scroll-enter in a **staggered waterfall** — each card appears with `opacity 0 → 1` and `translateY(30px) → 0`, with 80ms staggered delays.
- New submitted wish cards **pop in** with a `scale(0.5) → 1` spring animation.
- The dove ornament floats on a slow `translateY(-12px) ↔ translateY(12px)` loop (4s ease-in-out infinite).

---

## 🌊 Global Fluid Cursor Effect

Implement a **custom cursor with fluid magnetic/fluid distortion** throughout the entire page:

- Hide the default cursor.
- Render a custom circular cursor: outer ring (24px, gold `#C9A96E` border, transparent fill) + inner dot (6px, solid gold).
- The outer ring **lags behind** the true mouse position using linear interpolation (`lerp` with factor 0.12) — creating a smooth fluid trailing effect.
- On hovering any interactive element (button, link, input), the outer ring **scales up to 2.5×** and changes fill to `rgba(201, 169, 110, 0.15)` with a `mix-blend-mode: multiply`.
- On hovering the hero names, the cursor transforms into a small **rose petal SVG** that rotates as the mouse moves.
- Implement using `requestAnimationFrame` for 60fps smooth motion. Store `targetX/Y` and `currentX/Y`, lerping every frame.

---

## 🎞️ Global Scroll Animations

All sections use `IntersectionObserver` (threshold: 0.15) to trigger entrance animations. Default entrance:

- `opacity: 0; transform: translateY(50px)` → `opacity: 1; transform: translateY(0)`
- `transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1)`

**Section-to-section transitions:**  
Between each section, use a **wavy SVG divider** in cream/blush alternating fill that creates an organic flowing boundary (not a flat horizontal rule).

**Parallax layers in hero:**

- Background image moves at 0.5× scroll speed.
- Floral corner ornaments move at 0.3× scroll speed (opposite direction).
- Names stay fixed until 30% scroll, then fade out with `opacity` decreasing to 0 by 60% scroll.

---

## 🌸 Assets to Include (SVG Vectors)

All vectors should use the gold `#C9A96E` / cream `#F8EDE3` palette:

1. **`floral-divider.svg`** — Horizontal vine + center rose + gold dots. Used between every section.
2. **`corner-floral.svg`** — Quarter-circle vine+bloom ornament. Used in hero corners (mirrored via CSS).
3. **`rings-icon.svg`** — Two interlinked wedding rings with small diamond sparkle. Used in hero.
4. **`dove.svg`** — Stylized dove carrying an olive branch. Used in wishing wall section.
5. **`rsvp-envelope.svg`** — Elegant envelope with wax heart seal. Used in RSVP section header.
6. **`wishing-wall-icon.svg`** — Speech bubble with heart and decorative lines. Used in wishing wall header.
7. **`wavy-divider.svg`** — Organic wave shape used as section separator (filled, not stroked).

---

## 📐 Typography Scale

| Use               | Font              | Weight | Size                       |
| ----------------- | ----------------- | ------ | -------------------------- |
| Hero names        | Amiri             | 700    | clamp(3rem, 8vw, 6rem)     |
| Section titles    | Amiri             | 400    | clamp(1.8rem, 4vw, 3rem)   |
| Body / labels     | Noto Naskh Arabic | 400    | 1rem–1.125rem              |
| Countdown numbers | Amiri             | 700    | clamp(2.5rem, 6vw, 4.5rem) |
| Buttons           | Noto Naskh Arabic | 600    | 1rem                       |

---

## 📱 Responsive Notes

- Mobile-first. On mobile (`< 768px`), countdown boxes stack 2×2.
- Hero names stack vertically on mobile with the `&` centered between.
- Map iframe: 100% width, 300px height on mobile / 480px on desktop.
- RSVP card: full-width on mobile with `16px` padding.
- Cursor fluid effect is disabled on touch devices (use `:hover` media query check).

---

## 🧩 Tech Stack Recommendation

- Google Fonts: `Amiri` + `Noto+Naskh+Arabic`
- Google Maps embed API for location
- `IntersectionObserver` API for scroll triggers
- `requestAnimationFrame` for cursor fluid effect

---

_Template name: **Fayrouz** — A timeless Arabic wedding invitation experience._

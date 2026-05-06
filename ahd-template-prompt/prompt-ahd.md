# ✦ Arabic Wedding Invitation — Foxe Art Direction
## Template Name: **عهد — Ahd** *(Covenant / Vow)*

---

## Art Direction Analysis — Foxe Wedding

Foxe Wedding is built on these design principles:

**Visual DNA:**
- **Dark, cinematic, editorial** — full-bleed photography at near-black with white text sitting boldly over it
- **Stark contrast** — ivory/white type on very dark backgrounds (charcoal, near-black)
- **Massive serif display type** — names rendered huge, breathing in generous whitespace
- **Fixed transparent navbar** that becomes opaque on scroll
- **Sections alternate** between dark-photo-background and clean white/light backgrounds
- **No decorative borders or ornaments** — the photography IS the decoration
- **Single accent color** — a muted warm tone used only for micro-details
- **Ultra-thin hairline rules** separating content blocks
- **Timeline** for love story — numbered, vertical, left-aligned
- **Two-column event cards** floating over a dark section
- **Offset staggered gallery** grid with hover lightbox effect
- **Minimal form design** — bottom-border-only inputs, no boxes
- **Parallax scrolling** on photo sections

**Translated to Arabic:**
Same cinematic darkness, same editorial restraint — but the warmth shifts from Nordic cool to Arabian night: charcoal backgrounds warm to deep espresso-brown, ivory type takes on a parchment tint, and the single accent becomes antique gold. The large serif names are in Amiri calligraphy. The template reads RTL. Everything else — the structure, the drama, the photography-first approach — stays faithful to Foxe.

---

## Color Palette

```css
:root {
  /* Dark backgrounds — alternating through sections */
  --dark-1:     #0E0A06;   /* hero BG overlay — near black, warm */
  --dark-2:     #1A120A;   /* countdown, RSVP sections */
  --dark-3:     #231810;   /* footer, story section */

  /* Light backgrounds */
  --ivory:      #FAF6EF;   /* clean section backgrounds */
  --parchment:  #F2E8D5;   /* tinted section backgrounds */

  /* Typography */
  --white:      #F5F0E8;   /* primary text on dark */
  --white-dim:  rgba(245,240,232,0.55); /* secondary text on dark */
  --espresso:   #1C1209;   /* primary text on light */
  --espresso-dim: rgba(28,18,9,0.5);   /* secondary text on light */

  /* Accent — used sparingly */
  --gold:       #C4954A;   /* single accent: rules, dots, highlights */
  --gold-dim:   rgba(196,149,74,0.35); /* ghost accent */

  /* Photo overlay */
  --overlay:    rgba(10,7,4,0.72); /* dark photo overlay */
}
```

---

## Typography

```css
/* Load in <head> */
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Naskh+Arabic:wght@400;500;600&family=Cinzel:wght@400;500&display=swap');

/* Display — names, section titles */
--font-display: 'Amiri', serif;

/* Body — descriptions, labels, form */
--font-body: 'Noto Naskh Arabic', serif;

/* Numerals — dates, countdown numbers */
--font-numeral: 'Cinzel', serif;
```

**Scale:**
- Hero names: `clamp(4rem, 12vw, 9rem)` — Amiri Bold
- Section titles: `clamp(2.2rem, 6vw, 5rem)` — Amiri Regular
- Eyebrow labels: `0.72rem`, Noto Naskh, `letter-spacing: 0.3em`, uppercase
- Body text: `1.05rem`, Noto Naskh, `line-height: 1.95`
- Countdown numbers: `clamp(3rem, 8vw, 6rem)` — Cinzel

---

## Base Setup

```css
html {
  direction: rtl;
  scroll-behavior: smooth;
}

body {
  background: var(--dark-1);
  color: var(--white);
  font-family: var(--font-body);
  overflow-x: hidden;
  cursor: none; /* replaced by custom cursor */
}

.container {
  width: min(900px, 88vw);
  margin: 0 auto;
}

section {
  padding: clamp(80px, 12vh, 140px) 0;
}

/* Photo section base */
.section--photo {
  position: relative;
  background-attachment: fixed; /* parallax */
  background-size: cover;
  background-position: center;
}
.section--photo::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--overlay);
}
.section--photo > * { position: relative; z-index: 1; }
```

---

## Section 1 — Hero: الأسماء والأصول
### Names & Lineage

**Structure:** Full-screen `100svh`. Dark photo background (venue/garden shot) with `var(--overlay)`. Fixed transparent navbar at top.

**Navbar (fixed, transparent → dark on scroll):**
```
right side (RTL):  [logo mark — gold diamond SVG]  [template name: عهد]
left side:         [الموقع] [الأمنيات] [تأكيد الحضور] [قصتنا] [العد التنازلي]
```

**Hero content (centered):**

```
────────────────────────────────────────────────────────
                                                        
  ╔══════════════════════════════════════════════════╗  
  ║                                                  ║  
  ║   بسم الله الرحمن الرحيم                         ║  ← Noto Naskh 0.8rem
  ║   ─────────────────────                          ║  ← gold hairline 80px
  ║                                                  ║  
  ║         [اسم العريس]                              ║  ← Amiri Bold clamp(4rem,12vw,9rem)
  ║   ابن السيد [اسم والد العريس]                     ║  ← Noto Naskh 1rem, gold, tracking
  ║                                                  ║  
  ║                  و                               ║  ← Amiri 180px, gold 15% opacity
  ║                                                  ║  ← (sits as background watermark)
  ║         [اسم العروس]                              ║  ← Amiri Bold clamp(4rem,12vw,9rem)
  ║   بنت السيد [اسم والد العروس]                     ║  ← Noto Naskh 1rem, gold, tracking
  ║                                                  ║  
  ║   ─────────────────────                          ║  ← gold hairline
  ║   يتشرفان بدعوتكم لحضور حفل زفافهما              ║  ← Noto Naskh, white-dim, 0.95rem
  ║   [اليوم] · [التاريخ بالميلادي] · [التاريخ الهجري]║  ← Cinzel numerals + Noto Naskh
  ║                                                  ║  
  ╚══════════════════════════════════════════════════╝  
                                                        
                   ↓  (gold animated chevron)           
────────────────────────────────────────────────────────
```

**Load animations (sequence):**
1. `0.0s` — Background photo fades in from black: `opacity 0→1` over 1.8s
2. `0.4s` — Hairline rules draw in: `width 0→80px` ease-out 0.7s
3. `0.8s` — Groom name wipes in RTL: `clip-path: inset(0 0 0 100%)→inset(0 0 0 0%)` 0.9s
4. `1.1s` — Groom father name fades up: `translateY(10px) opacity:0 → translateY(0) opacity:1` 0.6s
5. `1.3s` — Gold `و` watermark fades in: `opacity 0→0.15` 1.2s
6. `1.6s` — Bride name wipes in LTR: `clip-path: inset(0 100% 0 0)→inset(0 0% 0 0)` 0.9s
7. `1.9s` — Bride father name fades up: same as groom father
8. `2.2s` — Tagline + date fades in
9. `2.5s` — Scroll chevron bounces in

**Parallax:** `background-attachment: fixed` on the photo layer. The `و` watermark moves at `translateY(scrollY * -0.15)` for depth.

---

## Section 2 — Countdown: العد التنازلي
### Save the Date Counter

**Background:** Dark photo (floral/candles close-up) + `var(--overlay)`. Full-width.

**Layout — centered:**
```
  يتبقى على موعد الفرح       ← eyebrow label, gold, tracking
  ──────                      ← gold 40px rule

  [  88  ]  [  23  ]  [  45  ]  [  12  ]
   يوماً     ساعةً     دقيقةً    ثانيةً
```

**Each unit:**
- Number: `Cinzel` `clamp(3rem,8vw,6rem)`, `var(--white)`
- A `1px` gold underline `50px` wide, centered, below number
- Label: `Noto Naskh` `0.75rem`, `var(--white-dim)`, `letter-spacing: 0.28em`
- Units are separated by a thin `1px` vertical gold rule `30px` tall, centered vertically
- The 4 units sit in a flex row with `gap: clamp(2rem, 6vw, 5rem)`

**Second tick animation:**
- On each tick: `transform: translateY(-100%)` (exit up) → number updates → new number enters from `translateY(100%)` → settles to `0`
- Duration: 0.35s `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

**Scroll-enter animation:**
- Each unit fades up with staggered 120ms delay: `translateY(30px) opacity:0 → 0 opacity:1`
- Vertical dividers between units scale in: `scaleY(0)→scaleY(1)` from center, 0.5s

---

## Section 3 — Our Story: قصتنا
### The Love Timeline

**Background:** `var(--ivory)`. Text: `var(--espresso)`.

**Section header (centered):**
```
  ── eyebrow ─────────────────────────────────────────
  الحكاية التي غيّرت كل شيء   ← Noto Naskh, 0.72rem, gold, tracking 0.3em
  ── title ───────────────────────────────────────────
  قصتنا                        ← Amiri, clamp(2.2rem,6vw,5rem)
  ── gold rule ───────────────────────────────────────
```

**Timeline structure:**

A single `2px solid var(--gold-dim)` vertical line runs down the exact center of the section.

Each milestone:
- A pearl dot on the center line: `14px` gold ring, `6px` gold filled center, ivory background (see `timeline-dot.svg`)
- Year badge: `Cinzel`, `0.7rem`, gold, `1px gold border`, `4px 10px` padding pill
- Title: `Amiri`, `1.6rem`, espresso
- Body: `Noto Naskh`, `0.95rem`, espresso-dim, `line-height:1.9`

**Alternating layout (desktop ≥ 768px):**
- Odd milestones: content block to the RIGHT of center line (RTL: content on right, dot center, empty left)
- Even milestones: content block to the LEFT of center line (dot center, content on left)
- Content max-width: `380px`
- Vertical gap between milestones: `80px`

**Mobile:** All content stacks to one side (right), dot stays on a left-margin line.

**Suggested milestones:**
1. 🌙 **أول لقاء** — لحظة التعارف الأولى
2. 💌 **أول رسالة** — بداية الحديث
3. 🌹 **أول موعد** — تلك الأمسية التي لا تُنسى
4. 🕊️ **كانت الموافقة** — قالت نعم
5. 💍 **الخطوبة** — أمام العائلتين والأحبة
6. 👑 **يوم الزفاف** — اليوم الذي طالما انتظرناه

**Scroll animations:**
- The vertical line draws downward: `height: 0→100%` as section scrolls into view (triggered once, 1.5s)
- Each milestone pair enters from its side: right-content `translateX(40px)→0`, left-content `translateX(-40px)→0`, `opacity:0→1`
- Timeline dots scale in with spring: `scale(0)→scale(1)` `cubic-bezier(0.34,1.56,0.64,1)` — they "pop"

---

## Section 4 — Location: خريطة الحفل
### Google Maps — Iframe Only

**Background:** `var(--parchment)`.

**Header (centered):**
```
  مكان الاحتفال               ← eyebrow label
  [Venue Name]                ← Amiri 2.5rem, espresso
  [Address line]              ← Noto Naskh, espresso-dim
  ─────────────               ← gold hairline 60px
```

**The iframe — NO wrapper, NO card, NO box-shadow:**
```html
<iframe
  src="https://www.google.com/maps/embed?pb=YOUR_EMBED_URL"
  width="100%"
  height="500"
  style="
    display: block;
    border: none;
    border-top: 1px solid rgba(196,149,74,0.4);
    border-bottom: 1px solid rgba(196,149,74,0.4);
    filter: sepia(15%) saturate(0.85) brightness(0.97);
    margin-top: 40px;
  "
  allowfullscreen
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade">
</iframe>
```

**Below iframe:**
```
  ← افتح في خرائط جوجل ↗      ← plain <a> tag, gold color, Noto Naskh 0.85rem
```

**Rules:**
- The iframe IS the section visual — do not add any card, border-radius, or box-shadow
- `filter: sepia(15%)` warms the map to match parchment palette
- Border only on top and bottom edges — clean, editorial
- On scroll-enter: `opacity:0→1` (0.8s) — nothing else

---

## Section 5 — RSVP: تأكيد الحضور

**Background:** Dark photo (wedding detail — rings, flowers) + `var(--overlay)`. Text: `var(--white)`.

**Header (centered):**
```
  هل ستكون معنا؟              ← Amiri, clamp(2.2rem,6vw,4.5rem)
  يسعدنا تأكيد حضوركم قبل [DATE]  ← Noto Naskh, white-dim
```

**RSVP envelope SVG icon** (40px, gold) centered above title.

**Form — Foxe minimal style:**
- Max-width: `520px`, centered, no background card, no border
- Each field: ONLY a `1px solid rgba(196,149,74,0.4)` bottom border
- On focus: border brightens to `var(--gold)` with 0.2s transition
- Label: `Noto Naskh` `0.75rem`, gold, `letter-spacing:0.2em`, floats above on focus/fill
- Fields:
  1. الاسم الكريم (text)
  2. رقم التواصل (tel)  
  3. عدد المرافقين (select: ١ ٢ ٣ ٤ ٥)
  4. حضور / اعتذار — two pill buttons:
     - Selected: `background: var(--gold)`, `color: var(--dark-1)`
     - Unselected: `border: 1px solid var(--gold-dim)`, `color: var(--white-dim)`
- Submit button: full-width rectangle, `background: var(--gold)`, `color: var(--dark-1)`, `Amiri` `1.1rem`, `padding: 16px`, NO border-radius
- On submit success: button transforms to `✓ تم التأكيد — نراكم قريباً 🤍`

**Scroll-enter animation:**
- Form fields reveal one by one: bottom-border `scaleX(0)→scaleX(1)` from right, staggered 80ms
- Text content above form fades up: `translateY(24px) opacity:0 → 0 opacity:1`

---

## Section 6 — Wishing Wall: حائط الأمنيات

**Background:** `var(--ivory)`. Text: `var(--espresso)`.

**Header (centered):**
```
  اتركوا لنا كلمة من القلب    ← eyebrow, gold
  حائط الأمنيات               ← Amiri, clamp(2.2rem,6vw,5rem)
```

**Input area — parchment notecard:**
```css
.wish-notecard {
  background: var(--parchment);
  border-top: 1px solid rgba(196,149,74,0.3);
  border-bottom: 1px solid rgba(196,149,74,0.3);
  padding: 32px 36px;
  /* Dotted lines effect */
  background-image: repeating-linear-gradient(
    transparent,
    transparent 31px,
    rgba(196,149,74,0.12) 31px,
    rgba(196,149,74,0.12) 32px
  );
  background-size: 100% 32px;
}
```

- Textarea: no border, no background, transparent — floats on the lined notecard
- Name input below (bottom-border-only, same as RSVP)
- Submit: **"أرسل أمنيتك"** — same gold rectangular button style

**Wishes grid:**
```css
.wishes-grid {
  columns: 3;         /* desktop */
  column-gap: 24px;
}
@media (max-width:768px) { .wishes-grid { columns: 2; } }
@media (max-width:480px) { .wishes-grid { columns: 1; } }

.wish-card {
  break-inside: avoid;
  margin-bottom: 24px;
  padding: 28px 24px;
  border: 1px solid rgba(196,149,74,0.18);
  background: var(--ivory);
  position: relative;
}
/* Decorative open-quote mark */
.wish-card::before {
  content: '"';
  font-family: 'Amiri', serif;
  font-size: 72px;
  color: var(--gold);
  opacity: 0.12;
  position: absolute;
  top: 8px; right: 16px;
  line-height: 1;
}
.wish-card__name  { font: 0.72rem var(--font-body); color: var(--gold); letter-spacing: 0.2em; }
.wish-card__text  { font: italic 1.05rem var(--font-display); color: var(--espresso); margin-top: 8px; line-height: 1.7; }
.wish-card__heart { position: absolute; bottom: 12px; left: 18px; color: var(--gold); opacity: 0.5; font-size: 0.85rem; }
```

**Animations:**
- Existing wish cards stagger in: `scale(0.96) opacity:0 → scale(1) opacity:1`, 60ms apart
- New submitted wish: `scale(0.7) opacity:0 → scale(1) opacity:1` spring `cubic-bezier(0.34,1.56,0.64,1)` 0.5s
- Notecard slides up on scroll-enter: `translateY(40px)→0`

---

## 🌧️ Heart Rain — Raining Hearts Canvas

**Implementation:** A `<canvas id="hearts">` sits `position:fixed; top:0; left:0; width:100vw; height:100vh; pointer-events:none; z-index:100`.

```javascript
const canvas = document.getElementById('hearts');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

class Heart {
  reset(fromTop = false) {
    this.x    = Math.random() * canvas.width;
    this.y    = fromTop ? -20 : Math.random() * canvas.height;
    this.size = Math.random() * 10 + 5;          // 5–15px
    this.vy   = Math.random() * 0.9 + 0.35;      // fall speed
    this.vx   = (Math.random() - 0.5) * 0.35;    // horizontal drift
    this.rot  = Math.random() * Math.PI * 2;
    this.rotV = (Math.random() - 0.5) * 0.018;
    this.wobT = Math.random() * Math.PI * 2;      // wobble phase
    this.wobS = Math.random() * 0.018 + 0.008;
    this.alpha= Math.random() * 0.28 + 0.07;      // 7–35% opacity — subtle
    const palette = ['#C4954A','#D4AE6A','#B8803A','#E8CC8A'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }
  constructor() { this.reset(false); }

  update() {
    this.wobT += this.wobS;
    this.x += this.vx + Math.sin(this.wobT) * 0.4;
    this.y += this.vy;
    this.rot += this.rotV;
    if (this.y > canvas.height + 24) this.reset(true);
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    const s = this.size;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s * 0.5, -s * 0.25, -s, s * 0.1, 0, s);
    ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.25, 0, s * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// 70 hearts — felt, not seen; ambient texture not confetti
const isMobile = innerWidth < 768;
const count = isMobile ? 35 : 70;
const hearts = Array.from({ length: count }, () => new Heart());

(function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(h => { h.update(); h.draw(); });
  requestAnimationFrame(loop);
})();
```

**Design intent:**
- Opacity range `7–35%` — hearts are ambient, not distracting; guests feel them subliminally
- Gold palette only — they harmonize with the accent color, not contrast against it
- Size `5–15px` — small and delicate, like petals
- `70` hearts on desktop, `35` on mobile

---

## 🖱️ Ink Cursor Effect

**Two-layer cursor system + dissolving ink-blot trail:**

```css
* { cursor: none; }

#cursor-dot {
  position: fixed; pointer-events: none; z-index: 9999;
  width: 6px; height: 6px;
  background: var(--gold);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.1s, opacity 0.2s;
}

#cursor-ring {
  position: fixed; pointer-events: none; z-index: 9998;
  width: 34px; height: 34px;
  border: 1px solid var(--gold);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.22s, height 0.22s, background 0.22s, border-color 0.22s;
}
#cursor-ring.hover {
  width: 60px; height: 60px;
  background: rgba(196,149,74,0.07);
}
#cursor-ring.click {
  width: 18px; height: 18px;
  background: rgba(196,149,74,0.25);
}

/* Ink blot particles spawned by JS */
.ink {
  position: fixed; pointer-events: none; z-index: 9997;
  background: var(--gold);
  transform-origin: center;
  transition: opacity 1.1s ease-out, transform 1.1s ease-out;
}
```

```javascript
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
let lastInkX = 0, lastInkY = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;

  // Spawn ink blot every ~55px of mouse travel
  const dist = Math.hypot(mx - lastInkX, my - lastInkY);
  if (dist > 55) {
    lastInkX = mx; lastInkY = my;
    spawnInk(mx, my);
  }
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

function spawnInk(x, y) {
  const el = document.createElement('div');
  el.className = 'ink';
  const w = Math.random() * 10 + 5;
  const h = Math.random() * 10 + 5;
  // Organic border-radius via random values
  const r = () => Math.floor(Math.random() * 55 + 20);
  el.style.cssText = `
    left:${x}px; top:${y}px;
    width:${w}px; height:${h}px;
    border-radius:${r()}% ${r()}% ${r()}% ${r()}% / ${r()}% ${r()}% ${r()}% ${r()}%;
    opacity:0.22;
    transform: translate(-50%,-50%) scale(1);
  `;
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.opacity = '0';
    el.style.transform = `translate(-50%,-50%) scale(${1.8 + Math.random()})`;
  });
  setTimeout(() => el.remove(), 1300);
}

// Cursor ring lerp
(function lerp() {
  rx += (mx - rx) * 0.11;
  ry += (my - ry) * 0.11;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(lerp);
})();

// Interactive hover/click states
document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});
document.addEventListener('mousedown', () => ring.classList.add('click'));
document.addEventListener('mouseup',   () => ring.classList.remove('click'));

// Disable on touch
if (window.matchMedia('(hover: none)').matches) {
  dot.style.display = ring.style.display = 'none';
}
```

---

## 🎞️ Global Scroll Animation System

```javascript
// IntersectionObserver — fires once on enter, threshold 0.12
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target); // fire once only
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .clip-reveal, .stagger-child').forEach(el => {
  observer.observe(el);
});
```

```css
/* Fade-up reveal */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1),
              transform 0.85s cubic-bezier(0.16,1,0.3,1);
}
.reveal.visible { opacity: 1; transform: none; }

/* RTL clip wipe — titles */
.clip-reveal {
  clip-path: inset(0 0 0 100%); /* RTL: wipe from left */
  transition: clip-path 0.9s cubic-bezier(0.77,0,0.18,1);
}
.clip-reveal.visible { clip-path: inset(0 0 0 0%); }

/* Stagger children */
.stagger-parent.visible .stagger-child:nth-child(1) { transition-delay: 0.00s; }
.stagger-parent.visible .stagger-child:nth-child(2) { transition-delay: 0.10s; }
.stagger-parent.visible .stagger-child:nth-child(3) { transition-delay: 0.20s; }
.stagger-parent.visible .stagger-child:nth-child(4) { transition-delay: 0.30s; }

/* Section hairline rule — draws from center */
.rule-reveal {
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
}
.rule-reveal.visible { transform: scaleX(1); }
```

---

## 📱 Responsive

| Screen | Behavior |
|---|---|
| `≥ 1024px` | Full layout. Timeline alternates L/R. Wishes 3-col masonry. |
| `768–1023px` | Timeline single-side. Wishes 2-col. Countdown flex-wrap. |
| `< 768px` | Single column. Names stack. Countdown 2×2. Wishes 1-col. |
| Touch | Cursor hidden. Hearts halved to 35. Photo parallax disabled. |

---

## 🗂️ File Structure

```
index.html          ← Single file
├── <head>          Google Fonts (Amiri + Noto Naskh + Cinzel), CSS vars
├── <style>         All CSS inline or in <style> block
├── <canvas>        #hearts — fixed, pointer-events:none
├── #cursor-dot     Fixed cursor elements
├── #cursor-ring
├── <nav>           Fixed transparent navbar
├── #hero           Section 1 — Names + fathers
├── #countdown      Section 2 — Counter
├── #story          Section 3 — Our Story timeline
├── #location       Section 4 — Google Maps iframe ONLY
├── #rsvp           Section 5 — RSVP form
├── #wishes         Section 6 — Wishing wall
├── <footer>        Dark, minimal, copyright
└── <script>        Hearts canvas · Cursor system · Countdown · IntersectionObserver
```

---

## SVG Assets Required

1. `logo-mark.svg` — Gold diamond/arabesque mark for navbar
2. `divider-minimal.svg` — Thin horizontal rule with center diamond
3. `heart-particle.svg` — Reference heart shape (mirrored in canvas JS)
4. `timeline-dot.svg` — Pearl dot for story timeline
5. `corner-frame.svg` — L-bracket corner ornament (hero section corners)
6. `rsvp-envelope.svg` — Minimal line envelope with wax seal
7. `wishing-icon.svg` — Minimal open book / notecard icon
8. `story-icon.svg` — Quill pen illustration for Our Story header
9. `scroll-chevron.svg` — Animated down-arrow for hero

---

*Template name: **عهد / Ahd** — Dark. Cinematic. Calligraphic. A vow written in gold on the night.*

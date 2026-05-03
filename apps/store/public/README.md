# Farhty — Gold Social Icons

Gold SVG icons on transparent background.
All icons are 100x100 viewBox — scale freely with width/height.

## Files
- `whatsapp-gold.svg`
- `tiktok-gold.svg`

## Gold Colors Used
- Primary gold: `#C9A84C`
- Light shimmer: `#E8C97A`
- Dark bg accent: `#1a1a1a`

## Usage in React (Vite)

```jsx
import whatsapp from './icons/whatsapp-gold.svg'
import tiktok from './icons/tiktok-gold.svg'

<img src={whatsapp} alt="WhatsApp" className="w-10 h-10" />
<img src={tiktok} alt="TikTok" className="w-10 h-10" />
```

## Usage as inline SVG (for hover color control)

```jsx
// Import as ReactComponent with Vite + vite-plugin-svgr
import { ReactComponent as WhatsAppIcon } from './icons/whatsapp-gold.svg'

<WhatsAppIcon className="w-10 h-10 hover:opacity-80 transition-opacity" />
```

## Recommended sizes
- Footer / navbar: 32px (w-8 h-8)
- Hero section: 48px (w-12 h-12)
- Large CTA: 64px (w-16 h-16)

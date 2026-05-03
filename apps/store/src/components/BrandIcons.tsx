// BrandIcons.tsx
// Includes: UI icons, botanical decorations, social icons (WhatsApp, TikTok)
// Farhty gold line-art icons — color: #B8976A
// Usage: <IconShield size={32} /> or <IconShield size={32} className="..." />

interface IconProps {
  size?: number
  className?: string
  opacity?: number
}

const defaults = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }

// ✓ Refund guarantee — shield with checkmark
export function IconShield({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48" className={className} {...defaults}>
      <path d="M0,-22 C10,-18 18,-12 18,0 C18,12 10,18 0,24 C-10,18 -18,12 -18,0 C-18,-12 -10,-18 0,-22 Z" strokeWidth="1.2"/>
      <polyline points="-7,1 -2,7 9,-5"/>
    </svg>
  )
}

// 🎧 Technical support — headset
export function IconHeadset({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48" className={className} {...defaults}>
      <path d="M-14,0 C-14,-16 14,-16 14,0"/>
      <rect x="-18" y="-2" width="7" height="12" rx="2.5"/>
      <rect x="11" y="-2" width="7" height="12" rx="2.5"/>
      <path d="M14,10 C14,16 7,20 0,20"/>
      <circle cx="0" cy="20" r="2.5" fill="currentColor" stroke="none"/>
    </svg>
  )
}

// ⚡ Instant delivery — lightning in circle
export function IconInstant({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48" className={className} {...defaults}>
      <circle cx="0" cy="0" r="20"/>
      <polyline points="3,-12 -4,1 4,1 -3,13" strokeWidth="1.5"/>
    </svg>
  )
}

// 💎 Exclusive — diamond gem
export function IconDiamond({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48" className={className} {...defaults}>
      <polygon points="0,-22 18,-7 12,18 -12,18 -18,-7"/>
      <polyline points="-18,-7 0,-1 18,-7"/>
      <line x1="-12" y1="18" x2="0" y2="-1"/>
      <line x1="12" y1="18" x2="0" y2="-1"/>
    </svg>
  )
}

// 📋 Choose template — card with checkmark
export function IconTemplate({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48" className={className} {...defaults}>
      <rect x="-16" y="-22" width="32" height="42" rx="2"/>
      <line x1="-8" y1="-12" x2="8" y2="-12"/>
      <line x1="-8" y1="-4" x2="8" y2="-4"/>
      <line x1="-8" y1="4" x2="2" y2="4"/>
      <circle cx="0" cy="14" r="6"/>
      <polyline points="-3,14 -1,16 4,11"/>
    </svg>
  )
}

// 💬 Contact us — chat bubble with heart
export function IconChat({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48" className={className} {...defaults}>
      <path d="M-18,-16 L18,-16 Q20,-16 20,-14 L20,6 Q20,8 18,8 L0,8 L-9,20 L-9,8 L-18,8 Q-20,8 -20,6 L-20,-14 Q-20,-16 -18,-16 Z"/>
      <path d="M0,-7 C0,-11 -7,-11 -7,-5 C-7,-1 0,4 0,4 C0,4 7,-1 7,-5 C7,-11 0,-11 0,-7 Z" strokeWidth="1.2"/>
    </svg>
  )
}

// ✏️ Enter data — pencil on card
export function IconEdit({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48" className={className} {...defaults}>
      <rect x="-16" y="-20" width="24" height="34" rx="2"/>
      <line x1="-8" y1="-10" x2="2" y2="-10"/>
      <line x1="-8" y1="-2" x2="2" y2="-2"/>
      <line x1="-8" y1="6" x2="-2" y2="6"/>
      <g transform="translate(10,8) rotate(-40)">
        <rect x="-2.5" y="-12" width="5" height="16" rx="1"/>
        <polygon points="-2.5,4 2.5,4 0,9" fill="currentColor" stroke="none"/>
      </g>
    </svg>
  )
}

// 🔗 Share invitation — share nodes
export function IconShare({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="-24 -24 48 48" className={className} {...defaults}>
      <circle cx="-13" cy="0" r="5.5"/>
      <circle cx="13" cy="-13" r="5.5"/>
      <circle cx="13" cy="13" r="5.5"/>
      <line x1="-7" y1="-3" x2="7" y2="-10"/>
      <line x1="-7" y1="3" x2="7" y2="10"/>
    </svg>
  )
}

// 🌹 Botanical — rose (for hero decoration)
export function BotanicalRose({ size = 80, className, opacity = 0.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="-28 -28 56 56" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={opacity}>
      <circle cx="0" cy="0" r="7"/>
      <circle cx="0" cy="0" r="13"/>
      <path d="M-5,-11 Q-9,-18 0,-20 Q9,-18 5,-11"/>
      <path d="M5,11 Q9,18 0,20 Q-9,18 -5,11"/>
      <path d="M-11,5 Q-18,9 -20,0 Q-18,-9 -11,-5"/>
      <path d="M11,-5 Q18,-9 20,0 Q18,9 11,5"/>
      <path d="M-9,-9 Q-15,-15 -9,-19 Q-3,-15 -3,-9"/>
      <path d="M9,9 Q15,15 9,19 Q3,15 3,9"/>
    </svg>
  )
}

// 🌿 Botanical — branch with leaves
export function BotanicalBranch({ size = 80, className, opacity = 0.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="-20 -36 40 72" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={opacity}>
      <line x1="0" y1="32" x2="0" y2="-32"/>
      <path d="M0,12 Q-16,2 -14,-8 Q-4,-4 0,12"/>
      <path d="M0,12 Q16,2 14,-8 Q4,-4 0,12"/>
      <path d="M0,-4 Q-12,-12 -10,-24 Q-2,-18 0,-4"/>
      <path d="M0,-4 Q12,-12 10,-24 Q2,-18 0,-4"/>
    </svg>
  )
}

// 🌸 Botanical — wildflower
export function BotanicalFlower({ size = 60, className, opacity = 0.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="-20 -24 40 52" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={opacity}>
      <circle cx="0" cy="0" r="4" fill="currentColor" opacity={0.3} stroke="none"/>
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
        <ellipse key={angle} cx="0" cy="-11" rx="3" ry="7" transform={`rotate(${angle})`}/>
      ))}
      <line x1="0" y1="5" x2="0" y2="26"/>
      <path d="M0,16 Q-8,12 -10,4"/>
    </svg>
  )
}

// 🌾 Botanical — wheat / feather
export function BotanicalWheat({ size = 80, className, opacity = 0.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="-18 -36 36 72" className={className} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity={opacity}>
      <line x1="0" y1="32" x2="0" y2="-32"/>
      <path d="M0,18 Q-11,10 -13,0 Q-5,2 0,18"/>
      <path d="M0,18 Q11,10 13,0 Q5,2 0,18"/>
      <path d="M0,4 Q-9,-4 -11,-14 Q-3,-10 0,4"/>
      <path d="M0,4 Q9,-4 11,-14 Q3,-10 0,4"/>
      <path d="M0,-10 Q-7,-18 -7,-28 Q-1,-22 0,-10"/>
      <path d="M0,-10 Q7,-18 7,-28 Q1,-22 0,-10"/>
    </svg>
  )
}

// WhatsApp — gold line-art
export function IconWhatsApp({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
      <path
        d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17 42.9 20.4 44 24 44c11 0 20-9 20-20S35 4 24 4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 15.5c-.4-1-.9-1-1.3-1s-.7 0-1.1 0-.9.1-1.5.7c-.6.6-2 1.9-2 4.7s2 5.4 2.3 5.8c.3.4 3.9 6.2 9.6 8.4 4.7 1.9 5.7 1.5 6.7 1.4 1-.1 3.3-1.3 3.7-2.6.4-1.3.4-2.3.3-2.6-.2-.2-.6-.4-1.1-.6-.6-.3-3.3-1.6-3.8-1.8-.5-.2-.9-.3-1.2.3-.4.6-1.4 1.8-1.7 2.1-.3.4-.7.4-1.3.1s-2.4-.9-4.6-2.8c-1.7-1.5-2.8-3.4-3.1-3.9-.3-.6 0-.9.2-1.1.3-.3.6-.7.9-1 .2-.3.3-.6.5-1 .2-.3.1-.7 0-1z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// TikTok — gold line-art
export function IconTikTok({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} fill="none">
      <path
        d="M20 4h8v26a7 7 0 1 1-7-7c.7 0 1.3.1 2 .3V15a15 15 0 1 0 14 14.8V18.4a19.7 19.7 0 0 0 8 2.6v-8a12 12 0 0 1-8-3A11.7 11.7 0 0 1 28 4h-8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

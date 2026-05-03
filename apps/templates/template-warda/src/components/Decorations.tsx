import type { CSSProperties } from 'react'

export function RoseSVG({ className = '', opacity = 0.3 }: { className?: string; opacity?: number }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <circle cx="100" cy="85" r="38" fill="#E8B4B4" opacity="0.4" />
      <circle cx="88" cy="78" r="24" fill="#D4A0A0" opacity="0.5" />
      <circle cx="112" cy="78" r="22" fill="#E8B4B4" opacity="0.45" />
      <circle cx="100" cy="92" r="26" fill="#C69B7B" opacity="0.3" />
      <ellipse cx="85" cy="70" rx="18" ry="10" fill="#F5D0D0" opacity="0.6" transform="rotate(-30 85 70)" />
      <ellipse cx="115" cy="70" rx="16" ry="10" fill="#F5D0D0" opacity="0.55" transform="rotate(25 115 70)" />
      <ellipse cx="100" cy="96" rx="20" ry="8" fill="#D4A0A0" opacity="0.5" transform="rotate(5 100 96)" />
      <ellipse cx="100" cy="80" rx="14" ry="14" fill="#FFE8E8" opacity="0.7" />
      <circle cx="96" cy="78" r="6" fill="#D4A0A0" opacity="0.4" />
      <circle cx="104" cy="78" r="5" fill="#C69B7B" opacity="0.35" />
      <path d="M100 108 Q95 135 80 155" stroke="#B8A99A" strokeWidth="2.5" fill="none" opacity="0.5" />
      <path d="M100 108 Q105 140 115 158" stroke="#B8A99A" strokeWidth="2" fill="none" opacity="0.4" />
      <path d="M80 155 Q70 145 65 150 Q60 155 70 160 Q75 155 80 155Z" fill="#B8A99A" opacity="0.35" />
      <path d="M115 158 Q125 148 130 155 Q135 162 122 165 Q118 160 115 158Z" fill="#B8A99A" opacity="0.3" />
      <path d="M88 130 Q78 125 72 130 Q68 135 80 138Z" fill="#B8A99A" opacity="0.3" />
      <path d="M112 132 Q122 127 128 133 Q132 138 120 140Z" fill="#B8A99A" opacity="0.25" />
    </svg>
  )
}

export function RoseLargeSVG({ className = '', opacity = 0.2, style }: { className?: string; opacity?: number; style?: React.CSSProperties }) {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity, ...style }}>
      <circle cx="200" cy="160" r="70" fill="#E8B4B4" opacity="0.35" />
      <circle cx="175" cy="145" r="45" fill="#D4A0A0" opacity="0.4" />
      <circle cx="225" cy="148" r="42" fill="#E8B4B4" opacity="0.38" />
      <circle cx="200" cy="175" r="48" fill="#C69B7B" opacity="0.25" />
      <ellipse cx="168" cy="130" rx="35" ry="18" fill="#F5D0D0" opacity="0.5" transform="rotate(-30 168 130)" />
      <ellipse cx="232" cy="133" rx="32" ry="18" fill="#F5D0D0" opacity="0.45" transform="rotate(25 232 133)" />
      <ellipse cx="200" cy="180" rx="38" ry="15" fill="#D4A0A0" opacity="0.4" transform="rotate(5 200 180)" />
      <ellipse cx="200" cy="152" rx="26" ry="26" fill="#FFE8E8" opacity="0.6" />
      <circle cx="190" cy="148" r="12" fill="#D4A0A0" opacity="0.35" />
      <circle cx="210" cy="148" r="10" fill="#C69B7B" opacity="0.3" />
      <circle cx="200" cy="162" r="8" fill="#F5D0D0" opacity="0.5" />
      <path d="M200 200 Q192 245 168 285" stroke="#B8A99A" strokeWidth="4" fill="none" opacity="0.45" />
      <path d="M200 200 Q208 250 230 290" stroke="#B8A99A" strokeWidth="3.5" fill="none" opacity="0.4" />
      <path d="M168 285 Q150 270 142 280 Q135 290 155 295 Q162 287 168 285Z" fill="#B8A99A" opacity="0.3" />
      <path d="M230 290 Q248 275 256 285 Q262 296 242 300 Q237 292 230 290Z" fill="#B8A99A" opacity="0.25" />
      <path d="M185 240 Q170 232 162 240 Q158 248 175 252Z" fill="#C69B7B" opacity="0.25" />
      <path d="M215 242 Q230 234 240 244 Q244 252 225 255Z" fill="#B8A99A" opacity="0.2" />
      <path d="M178 268 Q165 262 158 270 Q155 278 172 280Z" fill="#B8A99A" opacity="0.2" />
      <path d="M222 270 Q238 264 244 274 Q247 282 228 284Z" fill="#C69B7B" opacity="0.18" />
    </svg>
  )
}

export function OrnamentSVG({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20 Q30 5 60 20 Q90 35 110 20" stroke="#C69B7B" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M20 20 L60 8 L100 20" stroke="#D4A0A0" strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M20 20 L60 32 L100 20" stroke="#D4A0A0" strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M32 14 Q38 12 44 14" stroke="#B8A99A" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M76 14 Q82 12 88 14" stroke="#B8A99A" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M32 26 Q38 28 44 26" stroke="#B8A99A" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M76 26 Q82 28 88 26" stroke="#B8A99A" strokeWidth="0.8" fill="none" opacity="0.5" />
      <rect x="57" y="14" width="6" height="12" rx="2" fill="none" stroke="#C69B7B" strokeWidth="0.8" opacity="0.7" transform="rotate(45 60 20)" />
      <circle cx="60" cy="20" r="2" fill="#C69B7B" opacity="0.6" />
    </svg>
  )
}

export function WaxSealSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20">
      <circle cx="40" cy="40" r="36" fill="#C69B7B" />
      <circle cx="40" cy="40" r="34" fill="#D4A0A0" />
      <circle cx="40" cy="40" r="28" fill="#C69B7B" opacity="0.8" />
      <circle cx="40" cy="40" r="26" fill="#B88A6A" />
      <path d="M28 40 L40 28 L52 40 L40 52Z" fill="#C69B7B" opacity="0.7" />
      <path d="M32 40 L40 32 L48 40 L40 48Z" fill="#D4A0A0" opacity="0.6" />
      <circle cx="40" cy="40" r="4" fill="#E8B4B4" opacity="0.8" />
      <path d="M40 28 Q42 35 40 36" stroke="#A07858" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M40 52 Q38 45 40 44" stroke="#A07858" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M28 40 Q35 42 36 40" stroke="#A07858" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M52 40 Q45 38 44 40" stroke="#A07858" strokeWidth="0.8" fill="none" opacity="0.5" />
    </svg>
  )
}

export function DividerSVG({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="10" x2="120" y2="10" stroke="#C69B7B" strokeWidth="0.5" opacity="0.4" />
      <line x1="180" y1="10" x2="300" y2="10" stroke="#C69B7B" strokeWidth="0.5" opacity="0.4" />
      <circle cx="150" cy="10" r="3" fill="#C69B7B" opacity="0.5" />
      <path d="M140 10 Q145 6 150 10 Q155 14 160 10" stroke="#D4A0A0" strokeWidth="0.8" fill="none" opacity="0.6" />
      <path d="M135 10 Q142 4 150 10 Q158 16 165 10" stroke="#C69B7B" strokeWidth="0.5" fill="none" opacity="0.4" />
    </svg>
  )
}
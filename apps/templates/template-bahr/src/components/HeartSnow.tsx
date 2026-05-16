import { useMemo } from 'react'

interface Heart {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
  color: string
}

const COLORS = [
  'rgba(200,169,110,0.7)',
  'rgba(224,200,128,0.65)',
  'rgba(127,184,212,0.5)',
  'rgba(200,169,110,0.55)',
  'rgba(245,237,224,0.6)',
]

export function HeartSnow({ count = 28 }: { count?: number }) {
  const hearts = useMemo<Heart[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left:     Math.random() * 100,
        size:     9 + Math.random() * 13,
        duration: 9 + Math.random() * 9,
        delay:    Math.random() * 18,
        opacity:  0.45 + Math.random() * 0.45,
        color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      })),
    [count]
  )

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 5 }}
    >
      {hearts.map(h => (
        <span
          key={h.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            color: h.color,
            filter: 'drop-shadow(0 1px 3px rgba(200,169,110,0.3))',
            animation: `heartFall ${h.duration}s ${h.delay}s linear infinite`,
            opacity: h.opacity,
            userSelect: 'none',
          }}
        >
          ♥
        </span>
      ))}
    </div>
  )
}

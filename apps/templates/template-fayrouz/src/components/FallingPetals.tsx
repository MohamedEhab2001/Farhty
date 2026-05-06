import { useMemo } from 'react'

export default function FallingPetals() {
  const petals = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 8 + Math.random() * 12,
      duration: `${7 + Math.random() * 6}s`,
      delay: `${Math.random() * 8}s`,
      opacity: 0.15 + Math.random() * 0.2,
    })),
  [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map(p => (
        <svg
          key={p.id}
          className="petal absolute"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            '--duration': p.duration,
            '--delay': p.delay,
            opacity: p.opacity,
          } as React.CSSProperties}
          viewBox="0 0 24 24"
          fill="#C9A96E"
        >
          <path d="M12 2C8 6 4 10 4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-12z" />
        </svg>
      ))}
    </div>
  )
}

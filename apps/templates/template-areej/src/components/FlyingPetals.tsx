'use client'

import { useEffect, useState, useMemo } from 'react'

interface Petal {
  id: number
  left: number
  duration: number
  delay: number
  size: number
  opacity: number
  rotation: number
  type: number
  sway: number
}

const petalImages = [
  '/assets/petal-1.png',
  '/assets/blossom-1.png',
  '/assets/peony-1.png',
]

export default function FlyingPetals() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 7 + Math.random() * 11,
      delay: Math.random() * 28,
      size: 16 + Math.random() * 22,
      opacity: 0.55 + Math.random() * 0.4,
      rotation: Math.random() * 360,
      type: Math.floor(Math.random() * petalImages.length),
      sway: (Math.random() - 0.5) * 120,
    }))
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {petals.map((p) => (
        <img
          key={p.id}
          src={petalImages[p.type]}
          alt=""
          className="petal absolute select-none"
          style={{
            left: `${p.left}%`,
            top: '-40px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0,
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
            '--sway': `${p.sway}px`,
            transform: `rotate(${p.rotation}deg)`,
            objectFit: 'contain',
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

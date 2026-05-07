'use client'

import { useEffect, useState, useMemo } from 'react'

interface Particle {
  id: number
  left: number
  duration: number
  delay: number
  size: number
  opacity: number
}

export default function FallingGold() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 15,
      size: 2 + Math.random() * 4,
      opacity: 0.2 + Math.random() * 0.4,
    }))
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="gold-particle absolute rounded-full"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, rgba(201, 169, 110, ${p.opacity}), rgba(201, 169, 110, 0))`,
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
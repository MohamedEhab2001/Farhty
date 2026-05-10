import { useEffect, useState } from 'react'

interface Props {
  weddingDate: string
  weddingTime: string
}

export default function Countdown({ weddingDate, weddingTime }: Props) {
  const targetMs = (() => {
    if (!weddingDate) return new Date('2026-09-14T19:30:00+02:00').getTime()
    const timePart = weddingTime || '19:30'
    return new Date(`${weddingDate}T${timePart}:00`).getTime()
  })()

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, targetMs - now)
  const days    = Math.floor(diff / 86400000)
  const hours   = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  const units = [
    { label: 'Days',    value: days },
    { label: 'Hours',   value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ]

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.4em]" style={{ color: 'rgba(26,64,48,0.7)' }}>
        Counting down to our blessed day
      </p>
      <div className="mt-6 grid grid-cols-4 gap-3 md:gap-6">
        {units.map((u) => (
          <div
            key={u.label}
            className="relative flex flex-col items-center rounded-2xl px-2 py-5 backdrop-blur-sm"
            style={{ border: '1px solid rgba(184,150,46,0.4)', background: 'rgba(247,243,233,0.7)', boxShadow: 'var(--shadow-gold)' }}
          >
            <span className="font-display text-3xl md:text-5xl tabular-nums text-gold-gradient">
              {String(u.value).padStart(2, '0')}
            </span>
            <span className="mt-2 text-[10px] uppercase tracking-[0.3em] md:text-xs" style={{ color: 'rgba(26,64,48,0.7)' }}>
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

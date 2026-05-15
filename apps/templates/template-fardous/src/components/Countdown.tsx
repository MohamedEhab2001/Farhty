import { useEffect, useState } from 'react'

interface Props {
  weddingDate: string
  weddingTime: string
}

const UNITS = [
  { key: 'days', label: 'يوم' },
  { key: 'hours', label: 'ساعة' },
  { key: 'minutes', label: 'دقيقة' },
  { key: 'seconds', label: 'ثانية' },
]

export default function Countdown({ weddingDate, weddingTime }: Props) {
  const targetMs = (() => {
    if (!weddingDate) return new Date('2026-09-14T19:30:00+02:00').getTime()
    return new Date(`${weddingDate}T${weddingTime || '19:30'}:00`).getTime()
  })()

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, targetMs - now)
  const values: Record<string, number> = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }

  return (
    <div dir="rtl">
      <p className="text-sm tracking-[0.15em]" style={{ color: 'rgba(26,64,48,0.7)', fontFamily: 'Tajawal, sans-serif' }}>
        العداد التنازلي لفرحتنا
      </p>
      <div className="mt-6 grid grid-cols-4 gap-1.5 sm:gap-3 md:gap-5">
        {UNITS.map((u) => (
          <div
            key={u.key}
            className="flex flex-col items-center rounded-xl md:rounded-2xl px-1 py-3 sm:px-2 sm:py-4 md:py-5 backdrop-blur-sm"
            style={{ border: '1px solid rgba(184,150,46,0.4)', background: 'rgba(247,243,233,0.7)', boxShadow: 'var(--shadow-gold)' }}
          >
            <span
              className="text-xl sm:text-3xl md:text-5xl tabular-nums text-gold-gradient"
              style={{ fontFamily: 'Amiri, serif', fontWeight: 700 }}
            >
              {String(values[u.key]).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[8px] sm:text-[10px] md:text-xs" style={{ color: 'rgba(26,64,48,0.7)', fontFamily: 'Tajawal, sans-serif' }}>
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

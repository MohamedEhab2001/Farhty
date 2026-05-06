import { useEffect, useRef, useState } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(dateStr: string): TimeLeft {
  const target = new Date(dateStr).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)

  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function CountdownSection() {
  const { get } = useTemplateFields()
  const weddingDate = get('wedding_date') ?? ''
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(weddingDate))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!weddingDate) return
    const tick = setInterval(() => setTimeLeft(getTimeLeft(weddingDate)), 1000)
    return () => clearInterval(tick)
  }, [weddingDate])

  const units = [
    { label: 'DAYS',    value: pad(timeLeft.days) },
    { label: 'HOURS',   value: pad(timeLeft.hours) },
    { label: 'MINUTES', value: pad(timeLeft.minutes) },
    { label: 'SECONDS', value: pad(timeLeft.seconds) },
  ]

  return (
    <section
      ref={sectionRef}
      id="countdown"
      className="py-20 md:py-28"
      style={{ backgroundColor: '#F8F2E6' }}
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Section heading */}
        <div
          className="text-center mb-16 reveal"
          style={{ transitionDelay: '0ms' }}
          data-reveal
        >
          <p
            className="font-body uppercase tracking-[0.3em] text-warm-gray mb-3"
            style={{
              fontSize: '0.65rem',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            Counting Down To
          </p>
          <h2
            className="font-display italic font-light text-charcoal"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all 1s cubic-bezier(0.22,1,0.36,1) 0.1s',
            }}
          >
            Our Wedding Day
          </h2>
        </div>

        {/* Countdown boxes */}
        <div className="flex flex-row items-start justify-center gap-0 md:gap-4">
          {units.map((unit, i) => (
            <div
              key={unit.label}
              className="flex-1 countdown-box"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(36px)',
                transition: `all 1s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.12}s`,
              }}
            >
              {/* Large serif number */}
              <span
                className="font-display font-light text-charcoal leading-none tabular-nums"
                style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
              >
                {unit.value}
              </span>

              {/* Subtle separator dot */}
              {i < units.length - 1 && (
                <span
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-warm-gray/40 font-light select-none hidden md:block"
                  style={{ fontSize: '2rem' }}
                >
                  ·
                </span>
              )}

              {/* Label */}
              <span
                className="font-body font-light tracking-[0.25em] text-warm-gray mt-3"
                style={{ fontSize: '0.6rem' }}
              >
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

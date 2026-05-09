import { useEffect, useRef, useState } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

function getTimeLeft(dateStr: string): TimeLeft {
  const target = new Date(dateStr).getTime()
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) { return String(n).padStart(2, '0') }

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
    { label: 'ثانية', value: pad(timeLeft.seconds) },
    { label: 'دقيقة', value: pad(timeLeft.minutes) },
    { label: 'ساعة', value: pad(timeLeft.hours) },
    { label: 'يوم', value: pad(timeLeft.days) },
  ]

  return (
    <section ref={sectionRef} id="countdown" className="py-20 md:py-28" style={{ backgroundColor: '#F8F2E6' }}>
      <div className="max-w-4xl mx-auto px-6">

        <div className="text-center mb-16">
          <p
            className="font-tajawal font-light text-warm-gray mb-3"
            style={{
              fontSize: '0.75rem', letterSpacing: '0.1em',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.9s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            العد التنازلي إلى
          </p>
          <h2
            className="font-amiri italic font-light text-charcoal"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'all 1s cubic-bezier(0.22,1,0.36,1) 0.1s',
            }}
          >
            بانتظار فرحتنا
          </h2>
        </div>

        <div className="flex flex-row-reverse items-start justify-center">
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
              <span
                className="font-amiri font-light text-charcoal leading-none tabular-nums"
                style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
              >
                {unit.value}
              </span>
              <span
                className="font-tajawal font-light text-warm-gray mt-3"
                style={{ fontSize: '0.72rem' }}
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

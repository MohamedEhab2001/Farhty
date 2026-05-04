import { useState, useEffect, useRef } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'

export default function CountdownSection() {
  const { get } = useTemplateFields()
  const weddingDate = get('wedding_date')
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!weddingDate) return
    const target = new Date(weddingDate).getTime()

    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [weddingDate])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const boxes = [
    { label: 'الأيام', value: time.days },
    { label: 'الساعات', value: time.hours },
    { label: 'الدقائق', value: time.minutes },
    { label: 'الثواني', value: time.seconds },
  ]

  return (
    <section ref={ref} className="relative py-20 md:py-28 linen-texture" style={{ backgroundColor: '#6B3F2A' }}>
      {/* Wavy divider top */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full">
        <img src="/wavy-divider.svg" alt="" className="w-full h-12 md:h-20" style={{ transform: 'scaleY(-1)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2
          className="font-amiri text-gold mb-12"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
        >
          العد التنازلي للحظة الكبرى
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {boxes.map((box, i) => (
            <div
              key={box.label}
              className="bg-cream border-2 border-gold/40 rounded-2xl py-6 px-4 transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? 'translateX(0)'
                  : `translateX(${i % 2 === 0 ? '60px' : '-60px'})`,
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <span
                className="block font-amiri font-bold text-mahogany"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
              >
                {String(box.value).padStart(2, '0')}
              </span>
              <span className="block font-naskh text-gold text-sm md:text-base mt-1">
                {box.label}
              </span>
            </div>
          ))}
        </div>

        {/* Gold dots between boxes on desktop */}
        <div className="hidden md:flex justify-center gap-32 mt-[-70px] mb-4 pointer-events-none">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-2 h-2 rounded-full bg-gold/60 inline-block" />
          ))}
        </div>
      </div>
    </section>
  )
}

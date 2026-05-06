import { useState, useEffect, useRef } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'
import { motion, useInView } from 'framer-motion'

export default function CountdownSection() {
  const { get } = useTemplateFields()
  const weddingDate = get('wedding_date')
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

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

  const boxes = [
    { label: 'يوم', value: time.days },
    { label: 'ساعة', value: time.hours },
    { label: 'دقيقة', value: time.minutes },
    { label: 'ثانية', value: time.seconds },
  ]

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-28 linen-texture overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #3D2117 0%, #5A3424 30%, #6B3F2A 50%, #5A3424 70%, #3D2117 100%)',
      }}
    >
      {/* Decorative ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-15 rounded-full"
        style={{ background: 'radial-gradient(ellipse, #C9A96E, transparent 70%)' }} />

      {/* Wavy divider top */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full">
        <img src="/wavy-divider.svg" alt="" className="w-full h-12 md:h-20" style={{ transform: 'scaleY(-1)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.h2
          className="font-amiri gold-shimmer mb-4"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          العد التنازلي للحظة الكبرى
        </motion.h2>

        <motion.div
          className="w-20 h-px mx-auto mb-12"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {boxes.map((box, i) => (
            <motion.div
              key={box.label}
              className="relative group"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12, type: 'spring', stiffness: 100 }}
            >
              {/* Glow behind card */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.15), transparent 70%)', transform: 'scale(1.1)' }} />

              <div
                className="relative bg-gradient-to-b from-cream to-ivory border border-gold/25 rounded-2xl py-6 px-4
                           backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold/30 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-gold/30 rounded-bl-2xl" />

                <motion.span
                  className="block font-amiri font-bold"
                  style={{
                    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                    background: 'linear-gradient(180deg, #4A2A18, #6B3F2A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                  key={box.value}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {String(box.value).padStart(2, '0')}
                </motion.span>
                <span className="block font-naskh text-gold/80 text-sm md:text-base mt-1">
                  {box.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

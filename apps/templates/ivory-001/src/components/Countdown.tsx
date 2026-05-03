import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CountdownProps {
  weddingDate: string
  accentColor: string
  weddingTime: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown({ weddingDate, accentColor, weddingTime }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!weddingDate) return

    const target = new Date(weddingDate)
    if (weddingTime) {
      const [h, m] = weddingTime.split(':')
      target.setHours(parseInt(h) || 0, parseInt(m) || 0)
    }

    const calc = () => {
      const now = new Date().getTime()
      const diff = target.getTime() - now
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calc())
    const interval = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(interval)
  }, [weddingDate, weddingTime])

  if (!weddingDate) return null

  const units = [
    { label: 'يوم', value: timeLeft.days },
    { label: 'ساعة', value: timeLeft.hours },
    { label: 'دقيقة', value: timeLeft.minutes },
    { label: 'ثانية', value: timeLeft.seconds },
  ]

  return (
    <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #fefdfb 0%, #fdf8f0 100%)' }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="font-display text-3xl sm:text-4xl font-bold mb-3"
          style={{ color: accentColor }}
          initial={mounted ? { opacity: 0, y: 20 } : {}}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          العد التنازلي
        </motion.h2>
        <motion.div
          className="w-16 h-px mx-auto mb-10"
          style={{ backgroundColor: accentColor, opacity: 0.5 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        />

        <div className="flex justify-center gap-3 sm:gap-6" dir="ltr">
          {units.map((unit, i) => (
            <motion.div
              key={unit.label}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <div
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center mb-2"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)`,
                  border: `1px solid ${accentColor}30`,
                }}
              >
                <span
                  className="font-display font-bold text-2xl sm:text-4xl"
                  style={{ color: accentColor }}
                >
                  {String(unit.value).padStart(2, '0')}
                </span>
              </div>
              <span className="font-body text-xs sm:text-sm" style={{ color: '#7a6650' }}>
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'

export default function CountdownSection() {
  const { get } = useTemplateFields()
  const weddingDate = get('wedding_date')
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!weddingDate) return
    const target = new Date(weddingDate).getTime()
    const interval = setInterval(() => {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [weddingDate])

  if (!weddingDate) return null

  const units = [
    { label: 'يوم', value: timeLeft.days },
    { label: 'ساعة', value: timeLeft.hours },
    { label: 'دقيقة', value: timeLeft.minutes },
    { label: 'ثانية', value: timeLeft.seconds },
  ]

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-body text-rose/50 text-sm tracking-widest mb-3">العد التنازلي</p>
          <h2 className="font-display text-3xl md:text-5xl rose-shimmer py-4">بقي على الموعد</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {units.map((unit, i) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-panel rounded-[1.5rem] p-6 md:p-8 text-center"
            >
              <motion.span
                key={unit.value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="block font-display text-4xl md:text-5xl text-rose mb-2 font-bold"
              >
                {String(unit.value).padStart(2, '0')}
              </motion.span>
              <span className="font-body text-warm-charcoal/40 text-sm">{unit.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
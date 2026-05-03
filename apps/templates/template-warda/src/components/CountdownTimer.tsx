import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  date: string
}

export default function CountdownTimer({ date }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!date) return
    const target = new Date(date).getTime()

    const update = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [date])

  if (!date) return null

  const units = [
    { value: timeLeft.days, label: 'أيام' },
    { value: timeLeft.hours, label: 'ساعات' },
    { value: timeLeft.minutes, label: 'دقائق' },
    { value: timeLeft.seconds, label: 'ثوان' },
  ]

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blush-50 to-white">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-amiri text-2xl md:text-3xl text-blush-800 mb-2">العد التنازلي</h2>
          <div className="section-divider mx-auto mb-8" />
        </motion.div>

        <div className="grid grid-cols-4 gap-3 md:gap-4">
          {units.map((unit) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl border border-blush-200/50 shadow-sm p-3 md:p-4 text-center"
            >
              <div className="font-amiri text-3xl md:text-4xl text-blush-800 font-bold leading-none">
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="font-tajawal text-blush-500 text-xs md:text-sm mt-1">
                {unit.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
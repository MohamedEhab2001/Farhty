'use client'

import { motion } from 'framer-motion'
import { useTemplateFields } from '@farhty/template-sdk'

interface ScheduleItem {
  time: string
  label: string
}

export default function DayProgram() {
  const { get } = useTemplateFields()
  const rawItems = get('schedule_items')
  let items = rawItems as ScheduleItem[] | undefined
  if (typeof rawItems === 'string') {
    try {
      items = JSON.parse(rawItems)
    } catch (e) {
      items = undefined
    }
  }
  if (!Array.isArray(items)) {
    items = undefined
  }
  
  items = items ?? [
    { time: '18:00', label: 'استقبال الضيوف' },
    { time: '19:00', label: 'دخلة العروسين' },
    { time: '20:00', label: 'العشاء' },
    { time: '21:30', label: 'قطع الكيك' },
    { time: '22:00', label: 'الحفل والرقص' },
  ]

  const formatTime12h = (time: any) => {
    if (!time || typeof time !== 'string') return String(time || '')
    const parts = time.split(':')
    if (parts.length < 2) return time
    const [hStr, mStr] = parts
    const h = Number(hStr)
    const m = Number(mStr)
    if (isNaN(h) || isNaN(m)) return time
    const period = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${m.toString().padStart(2, '0')} ${period}`
  }

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="font-body text-rose/50 text-sm tracking-widest mb-3">برنامج الحفل</p>
          <h2 className="font-display text-3xl md:text-5xl rose-shimmer py-4">تفاصيل المساء</h2>
        </motion.div>

        <div className="relative">
          <div className="absolute right-1/2 translate-x-1/2 md:right-auto md:left-1/2 md:translate-x-0 top-0 bottom-0 w-px bg-gradient-to-b from-rose/15 via-rose/30 to-rose/15" />

          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative flex items-center gap-6 mb-8 last:mb-0"
            >
              <div className="glass-panel rounded-[1.25rem] p-5 md:p-6 flex-1 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-body text-warm-dark text-base">{item?.label}</h3>
                </div>
                <span className="font-display text-rose text-lg whitespace-nowrap" dir="ltr">
                  {formatTime12h(item?.time)}
                </span>
              </div>

              <div className="absolute right-1/2 translate-x-1/2 md:right-auto md:left-1/2 md:translate-x-0 w-3 h-3 rounded-full border-2 border-rose bg-ivory z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
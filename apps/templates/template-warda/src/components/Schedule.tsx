import { motion } from 'framer-motion'
import { DividerSVG } from './Decorations'

interface ScheduleItem {
  time: string
  label: string
}

interface ScheduleProps {
  items: ScheduleItem[] | string
}

export default function Schedule({ items }: ScheduleProps) {
  const parsedItems: ScheduleItem[] = (() => {
    if (Array.isArray(items)) return items
    if (typeof items === 'string') {
      try { return JSON.parse(items) } catch { return [] }
    }
    return []
  })()

  if (!parsedItems.length) return null

  return (
    <section className="py-16 px-4 bg-white/50">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="floral-divider">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-gold" fill="currentColor">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" opacity="0.3"/>
              <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5"/>
            </svg>
          </div>
          <h2 className="font-amiri text-2xl md:text-3xl text-blush-800">برنامج الحفل</h2>
          <DividerSVG className="w-32 mx-auto mt-3" />
        </motion.div>

        <div className="relative pr-6">
          <div className="absolute right-[7px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-blush-300 via-rose-gold to-blush-300" />

          {parsedItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative flex items-start gap-4 mb-6 last:mb-0"
            >
              <div className="absolute right-0 top-1.5 w-4 h-4 rounded-full bg-white border-2 border-rose-gold shadow-sm z-10" />
              <div className="mr-6 flex-1 bg-white/70 backdrop-blur-sm rounded-2xl border border-blush-200/50 p-4 shadow-sm">
                <span className="font-amiri text-rose-gold text-sm">{item.time}</span>
                <p className="font-tajawal text-blush-800 text-lg mt-1">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
import { useTemplateFields } from '@farhty/template-sdk'
import { motion } from 'framer-motion'

interface EventItem {
  name_ar: string
  name_en: string
  date: string
  time: string
  place: string
}

export default function EventsSection() {
  const { get } = useTemplateFields()

  const rawEvents = get('events') ?? []
  const events: EventItem[] = Array.isArray(rawEvents) ? rawEvents : (() => {
    try { return JSON.parse(rawEvents) } catch { return [] }
  })()

  const defaultEvents: EventItem[] = [
    { name_ar: 'الحناء', name_en: 'Henna Night', date: 'Thursday', time: '8:00 PM', place: 'Riad Al-Noor' },
    { name_ar: 'عقد القران', name_en: 'Nikah Ceremony', date: 'Friday', time: '5:00 PM', place: 'Koutoubia Garden' },
    { name_ar: 'الزفاف', name_en: 'Walima Reception', date: 'Saturday', time: '7:00 PM', place: 'Palais Soleiman' },
  ]

  const displayEvents = events.length > 0 ? events : defaultEvents

  return (
    <section className="py-24 px-6" style={{ background: 'oklch(0.22 0.06 155 / 0.4)' }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h3 className="font-serif text-4xl md:text-5xl mb-4">Events</h3>
          <p dir="rtl" className="font-arabic text-2xl text-gold">المناسبات</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {displayEvents.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              whileHover={{ y: -6 }}
              className="border border-gold/30 p-8 text-center backdrop-blur-sm hover:border-gold transition-colors"
              style={{ background: 'oklch(0.18 0.05 155 / 0.5)' }}
            >
              <p dir="rtl" className="font-arabic text-3xl text-gold mb-3">
                {e.name_ar}
              </p>
              <h4 className="font-serif text-2xl mb-6">{e.name_en}</h4>
              <div className="space-y-1 text-sm tracking-[0.2em] uppercase text-ivory/70">
                <p>{e.date}</p>
                <p className="text-gold">{e.time}</p>
                <p>{e.place}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

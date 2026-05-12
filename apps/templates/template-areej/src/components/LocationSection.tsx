'use client'

import { motion } from 'framer-motion'
import { useTemplateFields } from '@farhty/template-sdk'

export default function LocationSection() {
  const { get } = useTemplateFields()
  const venueName = get('venue_name') ?? 'قاعة الأفراح'
  const venueAddress = get('venue_address') ?? 'العنوان'
  const venueMapUrl = get('venue_map_url') as string | undefined

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="font-body text-rose/50 text-sm tracking-widest mb-3">الموقع</p>
          <h2 className="font-display text-3xl md:text-5xl rose-shimmer py-4">مكان الاحتفال</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-panel rounded-[2.5rem] overflow-hidden"
        >
          <div className="p-8 md:p-10">
            <h3 className="font-display text-2xl text-deep-rose mb-2">{venueName}</h3>
            <p className="font-body text-warm-charcoal/50 text-sm">{venueAddress}</p>
          </div>

          {venueMapUrl && (
            <div className="relative">
              <iframe
                src={venueMapUrl}
                width="100%"
                height="300"
                style={{ border: 'none', borderRadius: '0 0 2.5rem 2.5rem' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع القاعة"
              />
              <div className="absolute inset-0 border-t border-rose/10 pointer-events-none" />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
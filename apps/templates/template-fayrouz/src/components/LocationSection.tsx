import { useRef } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'
import { motion, useInView } from 'framer-motion'

export default function LocationSection() {
  const { get } = useTemplateFields()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  const venueName = get('venue_name') ?? 'قاعة الأفراح'
  const venueAddress = get('venue_address') ?? 'العنوان'
  const mapUrl = get('venue_map_url') ?? ''
  const directionsUrl = get('venue_directions_url') ?? ''

  return (
    <section ref={ref} className="relative py-14 md:py-28 bg-gradient-to-b from-ivory via-cream to-ivory">
      {/* Floral divider top */}
      <motion.div
        className="flex justify-center mb-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 0.5, scale: 1 } : {}}
        transition={{ duration: 0.8 }}
      >
        <img src="/floral-divider.svg" alt="" className="w-72 md:w-96 h-auto" />
      </motion.div>

      <div className="max-w-3xl mx-auto px-4 text-center">
        <motion.h2
          className="font-amiri text-espresso mb-3"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          مكان الاحتفال
        </motion.h2>

        <motion.div
          className="w-16 h-px mx-auto mb-10"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)' }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Map embed */}
        {mapUrl && (
          <motion.div
            className="rounded-2xl overflow-hidden border border-gold/30 shadow-xl mx-auto"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <iframe
              src={mapUrl}
              width="100%"
              height="400"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[300px] md:h-[480px]"
            />
          </motion.div>
        )}

        {/* Venue info */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h3 className="font-amiri text-2xl text-espresso mb-2">{venueName}</h3>
          <p className="font-naskh text-espresso/50 mb-6">{venueAddress}</p>

          {directionsUrl && (
            <motion.a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-naskh font-semibold
                         text-cream shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #C9A96E, #B8944F)',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              فتح في خرائط جوجل
            </motion.a>
          )}
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="mt-16">
        <img src="/wavy-divider.svg" alt="" className="w-full h-12 md:h-20" />
      </div>
    </section>
  )
}

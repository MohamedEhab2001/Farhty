import { useTemplateFields } from '@farhty/template-sdk'
import { motion } from 'framer-motion'
import { MapPin, Calendar } from 'lucide-react'
import venueImg from '../assets/venue.jpg'
import divider from '../assets/divider.png'

export default function VenueSection() {
  const { get } = useTemplateFields()
  const venueName = get('venue_name') ?? 'Palais Soleiman'
  const venueNameAr = get('venue_name_ar') ?? 'المكان'
  const venueAddress = get('venue_address') ?? 'Medina, Marrakech, Morocco'
  const venueMapUrl = get('venue_map_url') ?? ''
  const weddingDate = get('wedding_date') ?? ''
  const venueImage = get('venue_image') || venueImg

  const dateDisplay = weddingDate
    ? new Date(weddingDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '12 · 09 · 2026'

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Background venue image */}
      <motion.div
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img
          src={venueImage}
          alt={venueName}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, oklch(0.22 0.06 155) 0%, transparent 40%, transparent 60%, oklch(0.22 0.06 155) 100%)',
          }}
        />
      </motion.div>

      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p dir="rtl" className="font-arabic text-2xl text-gold mb-3">
            {venueNameAr}
          </p>
          <h3 className="font-serif text-4xl md:text-6xl mb-8">
            {venueName}
          </h3>
          <motion.img
            src={divider}
            alt=""
            loading="lazy"
            initial={{ opacity: 0, scaleX: 0.4 }}
            whileInView={{ opacity: 0.9, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="mx-auto h-12 md:h-16 w-auto"
          />

          <div className="mt-10 space-y-4 text-ivory/85">
            <div className="flex items-center justify-center gap-3">
              <MapPin className="h-4 w-4 text-gold" />
              <span className="text-sm tracking-[0.3em] uppercase">{venueAddress}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Calendar className="h-4 w-4 text-gold" />
              <span className="text-sm tracking-[0.3em] uppercase">{dateDisplay}</span>
            </div>
          </div>

          {/* Map iframe — strict rule: maps always as iframe */}
          {venueMapUrl && (
            <div className="mt-10 rounded-lg overflow-hidden border border-gold/20">
              <iframe
                src={venueMapUrl}
                width="100%"
                height="300"
                style={{ border: 'none' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Venue location"
              />
            </div>
          )}

          {get('venue_directions_url') && (
            <a
              href={get('venue_directions_url')}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-10 border border-gold/60 px-8 py-3 text-xs tracking-[0.4em] uppercase text-gold hover:bg-gold hover:text-emerald-deep transition-colors"
            >
              View on Map
            </a>
          )}
        </motion.div>
      </div>
    </section>
  )
}

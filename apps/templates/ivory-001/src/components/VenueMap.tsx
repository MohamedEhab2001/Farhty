import { motion } from 'framer-motion'

interface VenueMapProps {
  venueName: string
  venueAddress: string
  venueCoords: string
  accentColor: string
}

export default function VenueMap({ venueName, venueAddress, venueCoords, accentColor }: VenueMapProps) {
  const lat = venueCoords ? venueCoords.split(',')[0] : '30.0444'
  const lng = venueCoords ? venueCoords.split(',')[1] : '31.2357'
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

  return (
    <section className="py-20 px-4" style={{ background: '#fefdfb' }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="font-display text-3xl sm:text-4xl font-bold mb-3"
          style={{ color: accentColor }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          مكان الحفل
        </motion.h2>
        <motion.div
          className="w-16 h-px mx-auto mb-6"
          style={{ backgroundColor: accentColor, opacity: 0.5 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-display text-2xl font-bold mb-2" style={{ color: '#3d2e1e' }}>
            {venueName}
          </h3>
          {venueAddress && (
            <p className="font-body text-sm mb-6" style={{ color: '#7a6650' }}>
              {venueAddress}
            </p>
          )}
        </motion.div>

        <motion.div
          className="rounded-2xl overflow-hidden mb-6 shadow-lg"
          style={{ border: `1px solid ${accentColor}20` }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <iframe
            src={mapSrc}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="موقع الحفل"
          />
        </motion.div>

        <motion.a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-body font-bold transition-all duration-200 no-underline"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            color: '#fff',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          احصل على الاتجاهات
        </motion.a>
      </div>
    </section>
  )
}
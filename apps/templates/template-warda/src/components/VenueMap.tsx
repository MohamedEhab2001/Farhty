import { motion } from 'framer-motion'
import { DividerSVG } from './Decorations'

interface VenueMapProps {
  name: string
  address: string
  mapImage: string
}

export default function VenueMap({ name, address, mapImage }: VenueMapProps) {
  const mapsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : '#'

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white/50 to-blush-50">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="font-amiri text-2xl md:text-3xl text-blush-800 mb-2">موقع الحفل</h2>
          <DividerSVG className="w-32 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h3 className="font-amiri text-xl md:text-2xl text-blush-800">{name || 'قاعة الأفراح'}</h3>
          {address && (
            <p className="font-tajawal text-blush-500 text-sm mt-1">{address}</p>
          )}
        </motion.div>

        {mapImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-md border border-blush-200/50 mb-6"
          >
            <img
              src={mapImage}
              alt="خريطة الموقع"
              className="w-full h-48 md:h-64 object-cover"
            />
          </motion.div>
        )}

        {address && (
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-blush-300 text-blush-700 font-tajawal px-6 py-3 rounded-full shadow-sm hover:bg-white hover:shadow-md transition-all duration-300"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            الوصول إلى القاعة
          </motion.a>
        )}
      </div>
    </section>
  )
}
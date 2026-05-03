import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface GalleryProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any[]
  accentColor: string
}

interface GalleryImage {
  url: string
  caption?: string
}

export default function Gallery({ images, accentColor }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const parsedImages: GalleryImage[] = (() => {
    if (!images || !Array.isArray(images) || images.length === 0) return []
    return images.map((img: string | GalleryImage) =>
      typeof img === 'string' ? { url: img } : img
    )
  })()

  if (parsedImages.length === 0) return null

  const handlePrev = () => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === 0 ? parsedImages.length - 1 : selectedIndex - 1)
  }

  const handleNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex(selectedIndex === parsedImages.length - 1 ? 0 : selectedIndex + 1)
  }

  return (
    <section className="py-20 px-4" style={{ background: '#fefdfb' }}>
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="font-display text-3xl sm:text-4xl font-bold text-center mb-3"
          style={{ color: accentColor }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          ألبوم الصور
        </motion.h2>
        <motion.div
          className="w-16 h-px mx-auto mb-10"
          style={{ backgroundColor: accentColor, opacity: 0.5 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {parsedImages.map((img, i) => (
            <motion.div
              key={i}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setSelectedIndex(i)}
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={img.url}
                alt={img.caption || `صورة ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                  <path d="M11 8v6M8 11h6" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              className="fixed inset-0 z-[10000] flex items-center justify-center"
              style={{ backgroundColor: 'rgba(253, 248, 240, 0.95)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
            >
              <button
                className="absolute top-4 left-4 sm:top-8 sm:left-8 w-10 h-10 rounded-full flex items-center justify-center z-10"
                style={{ backgroundColor: accentColor, border: 'none', cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(null) }}
              >
                <span style={{ color: '#fff', fontSize: '18px' }}>✕</span>
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10"
                style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}40`, cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); handleNext() }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10"
                style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}40`, cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); handlePrev() }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              <motion.div
                className="max-w-4xl max-h-[80vh] px-14"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={parsedImages[selectedIndex].url}
                  alt={parsedImages[selectedIndex].caption || ''}
                  className="w-full h-full object-contain rounded-xl"
                  style={{ maxHeight: '80vh' }}
                />
                {parsedImages[selectedIndex].caption && (
                  <p className="text-center mt-4 font-body text-sm" style={{ color: '#7a6650' }}>
                    {parsedImages[selectedIndex].caption}
                  </p>
                )}
              </motion.div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-sm" style={{ color: '#7a6650' }}>
                {selectedIndex + 1} / {parsedImages.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
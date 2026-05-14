'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTemplateFields } from '@farhty/template-sdk'
import { useState } from 'react'

export default function GallerySection() {
  const { get } = useTemplateFields()
  const images = (get('gallery_images') as string[] | undefined) ?? []
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  if (images.length === 0) return null

  return (
    <section className="relative py-12 md:py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="font-body text-rose/50 text-sm tracking-widest mb-3">معرض الصور</p>
          <h2 className="font-display text-3xl md:text-5xl rose-shimmer py-4">ذكرياتنا</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square rounded-[1.25rem] overflow-hidden cursor-pointer shadow-[0_4px_20px_-4px_rgba(212,98,127,0.1)] hover:shadow-[0_8px_30px_-8px_rgba(212,98,127,0.2)] transition-shadow duration-300"
              onClick={() => setSelectedIdx(i)}
            >
              <img src={img} alt="" className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-warm-dark/90 flex items-center justify-center p-6"
            onClick={() => setSelectedIdx(null)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={images[selectedIdx]}
              alt=""
              className="max-w-full max-h-[85vh] object-contain rounded-[1rem]"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-6 left-6 w-10 h-10 border border-rose/30 rounded-full flex items-center justify-center text-rose/70 hover:text-rose transition-colors bg-ivory/10"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
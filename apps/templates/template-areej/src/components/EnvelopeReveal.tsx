'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface EnvelopeRevealProps {
  onOpen: () => void
}

export default function EnvelopeReveal({ onOpen }: EnvelopeRevealProps) {
  const [opening, setOpening] = useState(false)

  const handleOpen = () => {
    setOpening(true)
    setTimeout(onOpen, 1200)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ivory"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4627F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative w-full max-w-md px-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-12"
          >
            <p className="font-amiri text-rose/60 text-lg mb-4">وصلكم دعوة</p>
            <div className="text-3xl mb-2">🌸</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative cursor-pointer"
            onClick={handleOpen}
            style={{ perspective: '1000px' }}
          >
            <div
              className={`glass-panel rounded-[2.5rem] p-10 text-center transition-all duration-700 ${opening ? 'scale-50 opacity-0' : ''}`}
              style={{ transform: opening ? 'scale(0.5) translateY(-50px)' : 'scale(1)', opacity: opening ? 0 : 1 }}
            >
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto mb-6 border border-rose/20 rounded-full flex items-center justify-center bg-rose/5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-rose">
                    <path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 8v8a2 2 0 002 2h14a2 2 0 002-2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="font-display text-3xl md:text-4xl rose-shimmer mb-3">
                  دعوة زفاف
                </h2>
                <div className="w-16 h-px mx-auto bg-gradient-to-r from-transparent via-rose/30 to-transparent mb-4" />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block px-8 py-3 border border-rose/30 rounded-full text-rose font-body text-sm tracking-wide hover:bg-rose/10 transition-colors duration-300"
              >
                افتح الدعوة
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
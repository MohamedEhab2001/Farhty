import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EnvelopeRevealProps {
  onOpen: () => void
}

export default function EnvelopeReveal({ onOpen }: EnvelopeRevealProps) {
  const [opened, setOpened] = useState(false)

  const handleOpen = () => {
    setOpened(true)
    setTimeout(() => {
      onOpen()
    }, 1800)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'linear-gradient(180deg, #fdf8f0 0%, #f5eadb 50%, #fefdfb 100%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative w-[320px] sm:w-[380px]" style={{ perspective: '1200px' }}>
        {/* Envelope back */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #e8d5a3 0%, #c9a96e 100%)',
            boxShadow: '0 20px 60px rgba(61, 46, 30, 0.2)',
            height: opened ? '200px' : '260px',
            transition: 'height 0.6s ease',
          }}
        >
          {/* Wax seal decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle, #dfc7a0 0%, #a88a4e 100%)',
                boxShadow: '0 4px 20px rgba(168, 138, 78, 0.4)',
              }}
            >
              <span className="text-white text-2xl" style={{ fontFamily: 'var(--font-display)' }}>💍</span>
            </div>
          </div>

          {/* Ornamental lines on envelope */}
          <div className="absolute inset-4 border border-white/20 rounded-xl" />
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <svg width="120" height="20" viewBox="0 0 120 20">
              <path d="M10 10 Q30 2 60 10 Q90 18 110 10" stroke="rgba(255,255,255,0.3)" fill="none" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Envelope flap */}
        <motion.div
          className="absolute top-0 left-0 right-0 origin-top"
          style={{
            height: '140px',
            background: 'linear-gradient(180deg, #b08d4e 0%, #c9a96e 60%, #dfc7a0 100%)',
            borderRadius: '1rem 1rem 0 0',
            zIndex: 20,
          }}
          initial={{ rotateX: 0 }}
          animate={opened ? { rotateX: -180 } : { rotateX: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '20px solid transparent',
              borderRight: '20px solid transparent',
              borderTop: '16px solid #dfc7a0',
            }}
          />
          <div className="absolute top-6 left-1/2 -translate-x-1/2">
            <svg width="100" height="30" viewBox="0 0 100 30">
              <path d="M5 15 Q25 5 50 15 Q75 25 95 15" stroke="rgba(255,255,255,0.25)" fill="none" strokeWidth="0.8" />
              <circle cx="50" cy="15" r="3" fill="rgba(255,255,255,0.2)" />
            </svg>
          </div>
        </motion.div>

        {/* Invitation peek (scales up after flap opens) */}
        <AnimatePresence>
          {opened && (
            <motion.div
              className="absolute inset-x-4 bottom-4"
              style={{
                background: '#fefdfb',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 -4px 20px rgba(201, 169, 110, 0.2)',
                zIndex: 30,
              }}
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="text-center" style={{ color: 'var(--color-text-light)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                أدخل الدعوة
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Open button */}
        {!opened && (
          <motion.button
            onClick={handleOpen}
            className="absolute -bottom-14 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full font-body font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, #c9a96e 0%, #e8d5a3 100%)',
              color: '#3d2e1e',
              boxShadow: '0 8px 30px rgba(201, 169, 110, 0.4)',
              border: 'none',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            افتح الدعوة
          </motion.button>
        )}
      </div>

      {/* Decorative floating elements */}
      {!opened && (
        <>
          <div className="absolute top-[10%] left-[10%] w-2 h-2 rounded-full bg-gold-light/30 animate-pulse" />
          <div className="absolute top-[20%] right-[15%] w-1.5 h-1.5 rounded-full bg-gold-light/20 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-[25%] left-[20%] w-1 h-1 rounded-full bg-gold-light/25 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </>
      )}
    </motion.div>
  )
}
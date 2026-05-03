import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ShareButtonProps {
  accentColor: string
}

export default function ShareButton({ accentColor }: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false)

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ url })
        return
      }
    } catch {
      // fall through to clipboard
    }

    try {
      await navigator.clipboard.writeText(url)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch {
      // fallback
    }
  }

  return (
    <>
      <section className="py-12 px-4" style={{ background: '#fefdfb' }}>
        <div className="max-w-md mx-auto text-center">
          <motion.button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-body font-bold transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            مشاركة الدعوة
          </motion.button>
        </div>
      </section>

      <AnimatePresence>
        {showToast && (
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] px-6 py-3 rounded-xl font-body text-sm shadow-xl"
            style={{ backgroundColor: accentColor, color: '#fff' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            تم نسخ رابط الدعوة! ✓
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
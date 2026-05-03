import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RoseLargeSVG, WaxSealSVG } from './Decorations'

interface EnvelopeRevealProps {
  onOpen: () => void
}

export default function EnvelopeReveal({ onOpen }: EnvelopeRevealProps) {
  const [opening, setOpening] = useState(false)
  const [cardRevealed, setCardRevealed] = useState(false)

  const handleOpen = () => {
    setOpening(true)
    setTimeout(() => setCardRevealed(true), 800)
    setTimeout(() => onOpen(), 2200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blush-50 to-blush-100 overflow-hidden">
      <RoseLargeSVG className="absolute top-[-60px] right-[-80px] w-[300px] h-[300px] animate-float" opacity={0.12} />
      <RoseLargeSVG className="absolute bottom-[-60px] left-[-80px] w-[280px] h-[280px] animate-float" opacity={0.1} style={{ animationDelay: '3s' }} />

      <AnimatePresence>
        {!cardRevealed && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col items-center"
          >
            <div className="relative">
              <svg viewBox="0 0 280 200" className="w-[280px] h-[200px] md:w-[340px] md:h-[240px]" fill="none">
                <rect x="10" y="60" width="260" height="130" rx="8" fill="#E8C4C4" stroke="#D4A0A0" strokeWidth="1.5" />
                <rect x="10" y="60" width="260" height="130" rx="8" fill="url(#envGrad)" />
                <line x1="10" y1="90" x2="270" y2="90" stroke="#D4A0A0" strokeWidth="0.5" opacity="0.3" />
                <line x1="10" y1="150" x2="270" y2="150" stroke="#D4A0A0" strokeWidth="0.5" opacity="0.3" />

                <motion.g
                  animate={opening ? { rotateX: -180, originY: 0 } : { rotateX: 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  style={{ originX: '140px', originY: '0px', transformOrigin: '140px 0px' }}
                >
                  <path d="M10 60 L140 10 L270 60 Z" fill="#D4A0A0" stroke="#C69B7B" strokeWidth="1" />
                  <path d="M12 60 L140 12 L268 60" fill="#E8C4C4" opacity="0.5" />
                </motion.g>

                <defs>
                  <linearGradient id="envGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFE8E8" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#F5D0D0" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>

              <motion.div
                className="absolute"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                initial={{ scale: 1 }}
                animate={opening ? { scale: 1.3, opacity: 0 } : { scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <WaxSealSVG />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: opening ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="mt-6 font-amiri text-blush-700 text-lg animate-pulse-soft cursor-pointer select-none"
              onClick={handleOpen}
            >
              اضغط لفتح الدعوة
            </motion.p>
          </motion.div>
        )}

        {cardRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center px-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-amiri text-4xl md:text-5xl text-blush-800 mb-4"
            >
              دعوة زفاف
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="section-divider mx-auto mb-4"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="font-tajawal text-blush-600 text-lg"
            >
              يسرنا حضوركم
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
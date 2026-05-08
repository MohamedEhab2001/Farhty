import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SectionMessage {
  id: string
  speaker: 'bride' | 'groom'
  text: string
}

interface CoupleBubblesProps {
  messages: SectionMessage[]
  activeId: string | null
  visible: boolean
  brideImage: string
  groomImage: string
}

export function CoupleBubbles({ messages, activeId, visible, brideImage, groomImage }: CoupleBubblesProps) {
  const active = messages.find(m => m.id === activeId) ?? messages[0]
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 40 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed bottom-6 left-4 md:bottom-10 md:left-8 z-40 flex flex-col items-start gap-3"
      style={{ direction: 'ltr' }}
    >
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id + active.speaker}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative max-w-[260px] md:max-w-xs glass-card rounded-2xl rounded-bl-sm px-4 py-3 shadow-gold"
            style={{ direction: 'rtl' }}
          >
            <div className="text-[10px] tracking-[0.25em] text-gold mb-1 font-body">
              {active.speaker === 'bride' ? 'العروس' : 'العريس'}
            </div>
            <p className="font-arabic text-sm md:text-base text-ivory leading-relaxed">{active.text}</p>
            <span
              className="absolute -bottom-2 left-6 w-3 h-3 rotate-45 glass-card border-t-0 border-l-0"
              style={{ background: 'oklch(0.18 0.02 25 / 0.55)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <Avatar
          src={active?.speaker === 'groom' ? groomImage : brideImage}
          alt={active?.speaker === 'groom' ? 'العريس' : 'العروس'}
          highlighted
        />
        <Avatar
          src={active?.speaker === 'groom' ? brideImage : groomImage}
          alt={active?.speaker === 'groom' ? 'العروس' : 'العريس'}
        />
      </div>
    </motion.div>
  )
}

function Avatar({ src, alt, highlighted = false }: { src: string; alt: string; highlighted?: boolean }) {
  return (
    <motion.div
      animate={highlighted ? { scale: [1, 1.08, 1], y: [0, -4, 0] } : { scale: 0.85, y: 0 }}
      transition={highlighted ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
      className="relative rounded-full"
    >
      {highlighted && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
            style={{ boxShadow: '0 0 0 3px var(--gold)' }}
          />
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{ scale: [1, 1.7, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
            style={{ boxShadow: '0 0 0 2px var(--gold)' }}
          />
        </>
      )}
      <div
        className="relative rounded-full"
        style={{
          boxShadow: highlighted
            ? '0 0 0 2px var(--gold), 0 0 32px oklch(0.78 0.13 80 / 0.7)'
            : '0 0 0 1.5px oklch(0.78 0.13 80 / 0.5)',
        }}
      >
        <img src={src} alt={alt} className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover" loading="lazy" />
        {highlighted && (
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, oklch(0.95 0.1 85 / 0.55) 30deg, transparent 70deg, transparent 360deg)',
              mixBlendMode: 'overlay',
            }}
          />
        )}
      </div>
    </motion.div>
  )
}

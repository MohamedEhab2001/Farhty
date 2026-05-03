import { motion } from 'framer-motion'

export default function OrnamentalDivider() {
  return (
    <motion.div
      className="flex items-center justify-center py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 sm:w-20 h-px bg-[var(--color-gold)] opacity-30" />
        <svg width="40" height="24" viewBox="0 0 40 24">
          <path d="M2 12 Q10 2 20 12 Q30 22 38 12" stroke="var(--color-gold)" fill="none" strokeWidth="1" opacity="0.5" />
          <path d="M8 12 Q14 6 20 12 Q26 18 32 12" stroke="var(--color-gold)" fill="none" strokeWidth="0.5" opacity="0.3" />
          <circle cx="20" cy="12" r="2.5" fill="var(--color-gold)" opacity="0.4" />
          <circle cx="20" cy="12" r="1" fill="var(--color-gold)" opacity="0.7" />
        </svg>
        <div className="w-12 sm:w-20 h-px bg-[var(--color-gold)] opacity-30" />
      </div>
    </motion.div>
  )
}
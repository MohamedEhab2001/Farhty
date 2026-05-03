import { motion } from 'framer-motion'

interface CustomQuoteProps {
  quote: string
  accentColor: string
}

export default function CustomQuote({ quote, accentColor }: CustomQuoteProps) {
  if (!quote) return null

  return (
    <section className="py-16 px-4" style={{ background: '#fefdfb' }}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <svg width="32" height="24" viewBox="0 0 32 24" className="mx-auto mb-4 opacity-30">
            <path d="M0 24 V16 Q8 0 16 8 Q24 16 32 8 V24 Z" fill={accentColor} opacity="0.3" />
          </svg>
          <p
            className="font-display text-xl sm:text-2xl leading-relaxed"
            style={{ color: '#3d2e1e' }}
          >
            {quote}
          </p>
          <svg width="32" height="24" viewBox="0 0 32 24" className="mx-auto mt-4 opacity-30" style={{ transform: 'rotate(180deg)' }}>
            <path d="M0 24 V16 Q8 0 16 8 Q24 16 32 8 V24 Z" fill={accentColor} opacity="0.3" />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
import { motion } from 'framer-motion'

interface ParentsSectionProps {
  brideName: string
  groomName: string
  brideFather: string
  groomFather: string
  accentColor: string
}

export default function ParentsSection({ brideFather, groomFather, accentColor }: ParentsSectionProps) {
  if (!brideFather && !groomFather) return null

  return (
    <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #fefdfb 0%, #fdf8f0 100%)' }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="font-display text-3xl sm:text-4xl font-bold mb-3"
          style={{ color: accentColor }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          ووالديهما الكريمين
        </motion.h2>
        <motion.div
          className="w-16 h-px mx-auto mb-10"
          style={{ backgroundColor: accentColor, opacity: 0.5 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
        />

        {brideFather && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <p className="font-body text-sm mb-2" style={{ color: '#7a6650' }}>والد العروسة</p>
            <p className="font-display text-2xl font-bold" style={{ color: '#3d2e1e' }}>
              {brideFather}
            </p>
          </motion.div>
        )}

        {brideFather && groomFather && (
          <motion.div
            className="flex items-center justify-center my-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <svg width="40" height="24" viewBox="0 0 40 24">
              <path d="M0 12 Q10 2 20 12 Q30 22 40 12" stroke={accentColor} fill="none" strokeWidth="1" opacity="0.4" />
              <circle cx="20" cy="12" r="2" fill={accentColor} opacity="0.4" />
            </svg>
          </motion.div>
        )}

        {groomFather && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="font-body text-sm mb-2" style={{ color: '#7a6650' }}>والد العريس</p>
            <p className="font-display text-2xl font-bold" style={{ color: '#3d2e1e' }}>
              {groomFather}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
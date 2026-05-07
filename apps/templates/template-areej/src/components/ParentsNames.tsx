'use client'

import { motion } from 'framer-motion'
import { useTemplateFields } from '@farhty/template-sdk'

export default function ParentsNames() {
  const { get } = useTemplateFields()

  const brideName = get('bride_name') ?? 'ليلى'
  const groomName = get('groom_name') ?? 'كريم'
  const fatherOfBride = get('father_of_bride') ?? 'محمد'
  const fatherOfGroom = get('father_of_groom') ?? 'أحمد'

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel rounded-[2.5rem] p-10 md:p-14"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="text-center">
              <p className="font-body text-rose/50 text-sm mb-3">عروس</p>
              <h3 className="font-display text-3xl md:text-4xl text-deep-rose mb-2">{brideName}</h3>
              <p className="font-body text-warm-charcoal/40 text-sm">ابنة الفاضل / {fatherOfBride}</p>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="w-px h-20 bg-gradient-to-b from-transparent via-rose/25 to-transparent" />
            </div>

            <div className="hidden md:block" />

            <div className="text-center md:text-center">
              <p className="font-body text-rose/50 text-sm mb-3">عريس</p>
              <h3 className="font-display text-3xl md:text-4xl text-deep-rose mb-2">{groomName}</h3>
              <p className="font-body text-warm-charcoal/40 text-sm">ابن الفاضل / {fatherOfGroom}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
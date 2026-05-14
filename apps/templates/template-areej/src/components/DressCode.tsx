'use client'

import { motion } from 'framer-motion'
import { useTemplateFields } from '@farhty/template-sdk'

const dressCodeOptions: Record<string, { label: string }> = {
  formal: { label: 'رسمي' },
  'semi-formal': { label: 'نصف رسمي' },
  casual: { label: 'كاجوال' },
  traditional: { label: 'تقليدي' },
}

export default function DressCode() {
  const { get } = useTemplateFields()
  const dressCode = (get('dress_code') as string) ?? 'formal'
  const selected = dressCodeOptions[dressCode] ?? dressCodeOptions.formal

  return (
    <section className="relative py-10 md:py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-[2.5rem] p-8 md:p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="w-14 h-14 mx-auto mb-4 border border-rose/20 rounded-full flex items-center justify-center bg-rose/5"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-rose" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </motion.div>
          <p className="font-body text-rose/50 text-sm tracking-widest mb-2">الدريس كود</p>
          <p className="font-display text-2xl rose-shimmer">{selected.label}</p>
        </motion.div>
      </div>
    </section>
  )
}
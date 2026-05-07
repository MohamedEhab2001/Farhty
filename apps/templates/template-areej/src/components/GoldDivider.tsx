'use client'

import { motion } from 'framer-motion'

export default function GoldDivider() {
  return (
    <div className="flex items-center justify-center py-8 px-6">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-4 max-w-[200px]"
      >
        <div className="flex-1 h-px bg-gradient-to-l from-rose/40 to-transparent" />
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-2.5 h-2.5 rounded-full bg-rose/30"
        />
        <div className="flex-1 h-px bg-gradient-to-r from-rose/40 to-transparent" />
      </motion.div>
    </div>
  )
}
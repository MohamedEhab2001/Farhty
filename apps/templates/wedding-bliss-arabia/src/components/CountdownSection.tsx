import { useState, useEffect } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'
import { motion } from 'framer-motion'

function Unit({ n, label }: { n: number; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center"
    >
      <div className="font-serif text-4xl md:text-6xl text-gold tabular-nums">
        {String(n).padStart(2, '0')}
      </div>
      <div className="mt-2 text-[0.65rem] tracking-[0.4em] uppercase text-ivory/60">
        {label}
      </div>
    </motion.div>
  )
}

export default function CountdownSection() {
  const { get } = useTemplateFields()
  const weddingDate = get('wedding_date')
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })

  useEffect(() => {
    if (!weddingDate) return
    const target = new Date(weddingDate).getTime()
    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const i = setInterval(tick, 1000)
    return () => clearInterval(i)
  }, [weddingDate])

  return (
    <section className="py-24 px-6 text-center border-y border-gold/20">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-serif italic text-ivory/70 text-lg mb-10"
      >
        A celebration begins in
      </motion.p>
      <div className="flex justify-center gap-6 md:gap-16">
        <Unit n={t.d} label="Days" />
        <Unit n={t.h} label="Hours" />
        <Unit n={t.m} label="Minutes" />
        <Unit n={t.s} label="Seconds" />
      </div>
    </section>
  )
}

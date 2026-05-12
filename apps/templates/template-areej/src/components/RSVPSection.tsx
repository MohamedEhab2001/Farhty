'use client'

import { motion } from 'framer-motion'
import { useTemplateData } from '@farhty/template-sdk'
import { useState } from 'react'

export default function RSVPSection() {
  const { instance } = useTemplateData()
  const slug = instance?.slug || ''
  const [name, setName] = useState('')
  const [attending, setAttending] = useState(true)
  const [guests, setGuests] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const alreadySubmitted = typeof window !== 'undefined' && localStorage.getItem(`farhty_rsvp_submitted_${slug}`)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const config = await fetch('/config.json').then(r => r.json())
      const apiSlug = config.slug || slug
      await fetch(`${config.apiBase}/api/instances/by-domain/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: apiSlug, name: name.trim(), attending, guests }),
      })
      localStorage.setItem(`farhty_rsvp_submitted_${slug}`, 'true')
      setSubmitted(true)
    } catch {} finally {
      setLoading(false)
    }
  }

  if (submitted || alreadySubmitted) {
    return (
      <section className="relative py-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-[2.5rem] p-10"
          >
            <div className="text-4xl mb-4">🌸</div>
            <p className="font-display text-2xl text-deep-rose mb-2">شكراً لتأكيدكم</p>
            <p className="font-body text-warm-charcoal/40 text-sm">ننتظركم بكل شوق</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p className="font-body text-rose/50 text-sm tracking-widest mb-3">تأكيد الحضور</p>
          <h2 className="font-display text-3xl md:text-5xl rose-shimmer py-4">يسعدنا حضوركم</h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass-panel rounded-[2.5rem] p-8 md:p-10 space-y-6"
        >
          <div>
            <label className="block font-body text-warm-charcoal/60 text-sm mb-2">الاسم</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="areej-input"
              placeholder="ادخل اسمك"
              required
            />
          </div>

          <div>
            <label className="block font-body text-warm-charcoal/60 text-sm mb-4">هل ستحضرون؟</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`flex-1 py-3 rounded-xl font-body text-sm transition-all duration-300 ${
                  attending ? 'bg-rose/15 border border-rose/40 text-rose' : 'border border-rose/10 text-warm-charcoal/40'
                }`}
              >
                نعم، سأحضر
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`flex-1 py-3 rounded-xl font-body text-sm transition-all duration-300 ${
                  !attending ? 'bg-red-500/15 border border-red-400/40 text-red-400' : 'border border-rose/10 text-warm-charcoal/40'
                }`}
              >
                للأسف لن أتمكن
              </button>
            </div>
          </div>

          {attending && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="block font-body text-warm-charcoal/60 text-sm mb-2">عدد الضيوف</label>
              <input
                type="number"
                min={1}
                max={10}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="areej-input"
                dir="ltr"
              />
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-rose/15 border border-rose/30 text-rose font-body tracking-wide hover:bg-rose/25 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'جاري الإرسال...' : 'تأكيد الحضور'}
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}
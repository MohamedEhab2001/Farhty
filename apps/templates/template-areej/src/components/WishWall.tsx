'use client'

import { motion } from 'framer-motion'
import { useTemplateData } from '@farhty/template-sdk'
import { useState, useEffect } from 'react'

interface Wish {
  name: string
  message: string
  _id?: string
}

export default function WishWall() {
  const { instance } = useTemplateData()
  const [wishes, setWishes] = useState<Wish[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const slug = instance?.slug || ''

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const config = await fetch('/config.json').then(r => r.json())
        const res = await fetch(`${config.apiBase}/api/instances/by-domain?slug=${slug}`)
        const data = await res.json()
        if (data?.data?.wish_entries) {
          setWishes(JSON.parse(data.data.wish_entries))
        }
      } catch { }
    }
    if (slug) fetchWishes()
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setLoading(true)
    try {
      const config = await fetch('/config.json').then(r => r.json())
      await fetch(`${config.apiBase}/api/instances/by-domain/wish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: config.slug || slug, name: name.trim(), message: message.trim() }),
      })
      setWishes(prev => [...prev, { name: name.trim(), message: message.trim() }])
      setSubmitted(true)
    } catch { } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <p className="font-body text-gold/50 text-sm tracking-widest mb-3">تهاني</p>
          <h2 className="font-display text-3xl md:text-5xl gold-shimmer">اتركوا تهنئتكم</h2>
        </motion.div>

        {!submitted ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="glass-panel rounded-[2rem] p-8 md:p-10 space-y-6 mb-12"
          >
            <div>
              <label className="block font-body text-ivory/60 text-sm mb-2">الاسم</label>
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
              <label className="block font-body text-ivory/60 text-sm mb-2">التهنئة</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="areej-input resize-none"
                rows={3}
                placeholder="اكتب تهنئتك هنا..."
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gold/20 border border-gold/30 text-gold font-body tracking-wide hover:bg-gold/30 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال التهنئة'}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-[2rem] p-10 text-center mb-12"
          >
            <p className="font-display text-xl gold-shimmer">شكراً لتهنئتكم</p>
          </motion.div>
        )}

        {wishes.length > 0 && (
          <div className="space-y-4">
            {wishes.map((wish, i) => (
              <motion.div
                key={wish._id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel rounded-[1.25rem] p-6"
              >
                <p className="font-body text-ivory/80 text-sm mb-2">{wish.message}</p>
                <p className="font-display text-gold/60 text-xs">— {wish.name}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
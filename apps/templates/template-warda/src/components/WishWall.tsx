import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTemplateData, useTemplateFields } from '@farhty/template-sdk'
import { DividerSVG } from './Decorations'

interface WishEntry {
  name: string
  message: string
  timestamp: string
}

export default function WishWall() {
  const { instance } = useTemplateData()
  const { get } = useTemplateFields()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const wishes: WishEntry[] = (() => {
    const raw = get('wish_entries')
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return [] } }
    return []
  })()

  const slug = instance?.slug ?? ''
  const MAX_CHARS = 200

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) return
    setLoading(true)

    try {
      const config = await fetch('/config.json').then(r => r.json())
      const currentSlug = config.slug || window.location.hostname.split('.')[0]
      const token = localStorage.getItem(`farhty_token_${currentSlug}`)

      const res = await fetch(`${config.apiBase}/api/instances/by-domain?slug=${currentSlug}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const current = await res.json()

      await fetch(`${config.apiBase}/api/instances/${current.instanceId}/data`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...current.data,
          wish_entries: [
            { name: name.trim(), message: message.trim(), timestamp: new Date().toISOString() },
            ...(Array.isArray(current.data.wish_entries) ? current.data.wish_entries : [])
          ]
        })
      })

      setName('')
      setMessage('')
      window.location.reload()
    } catch {
      alert('حدث خطأ. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 px-4 bg-white/50">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="font-amiri text-2xl md:text-3xl text-blush-800 mb-2">تهانيكم</h2>
          <DividerSVG className="w-32 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl border border-blush-200/50 p-6 shadow-sm mb-8"
        >
          <div className="mb-4">
            <label className="font-tajawal text-blush-600 text-sm block mb-2">الاسم</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-blush-50 border border-blush-200 rounded-xl px-4 py-3 font-tajawal text-blush-900 placeholder-blush-300 focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold/30 transition-all"
              placeholder="اسمك الكريم"
            />
          </div>

          <div className="mb-4">
            <label className="font-tajawal text-blush-600 text-sm block mb-2">تهنئتكم</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value.slice(0, MAX_CHARS))}
              className="w-full bg-blush-50 border border-blush-200 rounded-xl px-4 py-3 font-tajawal text-blush-900 placeholder-blush-300 focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold/30 transition-all resize-none"
              rows={3}
              placeholder="اكتب تهنئتك هنا..."
            />
            <p className="text-xs text-blush-400 mt-1 text-left" dir="ltr">{message.length}/{MAX_CHARS}</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name.trim() || !message.trim() || loading}
            className="w-full py-3 rounded-xl font-amiri text-lg bg-gradient-to-l from-blush-400 to-rose-gold text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الإرسال...' : 'أرسل تهنئتك'}
          </button>
        </motion.div>

        {wishes.length > 0 && (
          <div className="space-y-3">
            {wishes.map((wish, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-blush-50/80 rounded-2xl border border-blush-200/50 p-4 shadow-sm"
              >
                <p className="font-amiri text-blush-800 text-sm leading-relaxed">{wish.message}</p>
                <p className="font-tajawal text-blush-400 text-xs mt-2">— {wish.name}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
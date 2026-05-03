import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface WishWallProps {
  instanceId: string
  accentColor: string
}

interface Wish {
  name: string
  message: string
  timestamp: string
}

export default function WishWall({ accentColor }: WishWallProps) {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const loadWishes = useCallback(async () => {
    try {
      const config = await fetch('/config.json').then(r => r.json())
      const apiBase = config.apiBase || 'http://localhost:3001'
      const slug = config.slug || window.location.hostname.split('.')[0]
      const token = localStorage.getItem(`farhty_token_${slug}`)
      if (!token) { setLoading(false); return }

      const res = await fetch(`${apiBase}/api/instances/by-domain?slug=${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setWishes(data.data?.wish_entries ?? [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadWishes() }, [loadWishes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    setSubmitting(true)
    setError('')

    try {
      const config = await fetch('/config.json').then(r => r.json())
      const apiBase = config.apiBase || 'http://localhost:3001'
      const slug = config.slug || window.location.hostname.split('.')[0]
      const token = localStorage.getItem(`farhty_token_${slug}`)
      if (!token) { setError('يجب تسجيل الدخول أولاً'); return }

      const newWish: Wish = { name: name.trim(), message: message.trim(), timestamp: new Date().toISOString() }

      const existingRes = await fetch(`${apiBase}/api/instances/by-domain?slug=${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const existingData = await existingRes.json()
      const currentWishes: Wish[] = existingData.data?.wish_entries ?? []

      const updatedData = { ...existingData.data, wish_entries: [...currentWishes, newWish] }

      const res = await fetch(`${apiBase}/api/instances/${existingData.instanceId}/data`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Host: window.location.hostname,
        },
        body: JSON.stringify(updatedData),
      })

      if (!res.ok) throw new Error('فشل الإرسال')

      setName('')
      setMessage('')
      setWishes([...currentWishes, newWish])
    } catch {
      setError('حدث خطأ. حاول مرة أخرى.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-20 px-4" style={{ background: 'linear-gradient(180deg, #fefdfb 0%, #fdf8f0 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="font-display text-3xl sm:text-4xl font-bold text-center mb-3"
          style={{ color: accentColor }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          حائط التهاني
        </motion.h2>
        <motion.div
          className="w-16 h-px mx-auto mb-12"
          style={{ backgroundColor: accentColor, opacity: 0.5 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
        />

        <motion.form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto mb-12 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="اسمك"
            className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none"
            style={{ backgroundColor: `${accentColor}08`, border: `1px solid ${accentColor}25`, color: '#3d2e1e' }}
            required
          />
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="اكتب تهنئتك هنا..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none resize-none"
            style={{ backgroundColor: `${accentColor}08`, border: `1px solid ${accentColor}25`, color: '#3d2e1e' }}
            required
          />
          {error && <p className="text-center font-body text-sm" style={{ color: '#e53e3e' }}>{error}</p>}
          <button
            type="submit"
            disabled={submitting || !name.trim() || !message.trim()}
            className="w-full py-3 rounded-xl font-body font-bold transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              color: '#fff',
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting || !name.trim() || !message.trim() ? 0.6 : 1,
            }}
          >
            {submitting ? 'جاري الإرسال...' : 'أرسل التهنئة'}
          </button>
        </motion.form>

        {!loading && wishes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishes.map((wish, i) => (
              <motion.div
                key={`${wish.timestamp}-${i}`}
                className="p-5 rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}08, ${accentColor}03)`,
                  border: `1px solid ${accentColor}15`,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <p className="font-body text-sm leading-relaxed mb-3" style={{ color: '#3d2e1e' }}>
                  "{wish.message}"
                </p>
                <p className="font-display font-bold text-sm" style={{ color: accentColor }}>
                  — {wish.name}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && wishes.length === 0 && (
          <p className="text-center font-body text-sm" style={{ color: '#7a6650' }}>
            كن أول من يهنئ!
          </p>
        )}
      </div>
    </section>
  )
}
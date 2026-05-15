import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Wish { name: string; message: string; visible?: boolean }
interface Props { initialWishes: Wish[] }

export default function WishWall({ initialWishes }: Props) {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setWishes(initialWishes.filter(w => w.visible !== false))
  }, [initialWishes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const config = await fetch('/config.json').then(r => r.json())
      const slug = config.slug || window.location.hostname.split('.')[0]
      const res = await fetch(`${config.apiBase}/api/instances/by-domain/wish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name: name.trim().slice(0, 60), message: message.trim().slice(0, 400) }),
      })
      if (!res.ok) throw new Error('فشل الإرسال')
      setWishes(prev => [{ name: name.trim(), message: message.trim(), visible: true }, ...prev])
      setName('')
      setMessage('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
    } catch {
      setError('لم نتمكن من إرسال أمنيتك، يرجى المحاولة مرة أخرى.')
      setTimeout(() => setError(''), 4000)
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
    border: '1px solid rgba(184,150,46,0.5)',
    background: 'rgba(247,243,233,0.8)',
    fontFamily: 'Tajawal, sans-serif', fontSize: '1rem',
    color: 'var(--ink)', outline: 'none', direction: 'rtl', textAlign: 'right',
  }

  return (
    <div dir="rtl">
      <div className="text-center">
        <p className="text-sm tracking-[0.15em]" style={{ color: 'rgba(26,64,48,0.7)', fontFamily: 'Tajawal, sans-serif' }}>
          اترك دعاءك
        </p>
        <h3 className="mt-3 text-3xl md:text-4xl" style={{ color: 'var(--ink)', fontFamily: 'Amiri, serif' }}>
          دفتر التهنئة
        </h3>
        <p className="mt-1 text-sm" style={{ color: 'rgba(26,26,46,0.6)', fontFamily: 'Tajawal, sans-serif' }}>
          شارك دعاءً أو كلمة طيبة للزوجين
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl space-y-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="اسمك"
          maxLength={60}
          style={inputStyle}
        />
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="دعاؤك أو رسالتك…"
          rows={3}
          maxLength={400}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        {error && (
          <p className="text-sm text-center" style={{ color: '#c0392b', fontFamily: 'Tajawal, sans-serif' }}>{error}</p>
        )}
        {submitted && (
          <p className="text-sm text-center" style={{ color: 'var(--emerald)', fontFamily: 'Tajawal, sans-serif' }}>
            ✓ تم إرسال أمنيتك — جزاكم الله خيرًا
          </p>
        )}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-7 py-3 text-sm tracking-[0.1em] transition-transform hover:scale-105 disabled:opacity-50"
            style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-gold)', color: 'var(--cream)', fontFamily: 'Tajawal, sans-serif', fontWeight: 500 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z" />
            </svg>
            {submitting ? 'جاري الإرسال...' : 'أرسل الأمنية'}
          </button>
        </div>
      </form>

      <div className="mx-auto mt-10 grid max-w-2xl gap-4">
        <AnimatePresence initial={false}>
          {wishes.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm"
              style={{ color: 'rgba(26,26,46,0.5)', fontFamily: 'Tajawal, sans-serif' }}
            >
              كن أول من يترك دعاءً…
            </motion.p>
          )}
          {wishes.map((w, i) => (
            <motion.div
              key={`${w.name}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl px-5 py-4 text-right"
              style={{ border: '1px solid rgba(184,150,46,0.4)', background: 'rgba(247,243,233,0.7)' }}
            >
              <p className="font-semibold text-base" style={{ color: 'var(--emerald-deep)', fontFamily: 'Tajawal, sans-serif' }}>
                {w.name}
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: 'rgba(26,26,46,0.8)', fontFamily: 'Tajawal, sans-serif' }}>
                {w.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

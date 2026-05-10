import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'

interface Wish { name: string; message: string; visible?: boolean }

interface Props {
  initialWishes: Wish[]
}

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
      if (!res.ok) throw new Error('Failed to submit')
      setWishes(prev => [{ name: name.trim(), message: message.trim(), visible: true }, ...prev])
      setName('')
      setMessage('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
    } catch {
      setError('Could not send your wish. Please try again.')
      setTimeout(() => setError(''), 4000)
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
    border: '1px solid rgba(184,150,46,0.5)',
    background: 'rgba(247,243,233,0.8)',
    fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem',
    color: 'var(--ink)', outline: 'none',
  }

  return (
    <div>
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.4em]" style={{ color: 'rgba(26,64,48,0.7)' }}>Leave your duʿāʾ</p>
        <h3 className="mt-3 font-display text-3xl md:text-4xl" style={{ color: 'var(--ink)' }}>Wish Wall</h3>
        <p className="mt-1 text-sm italic" style={{ color: 'rgba(26,26,46,0.6)' }}>Share a prayer or kind word for the couple</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl space-y-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          maxLength={60}
          style={inputStyle}
        />
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Your duʿāʾ or message…"
          rows={3}
          maxLength={400}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
        {error && <p className="text-sm" style={{ color: '#c0392b' }}>{error}</p>}
        {submitted && <p className="text-sm text-center" style={{ color: 'var(--emerald)' }}>✓ Your wish was sent — جزاكم الله خيرًا</p>}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 font-display text-sm uppercase tracking-[0.3em] transition-transform hover:scale-105 disabled:opacity-50"
            style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-gold)', color: 'var(--cream)' }}
          >
            <Send className="h-4 w-4" />
            {submitting ? 'Sending…' : 'Send Wish'}
          </button>
        </div>
      </form>

      <div className="mx-auto mt-10 grid max-w-2xl gap-4">
        <AnimatePresence initial={false}>
          {wishes.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm italic" style={{ color: 'rgba(26,26,46,0.5)' }}>
              Be the first to leave a blessing…
            </motion.p>
          )}
          {wishes.map((w, i) => (
            <motion.div
              key={`${w.name}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl px-5 py-4 backdrop-blur-sm"
              style={{ border: '1px solid rgba(184,150,46,0.4)', background: 'rgba(247,243,233,0.7)' }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-display text-lg" style={{ color: 'var(--emerald-deep)' }}>{w.name}</p>
              </div>
              <p className="mt-1 text-sm italic" style={{ color: 'rgba(26,26,46,0.8)' }}>{w.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

import { useState, useRef } from 'react'
import { useTemplateData, useTemplateFields } from '@farhty/template-sdk'
import { motion, useInView, AnimatePresence } from 'framer-motion'

interface WishEntry {
  name: string
  message: string
  timestamp: string
}

export default function WishWall() {
  const { slug } = useTemplateData()
  const { get } = useTemplateFields()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [localWishes, setLocalWishes] = useState<WishEntry[]>([])
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  const existingWishes: WishEntry[] = (() => {
    const raw = get('wish_entries')
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') {
      try { return JSON.parse(raw) } catch { return [] }
    }
    return []
  })()

  const allWishes = [...localWishes, ...existingWishes]

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setStatus('submitting')

    try {
      const config = await fetch('/config.json').then(r => r.json())
      const resolvedSlug = config.slug || window.location.hostname.split('.')[0]
      const apiBase = config.apiBase || 'http://localhost:3001'

      await fetch(`${apiBase}/api/instances/by-domain/wish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: resolvedSlug, name: name.trim(), message: message.trim() }),
      })

      setLocalWishes(prev => [{ name: name.trim(), message: message.trim(), timestamp: new Date().toISOString() }, ...prev])
      setName('')
      setMessage('')
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section ref={ref} className="py-24 px-6 relative overflow-hidden" style={{ background: 'oklch(0.22 0.06 155 / 0.4)' }}>
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.p
            dir="rtl"
            className="font-arabic text-2xl text-gold mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            حائط الأمنيات
          </motion.p>
          <motion.h3
            className="font-serif text-4xl md:text-5xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Wish Wall
          </motion.h3>
          <motion.p
            className="font-serif text-ivory/50 text-sm"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            Leave a message from the heart
          </motion.p>
          <motion.div
            className="mt-4 mx-auto w-48 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, oklch(0.74 0.13 80 / 0.4), transparent)' }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </div>

        {/* Form */}
        <motion.form
          onSubmit={submit}
          className="border border-gold/20 backdrop-blur-sm rounded-sm p-6 md:p-8 mb-10"
          style={{ background: 'oklch(0.18 0.05 155 / 0.6)' }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-4 py-3 bg-transparent border border-gold/30 text-ivory font-serif
                         outline-none focus:border-gold transition-colors placeholder:text-ivory/30"
            />
          </div>
          <div className="mb-4">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write your wish..."
              required
              rows={4}
              className="w-full px-4 py-3 bg-transparent border border-gold/30 text-ivory font-serif
                         outline-none focus:border-gold transition-colors placeholder:text-ivory/30 resize-none"
            />
          </div>
          <motion.button
            type="submit"
            disabled={status === 'submitting' || !name.trim() || !message.trim()}
            className="w-full py-3 text-sm tracking-[0.3em] uppercase font-serif text-emerald-deep
                       disabled:opacity-50 transition-all"
            style={{ background: 'var(--gradient-gold)' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'submitting' ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  className="w-4 h-4 border-2 border-emerald-deep/30 border-t-emerald-deep rounded-full inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Sending...
              </span>
            ) :
             status === 'success' ? 'Sent successfully!' :
             status === 'error' ? 'Error — try again' : 'Send your wish'}
          </motion.button>
        </motion.form>

        {/* Wishes grid */}
        <AnimatePresence>
          {allWishes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allWishes.map((wish, i) => (
                <motion.div
                  key={`${wish.name}-${wish.timestamp}-${i}`}
                  className="border border-gold/15 p-5 backdrop-blur-sm relative group"
                  style={{ background: 'oklch(0.18 0.05 155 / 0.4)' }}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/20
                                  group-hover:border-gold/40 transition-colors" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/20
                                  group-hover:border-gold/40 transition-colors" />

                  <p className="font-serif text-ivory/70 text-sm leading-relaxed mb-3 italic">
                    &ldquo;{wish.message}&rdquo;
                  </p>
                  <p className="text-gold/70 text-xs tracking-[0.2em] uppercase">— {wish.name}</p>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

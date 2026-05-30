import { useState, useRef } from 'react'
import { useTemplateData, useTemplateFields } from '@farhty/template-sdk'
import { motion, AnimatePresence, useInView } from 'framer-motion'

interface WishEntry {
  name: string
  message: string
  timestamp: string
}

export function WishingWall() {
  const { slug } = useTemplateData()
  const { get } = useTemplateFields()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [localWishes, setLocalWishes] = useState<WishEntry[]>([])
  const formRef = useRef<HTMLDivElement>(null)
  const inView = useInView(formRef, { once: true, margin: '0px' })

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
      const config = await fetch('/config.json')
        .then(r => r.json())
        .catch(() => ({ apiBase: 'http://localhost:3001', slug: '' }))
      const resolvedSlug = config.slug || slug || window.location.hostname.split('.')[0]
      const apiBase = config.apiBase || 'http://localhost:3001'
      await fetch(`${apiBase}/api/instances/by-domain/wish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: resolvedSlug, name: name.trim(), message: message.trim() }),
      })
      setLocalWishes(prev => [
        { name: name.trim(), message: message.trim(), timestamp: new Date().toISOString() },
        ...prev,
      ])
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
    <div ref={formRef} className="w-full space-y-8">
      {/* Form */}
      <motion.form
        onSubmit={submit}
        className="glass-card rounded-2xl p-6 md:p-8 text-right space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <div>
          <label className="block text-xs text-gold tracking-[0.3em] mb-2 font-body">
            اسمك الكريم
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="اكتب اسمك هنا"
            required
            className="w-full bg-transparent border border-gold/30 rounded-lg px-4 py-3 font-arabic text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition"
          />
        </div>

        <div>
          <label className="block text-xs text-gold tracking-[0.3em] mb-2 font-body">
            أمنيتك
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="اكتب كلمة من قلبك للعروسين…"
            required
            rows={4}
            className="w-full bg-transparent border border-gold/30 rounded-lg px-4 py-3 font-arabic text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'submitting' || !name.trim() || !message.trim()}
          className="w-full py-4 rounded-lg bg-gradient-gold text-primary-foreground font-arabic text-lg shadow-gold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition"
        >
          {status === 'submitting' ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full inline-block"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              جاري الإرسال...
            </span>
          ) : status === 'success' ? (
            'تم الإرسال بنجاح ✓'
          ) : status === 'error' ? (
            'حدث خطأ، حاول مرة أخرى'
          ) : (
            'أرسل أمنيتك'
          )}
        </button>
      </motion.form>

      {/* Wishes grid */}
      <AnimatePresence>
        {allWishes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
            {allWishes.map((wish, i) => (
              <motion.div
                key={`${wish.name}-${wish.timestamp || i}-${i}`}
                className="glass-card rounded-xl p-5 border border-gold/15 relative group"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                {/* Decorative gold corners */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/25 rounded-tr-xl group-hover:border-gold/50 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/25 rounded-bl-xl group-hover:border-gold/50 transition-colors duration-300" />

                <p className="font-arabic text-ivory/80 text-sm leading-relaxed mb-3">
                  &ldquo;{wish.message}&rdquo;
                </p>
                <p className="font-arabic text-gold/70 text-xs">— {wish.name}</p>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

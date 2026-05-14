import { useState, useEffect, useRef } from 'react'
import { useTemplateData, useTemplateFields } from '@farhty/template-sdk'
import { motion, useInView, AnimatePresence } from 'framer-motion'

interface WishEntry {
  name: string
  message: string
  timestamp: string
}

export default function WishingWall() {
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
    <section ref={ref} className="relative py-14 md:py-28 bg-gradient-to-b from-ivory via-cream/50 to-ivory overflow-hidden">
      {/* Floating dove */}
      <motion.img
        src="/dove.svg"
        alt=""
        className="absolute top-8 left-8 w-20 md:w-28 opacity-30 pointer-events-none"
        animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.img
            src="/wishing-wall-icon.svg"
            alt=""
            className="w-14 h-14 mx-auto mb-4 opacity-70"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 0.7, scale: 1 } : {}}
            transition={{ duration: 0.6, type: 'spring' }}
          />
          <motion.h2
            className="font-amiri text-espresso mb-2"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            حائط الأمنيات
          </motion.h2>
          <motion.p
            className="font-naskh text-espresso/40"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            اتركوا لنا كلمة من القلب
          </motion.p>
          <motion.div
            className="mt-4 mx-auto w-48 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A96E40, transparent)' }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </div>

        {/* Input form */}
        <motion.form
          onSubmit={submit}
          className="bg-gradient-to-b from-cream to-ivory/80 rounded-2xl p-6 border border-gold/15
                     shadow-lg mb-10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="اسمك"
              required
              className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-ivory/70 font-naskh
                         text-espresso outline-none focus:border-gold focus:ring-2 focus:ring-gold/10
                         transition-all duration-200"
            />
          </div>
          <div className="mb-4">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="اكتب أمنيتك هنا..."
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-ivory/70 font-naskh
                         text-espresso outline-none focus:border-gold focus:ring-2 focus:ring-gold/10
                         transition-all duration-200 resize-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #C9A96E15 31px, #C9A96E15 32px)',
                lineHeight: '32px',
                paddingTop: '8px',
              }}
            />
          </div>
          <motion.button
            type="submit"
            disabled={status === 'submitting' || !name.trim() || !message.trim()}
            className="w-full py-3 rounded-xl text-cream font-naskh font-semibold
                       disabled:opacity-50 transition-all duration-300 shadow-md hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #C9A96E, #B8944F)' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            {status === 'submitting' ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                جاري الإرسال...
              </span>
            ) :
             status === 'success' ? 'تم الإرسال بنجاح!' :
             status === 'error' ? 'حدث خطأ' : 'أرسل أمنيتك'}
          </motion.button>
        </motion.form>

        {/* Wishes grid */}
        <AnimatePresence>
          {allWishes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allWishes.map((wish, i) => (
                <motion.div
                  key={`${wish.name}-${wish.timestamp}-${i}`}
                  className="bg-gradient-to-br from-cream to-ivory rounded-xl p-5 border border-gold/15
                             shadow-sm hover:shadow-md transition-shadow duration-300 relative group"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  {/* Gold corner accent */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/25 rounded-tr-xl
                                  group-hover:border-gold/40 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/25 rounded-bl-xl
                                  group-hover:border-gold/40 transition-colors duration-300" />

                  <p className="font-naskh text-espresso/70 text-sm leading-relaxed mb-3">
                    &ldquo;{wish.message}&rdquo;
                  </p>
                  <p className="font-naskh text-gold/70 text-xs font-semibold">— {wish.name}</p>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

import { useState, useEffect, useRef } from 'react'
import { useTemplateData, useTemplateFields } from '@farhty/template-sdk'

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
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  const existingWishes: WishEntry[] = (() => {
    const raw = get('wish_entries')
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') {
      try { return JSON.parse(raw) } catch { return [] }
    }
    return []
  })()

  const allWishes = [...localWishes, ...existingWishes]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

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
    <section ref={ref} className="relative py-20 md:py-28 bg-ivory">
      {/* Floating dove */}
      <img
        src="/dove.svg"
        alt=""
        className="absolute top-8 left-8 w-20 md:w-28 opacity-40 pointer-events-none"
        style={{ animation: 'float 4s ease-in-out infinite' }}
      />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(-12px); }
          50% { transform: translateY(12px); }
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <img src="/wishing-wall-icon.svg" alt="" className="w-14 h-14 mx-auto mb-4 opacity-80" />
          <h2
            className="font-amiri text-espresso mb-2"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            حائط الأمنيات
          </h2>
          <p className="font-naskh text-espresso/50">اتركوا لنا كلمة من القلب</p>
          <div className="mt-4">
            <img src="/floral-divider.svg" alt="" className="w-48 mx-auto opacity-40" />
          </div>
        </div>

        {/* Input form */}
        <form
          onSubmit={submit}
          className="bg-cream rounded-2xl p-6 border border-gold/20 shadow-md mb-10
                     transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(50px)',
          }}
        >
          <div className="mb-4">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="اسمك"
              required
              className="w-full px-4 py-3 rounded-xl border border-gold/30 bg-ivory font-naskh
                         text-espresso outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="mb-4">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="اكتب أمنيتك هنا..."
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gold/30 bg-ivory font-naskh
                         text-espresso outline-none focus:border-gold transition-colors resize-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #C9A96E20 31px, #C9A96E20 32px)',
                lineHeight: '32px',
                paddingTop: '8px',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'submitting' || !name.trim() || !message.trim()}
            className="w-full py-3 rounded-xl bg-gold text-cream font-naskh font-semibold
                       hover:bg-gold/90 disabled:opacity-50 transition-all"
          >
            {status === 'submitting' ? 'جاري الإرسال...' :
             status === 'success' ? 'تم الإرسال بنجاح!' :
             status === 'error' ? 'حدث خطأ' : 'أرسل أمنيتك'}
          </button>
        </form>

        {/* Wishes grid */}
        {allWishes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allWishes.map((wish, i) => (
              <div
                key={`${wish.name}-${wish.timestamp}-${i}`}
                className="bg-cream rounded-xl p-5 border border-gold/20 shadow-sm relative
                           transition-all duration-600"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                {/* Gold corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/40 rounded-tr-xl" />
                <p className="font-naskh text-espresso/80 text-sm leading-relaxed mb-3">
                  {wish.message}
                </p>
                <p className="font-naskh text-gold text-xs font-semibold">— {wish.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

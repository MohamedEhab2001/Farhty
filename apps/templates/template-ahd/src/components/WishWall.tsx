import { useState, useEffect, useRef } from 'react'
import { useTemplateData, useTemplateFields } from '@farhty/template-sdk'

export interface WishEntry {
  name: string
  message: string
  timestamp: string
  visible?: boolean   // undefined / true = shown; false = hidden by admin
}

export default function WishWall() {
  const { slug } = useTemplateData()
  const { get } = useTemplateFields()
  const sectionRef = useRef<HTMLElement>(null)
  const [sectionVisible, setSectionVisible] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  // optimistically shown right after submit (always visible locally)
  const [localWishes, setLocalWishes] = useState<WishEntry[]>([])

  // Read stored wishes from instance field, keep only visible ones for guests
  const storedWishes: WishEntry[] = (() => {
    const raw = get('wish_entries')
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') { try { return JSON.parse(raw) } catch { return [] } }
    return []
  })()

  // Guests see: stored wishes where visible !== false + their own just-submitted ones
  const publicWishes = storedWishes.filter(w => w.visible !== false)
  const allWishes = [...localWishes, ...publicWishes]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSectionVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
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

      // Show immediately to this guest; visible defaults to true in backend
      setLocalWishes(prev => [
        { name: name.trim(), message: message.trim(), timestamp: new Date().toISOString(), visible: true },
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
    <section ref={sectionRef} id="wish-wall" className="py-24 md:py-36 bg-ivory">
      <div className="max-w-3xl mx-auto px-6">

        {/* Heading */}
        <div
          className="text-center mb-14"
          style={{
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <p className="font-tajawal font-light text-warm-gray mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            اترك رسالة
          </p>
          <h2 className="font-amiri italic font-light text-charcoal mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            تهانٍ وأمنيات
          </h2>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '0 auto' }} />
        </div>

        {/* Form */}
        <form
          onSubmit={submit}
          className="mb-16 pb-16"
          style={{
            borderBottom: '1px solid rgba(196,163,90,0.15)',
            opacity: sectionVisible ? 1 : 0,
            transform: sectionVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1) 0.1s',
          }}
        >
          <div className="space-y-8">
            <div>
              <label className="block font-tajawal font-light text-warm-gray mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                اسمك
              </label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                required placeholder="أدخل اسمك" className="ahd-input"
              />
            </div>
            <div>
              <label className="block font-tajawal font-light text-warm-gray mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                رسالتك
              </label>
              <textarea
                value={message} onChange={e => setMessage(e.target.value)}
                required rows={4} placeholder="اكتب أمنيتك هنا..."
                style={{
                  background: 'transparent', border: 'none',
                  borderBottom: '1px solid var(--warm-gray)', borderRadius: 0,
                  outline: 'none', width: '100%', padding: '10px 0',
                  fontFamily: 'Tajawal, sans-serif', fontWeight: 300,
                  fontSize: '0.95rem', color: 'var(--charcoal)', resize: 'none',
                  transition: 'border-color 0.3s ease', direction: 'rtl',
                }}
                onFocus={e => e.target.style.borderBottomColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderBottomColor = 'var(--warm-gray)'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'submitting' || !name.trim() || !message.trim()}
              style={{
                padding: '0.9rem 2.5rem', borderRadius: '999px',
                background: 'var(--navy)', color: '#F5E6C8',
                fontFamily: 'Tajawal, sans-serif', fontWeight: 300,
                fontSize: '0.85rem', border: 'none',
                cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                opacity: !name.trim() || !message.trim() ? 0.45 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              {status === 'submitting' ? 'جاري الإرسال...'
               : status === 'success'  ? 'تم الإرسال ✓'
               : status === 'error'    ? 'خطأ — حاول مرة أخرى'
               : 'أرسل أمنيتك'}
            </button>
          </div>
        </form>

        {/* Wish cards */}
        {allWishes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allWishes.map((wish, i) => (
              <div
                key={`${wish.name}-${wish.timestamp ?? i}-${i}`}
                style={{
                  background: 'white', padding: '2rem',
                  boxShadow: '0 1px 16px rgba(0,0,0,0.05)',
                  opacity: sectionVisible ? 1 : 0,
                  transform: sectionVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `all 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s`,
                }}
              >
                <p className="font-amiri italic text-gold mb-3" style={{ fontSize: '2rem', lineHeight: 1, opacity: 0.6 }}>"</p>
                <p className="font-tajawal font-light text-charcoal/75 leading-relaxed mb-5" style={{ fontSize: '0.9rem', lineHeight: 1.9 }}>
                  {wish.message}
                </p>
                <p className="font-tajawal font-light text-warm-gray" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                  — {wish.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {allWishes.length === 0 && (
          <p className="text-center font-tajawal font-light text-warm-gray" style={{ fontSize: '0.85rem', opacity: 0.6 }}>
            كن أول من يترك أمنية.
          </p>
        )}

      </div>
    </section>
  )
}

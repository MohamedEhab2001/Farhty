import { useState, useEffect, useRef } from 'react'
import { useTemplateData, useTemplateFields } from '@farhty/template-sdk'

interface WishEntry {
  name: string
  message: string
  timestamp: string
}

export default function WishWall() {
  const { slug } = useTemplateData()
  const { get } = useTemplateFields()
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [localWishes, setLocalWishes] = useState<WishEntry[]>([])

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
        body: JSON.stringify({
          slug: resolvedSlug,
          name: name.trim(),
          message: message.trim(),
        }),
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
    <section
      ref={sectionRef}
      id="wish-wall"
      className="py-24 md:py-36 bg-ivory"
    >
      <div className="max-w-3xl mx-auto px-6">

        {/* Heading */}
        <div
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <p
            className="font-body uppercase tracking-[0.3em] text-warm-gray mb-3"
            style={{ fontSize: '0.62rem' }}
          >
            Leave a Message
          </p>
          <h2
            className="font-display italic font-light text-charcoal mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            Wishes &amp; Blessings
          </h2>
          <div
            style={{
              width: '40px',
              height: '1px',
              background: 'var(--gold)',
              margin: '0 auto',
            }}
          />
        </div>

        {/* Input form */}
        <form
          onSubmit={submit}
          className="mb-16 pb-16"
          style={{
            borderBottom: '1px solid rgba(196,163,90,0.15)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1) 0.1s',
          }}
        >
          <div className="space-y-8">
            <div>
              <label
                className="block font-body uppercase tracking-[0.2em] text-warm-gray mb-2"
                style={{ fontSize: '0.6rem' }}
              >
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="ahd-input"
              />
            </div>

            <div>
              <label
                className="block font-body uppercase tracking-[0.2em] text-warm-gray mb-2"
                style={{ fontSize: '0.6rem' }}
              >
                Your Message
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={4}
                placeholder="Write your wish here..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--warm-gray)',
                  borderRadius: 0,
                  outline: 'none',
                  width: '100%',
                  padding: '10px 0',
                  fontFamily: 'Jost, sans-serif',
                  fontWeight: 300,
                  fontSize: '0.95rem',
                  color: 'var(--charcoal)',
                  resize: 'none',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={e => e.target.style.borderBottomColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderBottomColor = 'var(--warm-gray)'}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting' || !name.trim() || !message.trim()}
              style={{
                padding: '0.9rem 2.5rem',
                borderRadius: '999px',
                background: 'var(--navy)',
                color: '#F5E6C8',
                fontFamily: 'Jost, sans-serif',
                fontWeight: 300,
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                opacity: !name.trim() || !message.trim() ? 0.45 : 1,
                transition: 'opacity 0.3s ease',
              }}
            >
              {status === 'submitting' ? 'Sending...'
               : status === 'success'   ? 'Sent ✓'
               : status === 'error'     ? 'Error — Try Again'
               : 'Send Wish'}
            </button>
          </div>
        </form>

        {/* Wishes grid */}
        {allWishes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allWishes.map((wish, i) => (
              <div
                key={`${wish.name}-${wish.timestamp}-${i}`}
                style={{
                  background: 'white',
                  padding: '2rem',
                  boxShadow: '0 1px 16px rgba(0,0,0,0.05)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(24px)',
                  transition: `all 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s`,
                }}
              >
                {/* Quote mark */}
                <p
                  className="font-display italic text-gold mb-3"
                  style={{ fontSize: '2rem', lineHeight: 1, opacity: 0.6 }}
                >
                  "
                </p>
                <p
                  className="font-body font-light text-charcoal/75 leading-relaxed mb-5"
                  style={{ fontSize: '0.9rem', lineHeight: 1.8 }}
                >
                  {wish.message}
                </p>
                <p
                  className="font-body uppercase tracking-[0.2em] text-warm-gray"
                  style={{ fontSize: '0.6rem' }}
                >
                  — {wish.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {allWishes.length === 0 && (
          <p
            className="text-center font-body font-light text-warm-gray"
            style={{ fontSize: '0.85rem', opacity: 0.6 }}
          >
            Be the first to leave a wish.
          </p>
        )}

      </div>
    </section>
  )
}

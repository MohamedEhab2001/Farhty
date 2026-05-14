import { useState, useEffect, useRef } from 'react'
import { useTemplateData } from '@farhty/template-sdk'

export default function RSVPSection() {
  const { slug } = useTemplateData()
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState('')
  const [guests, setGuests] = useState(1)
  const [attending, setAttending] = useState<boolean | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const alreadySubmitted = localStorage.getItem(`farhty_rsvp_submitted_${slug}`)

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
    if (!name.trim() || attending === null) return
    setStatus('submitting')
    try {
      const config = await fetch('/config.json').then(r => r.json())
      const resolvedSlug = config.slug || window.location.hostname.split('.')[0]
      const apiBase = config.apiBase || 'http://localhost:3001'
      await fetch(`${apiBase}/api/instances/by-domain/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: resolvedSlug, name: name.trim(), attending, guests: attending ? guests : 0 }),
      })
      localStorage.setItem(`farhty_rsvp_submitted_${resolvedSlug}`, 'true')
      setStatus('success')
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section ref={sectionRef} id="rsvp" className="rsvp-bg py-14 md:py-36">
      <div className="max-w-xl mx-auto px-6">

        <div
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {/* <p className="font-tajawal font-light text-warm-gray mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            يُرجى الرد بحلول الموعد المحدد
          </p> */}
          <h2 className="font-amiri italic font-light text-charcoal mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            هل ستحضر معنا؟
          </h2>
          <div style={{ width: '40px', height: '1px', background: 'var(--gold)', margin: '0 auto' }} />
        </div>

        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 1s cubic-bezier(0.22,1,0.36,1) 0.15s' }}>
          {alreadySubmitted || status === 'success' ? (
            <div className="text-center py-12">
              <div className="mx-auto mb-6 flex items-center justify-center" style={{ width: '56px', height: '56px', border: '1px solid var(--gold)', borderRadius: '50%' }}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: '22px', height: '22px' }}>
                  <path d="M5 13l4 4L19 7" stroke="#C4A35A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-amiri italic font-light text-charcoal" style={{ fontSize: '1.5rem' }}>شكرًا لك.</p>
              <p className="font-tajawal font-light text-warm-gray mt-2" style={{ fontSize: '0.85rem' }}>تم تسجيل ردك بنجاح.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-10">

              <div>
                <label className="block font-tajawal font-light text-warm-gray mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                  الاسم الكامل
                </label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="أدخل اسمك" className="ahd-input" />
              </div>

              <div>
                <label className="block font-tajawal font-light text-warm-gray mb-4" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                  الحضور
                </label>
                <div className="flex gap-4">
                  {[
                    { val: true, label: 'بكل سرور' },
                    { val: false, label: 'مع الأسف' },
                  ].map(opt => (
                    <button
                      key={String(opt.val)}
                      type="button"
                      onClick={() => setAttending(opt.val)}
                      className="flex-1 py-3 font-tajawal font-light text-sm uppercase transition-all duration-300 min-h-[48px]"
                      style={{
                        border: attending === opt.val
                          ? `1px solid ${opt.val ? 'var(--gold)' : 'var(--charcoal)'}`
                          : '1px solid #D5C9B8',
                        color: attending === opt.val
                          ? (opt.val ? 'var(--gold)' : 'var(--charcoal)')
                          : 'var(--warm-gray)',
                        background: attending === opt.val && opt.val ? 'rgba(196,163,90,0.05)' : 'transparent',
                        fontSize: '0.8rem',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {attending === true && (
                <div>
                  <label className="block font-tajawal font-light text-warm-gray mb-2" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                    عدد الحضور
                  </label>
                  <select value={guests} onChange={e => setGuests(Number(e.target.value))} className="ahd-input" style={{ cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'ضيف' : 'ضيوف'}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting' || !name.trim() || attending === null}
                  style={{
                    display: 'block', width: '100%', padding: '1rem 2rem',
                    borderRadius: '999px', background: 'var(--navy)',
                    color: '#F5E6C8', fontFamily: 'Tajawal, sans-serif',
                    fontWeight: 300, fontSize: '0.9rem', border: 'none',
                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                    opacity: status === 'submitting' || !name.trim() || attending === null ? 0.5 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {status === 'submitting' ? 'جاري الإرسال...' : 'إرسال الرد'}
                </button>
                {status === 'error' && (
                  <p className="text-center mt-4 font-tajawal font-light text-warm-gray" style={{ fontSize: '0.8rem' }}>
                    حدث خطأ، حاول مرة أخرى.
                  </p>
                )}
              </div>

            </form>
          )}
        </div>
      </div>
    </section>
  )
}

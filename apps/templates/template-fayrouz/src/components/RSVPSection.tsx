import { useState, useEffect, useRef } from 'react'
import { useTemplateData } from '@farhty/template-sdk'

export default function RSVPSection() {
  const { slug } = useTemplateData()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [guests, setGuests] = useState(1)
  const [attending, setAttending] = useState(true)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  const alreadySubmitted = localStorage.getItem(`farhty_rsvp_submitted_${slug}`)

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
    if (!name.trim()) return
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
    <section ref={ref} className="relative py-20 md:py-28" style={{ backgroundColor: '#F0D5C0' }}>
      <div className="max-w-lg mx-auto px-4">
        {/* Envelope icon */}
        <div className="flex justify-center mb-6">
          <img src="/rsvp-envelope.svg" alt="" className="w-16 h-16 opacity-80" />
        </div>

        <div
          className="bg-cream rounded-3xl p-6 md:p-10 border border-gold/30 shadow-xl relative overflow-hidden
                     transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(80px)',
          }}
        >
          {/* Corner ornaments */}
          <img src="/corner-floral.svg" alt="" className="absolute top-2 right-2 w-16 opacity-30" />
          <img src="/corner-floral.svg" alt="" className="absolute bottom-2 left-2 w-16 opacity-30 rotate-180" />

          <h2
            className="font-amiri text-center text-espresso mb-8"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}
          >
            هل ستحضر معنا؟
          </h2>

          {alreadySubmitted || status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-amiri text-xl text-espresso">شكرًا لتأكيدك!</p>
              <p className="font-naskh text-espresso/50 mt-2 text-sm">تم تسجيل ردّك بنجاح</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block font-naskh text-sm text-espresso/70 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gold/30 bg-ivory font-naskh
                             text-espresso outline-none focus:border-gold transition-colors"
                  placeholder="أدخل اسمك"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-naskh text-sm text-espresso/70 mb-1">رقم الهاتف</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl border border-gold/30 bg-ivory font-naskh
                             text-espresso outline-none focus:border-gold transition-colors"
                  placeholder="01xxxxxxxxx"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block font-naskh text-sm text-espresso/70 mb-1">عدد الحضور</label>
                <select
                  value={guests}
                  onChange={e => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gold/30 bg-ivory font-naskh
                             text-espresso outline-none focus:border-gold transition-colors"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Attending toggle */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAttending(true)}
                  className={`flex-1 py-3 rounded-xl font-naskh font-semibold transition-all
                    ${attending
                      ? 'bg-gold text-cream shadow-md'
                      : 'bg-transparent border-2 border-gold/40 text-espresso/60'
                    }`}
                >
                  حضور
                </button>
                <button
                  type="button"
                  onClick={() => setAttending(false)}
                  className={`flex-1 py-3 rounded-xl font-naskh font-semibold transition-all
                    ${!attending
                      ? 'bg-mahogany text-cream shadow-md'
                      : 'bg-transparent border-2 border-gold/40 text-espresso/60'
                    }`}
                >
                  اعتذار
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting' || !name.trim()}
                className="w-full py-4 rounded-xl bg-gradient-to-l from-gold to-[#E8C85A] text-espresso
                           font-naskh font-bold text-lg shadow-lg hover:shadow-xl
                           disabled:opacity-50 transition-all relative overflow-hidden"
              >
                {status === 'submitting' ? 'جاري الإرسال...' : 'تأكيد الحضور'}
              </button>

              {status === 'error' && (
                <p className="text-center text-red-600 font-naskh text-sm">حدث خطأ، حاول مرة أخرى</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

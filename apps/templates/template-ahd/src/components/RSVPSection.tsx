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
        body: JSON.stringify({
          slug: resolvedSlug,
          name: name.trim(),
          attending,
          guests: attending ? guests : 0,
        }),
      })

      localStorage.setItem(`farhty_rsvp_submitted_${resolvedSlug}`, 'true')
      setStatus('success')
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="rsvp"
      className="rsvp-bg py-24 md:py-36"
    >
      <div className="max-w-xl mx-auto px-6">

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
            Kindly Reply By
          </p>
          <h2
            className="font-display italic font-light text-charcoal mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            Will You Join Us?
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

        {/* Form / Success */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1) 0.15s',
          }}
        >
          {alreadySubmitted || status === 'success' ? (
            <div className="text-center py-12">
              <div
                className="mx-auto mb-6 flex items-center justify-center"
                style={{
                  width: '56px',
                  height: '56px',
                  border: '1px solid var(--gold)',
                  borderRadius: '50%',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" style={{ width: '22px', height: '22px' }}>
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#C4A35A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                className="font-display italic font-light text-charcoal"
                style={{ fontSize: '1.5rem' }}
              >
                Thank you.
              </p>
              <p
                className="font-body font-light text-warm-gray mt-2"
                style={{ fontSize: '0.85rem', letterSpacing: '0.08em' }}
              >
                Your response has been recorded.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-10">

              {/* Full Name */}
              <div>
                <label
                  className="block font-body uppercase tracking-[0.2em] text-warm-gray mb-2"
                  style={{ fontSize: '0.6rem' }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="ahd-input"
                />
              </div>

              {/* Attendance */}
              <div>
                <label
                  className="block font-body uppercase tracking-[0.2em] text-warm-gray mb-4"
                  style={{ fontSize: '0.6rem' }}
                >
                  Attendance
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className="flex-1 py-3 font-body font-light text-sm tracking-widest uppercase transition-all duration-300"
                    style={{
                      border: attending === true
                        ? '1px solid var(--gold)'
                        : '1px solid #D5C9B8',
                      color: attending === true ? 'var(--gold)' : 'var(--warm-gray)',
                      background: attending === true ? 'rgba(196,163,90,0.05)' : 'transparent',
                      letterSpacing: '0.15em',
                      fontSize: '0.7rem',
                    }}
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className="flex-1 py-3 font-body font-light text-sm tracking-widest uppercase transition-all duration-300"
                    style={{
                      border: attending === false
                        ? '1px solid var(--charcoal)'
                        : '1px solid #D5C9B8',
                      color: attending === false ? 'var(--charcoal)' : 'var(--warm-gray)',
                      background: 'transparent',
                      letterSpacing: '0.15em',
                      fontSize: '0.7rem',
                    }}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {/* Number of guests — only if attending */}
              {attending === true && (
                <div>
                  <label
                    className="block font-body uppercase tracking-[0.2em] text-warm-gray mb-2"
                    style={{ fontSize: '0.6rem' }}
                  >
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={e => setGuests(Number(e.target.value))}
                    className="ahd-input"
                    style={{ cursor: 'pointer' }}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'submitting' || !name.trim() || attending === null}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '1rem 2rem',
                    borderRadius: '999px',
                    background: 'var(--navy)',
                    color: '#F5E6C8',
                    fontFamily: 'Jost, sans-serif',
                    fontWeight: 300,
                    fontSize: '0.75rem',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    border: 'none',
                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                    opacity: status === 'submitting' || !name.trim() || attending === null ? 0.5 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Reply'}
                </button>

                {status === 'error' && (
                  <p
                    className="text-center mt-4 font-body font-light text-warm-gray"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Something went wrong. Please try again.
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

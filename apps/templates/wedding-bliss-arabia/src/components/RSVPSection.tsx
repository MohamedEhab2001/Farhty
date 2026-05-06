import { useState, useEffect, useRef } from 'react'
import { useTemplateData } from '@farhty/template-sdk'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import ornament from '../assets/ornament-bg.jpg'
import divider from '../assets/divider.png'

export default function RSVPSection() {
  const { slug } = useTemplateData()
  const [name, setName] = useState('')
  const [guests, setGuests] = useState(1)
  const [attending, setAttending] = useState(true)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  useEffect(() => {
    setAlreadySubmitted(!!localStorage.getItem(`farhty_rsvp_submitted_${slug}`))
  }, [slug])

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
      setAlreadySubmitted(true)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section ref={ref} className="py-32 px-6 text-center relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: `url(${ornament})`, backgroundSize: '500px' }}
      />

      <div className="relative max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p dir="rtl" className="font-arabic text-2xl text-gold mb-4">
            نتشرف بحضوركم
          </p>
          <h3 className="font-serif text-5xl md:text-6xl mb-8">
            Kindly Respond
          </h3>
          <motion.img
            src={divider}
            alt=""
            loading="lazy"
            initial={{ opacity: 0, scaleX: 0.4 }}
            whileInView={{ opacity: 0.9, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="mx-auto h-12 md:h-16 w-auto mb-8"
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {alreadySubmitted || status === 'success' ? (
            <motion.div
              key="success"
              className="py-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border border-gold/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <p className="font-serif text-2xl text-ivory/90">Thank you!</p>
              <p className="font-serif text-ivory/50 mt-2 text-sm">Your response has been recorded</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              className="space-y-5 text-left"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Name */}
              <div>
                <label className="block text-xs tracking-[0.3em] uppercase text-ivory/50 mb-2">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-transparent border border-gold/30 text-ivory font-serif
                             outline-none focus:border-gold transition-colors placeholder:text-ivory/30"
                  placeholder="Enter your name"
                />
              </div>

              {/* Guests */}
              <div>
                <label className="block text-xs tracking-[0.3em] uppercase text-ivory/50 mb-2">Number of Guests</label>
                <select
                  value={guests}
                  onChange={e => setGuests(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-emerald-deep border border-gold/30 text-ivory font-serif
                             outline-none focus:border-gold transition-colors"
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
                  className={`flex-1 py-3 text-sm tracking-[0.3em] uppercase font-serif transition-all
                    ${attending
                      ? 'bg-gold text-emerald-deep'
                      : 'border border-gold/30 text-ivory/50 hover:border-gold/60'
                    }`}
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => setAttending(false)}
                  className={`flex-1 py-3 text-sm tracking-[0.3em] uppercase font-serif transition-all
                    ${!attending
                      ? 'bg-ivory/20 text-ivory'
                      : 'border border-gold/30 text-ivory/50 hover:border-gold/60'
                    }`}
                >
                  Decline
                </button>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={status === 'submitting' || !name.trim()}
                className="w-full py-4 text-sm tracking-[0.4em] uppercase text-emerald-deep font-semibold
                           disabled:opacity-50 transition-all"
                style={{
                  background: 'var(--gradient-gold)',
                  boxShadow: 'var(--shadow-gold)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {status === 'submitting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      className="w-4 h-4 border-2 border-emerald-deep/30 border-t-emerald-deep rounded-full inline-block"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Submitting...
                  </span>
                ) : 'Confirm Attendance'}
              </motion.button>

              <AnimatePresence>
                {status === 'error' && (
                  <motion.p
                    className="text-center text-red-400 text-sm bg-red-400/10 py-2 rounded"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Something went wrong, please try again
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

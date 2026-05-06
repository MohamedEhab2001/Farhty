import { useState, useEffect, useRef } from 'react'
import { useTemplateData } from '@farhty/template-sdk'
import { motion, useInView, AnimatePresence } from 'framer-motion'

export default function RSVPSection() {
  const { slug } = useTemplateData()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
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
    <section
      ref={ref}
      className="relative py-20 md:py-28 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #F5E6D5 0%, #F0D5C0 40%, #EBCBB0 100%)',
      }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232C1A0E'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-lg mx-auto px-4 relative z-10">
        {/* Envelope icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src="/rsvp-envelope.svg"
            alt=""
            className="w-16 h-16 opacity-70"
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.div
          className="bg-gradient-to-b from-cream to-ivory rounded-3xl p-6 md:p-10 border border-gold/20
                     shadow-2xl relative overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.15, type: 'spring', stiffness: 80 }}
        >
          {/* Corner ornaments */}
          <img src="/corner-floral.svg" alt="" className="absolute top-2 right-2 w-16 opacity-20" />
          <img src="/corner-floral.svg" alt="" className="absolute bottom-2 left-2 w-16 opacity-20 rotate-180" />

          <h2
            className="font-amiri text-center text-espresso mb-8"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}
          >
            هل ستحضر معنا؟
          </h2>

          <AnimatePresence mode="wait">
            {alreadySubmitted || status === 'success' ? (
              <motion.div
                key="success"
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.2), rgba(201,169,110,0.1))' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <p className="font-amiri text-xl text-espresso">شكرًا لتأكيدك!</p>
                <p className="font-naskh text-espresso/40 mt-2 text-sm">تم تسجيل ردّك بنجاح</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Name */}
                <div>
                  <label className="block font-naskh text-sm text-espresso/60 mb-1.5">الاسم الكامل</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-ivory/70 font-naskh
                               text-espresso outline-none focus:border-gold focus:ring-2 focus:ring-gold/10
                               transition-all duration-200"
                    placeholder="أدخل اسمك"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-naskh text-sm text-espresso/60 mb-1.5">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-ivory/70 font-naskh
                               text-espresso outline-none focus:border-gold focus:ring-2 focus:ring-gold/10
                               transition-all duration-200"
                    placeholder="01xxxxxxxxx"
                  />
                </div>

                {/* Guests */}
                <div>
                  <label className="block font-naskh text-sm text-espresso/60 mb-1.5">عدد الحضور</label>
                  <select
                    value={guests}
                    onChange={e => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gold/20 bg-ivory/70 font-naskh
                               text-espresso outline-none focus:border-gold focus:ring-2 focus:ring-gold/10
                               transition-all duration-200"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                {/* Attending toggle */}
                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`flex-1 py-3 rounded-xl font-naskh font-semibold transition-all duration-300
                      ${attending
                        ? 'text-cream shadow-lg'
                        : 'bg-transparent border border-gold/30 text-espresso/50 hover:border-gold/50'
                      }`}
                    style={attending ? { background: 'linear-gradient(135deg, #C9A96E, #B8944F)' } : {}}
                    whileTap={{ scale: 0.97 }}
                  >
                    حضور
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`flex-1 py-3 rounded-xl font-naskh font-semibold transition-all duration-300
                      ${!attending
                        ? 'text-cream shadow-lg'
                        : 'bg-transparent border border-gold/30 text-espresso/50 hover:border-gold/50'
                      }`}
                    style={!attending ? { background: 'linear-gradient(135deg, #8B6350, #6B4A38)' } : {}}
                    whileTap={{ scale: 0.97 }}
                  >
                    اعتذار
                  </motion.button>
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={status === 'submitting' || !name.trim()}
                  className="w-full py-4 rounded-xl text-cream font-naskh font-bold text-lg
                             shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #C9A96E 0%, #E8C85A 50%, #C9A96E 100%)',
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        className="w-5 h-5 border-2 border-cream/30 border-t-cream rounded-full inline-block"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      جاري الإرسال...
                    </span>
                  ) : 'تأكيد الحضور'}
                </motion.button>

                <AnimatePresence>
                  {status === 'error' && (
                    <motion.p
                      className="text-center text-red-600 font-naskh text-sm bg-red-50 py-2 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      حدث خطأ، حاول مرة أخرى
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

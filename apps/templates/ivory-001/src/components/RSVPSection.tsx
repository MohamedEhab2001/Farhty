import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface RSVPSectionProps {
  instanceId: string
  accentColor: string
}

interface RSVPEntry {
  name: string
  attendance: boolean
  guests: number
  timestamp: string
}

export default function RSVPSection({ accentColor }: RSVPSectionProps) {
  const [name, setName] = useState('')
  const [attendance, setAttendance] = useState<'yes' | 'no' | ''>('')
  const [guests, setGuests] = useState('1')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)

  useEffect(() => {
    const key = `farhty_rsvp_submitted`
    if (localStorage.getItem(key)) {
      setAlreadySubmitted(true)
      setSubmitted(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !attendance) return

    setLoading(true)
    setError('')

    try {
      const config = await fetch('/config.json').then(r => r.json())
      const apiBase = config.apiBase || 'http://localhost:3001'
      const slug = config.slug || window.location.hostname.split('.')[0]
      const token = localStorage.getItem(`farhty_token_${slug}`)
      if (!token) { setError('يجب تسجيل الدخول أولاً'); return }

      const entry: RSVPEntry = {
        name: name.trim(),
        attendance: attendance === 'yes',
        guests: attendance === 'yes' ? parseInt(guests) || 1 : 0,
        timestamp: new Date().toISOString(),
      }

      const existingRes = await fetch(`${apiBase}/api/instances/by-domain?slug=${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const existingData = await existingRes.json()
      const currentEntries: RSVPEntry[] = existingData.data?.rsvp_entries ?? []

      const updatedData = { ...existingData.data, rsvp_entries: [...currentEntries, entry] }

      const res = await fetch(`${apiBase}/api/instances/${existingData.instanceId}/data`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Host: window.location.hostname,
        },
        body: JSON.stringify(updatedData),
      })

      if (!res.ok) throw new Error('فشل الإرسال')

      localStorage.setItem('farhty_rsvp_submitted', 'true')
      setSubmitted(true)
    } catch {
      setError('حدث خطأ. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="py-20 px-4" style={{ background: '#fefdfb' }}>
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-2xl"
            style={{ background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}05)` }}
          >
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: accentColor }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-2xl font-bold mb-2" style={{ color: accentColor }}>
              {alreadySubmitted ? 'تم تأكيد حضورك مسبقاً' : 'شكراً لتأكيدك!'}
            </h3>
            <p className="font-body text-sm" style={{ color: '#7a6650' }}>
              ننتظر حضورك بكل شوق
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4" style={{ background: '#fefdfb' }}>
      <div className="max-w-md mx-auto">
        <motion.h2
          className="font-display text-3xl sm:text-4xl font-bold text-center mb-3"
          style={{ color: accentColor }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          تأكيد الحضور
        </motion.h2>
        <motion.div
          className="w-16 h-px mx-auto mb-10"
          style={{ backgroundColor: accentColor, opacity: 0.5 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
        />

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <label className="block font-body text-sm mb-2" style={{ color: '#7a6650' }}>الاسم</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="اسمك الكريم"
              className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-all duration-200"
              style={{ backgroundColor: `${accentColor}08`, border: `1px solid ${accentColor}25`, color: '#3d2e1e' }}
              required
            />
          </div>

          <div>
            <label className="block font-body text-sm mb-2" style={{ color: '#7a6650' }}>هل ستحضر؟</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAttendance('yes')}
                className="flex-1 py-3 rounded-xl font-body text-sm font-bold transition-all duration-200"
                style={{
                  backgroundColor: attendance === 'yes' ? accentColor : `${accentColor}08`,
                  color: attendance === 'yes' ? '#fff' : '#3d2e1e',
                  border: `1px solid ${attendance === 'yes' ? accentColor : `${accentColor}25`}`,
                }}
              >
                نعم، سأحضر
              </button>
              <button
                type="button"
                onClick={() => setAttendance('no')}
                className="flex-1 py-3 rounded-xl font-body text-sm font-bold transition-all duration-200"
                style={{
                  backgroundColor: attendance === 'no' ? '#8e6e3a' : `${accentColor}08`,
                  color: attendance === 'no' ? '#fff' : '#3d2e1e',
                  border: `1px solid ${attendance === 'no' ? '#8e6e3a' : `${accentColor}25`}`,
                }}
              >
                أعتذر
              </button>
            </div>
          </div>

          {attendance === 'yes' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="block font-body text-sm mb-2" style={{ color: '#7a6650' }}>عدد الضيوف</label>
              <select
                value={guests}
                onChange={e => setGuests(e.target.value)}
                className="w-full px-4 py-3 rounded-xl font-body text-sm outline-none"
                style={{ backgroundColor: `${accentColor}08`, border: `1px solid ${accentColor}25`, color: '#3d2e1e' }}
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </motion.div>
          )}

          {error && <p className="text-center font-body text-sm" style={{ color: '#e53e3e' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading || !name.trim() || !attendance}
            className="w-full py-4 rounded-xl font-body font-bold text-lg transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              color: '#fff',
              border: 'none',
              cursor: loading || !name.trim() || !attendance ? 'not-allowed' : 'pointer',
              opacity: loading || !name.trim() || !attendance ? 0.6 : 1,
            }}
          >
            {loading ? 'جاري الإرسال...' : 'تأكيد الحضور'}
          </button>
        </motion.form>
      </div>
    </section>
  )
}
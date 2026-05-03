import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTemplateData } from '@farhty/template-sdk'
import { RoseLargeSVG, DividerSVG } from './Decorations'

export default function RSVPSection() {
  const { instance } = useTemplateData()
  const [name, setName] = useState('')
  const [attending, setAttending] = useState<'yes' | 'no' | ''>('')
  const [guests, setGuests] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const slug = instance?.slug ?? ''
  const rsvpKey = `farhty_rsvp_submitted_${slug}`

  if (typeof window !== 'undefined' && localStorage.getItem(rsvpKey)) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-blush-50 to-blush-100/30 relative overflow-hidden">
        <RoseLargeSVG className="absolute top-0 left-0 w-[250px] h-[250px] opacity-[0.06]" />
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-blush-200/50 p-8 shadow-sm">
            <span className="text-4xl mb-4 block">&#x1F338;</span>
            <p className="font-amiri text-2xl text-blush-800">نورتمونا</p>
          </div>
        </div>
      </section>
    )
  }

  const handleSubmit = async () => {
    if (!name || !attending) return
    setLoading(true)

    try {
      const config = await fetch('/config.json').then(r => r.json())
      const currentSlug = config.slug || window.location.hostname.split('.')[0]
      const token = localStorage.getItem(`farhty_token_${currentSlug}`)

      const res = await fetch(`${config.apiBase}/api/instances/by-domain?slug=${currentSlug}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const current = await res.json()

      await fetch(`${config.apiBase}/api/instances/${current.instanceId}/data`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...current.data,
          rsvp_entries: [
            ...(Array.isArray(current.data.rsvp_entries) ? current.data.rsvp_entries : []),
            { name, attending: attending === 'yes', guests: attending === 'yes' ? guests : 0, timestamp: new Date().toISOString() }
          ]
        })
      })

      localStorage.setItem(rsvpKey, 'true')
      setSubmitted(true)
    } catch {
      alert('حدث خطأ. حاول مرة أخرى.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-blush-50 to-blush-100/30 relative overflow-hidden">
        <RoseLargeSVG className="absolute top-0 right-0 w-[250px] h-[250px] opacity-[0.06]" />
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-blush-200/50 p-8 shadow-sm">
            <span className="text-4xl mb-4 block">&#x1F338;</span>
            <p className="font-amiri text-2xl text-blush-800">
              {attending === 'yes' ? 'نورتمونا &#x1F338;' : 'نتمنى لكم وقتاً جميلاً'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blush-50 to-blush-100/30 relative overflow-hidden">
      <RoseLargeSVG className="absolute top-0 right-0 w-[250px] h-[250px] opacity-[0.06]" />
      <RoseLargeSVG className="absolute bottom-0 left-0 w-[200px] h-[200px] opacity-[0.05]" />

      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="font-amiri text-2xl md:text-3xl text-blush-800 mb-2">تأكيد الحضور</h2>
          <DividerSVG className="w-32 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl border border-blush-200/50 p-6 shadow-sm"
        >
          <div className="mb-5">
            <label className="font-tajawal text-blush-600 text-sm block mb-2">الاسم</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-blush-50 border border-blush-200 rounded-xl px-4 py-3 font-tajawal text-blush-900 placeholder-blush-300 focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold/30 transition-all"
              placeholder="اسمك الكريم"
            />
          </div>

          <div className="mb-5">
            <label className="font-tajawal text-blush-600 text-sm block mb-3">هل ستحضر؟</label>
            <div className="flex gap-3">
              <button
                onClick={() => setAttending('yes')}
                className={`flex-1 py-3 rounded-xl font-tajawal text-sm border transition-all duration-300 ${
                  attending === 'yes'
                    ? 'bg-blush-400 text-white border-blush-400 shadow-md'
                    : 'bg-white/50 text-blush-600 border-blush-200 hover:border-blush-300'
                }`}
              >
                سأحضر بكل سرور
              </button>
              <button
                onClick={() => setAttending('no')}
                className={`flex-1 py-3 rounded-xl font-tajawal text-sm border transition-all duration-300 ${
                  attending === 'no'
                    ? 'bg-blush-400 text-white border-blush-400 shadow-md'
                    : 'bg-white/50 text-blush-600 border-blush-200 hover:border-blush-300'
                }`}
              >
                أعتذر عن الحضور
              </button>
            </div>
          </div>

          {attending === 'yes' && (
            <div className="mb-5">
              <label className="font-tajawal text-blush-600 text-sm block mb-2">عدد الضيوف</label>
              <input
                type="number"
                min={1}
                max={10}
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
                className="w-full bg-blush-50 border border-blush-200 rounded-xl px-4 py-3 font-tajawal text-blush-900 focus:outline-none focus:border-rose-gold focus:ring-1 focus:ring-rose-gold/30 transition-all"
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!name || !attending || loading}
            className="w-full py-3 rounded-xl font-amiri text-lg bg-gradient-to-l from-blush-400 to-rose-gold text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الإرسال...' : 'تأكيد'}
          </button>
        </motion.div>
      </div>
    </section>
  )
}
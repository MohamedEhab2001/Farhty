import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useTemplateData, useTemplateFields } from '@farhty/template-sdk'
import { HeartSnow } from './HeartSnow'
import { Ornament } from './invitation/Ornament'
import { Reveal } from './invitation/Reveal'
import seaHero        from '../assets/sea-hero.jpg'
import florals        from '../assets/florals.jpg'
import venueImg       from '../assets/venue.jpg'
import gateOpeningMp4 from '../assets/gate-opening.mp4'

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
async function getConfig(): Promise<{ slug: string; apiBase: string }> {
  const cfg = await fetch('/config.json').then(r => r.json()).catch(() => ({}))
  return {
    slug:    cfg.slug    || window.location.hostname.split('.')[0],
    apiBase: cfg.apiBase || 'http://localhost:3001',
  }
}

function pad(n: number) { return String(n).padStart(2, '0') }

/* ─── Stars overlay (intro screen) ────────────────────────────────────────── */
function Stars() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const stars = useMemo(
    () => Array.from({ length: 28 }, () => ({
      w: 2 + Math.random() * 2.5,
      top:  Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 4,
    })),
    []
  )
  if (!mounted) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-shimmer"
          style={{ width: s.w, height: s.w, top: `${s.top}%`, left: `${s.left}%`, animationDelay: `${s.delay}s` }}
        />
      ))}
    </div>
  )
}

/* ─── Music Player ─────────────────────────────────────────────────────────── */
function MusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const el = audioRef.current
    if (!el) return
    if (playing) { el.pause(); setPlaying(false) }
    else { el.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  return (
    <div
      className="fixed bottom-6 left-6 z-40 flex items-center gap-2"
      style={{ direction: 'ltr' }}
    >
      <audio ref={audioRef} src={src} loop />
      <button
        onClick={toggle}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl text-white transition-all active:scale-95 animate-pulse-ring"
        style={{ background: 'linear-gradient(135deg,#1e4d6b,#4a7fa5)' }}
        aria-label={playing ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
      >
        {playing
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>}
      </button>
      <span className="text-xs font-body text-white/80 bg-[#1e4d6b]/70 backdrop-blur px-3 py-1 rounded-full">
        {playing ? 'موسيقى' : 'موسيقى'}
      </span>
    </div>
  )
}

/* ─── Intro Screen ─────────────────────────────────────────────────────────── */
function IntroScreen({ groomEn, brideEn, onOpen }: { groomEn: string; brideEn: string; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer group"
      style={{ background: 'linear-gradient(180deg,#1e4d6b 0%,#2c6080 50%,#1e4d6b 100%)' }}
      aria-label="افتح الدعوة"
    >
      <Stars />

      <div className="relative z-10 flex flex-col items-center animate-float px-6 text-center">
        {/* Gold diamond */}
        <svg width="40" height="40" viewBox="0 0 24 24" className="mb-8 opacity-90" style={{ color: '#c8a96e' }}>
          <path d="M12 2L14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5Z" fill="currentColor" />
        </svg>

        <p className="font-arabic text-3xl sm:text-4xl mb-4" style={{ color: '#f5ede0' }}>
          اضغط لفتح الدعوة
        </p>
        <p className="text-sm italic tracking-[0.35em] uppercase mb-8" style={{ color: 'rgba(245,237,224,0.65)', fontFamily: 'Poppins, sans-serif' }}>
          Tap to open
        </p>

        {/* Animated circle border */}
        <div className="w-16 h-16 rounded-full border border-[rgba(200,169,110,0.45)] flex items-center justify-center animate-pulse-ring">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8a96e" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 5v14m0 0l-5-5m5 5l5-5" />
          </svg>
        </div>
      </div>

      {/* Couple names */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
        <p style={{ fontFamily: "'Balinesty','Great Vibes',cursive", fontSize: '1.5rem', color: 'rgba(200,169,110,0.8)', lineHeight: 1.3 }}>
          {groomEn} &amp; {brideEn}
        </p>
      </div>
    </button>
  )
}

/* ─── Gate Video ───────────────────────────────────────────────────────────── */
function GateVideo({ src, fading }: { src: string; fading: boolean }) {
  return (
    <div className="fixed inset-0 w-full h-full bg-black z-50 transition-opacity duration-1000" style={{ opacity: fading ? 0 : 1 }}>
      <video src={src} autoPlay muted playsInline className="w-full h-full object-cover" />
    </div>
  )
}

/* ─── Countdown ────────────────────────────────────────────────────────────── */
function CountdownSection() {
  const { get } = useTemplateFields()
  const dateStr = get('wedding_date') as string | undefined
  const target = useMemo(() => dateStr ? new Date(dateStr).getTime() : null, [dateStr])

  const [remaining, setRemaining] = useState(target ? Math.max(0, target - Date.now()) : 0)
  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setRemaining(Math.max(0, target - Date.now())), 1000)
    return () => clearInterval(id)
  }, [target])

  const d = Math.floor(remaining / 86_400_000)
  const h = Math.floor((remaining % 86_400_000) / 3_600_000)
  const m = Math.floor((remaining % 3_600_000) / 60_000)
  const s = Math.floor((remaining % 60_000) / 1_000)

  const items = [
    { v: d, ar: 'يوم',   en: 'Days' },
    { v: h, ar: 'ساعة',  en: 'Hrs'  },
    { v: m, ar: 'دقيقة', en: 'Min'  },
    { v: s, ar: 'ثانية', en: 'Sec'  },
  ]

  return (
    <section className="py-24 px-5 text-center" style={{ background: '#faf7f2' }}>
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <p className="font-arabic text-3xl sm:text-4xl mb-2" style={{ color: '#1e4d6b' }}>العدّ التنازلي</p>
        </Reveal>
        <Reveal delay={200}>
          <p className="font-body text-xs tracking-[0.4em] uppercase mb-12" style={{ color: '#4a7fa5' }}>Counting the days</p>
        </Reveal>
        <Reveal delay={400}>
          <div className="grid grid-cols-4 gap-3 sm:gap-5">
            {items.map(it => (
              <div key={it.en} className="flex flex-col items-center">
                <div
                  className="w-full rounded-2xl py-5 sm:py-7 shadow-lg border"
                  style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', borderColor: 'rgba(200,169,110,0.25)' }}
                >
                  <div className="tabular-nums text-3xl sm:text-5xl font-bold" style={{ color: '#1e4d6b', fontFamily: 'Cormorant Garamond, serif' }}>
                    {pad(it.v)}
                  </div>
                </div>
                <p className="font-arabic text-xs sm:text-sm mt-2" style={{ color: '#4a7fa5' }}>{it.ar}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Gallery ──────────────────────────────────────────────────────────────── */
function GallerySection() {
  const { get } = useTemplateFields()
  const raw = get('gallery_images')
  const images: string[] = Array.isArray(raw) ? raw : (typeof raw === 'string' && raw.startsWith('[') ? JSON.parse(raw) : [])
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (images.length === 0) return null

  return (
    <section className="py-24 px-5" style={{ background: '#f5ede0' }}>
      <div className="max-w-4xl mx-auto">
        <Reveal><div className="flex items-center gap-4 mb-12 justify-center"><span className="ornament-line" /><p className="font-arabic text-3xl sm:text-4xl whitespace-nowrap" style={{ color: '#1e4d6b' }}>معرض الصور</p><span className="ornament-line" /></div></Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {images.map((src, i) => (
            <Reveal key={i} delay={i * 80}>
              <button
                onClick={() => setLightbox(src)}
                className="relative aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group active:scale-[0.98]"
              >
                <img src={src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition-all" onClick={() => setLightbox(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </section>
  )
}

/* ─── Day Program ──────────────────────────────────────────────────────────── */
function DayProgramSection() {
  const { get } = useTemplateFields()
  const raw = get('schedule_items')
  const items: { time: string; label: string }[] = Array.isArray(raw) ? raw : [
    { time: '18:00', label: 'استقبال الضيوف' },
    { time: '19:00', label: 'حفل الزفاف' },
    { time: '20:30', label: 'العشاء' },
    { time: '22:00', label: 'رقصة العرسان الأولى' },
  ]

  return (
    <section className="py-24 px-5" style={{ background: '#faf7f2' }}>
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-14 justify-center">
            <span className="ornament-line" />
            <p className="font-arabic text-3xl sm:text-4xl whitespace-nowrap" style={{ color: '#1e4d6b' }}>برنامج الحفل</p>
            <span className="ornament-line" />
          </div>
        </Reveal>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute right-[3.25rem] sm:right-1/2 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom,transparent,#c8a96e,transparent)' }} />

          <div className="space-y-6">
            {items.map((it, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="flex items-center gap-4 sm:gap-6 flex-row">
                  {/* Time */}
                  <div className="w-24 sm:w-28 text-right shrink-0">
                    <span className="font-body font-semibold text-sm sm:text-base tabular-nums" style={{ color: '#c8a96e' }}>
                      {it.time}
                    </span>
                  </div>
                  {/* Dot */}
                  <div className="shrink-0 z-10 w-4 h-4 rounded-full border-2 shadow-md" style={{ background: '#faf7f2', borderColor: '#c8a96e', boxShadow: '0 0 0 4px rgba(200,169,110,0.15)' }} />
                  {/* Label */}
                  <div className="flex-1">
                    <p className="font-arabic text-base sm:text-lg" style={{ color: '#1e4d6b' }}>{it.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── RSVP ─────────────────────────────────────────────────────────────────── */
function RSVPSection() {
  const { instance } = useTemplateData()
  const { get } = useTemplateFields()
  const slug = instance?.slug ?? ''
  const [name, setName] = useState('')
  const [attending, setAttending] = useState(true)
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(`farhty_rsvp_submitted_${slug}`)) setSubmitted(true)
  }, [slug])

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      const { apiBase } = await getConfig()
      await fetch(`${apiBase}/api/instances/by-domain/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name: name.trim(), attending, guests }),
      })
      localStorage.setItem(`farhty_rsvp_submitted_${slug}`, 'true')
      setSubmitted(true)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  const deadline = get('rsvp_deadline') as string | undefined

  return (
    <section className="py-28 px-5 text-center relative overflow-hidden" dir="rtl" style={{ background: 'linear-gradient(180deg,#1e4d6b 0%,#2c6080 100%)' }}>
      {/* Wave top */}
      <svg className="absolute top-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: 40, color: '#faf7f2' }}>
        <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1440,20 1440,30 L1440,0 L0,0Z" fill="currentColor" />
      </svg>

      <div className="relative z-10 max-w-md mx-auto">
        <Reveal>
          <p className="font-arabic text-3xl sm:text-4xl mb-2" style={{ color: '#f5ede0' }}>تأكيد الحضور</p>
        </Reveal>
        <Reveal delay={200}>
          <p className="font-body text-xs tracking-[0.4em] uppercase mb-8" style={{ color: 'rgba(245,237,224,0.6)' }}>RSVP</p>
        </Reveal>

        {submitted ? (
          <Reveal delay={200}>
            <div className="rounded-3xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
              <div className="text-5xl mb-4">🎉</div>
              <p className="font-arabic text-2xl mb-2" style={{ color: '#f5ede0' }}>شكراً جزيلاً!</p>
              <p className="font-body text-sm" style={{ color: 'rgba(245,237,224,0.75)' }}>تم تسجيل ردّك بنجاح</p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={300}>
            {deadline && (
              <p className="font-body text-sm mb-6" style={{ color: 'rgba(245,237,224,0.7)' }}>
                يرجى التأكيد قبل {new Date(deadline).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
            <div className="rounded-3xl p-6 sm:p-8 space-y-5 text-right" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
              {/* Name */}
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: 'rgba(245,237,224,0.85)' }}>الاسم</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="اسمك الكريم"
                  className="w-full rounded-xl px-4 py-3 font-body text-sm outline-none border-0 focus:ring-2 focus:ring-[#c8a96e]"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#f5ede0' }}
                />
              </div>
              {/* Attending */}
              <div>
                <label className="block font-body text-sm mb-3" style={{ color: 'rgba(245,237,224,0.85)' }}>هل ستحضر؟</label>
                <div className="flex gap-3">
                  {[{ val: true, label: 'نعم، سأحضر 🎊' }, { val: false, label: 'آسف، لن أتمكن' }].map(opt => (
                    <button
                      key={String(opt.val)}
                      onClick={() => setAttending(opt.val)}
                      className="flex-1 py-2.5 rounded-xl font-body text-sm transition-all"
                      style={{
                        background: attending === opt.val ? '#c8a96e' : 'rgba(255,255,255,0.12)',
                        color: attending === opt.val ? '#1a3a4a' : 'rgba(245,237,224,0.8)',
                        fontWeight: attending === opt.val ? 600 : 400,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Guests count */}
              {attending && (
                <div>
                  <label className="block font-body text-sm mb-2" style={{ color: 'rgba(245,237,224,0.85)' }}>عدد الحضور</label>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        onClick={() => setGuests(n)}
                        className="w-10 h-10 rounded-full font-body text-sm transition-all"
                        style={{ background: guests === n ? '#c8a96e' : 'rgba(255,255,255,0.12)', color: guests === n ? '#1a3a4a' : 'rgba(245,237,224,0.8)', fontWeight: guests === n ? 600 : 400 }}
                      >
                        {n}
                      </button>
                    ))}
                    <span className="font-body text-xs" style={{ color: 'rgba(245,237,224,0.5)' }}>+</span>
                  </div>
                </div>
              )}
              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading || !name.trim()}
                className="w-full py-4 rounded-xl font-body font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#c8a96e,#e0c880)', color: '#1a3a4a' }}
              >
                {loading ? 'جاري الإرسال...' : 'تأكيد الحضور'}
              </button>
            </div>
          </Reveal>
        )}
      </div>

      {/* Wave bottom */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height: 40, color: '#faf7f2' }}>
        <path d="M0,30 C360,0 720,60 1080,30 C1260,15 1440,40 1440,30 L1440,60 L0,60Z" fill="currentColor" />
      </svg>
    </section>
  )
}

/* ─── Wish Wall ────────────────────────────────────────────────────────────── */
function WishWallSection() {
  const { instance } = useTemplateData()
  const slug = instance?.slug ?? ''
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) return
    setLoading(true)
    try {
      const { apiBase } = await getConfig()
      await fetch(`${apiBase}/api/instances/by-domain/wish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name: name.trim(), message: message.trim() }),
      })
      setSubmitted(true)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  return (
    <section className="py-24 px-5" style={{ background: '#f5ede0' }} dir="rtl">
      <div className="max-w-lg mx-auto">
        <Reveal>
          <div className="flex items-center gap-4 mb-12 justify-center">
            <span className="ornament-line" />
            <p className="font-arabic text-3xl sm:text-4xl whitespace-nowrap" style={{ color: '#1e4d6b' }}>اترك تهنئة</p>
            <span className="ornament-line" />
          </div>
        </Reveal>

        {submitted ? (
          <Reveal delay={100}>
            <div className="rounded-3xl p-10 text-center shadow-lg" style={{ background: '#fff' }}>
              <div className="text-5xl mb-4">💌</div>
              <p className="font-arabic text-2xl mb-2" style={{ color: '#1e4d6b' }}>شكراً لكلماتك الجميلة!</p>
              <p className="font-body text-sm" style={{ color: '#4a7fa5' }}>وصلت تهنئتك إلى العروسَين</p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={200}>
            <div className="rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg" style={{ background: '#fff' }}>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#4a7fa5' }}>اسمك</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="الاسم الكريم"
                  className="w-full rounded-xl border px-4 py-3 font-body text-sm outline-none focus:ring-2 focus:ring-[#c8a96e] focus:border-transparent transition-all"
                  style={{ borderColor: 'rgba(200,169,110,0.3)', color: '#1a3a4a' }}
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#4a7fa5' }}>كلمات التهنئة</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="اكتب تهنئتك وأمنياتك الجميلة..."
                  rows={4}
                  className="w-full rounded-xl border px-4 py-3 font-arabic text-sm outline-none focus:ring-2 focus:ring-[#c8a96e] focus:border-transparent transition-all resize-none"
                  style={{ borderColor: 'rgba(200,169,110,0.3)', color: '#1a3a4a', lineHeight: 1.8 }}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading || !name.trim() || !message.trim()}
                className="w-full py-4 rounded-xl font-body font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#1e4d6b,#4a7fa5)', color: '#fff' }}
              >
                {loading ? 'جاري الإرسال...' : 'أرسل تهنئتك 💙'}
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

/* ─── Main Invitation ──────────────────────────────────────────────────────── */
export default function Invitation() {
  const { instance } = useTemplateData()
  const { get } = useTemplateFields()

  type Stage = 'intro' | 'video' | 'invite'
  const [stage, setStage] = useState<Stage>('intro')
  const [videoFading, setVideoFading] = useState(false)

  const brideAr   = (get('bride_name')    as string) || 'مها'
  const groomAr   = (get('groom_name')    as string) || 'علي'
  const brideEn   = (get('bride_name_en') as string) || 'Maha'
  const groomEn   = (get('groom_name_en') as string) || 'Ali'
  const dateStr   = (get('wedding_date')  as string) || ''
  const timeStr   = (get('ceremony_time') as string) || '19:00'
  const venueName = (get('venue_name')    as string) || 'منتجع شاطئ الياسمين · جدة'
  const venueAddr = (get('venue_address') as string) || 'Yasmine Beach Resort · Jeddah Corniche'
  const venueMap  = (get('venue_map_url') as string) || ''
  const welcome   = (get('welcome_message') as string) || 'بكل فرحٍ وسرور\nندعوكم لمشاركتنا فرحة العمر\nوحضور حفل زفافنا على ضفاف البحر'
  const heroImg   = (get('hero_image')    as string) || seaHero
  const florImg   = (get('florals_image') as string) || florals
  const venueImage = (get('venue_image') as string) || venueImg
  const gateVideo = (get('gate_video_url') as string) || gateOpeningMp4
  const musicSrc  = (get('music_file')   as string) || ''
  const fatherBride = (get('father_bride_name') as string) || 'أبو مها'
  const fatherGroom = (get('father_groom_name') as string) || 'أبو علي'
  const dressCode = (get('dress_code') as string) || 'formal'
  const accentColor = (get('accent_color') as string) || '#c8a96e'

  const dressLabels: Record<string, string> = {
    formal: 'رسمي',
    'semi-formal': 'نصف رسمي',
    casual: 'كاجوال',
    traditional: 'تقليدي',
  }

  const weddingDateFormatted = dateStr
    ? new Date(dateStr).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'السبت ١٨ يوليو ٢٠٢٦'

  const weddingDateEn = dateStr
    ? new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Saturday, July 18, 2026'

  const openGate = useCallback(() => {
    if (gateVideo) {
      setStage('video')
      setTimeout(() => setVideoFading(true), 4200)
      setTimeout(() => { setStage('invite'); window.scrollTo(0, 0) }, 5200)
    } else {
      setStage('invite')
      window.scrollTo(0, 0)
    }
  }, [gateVideo])

  const fG = instance?.features ?? {}

  return (
    <main dir="rtl" className="min-h-screen overflow-x-hidden" style={{ fontFamily: 'Poppins, sans-serif', background: '#faf7f2', color: '#1a3a4a' }}>
      <HeartSnow />

      {stage === 'intro' && <IntroScreen groomEn={groomEn} brideEn={brideEn} onOpen={openGate} />}
      {stage === 'video' && gateVideo && <GateVideo src={gateVideo} fading={videoFading} />}

      {stage === 'invite' && (
        <>
          {/* ── Hero ──────────────────────────────────────────────────────── */}
          <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden" style={{ background: '#1e4d6b' }}>
            <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.55 }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom,rgba(30,77,107,0.3) 0%,rgba(30,77,107,0.65) 60%,rgba(30,77,107,0.9) 100%)' }} />

            <div className="relative z-10 text-center px-6 animate-fade-up">
              <Reveal>
                <p className="font-arabic text-lg sm:text-xl mb-6" style={{ color: 'rgba(245,237,224,0.85)' }}>
                  بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ
                </p>
              </Reveal>

              <Reveal delay={300}>
                <Ornament className="mb-8" />
              </Reveal>

              {/* Arabic names */}
              <Reveal delay={500}>
                <h1 className="font-name-ar leading-snug mb-3" style={{ fontSize: 'clamp(3rem,9vw,6rem)', color: '#f5ede0' }}>
                  {groomAr}
                  <span className="mx-4 text-[0.55em]" style={{ color: accentColor }}>و</span>
                  {brideAr}
                </h1>
              </Reveal>

              {/* English names */}
              <Reveal delay={700}>
                <h2 className="font-name-en mb-8" style={{ fontSize: 'clamp(1.8rem,5vw,3.5rem)', color: accentColor, lineHeight: 1.2 }}>
                  {groomEn} &amp; {brideEn}
                </h2>
              </Reveal>

              <Reveal delay={900}>
                <p className="font-body text-xs tracking-[0.5em] uppercase" style={{ color: 'rgba(245,237,224,0.6)' }}>
                  {dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() : '18 · 07 · 2026'}
                </p>
              </Reveal>
            </div>

            {/* Scroll arrow */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
              <svg width="20" height="32" viewBox="0 0 20 32" fill="none" style={{ color: 'rgba(245,237,224,0.5)' }}>
                <path d="M10 2v24m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
          </section>

          {/* ── Quran verse ───────────────────────────────────────────────── */}
          <section className="py-28 px-6 text-center" style={{ background: '#faf7f2' }}>
            <div className="max-w-3xl mx-auto">
              <Reveal><Ornament className="mb-10" /></Reveal>
              <Reveal delay={200}>
                <p className="font-arabic leading-loose text-2xl sm:text-3xl" style={{ color: '#1e4d6b' }}>
                  وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
                  <br />لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
                </p>
              </Reveal>
              <Reveal delay={500}>
                <p className="mt-6 font-body text-sm italic" style={{ color: '#4a7fa5', lineHeight: 1.8 }}>
                  "And among His signs is that He created for you mates from yourselves, that you may find tranquility in them;<br />and He placed between you affection and mercy."
                </p>
              </Reveal>
            </div>
          </section>

          {/* ── Invitation message ────────────────────────────────────────── */}
          <section className="py-24 px-5 overflow-hidden" style={{ background: '#e8f2f8' }}>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-14 items-center">
              <Reveal>
                <div className="relative aspect-[4/5] max-w-sm mx-auto rounded-3xl overflow-hidden shadow-2xl">
                  <img src={florImg} alt="" className="w-full h-full object-cover" loading="lazy" />
                  {/* Corner accents */}
                  <div className="absolute inset-0 border-2 rounded-3xl pointer-events-none" style={{ borderColor: 'rgba(200,169,110,0.3)', margin: '12px' }} />
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="text-center md:text-right">
                  <Ornament className="mb-7" />
                  <h2 className="font-arabic text-3xl sm:text-4xl mb-6" style={{ color: '#1e4d6b' }}>
                    يتشرّفان بدعوتكم
                  </h2>
                  <div className="font-arabic text-lg sm:text-xl leading-loose mb-6" style={{ color: '#2c6080' }}>
                    {welcome.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                  <p className="font-body text-sm italic" style={{ color: '#4a7fa5', lineHeight: 1.8 }}>
                    Together with their families, they request the honour of your presence<br />at the celebration of their marriage by the sea.
                  </p>
                  {/* Details pills */}
                  <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
                    <span className="rounded-full px-5 py-2 font-body text-xs font-semibold" style={{ background: 'rgba(30,77,107,0.12)', color: '#1e4d6b' }}>📅 {weddingDateFormatted}</span>
                    <span className="rounded-full px-5 py-2 font-body text-xs font-semibold" style={{ background: 'rgba(30,77,107,0.12)', color: '#1e4d6b' }}>🕖 {timeStr}</span>
                    <span className="rounded-full px-5 py-2 font-body text-xs font-semibold" style={{ background: 'rgba(30,77,107,0.12)', color: '#1e4d6b' }}>👔 {dressLabels[dressCode] || dressCode}</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* ── Parents ───────────────────────────────────────────────────── */}
          {get('section_parents_visible') !== false && (
            <section className="py-24 px-5 text-center" style={{ background: '#faf7f2' }}>
              <div className="max-w-3xl mx-auto">
                <Reveal><Ornament className="mb-10" /></Reveal>
                <Reveal delay={200}>
                  <p className="font-arabic text-2xl sm:text-3xl mb-10" style={{ color: '#1e4d6b' }}>بمباركة أهلهما الكرام</p>
                </Reveal>
                <Reveal delay={350}>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-10">
                    <div className="text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,#e8f2f8,#c8e0ef)' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a7fa5" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <p className="font-arabic text-lg sm:text-2xl leading-snug" style={{ color: '#1e4d6b' }}>{fatherGroom}</p>
                      <p className="font-body text-xs mt-1" style={{ color: '#4a7fa5' }}>والد العريس</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="#c8a96e"><path d="M12 2L14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5Z"/></svg>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg,#fef0f6,#f4d0e5)' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a66b96" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <p className="font-arabic text-lg sm:text-2xl leading-snug" style={{ color: '#1e4d6b' }}>{fatherBride}</p>
                      <p className="font-body text-xs mt-1" style={{ color: '#4a7fa5' }}>والد العروسة</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </section>
          )}

          {/* ── Day Program ───────────────────────────────────────────────── */}
          {fG.schedule && get('section_dayprogram_visible') !== false && <DayProgramSection />}

          {/* ── Countdown ─────────────────────────────────────────────────── */}
          {fG.countdown && get('section_countdown_visible') !== false && <CountdownSection />}

          {/* ── Gallery ───────────────────────────────────────────────────── */}
          {fG.gallery && get('section_gallery_visible') !== false && <GallerySection />}

          {/* ── Venue & Map ───────────────────────────────────────────────── */}
          {fG.venueMap && get('section_venue_visible') !== false && (
            <section style={{ background: '#faf7f2' }}>
              {/* Venue image */}
              <div className="relative h-[60vw] max-h-[440px] overflow-hidden">
                <img src={venueImage} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top,rgba(30,77,107,0.88) 0%,rgba(30,77,107,0.25) 60%,transparent 100%)' }} />
                <div className="absolute inset-0 flex items-end pb-10 sm:pb-14 px-6">
                  <div className="max-w-3xl mx-auto w-full text-center">
                    <Reveal>
                      <h2 className="font-name-en mb-3" style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#f5ede0' }}>By the Sea</h2>
                    </Reveal>
                    <Reveal delay={200}>
                      <p className="font-arabic text-xl sm:text-2xl mb-1" style={{ color: '#f5ede0' }}>{venueName}</p>
                    </Reveal>
                    <Reveal delay={400}>
                      <p className="font-body text-sm tracking-[0.25em] uppercase" style={{ color: 'rgba(245,237,224,0.65)' }}>{venueAddr}</p>
                    </Reveal>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="py-16 px-5">
                <div className="max-w-4xl mx-auto">
                  <Reveal>
                    <div className="flex items-center gap-4 mb-8 justify-center">
                      <span className="ornament-line" />
                      <p className="font-arabic text-2xl sm:text-3xl whitespace-nowrap" style={{ color: '#1e4d6b' }}>موقع القاعة</p>
                      <span className="ornament-line" />
                    </div>
                  </Reveal>
                  {venueMap ? (
                    <Reveal delay={200}>
                      <div className="rounded-3xl overflow-hidden shadow-xl border" style={{ borderColor: 'rgba(200,169,110,0.2)' }}>
                        <iframe
                          src={venueMap}
                          width="100%"
                          height="360"
                          style={{ border: 'none', display: 'block' }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </Reveal>
                  ) : (
                    <Reveal delay={200}>
                      <div className="rounded-3xl flex items-center justify-center text-center py-16 border-2 border-dashed" style={{ borderColor: 'rgba(200,169,110,0.35)', background: 'rgba(200,169,110,0.05)' }}>
                        <div>
                          <p className="text-3xl mb-3">🗺️</p>
                          <p className="font-arabic text-lg" style={{ color: '#4a7fa5' }}>يُضاف رابط الخريطة من لوحة التحكم</p>
                        </div>
                      </div>
                    </Reveal>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ── RSVP ──────────────────────────────────────────────────────── */}
          {fG.rsvp && get('section_rsvp_visible') !== false && <RSVPSection />}

          {/* ── Wish Wall ─────────────────────────────────────────────────── */}
          {fG.wishWall && get('section_wishwall_visible') !== false && <WishWallSection />}

          {/* ── Closing quote ─────────────────────────────────────────────── */}
          <section className="py-24 px-5 text-center" style={{ background: 'linear-gradient(180deg,#1e4d6b,#2c6080)' }}>
            <div className="max-w-2xl mx-auto">
              <Reveal>
                <Ornament className="mb-10 [&_.ornament-line]:bg-gradient-to-r [&_.ornament-line]:from-transparent [&_.ornament-line]:via-[#c8a96e] [&_.ornament-line]:to-transparent" />
              </Reveal>
              <Reveal delay={200}>
                <p className="font-arabic text-2xl sm:text-3xl mb-4" style={{ color: '#f5ede0' }}>بانتظاركم لمشاركتنا الفرح</p>
              </Reveal>
              <Reveal delay={400}>
                <p className="font-name-en mb-6" style={{ fontSize: 'clamp(1.6rem,4vw,2.8rem)', color: accentColor }}>
                  {groomEn} &amp; {brideEn}
                </p>
              </Reveal>
              <Reveal delay={600}>
                <p className="font-body text-xs tracking-[0.4em] uppercase" style={{ color: 'rgba(245,237,224,0.45)' }}>
                  {weddingDateEn}
                </p>
              </Reveal>
            </div>
          </section>

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <footer className="py-8 px-5 text-center" style={{ background: '#1a3a4a' }}>
            <p className="font-body text-xs tracking-widest" style={{ color: 'rgba(245,237,224,0.3)', letterSpacing: '0.12em' }}>
              صنعت لكل حب بواسطة farhty.online
            </p>
          </footer>

          {/* ── Music Player ──────────────────────────────────────────────── */}
          {fG.music && get('section_music_visible') !== false && musicSrc && <MusicPlayer src={musicSrc} />}
        </>
      )}
    </main>
  )
}

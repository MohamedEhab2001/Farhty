import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTemplateData, useTemplateFields } from '@farhty/template-sdk'
import { Curtain } from './Curtain'
import { Petals } from './Petals'
import { CoupleBubbles } from './CoupleBubbles'
import { SectionWrap } from './SectionWrap'
import { WishingWall } from './WishingWall'
import hallBg from '../assets/hall-bg.jpg'
import coupleAsset from '../assets/couple.jpg'
import brideAsset from '../assets/bride.jpg'
import groomAsset from '../assets/groom.jpg'

const DEFAULT_STORY = [
  { year: '٢٠٢١', title: 'اللقاء الأول', text: 'نظرة في حفل صديق… غيّرت مسار حياتنا.' },
  { year: '٢٠٢٣', title: 'الخطوبة', text: 'تحت ضوء القمر، قلنا نعم لرحلة العمر.' },
  { year: '٢٠٢٥', title: 'الزفاف', text: 'اليوم الذي ننتظره… ونريدكم فيه.' },
]

function formatDateAr(iso: string): string {
  try {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch {
    return iso
  }
}

export function Invitation() {
  const { instance, slug } = useTemplateData()
  const { get } = useTemplateFields()
  const [active, setActive] = useState('hero')
  const [bubblesVisible, setBubblesVisible] = useState(false)
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 })

  const brideName: string = get('bride_name') || 'ليلى'
  const groomName: string = get('groom_name') || 'أحمد'
  const weddingDate: string = get('wedding_date') || '2025-06-15'
  const weddingTime: string = get('wedding_time') || 'الثامنة مساءً'
  const venueName: string = get('venue_name') || 'قاعة الماسة الكبرى — القاهرة'
  const venueDesc: string = get('venue_description') || 'قاعة فاخرة بإطلالة آسرة وقوشة من الذهب والورود.'
  const venueMapUrl: string = get('venue_map_url') || ''
  const heroImage: string = get('hero_image') || coupleAsset
  const brideImageSrc: string = get('bride_image') || brideAsset
  const groomImageSrc: string = get('groom_image') || groomAsset
  const fatherBride: string = get('father_bride_name') || 'السيد محمود الحسيني'
  const fatherGroom: string = get('father_groom_name') || 'السيد كريم منصور'
  const welcomeMsg: string = get('welcome_message') || 'نشارككم لحظة كتبها القلب قبل الورق، ونزفّ إليكم دعوتنا لحضور حفل قراننا.'
  const rawStory = get('story_items')
  const storyItems = (Array.isArray(rawStory) && rawStory.length > 0) ? rawStory : DEFAULT_STORY

  const DEFAULT_MESSAGES = [
    { id: 'hero',       speaker: 'bride' as const, text: `أهلًا بكم في رحلة فرحنا… أنا ${brideName}.` },
    { id: 'invitation', speaker: 'groom' as const, text: `يشرّفنا حضوركم في أجمل ليالي العمر، أنا ${groomName}.` },
    { id: 'story',      speaker: 'bride' as const, text: 'كل قصة حب تبدأ بنظرة… وقصتنا بدأت بابتسامة.' },
    { id: 'countdown',  speaker: 'groom' as const, text: 'قلوبنا تعدّ الأيام معكم حتى يحلّ الفرح.' },
    { id: 'venue',      speaker: 'bride' as const, text: 'ننتظركم في المكان الذي اخترناه بكل حب.' },
    { id: 'rsvp',       speaker: 'groom' as const, text: 'حضوركم هو أغلى هدية… أكّدوا لنا تشرّفكم.' },
    { id: 'wishwall',   speaker: 'bride' as const, text: 'اتركوا لنا كلمة من القلب… تسعدنا كثيرًا.' },
  ]
  const rawMessages = get('bubble_messages')
  const MESSAGES: { id: string; speaker: 'bride' | 'groom'; text: string }[] = (
    Array.isArray(rawMessages) && rawMessages.length > 0
  ) ? (rawMessages as { id: string; speaker: string; text: string }[]).map(m => ({
    id: m.id,
    speaker: (m.speaker === 'groom' ? 'groom' : 'bride') as 'bride' | 'groom',
    text: m.text,
  })) : DEFAULT_MESSAGES

  const dateIso = weddingDate ? `${weddingDate}T20:00:00` : '2025-06-15T20:00:00'

  const features = instance?.features ?? {}
  const showCurtain = (features.curtainIntro as boolean | undefined) ?? true
  const showBubbles = (features.coupleBubbles as boolean | undefined) ?? true
  const showStory = (features.story as boolean | undefined) ?? true
  const showCountdown = (features.countdown as boolean | undefined) ?? true
  const showVenue = (features.venueMap as boolean | undefined) ?? true
  const showRsvp = (features.rsvp as boolean | undefined) ?? true
  const showWishWall = (features.wishWall as boolean | undefined) ?? true

  useEffect(() => {
    if (!showCurtain) setBubblesVisible(true)
  }, [showCurtain])

  useEffect(() => {
    const target = new Date(dateIso).getTime()
    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [dateIso])

  return (
    <main className="relative min-h-[100dvh] text-ivory">
      {/* Fixed atmospheric background */}
      <div className="fixed inset-0 z-0">
        <img src={hallBg} alt="قاعة الفرح" className="w-full h-full object-cover" width={1920} height={1080} />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, oklch(0.10 0.04 25 / 0.78) 0%, oklch(0.16 0.05 22 / 0.62) 40%, oklch(0.10 0.04 25 / 0.85) 100%)' }}
        />
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, oklch(0.85 0.12 80 / 0.4), transparent 60%)' }}
        />
      </div>

      <Petals count={20} />
      {showCurtain && <Curtain onOpen={() => setBubblesVisible(true)} />}
      {showBubbles && (
        <CoupleBubbles
          messages={MESSAGES}
          activeId={active}
          visible={bubblesVisible}
          brideImage={brideImageSrc}
          groomImage={groomImageSrc}
        />
      )}

      {/* HERO */}
      <SectionWrap id="hero" onActive={setActive}>
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.6, ease: 'easeOut' }}
          className="mx-auto mb-10 relative w-44 h-44 md:w-56 md:h-56"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-gold blur-2xl opacity-50 animate-shimmer" />
          <div
            className="relative w-full h-full rounded-full overflow-hidden"
            style={{ boxShadow: '0 0 0 2px var(--gold), 0 0 0 8px oklch(0.18 0.02 25 / 0.6), 0 0 0 9px var(--gold), 0 30px 80px oklch(0 0 0 / 0.6)' }}
          >
            <img src={heroImage} alt={`${brideName} و ${groomName}`} className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <div className="text-gold/80 text-xs tracking-[0.5em] uppercase mb-3 font-body">دعوة زفاف</div>
        <h1 className="font-arabic text-5xl md:text-7xl leading-[1.1] mb-6">
          <span className="text-gradient-gold">{brideName}</span>
          <span className="block text-2xl md:text-3xl my-3 text-ivory/70 font-display italic">&amp;</span>
          <span className="text-gradient-gold">{groomName}</span>
        </h1>
        <div className="ornament-divider w-40 mx-auto mb-6" />
        <p className="font-arabic text-lg md:text-xl text-ivory/80 max-w-xl mx-auto leading-loose">{welcomeMsg}</p>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16 text-gold/60 text-xs tracking-[0.4em]"
        >
          ↓ تابعوا الرحلة
        </motion.div>
      </SectionWrap>

      {/* INVITATION */}
      <SectionWrap id="invitation" eyebrow="THE INVITATION" title="بشرى سارّة" onActive={setActive}>
        <div className="glass-card rounded-2xl p-8 md:p-12 shadow-deep">
          <p className="font-arabic text-base md:text-lg leading-loose text-ivory/90">
            بكل الحب والامتنان، نتشرّف نحن عائلتي
            <span className="text-gold mx-2">{fatherBride}</span>
            و
            <span className="text-gold mx-2">{fatherGroom}</span>
            بدعوتكم لحضور حفل زفاف ولدينا
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 font-arabic text-2xl md:text-3xl">
            <span className="text-gradient-gold">{brideName}</span>
            <span className="font-display italic text-ivory/50">&amp;</span>
            <span className="text-gradient-gold">{groomName}</span>
          </div>
        </div>
      </SectionWrap>

      {/* STORY */}
      {showStory && (
        <SectionWrap id="story" eyebrow="OUR JOURNEY" title="قصتنا" onActive={setActive}>
          <div className="space-y-8">
            {storyItems.map((s: { year: string; title: string; text: string }, i: number) => (
              <motion.div
                key={s.year || i}
                initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="glass-card rounded-xl p-6 flex items-center gap-5 text-right"
              >
                <div className="font-display text-3xl text-gradient-gold shrink-0 w-20">{s.year}</div>
                <div className="flex-1">
                  <div className="font-arabic text-xl text-gold mb-1">{s.title}</div>
                  <p className="font-arabic text-ivory/80 leading-relaxed">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrap>
      )}

      {/* COUNTDOWN */}
      {showCountdown && (
        <SectionWrap id="countdown" eyebrow="SAVE THE DATE" title={formatDateAr(weddingDate)} onActive={setActive}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 max-w-xl mx-auto">
            {[
              { v: countdown.d, l: 'يوم' },
              { v: countdown.h, l: 'ساعة' },
              { v: countdown.m, l: 'دقيقة' },
              { v: countdown.s, l: 'ثانية' },
            ].map(c => (
              <div key={c.l} className="glass-card rounded-xl p-4 md:p-6">
                <div className="font-display text-3xl md:text-5xl text-gradient-gold tabular-nums">
                  {String(c.v).padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm text-ivory/70 font-arabic mt-2">{c.l}</div>
              </div>
            ))}
          </div>
          <p className="font-arabic mt-10 text-ivory/80 text-lg">الحفل يبدأ الساعة {weddingTime}</p>
        </SectionWrap>
      )}

      {/* VENUE */}
      {showVenue && (
        <SectionWrap id="venue" eyebrow="THE VENUE" title="مكان الحفل" onActive={setActive}>
          <div className="glass-card rounded-2xl overflow-hidden shadow-deep">
            <div className="aspect-[16/9] w-full bg-burgundy/30 relative">
              {venueMapUrl ? (
                <iframe
                  title="موقع الحفل"
                  src={venueMapUrl}
                  className="absolute inset-0 w-full h-full grayscale-[40%] contrast-110"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-ivory/40 font-arabic text-sm">لم يتم تعيين رابط الخريطة بعد</p>
                </div>
              )}
            </div>
            <div className="p-6 md:p-8 text-center">
              <div className="font-arabic text-2xl text-gradient-gold mb-2">{venueName}</div>
              <p className="text-ivory/70 font-arabic">{venueDesc}</p>
            </div>
          </div>
        </SectionWrap>
      )}

      {/* RSVP */}
      {showRsvp && (
        <SectionWrap id="rsvp" eyebrow="WILL YOU JOIN US" title="تأكيد الحضور" onActive={setActive}>
          <RSVPForm slug={slug} />
        </SectionWrap>
      )}

      {/* WISHING WALL */}
      {showWishWall && (
        <SectionWrap id="wishwall" eyebrow="WISH WALL" title="حائط الأمنيات" onActive={setActive}>
          <WishingWall />
        </SectionWrap>
      )}

      {/* FOOTER */}
      <footer className="relative z-20 text-center py-16 px-5">
        <div className="ornament-divider w-32 mx-auto mb-6" />
        <p className="font-arabic text-gold text-lg">شكرًا لكونكم جزءًا من فرحتنا</p>
        <p className="text-xs text-ivory/40 tracking-[0.3em] mt-4 font-body">FARHTY · فرحتي</p>
      </footer>
    </main>
  )
}

function RSVPForm({ slug }: { slug: string }) {
  const [name, setName] = useState('')
  const [count, setCount] = useState(1)
  const [attend, setAttend] = useState<'yes' | 'no' | null>(null)
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const alreadySubmitted = Boolean(localStorage.getItem(`farhty_rsvp_submitted_${slug}`))

  if (alreadySubmitted || sent) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card rounded-2xl p-10"
      >
        <div className="font-arabic text-2xl text-gradient-gold mb-3">شكرًا {name || ''} 🤍</div>
        <p className="font-arabic text-ivory/80">تم تسجيل ردّك بنجاح، نراكم على خير.</p>
      </motion.div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !attend) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const config = await fetch('/config.json')
        .then(r => r.json())
        .catch(() => ({ apiBase: 'http://localhost:3001', slug: '' }))
      const resolvedSlug = config.slug || slug || window.location.hostname.split('.')[0]
      const apiBase = config.apiBase || 'http://localhost:3001'
      await fetch(`${apiBase}/api/instances/by-domain/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: resolvedSlug, name, attending: attend === 'yes', guests: count }),
      })
      localStorage.setItem(`farhty_rsvp_submitted_${resolvedSlug}`, 'true')
      setSent(true)
    } catch {
      setSubmitError('حدث خطأ، حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-10 space-y-5 text-right">
      <div>
        <label className="block text-xs text-gold tracking-[0.3em] mb-2 font-body">الاسم الكريم</label>
        <input
          required
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-transparent border border-gold/30 rounded-lg px-4 py-3 font-arabic text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition"
          placeholder="اكتب اسمك هنا"
        />
      </div>

      <div>
        <label className="block text-xs text-gold tracking-[0.3em] mb-2 font-body">عدد الأشخاص</label>
        <input
          type="number"
          min={1}
          max={10}
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          dir="ltr"
          className="w-full bg-transparent border border-gold/30 rounded-lg px-4 py-3 font-arabic text-ivory focus:outline-none focus:border-gold transition"
        />
      </div>

      <div>
        <label className="block text-xs text-gold tracking-[0.3em] mb-3 font-body">هل ستشرّفوننا؟</label>
        <div className="grid grid-cols-2 gap-3">
          {([{ v: 'yes' as const, l: 'بكل سرور' }, { v: 'no' as const, l: 'اعتذر' }]).map(opt => (
            <button
              type="button"
              key={opt.v}
              onClick={() => setAttend(opt.v)}
              className={`py-3 rounded-lg font-arabic transition border ${
                attend === opt.v
                  ? 'bg-gradient-gold text-primary-foreground border-transparent shadow-gold'
                  : 'border-gold/30 text-ivory/80 hover:border-gold'
              }`}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      {submitError && <p className="text-red-400 font-arabic text-sm">{submitError}</p>}

      <button
        type="submit"
        disabled={!name || !attend || submitting}
        className="w-full py-4 rounded-lg bg-gradient-gold text-primary-foreground font-arabic text-lg shadow-gold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] transition"
      >
        {submitting ? 'جاري الإرسال...' : 'إرسال الردّ'}
      </button>
    </form>
  )
}

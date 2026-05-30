import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import mosqueImg from '../assets/mosque.jpg'
import ArabesqueMark from './ArabesqueMark'
import CornerOrnament from './CornerOrnament'
import Divider from './Divider'
import Countdown from './Countdown'
import VenueSection from './VenueSection'
import WishWall from './WishWall'
import type { InstanceData } from '@farhty/template-sdk'

interface Props {
  muted: boolean
  onToggleMute: () => void
  get: (key: string) => unknown
  instance: InstanceData | null
}

function str(v: unknown, fallback: string): string {
  return typeof v === 'string' && v ? v : fallback
}

export default function MainInvitation({ muted, onToggleMute, get, instance }: Props) {
  const brideName = str(get('bride_name'), 'نور')
  const groomName = str(get('groom_name'), 'يوسف')
  const weddingDate = str(get('wedding_date'), '')
  const weddingTime = str(get('wedding_time'), '19:30')
  const familyBride = str(get('family_bride'), 'آل الحسن')
  const familyGroom = str(get('family_groom'), 'آل الرحمان')
  const eventType = str(get('event_type'), 'وليمة')
  const venueName = str(get('venue_name'), 'قاعة الأندلس')
  const venueAddr = str(get('venue_address'), 'مصر الجديدة، القاهرة')
  const venueMapUrl = str(get('venue_map_url'), '')
  const venueMapLnk = str(get('venue_map_link'), '')
  const heroImage = str(get('hero_image'), '') || mosqueImg

  const verseAr = str(get('quran_verse_ar'), 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً')
  const verseRef = str(get('quran_verse_ref'), '— سورة الروم ٣٠:٢١')

  const rawWishes = get('wish_entries')
  const wishes: { name: string; message: string; visible?: boolean }[] = Array.isArray(rawWishes)
    ? rawWishes
    : (() => { try { return JSON.parse(rawWishes as string) } catch { return [] } })()

  const displayDate = (() => {
    if (!weddingDate) return 'سيُحدَّد لاحقاً'
    try {
      return new Date(weddingDate + 'T12:00:00').toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    } catch { return weddingDate }
  })()

  const displayTime = (() => {
    if (!weddingTime) return ''
    const [h, m] = weddingTime.split(':').map(Number)
    const period = h >= 12 ? 'مساءً' : 'صباحاً'
    const h12 = h % 12 || 12
    return `${h12}:${String(m).padStart(2, '0')} ${period}`
  })()

  return (
    <motion.section
      dir="rtl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className="relative z-10 mx-auto flex min-h-[100dvh] max-w-4xl flex-col items-center px-4 py-10 sm:px-6 sm:py-14 md:py-16"
    >
      {/* Mute button */}
      {instance?.features?.music !== false && (
        <button
          onClick={onToggleMute}
          aria-label={muted ? 'تشغيل التلاوة' : 'كتم التلاوة'}
          className="fixed left-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur transition hover:scale-110"
          style={{ border: '1px solid rgba(184,150,46,0.5)', background: 'rgba(247,243,233,0.8)', color: 'var(--emerald-deep)' }}
        >
          <span className="absolute inset-0 -z-10 rounded-full animate-pulse-ring" style={{ background: 'rgba(184,150,46,0.3)' }} />
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}

      {/* Frame */}
      <div
        className="relative w-full rounded-[1.5rem] sm:rounded-[2rem] px-4 py-10 sm:px-6 sm:py-14 backdrop-blur-sm md:px-14 md:py-20"
        style={{ border: '1px solid rgba(184,150,46,0.4)', background: 'rgba(247,243,233,0.6)', boxShadow: '0 30px 80px -30px rgba(139,110,26,0.35)' }}
      >
        <CornerOrnament className="absolute -right-3 -top-3" />
        <CornerOrnament className="absolute -left-3 -top-3 rotate-90" />
        <CornerOrnament className="absolute -left-3 -bottom-3 rotate-180" />
        <CornerOrnament className="absolute -right-3 -bottom-3 -rotate-90" />

        {/* Hero image banner */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="relative mx-auto mb-10 h-44 w-full overflow-hidden rounded-2xl md:h-64"
          style={{ border: '1px solid rgba(184,150,46,0.4)', boxShadow: 'var(--shadow-gold)' }}
        >
          <img src={heroImage} alt="الحفل" className="h-full w-full object-cover animate-ken-burns" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(247,243,233,0.8) 0%, rgba(247,243,233,0.1) 50%, transparent 100%)' }} />
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: 'linear-gradient(to left, rgba(26,64,48,0.3), transparent, rgba(26,64,48,0.3))' }} />
        </motion.div>

        <div className="text-center">
          <ArabesqueMark small />

          <p className="my-3 text-3xl sm:text-4xl text-gold-gradient" style={{ fontFamily: 'Amiri, serif' }}>﴿ ﷽ ﴾</p>

          {/* Quran verse */}
          <p className="mt-6 text-xl leading-[2] md:text-2xl" style={{ color: 'var(--emerald-deep)', fontFamily: 'Amiri, serif' }} dir="rtl">
            {verseAr}
          </p>
          <p className="mt-2 text-xs tracking-[0.2em]" style={{ color: 'var(--gold-deep)', fontFamily: 'Tajawal, sans-serif' }}>
            {verseRef}
          </p>

          <Divider />

          {/* Families intro */}
          <p className="text-sm tracking-[0.15em]" style={{ color: 'rgba(26,64,48,0.8)', fontFamily: 'Tajawal, sans-serif' }}>
            بفضل الله وتوفيقه
          </p>
          <p className="mt-3 text-base" style={{ color: 'rgba(26,26,46,0.75)', fontFamily: 'Tajawal, sans-serif' }}>
            تتشرف عائلتا {familyBride} و{familyGroom}
          </p>
          <p className="mt-1 text-base" style={{ color: 'rgba(26,26,46,0.75)', fontFamily: 'Tajawal, sans-serif' }}>
            بدعوة حضراتكم لحضور حفل {eventType}
          </p>

          {/* Names */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl" style={{ color: 'var(--ink)', fontFamily: 'Amiri, serif' }}>
            {groomName}
          </h1>
          <h1 className="mt-8 text-5xl sm:text-6xl md:text-8xl" style={{ color: 'var(--ink)', fontFamily: 'Amiri, serif' }}>
            {brideName}
          </h1>

        

          <Divider />

          {/* Details grid */}
          <div className="grid gap-5 md:gap-8 md:grid-cols-3">
            <DetailBlock
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>}
              label="التاريخ"
              value={displayDate}
              sub=""
            />
            <DetailBlock
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>}
              label="الوقت"
              value={displayTime || weddingTime}
              sub={eventType}
            />
            <DetailBlock
              icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>}
              label="المكان"
              value={venueName}
              sub={venueAddr}
            />
          </div>

          {/* Countdown */}
          {instance?.features?.countdown !== false && get('section_countdown_visible') !== false && weddingDate && (
            <>
              <Divider />
              <Countdown weddingDate={weddingDate} weddingTime={weddingTime} />
            </>
          )}

          {/* Venue map */}
          {instance?.features?.venueMap !== false && get('section_venue_visible') !== false && (venueMapUrl || venueMapLnk) && (
            <>
              <Divider />
              <VenueSection venueName={venueName} venueAddress={venueAddr} venueMapUrl={venueMapUrl} venueMapLink={venueMapLnk} />
            </>
          )}

          {/* Wish wall */}
          {instance?.features?.wishWall !== false && get('section_wishwall_visible') !== false && (
            <>
              <Divider />
              <WishWall initialWishes={wishes} />
            </>
          )}

          <Divider />

          {/* Closing dua */}
          {/* <p className="text-xl leading-[2]" style={{ color: 'var(--emerald-deep)', fontFamily: 'Amiri, serif' }} dir="rtl">
            بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْر
          </p> */}
        </div>
      </div>

      <p className="mt-10 text-sm tracking-[0.3em]" style={{ color: 'rgba(184,150,46,0.7)', fontFamily: 'Tajawal, sans-serif' }}>
        أهلًا وسهلًا بكم
      </p>

      <div className="mt-16 flex flex-col items-center gap-1 opacity-40 transition-opacity hover:opacity-100">
        <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--emerald-deep)', fontFamily: 'Tajawal, sans-serif' }}>
          صنعت بكل حب بواسطة
        </p>
        <a
          href="https://farhaty.online"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium tracking-widest"
          style={{ color: 'var(--gold-deep)', fontFamily: 'Tajawal, sans-serif' }}
        >
          farhaty.online
        </a>
      </div>
      <p className="mt-3 text-xs" style={{ color: 'rgba(184,150,46,0.4)', fontFamily: 'Tajawal, sans-serif', letterSpacing: '0.1em' }}>
        صنعت لكل حب بواسطة farhty.online
      </p>
    </motion.section>
  )
}

function DetailBlock({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ border: '1px solid rgba(184,150,46,0.5)', color: 'var(--gold-deep)' }}>
        {icon}
      </div>
      <p className="text-xs tracking-[0.2em]" style={{ color: 'rgba(26,64,48,0.7)', fontFamily: 'Tajawal, sans-serif' }}>{label}</p>
      <p className="text-lg leading-snug" style={{ color: 'var(--ink)', fontFamily: 'Tajawal, sans-serif', fontWeight: 500 }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: 'rgba(26,26,46,0.6)', fontFamily: 'Tajawal, sans-serif' }}>{sub}</p>}
    </div>
  )
}

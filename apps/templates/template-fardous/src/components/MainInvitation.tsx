import { motion } from 'framer-motion'
import { Volume2, VolumeX, Calendar, MapPin, Clock } from 'lucide-react'
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
  const brideName   = str(get('bride_name'), 'Noor')
  const groomName   = str(get('groom_name'), 'Yusuf')
  const weddingDate = str(get('wedding_date'), '')
  const weddingTime = str(get('wedding_time'), '19:30')
  const familyBride = str(get('family_bride'), 'Al-Hassan')
  const familyGroom = str(get('family_groom'), 'Al-Rahman')
  const eventType   = str(get('event_type'), 'Walīmah')
  const venueName   = str(get('venue_name'), 'Al-Andalus Hall')
  const venueAddr   = str(get('venue_address'), 'Heliopolis, Cairo · Egypt')
  const venueMapUrl = str(get('venue_map_url'), '')
  const venueMapLnk = str(get('venue_map_link'), '')
  const heroImage   = str(get('hero_image'), '') || mosqueImg

  const verseAr  = str(get('quran_verse_ar'), 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً')
  const verseEn  = str(get('quran_verse_en'), '"And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquillity with them, and He has put love and mercy between you."')
  const verseRef = str(get('quran_verse_ref'), '— Surah Ar-Rūm 30:21')

  const rawWishes = get('wish_entries')
  const wishes: { name: string; message: string; visible?: boolean }[] = Array.isArray(rawWishes)
    ? rawWishes
    : (() => { try { return JSON.parse(rawWishes as string) } catch { return [] } })()

  // Format date display
  const displayDate = (() => {
    if (!weddingDate) return 'To Be Announced'
    try {
      return new Date(weddingDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    } catch { return weddingDate }
  })()

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center px-6 py-16"
    >
      {/* Mute button */}
      {instance?.features?.music !== false && (
        <button
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute recitation' : 'Mute recitation'}
          className="fixed right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur transition hover:scale-110"
          style={{ border: '1px solid rgba(184,150,46,0.5)', background: 'rgba(247,243,233,0.8)', color: 'var(--emerald-deep)' }}
        >
          <span className="absolute inset-0 -z-10 rounded-full animate-pulse-ring" style={{ background: 'rgba(184,150,46,0.3)' }} />
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}

      {/* Frame */}
      <div className="relative w-full rounded-[2rem] px-6 py-14 backdrop-blur-sm md:px-14 md:py-20" style={{ border: '1px solid rgba(184,150,46,0.4)', background: 'rgba(247,243,233,0.6)', boxShadow: '0 30px 80px -30px rgba(139,110,26,0.35)' }}>
        <CornerOrnament className="absolute -left-3 -top-3" />
        <CornerOrnament className="absolute -right-3 -top-3 rotate-90" />
        <CornerOrnament className="absolute -right-3 -bottom-3 rotate-180" />
        <CornerOrnament className="absolute -left-3 -bottom-3 -rotate-90" />

        {/* Mosque banner */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          className="relative mx-auto mb-10 h-44 w-full overflow-hidden rounded-2xl md:h-64"
          style={{ border: '1px solid rgba(184,150,46,0.4)', boxShadow: 'var(--shadow-gold)' }}
        >
          <img src={heroImage} alt="Venue" className="h-full w-full object-cover animate-ken-burns" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(247,243,233,0.8) 0%, rgba(247,243,233,0.1) 50%, transparent 100%)' }} />
          <div className="absolute inset-0 mix-blend-multiply" style={{ background: 'linear-gradient(to right, rgba(26,64,48,0.3), transparent, rgba(26,64,48,0.3))' }} />
        </motion.div>

        <div className="text-center">
          <ArabesqueMark small />

          <p className="mt-6 font-arabic text-xl leading-loose md:text-2xl" style={{ color: 'var(--emerald-deep)' }} dir="rtl">
            {verseAr}
          </p>
          <p className="mt-4 font-display italic md:text-lg" style={{ color: 'rgba(45,106,79,0.8)' }}>
            {verseEn}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.35em]" style={{ color: 'var(--gold-deep)' }}>{verseRef}</p>

          <Divider />

          <p className="text-sm uppercase tracking-[0.4em]" style={{ color: 'rgba(26,64,48,0.7)' }}>With the grace of Allah ﷻ</p>
          <p className="mt-3 font-display italic" style={{ color: 'rgba(26,26,46,0.7)' }}>
            The families of {familyBride} &amp; {familyGroom}
          </p>
          <p className="mt-1 font-display italic" style={{ color: 'rgba(26,26,46,0.7)' }}>
            request the honour of your presence at the {eventType} of
          </p>

          <h1 className="mt-8 font-display text-5xl md:text-7xl" style={{ color: 'var(--ink)' }}>{brideName}</h1>
          <p className="my-3 font-arabic text-3xl text-gold-gradient">﴾ ﷽ ﴿</p>
          <h1 className="font-display text-5xl md:text-7xl" style={{ color: 'var(--ink)' }}>{groomName}</h1>

          <Divider />

          {/* Details */}
          <div className="grid gap-8 md:grid-cols-3">
            <DetailBlock icon={<Calendar className="h-5 w-5" />} label="Date" value={displayDate} sub="" />
            <DetailBlock icon={<Clock className="h-5 w-5" />} label="Time" value={weddingTime} sub={`${eventType} & Dinner`} />
            <DetailBlock icon={<MapPin className="h-5 w-5" />} label="Venue" value={venueName} sub={venueAddr} />
          </div>

          {/* Countdown */}
          {instance?.features?.countdown !== false && weddingDate && (
            <>
              <Divider />
              <Countdown weddingDate={weddingDate} weddingTime={weddingTime} />
            </>
          )}

          {/* Venue map */}
          {instance?.features?.venueMap !== false && (venueMapUrl || venueMapLnk) && (
            <>
              <Divider />
              <VenueSection venueName={venueName} venueAddress={venueAddr} venueMapUrl={venueMapUrl} venueMapLink={venueMapLnk} />
            </>
          )}

          {/* Wish wall */}
          {instance?.features?.wishWall !== false && (
            <>
              <Divider />
              <WishWall initialWishes={wishes} />
            </>
          )}

          <Divider />

          <p className="font-arabic text-xl" style={{ color: 'var(--emerald-deep)' }} dir="rtl">
            بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْر
          </p>
          <p className="mt-3 text-sm italic" style={{ color: 'rgba(26,26,46,0.6)' }}>
            "May Allah bless you, and shower His blessings upon you, and join you together in goodness."
          </p>
        </div>
      </div>

      <p className="mt-10 text-xs uppercase tracking-[0.5em]" style={{ color: 'rgba(184,150,46,0.7)' }}>
        Ahlan wa Sahlan • أهلًا وسهلًا
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
      <p className="text-[11px] uppercase tracking-[0.35em]" style={{ color: 'rgba(26,64,48,0.7)' }}>{label}</p>
      <p className="font-display text-xl" style={{ color: 'var(--ink)' }}>{value}</p>
      {sub && <p className="text-xs italic" style={{ color: 'rgba(26,26,46,0.6)' }}>{sub}</p>}
    </div>
  )
}

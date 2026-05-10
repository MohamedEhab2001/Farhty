import { motion } from 'framer-motion'
import mosqueImg from '../assets/mosque.jpg'
import ArabesqueMark from './ArabesqueMark'

interface Props {
  onOpen: () => void
  get: (key: string) => unknown
}

export default function CoverScreen({ onOpen, get }: Props) {
  const heroImage = (get('hero_image') as string) || mosqueImg
  const brideName = (get('bride_name') as string) || 'نور'
  const groomName = (get('groom_name') as string) || 'يوسف'
  const eventType = (get('event_type') as string) || 'وليمة'

  return (
    <motion.section
      dir="rtl"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      {/* Hero backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <img
          src={heroImage}
          alt="مكان الحفل"
          className="h-full w-full object-cover opacity-90 animate-ken-burns"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(247,243,233,0.4), rgba(247,243,233,0.6), var(--cream))' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, var(--cream) 85%)' }} />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0, rotate: -10 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
        className="mb-8"
      >
        <ArabesqueMark />
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        className="font-arabic text-2xl md:text-3xl"
        style={{ color: 'var(--emerald)', fontFamily: 'Amiri, serif' }}
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </motion.p>

      <motion.h1
        initial={{ y: 20, opacity: 0, letterSpacing: '0.3em' }}
        animate={{ y: 0, opacity: 1, letterSpacing: '0.05em' }}
        transition={{ duration: 1.6, delay: 0.8, ease: 'easeOut' }}
        className="mt-10 text-5xl md:text-7xl text-gold-sweep"
        style={{ fontFamily: 'Amiri, serif' }}
      >
        دعوة زفاف
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.05 }}
        className="mt-3 text-sm tracking-[0.1em] sm:tracking-[0.25em]"
        style={{ color: 'rgba(26,64,48,0.7)', fontFamily: 'Tajawal, sans-serif' }}
      >
        يُشرّفنا حضوركم لحفل {eventType}
      </motion.p>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.25 }}
        className="mt-4 text-4xl md:text-5xl"
        style={{ color: 'var(--ink)', fontFamily: 'Amiri, serif' }}
      >
        {brideName} <span className="text-gold-gradient">❦</span> {groomName}
      </motion.h2>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6 }}
        onClick={onOpen}
        className="group relative mt-10 sm:mt-14 inline-flex items-center gap-3 rounded-full px-7 py-4 sm:px-10 text-base tracking-[0.1em] sm:tracking-[0.15em] transition-transform hover:scale-105"
        style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-gold)', color: 'var(--cream)', fontFamily: 'Tajawal, sans-serif', fontWeight: 500 }}
      >
        <span className="absolute inset-0 rounded-full border" style={{ borderColor: 'rgba(247,243,233,0.4)' }} />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity={0.8}>
          <path d="M12 21s-7-4.35-9.5-8.5C.5 9 3 5 6.5 5c2 0 3.5 1.5 5.5 4 2-2.5 3.5-4 5.5-4 3.5 0 6 4 4 7.5C19 16.65 12 21 12 21Z"/>
        </svg>
        <span>افتح الدعوة</span>
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
        className="mt-8 text-xs"
        style={{ color: 'rgba(26,64,48,0.5)', fontFamily: 'Tajawal, sans-serif' }}
      >
        (سيُعزف القرآن الكريم بصوت هادئ)
      </motion.p>
    </motion.section>
  )
}

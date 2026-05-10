import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import mosqueImg from '../assets/mosque.jpg'
import ArabesqueMark from './ArabesqueMark'

interface Props {
  onOpen: () => void
  get: (key: string) => unknown
}

export default function CoverScreen({ onOpen, get }: Props) {
  const heroImage = (get('hero_image') as string) || mosqueImg
  const brideName = (get('bride_name') as string) || 'Noor'
  const groomName = (get('groom_name') as string) || 'Yusuf'
  const eventType = (get('event_type') as string) || 'Walīmah'

  return (
    <motion.section
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      {/* Hero backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <img
          src={heroImage}
          alt="Wedding venue"
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
        style={{ color: 'var(--emerald)' }}
        dir="rtl"
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </motion.p>

      <motion.h1
        initial={{ y: 20, opacity: 0, letterSpacing: '0.5em' }}
        animate={{ y: 0, opacity: 1, letterSpacing: '0.05em' }}
        transition={{ duration: 1.6, delay: 0.8, ease: 'easeOut' }}
        className="mt-10 font-display text-5xl italic md:text-7xl text-gold-sweep"
      >
        An Invitation
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.05 }}
        className="mt-3 text-sm uppercase tracking-[0.4em]"
        style={{ color: 'rgba(26,64,48,0.7)' }}
      >
        To the {eventType} of
      </motion.p>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.25 }}
        className="mt-4 font-display text-4xl md:text-5xl"
        style={{ color: 'var(--ink)' }}
      >
        {brideName} <span className="text-gold-gradient italic">&amp;</span> {groomName}
      </motion.h2>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6 }}
        onClick={onOpen}
        className="group relative mt-14 inline-flex items-center gap-3 rounded-full px-10 py-4 font-display text-base tracking-[0.3em] uppercase transition-transform hover:scale-105"
        style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-gold)', color: 'var(--cream)' }}
      >
        <span className="absolute inset-0 rounded-full border" style={{ borderColor: 'rgba(247,243,233,0.4)' }} />
        <span>Open Invitation</span>
        <Heart className="h-4 w-4" strokeWidth={1.5} />
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
        className="mt-8 text-xs italic"
        style={{ color: 'rgba(26,64,48,0.5)' }}
      >
        (Quran recitation will play softly)
      </motion.p>
    </motion.section>
  )
}

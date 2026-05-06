import { useRef } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import ornament from '../assets/ornament-bg.jpg'
import divider from '../assets/divider.png'

export default function HeroSection() {
  const { get } = useTemplateFields()
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  const brideName = get('bride_name') ?? 'Layla'
  const groomName = get('groom_name') ?? 'Karim'
  const brideNameAr = get('bride_name_ar') ?? 'ليلى'
  const groomNameAr = get('groom_name_ar') ?? 'كريم'
  const weddingDate = get('wedding_date') ?? ''
  const tagline = get('tagline') ?? 'Request the honour of your presence'
  const heroImage = get('hero_image')

  const dateDisplay = weddingDate
    ? new Date(weddingDate).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : 'Saturday · 12 September 2026'
  const venueName = get('venue_name') ?? 'Marrakech'

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
    >
      {/* Background pattern or hero image */}
      {heroImage ? (
        <>
          <motion.div
            className="absolute inset-0"
            style={{ y: heroY }}
          >
            <img src={heroImage} alt="" className="w-full h-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-emerald-deep/80" />
        </>
      ) : (
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-[0.18] mix-blend-screen"
          style={{
            backgroundImage: `url(${ornament})`,
            backgroundSize: '640px',
            backgroundRepeat: 'repeat',
            y: heroY,
          }}
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, oklch(0.22 0.06 155) 75%)',
        }}
      />

      {/* Floating sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-gold/40"
          style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>
      ))}

      <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center max-w-3xl">
        <motion.p
          dir="rtl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-arabic text-2xl md:text-3xl text-gold/90 mb-6"
        >
          بسم الله الرحمن الرحيم
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-[0.7rem] tracking-[0.6em] uppercase text-ivory/60 mb-10"
        >
          Together with their families
        </motion.p>

        <motion.h1
          dir="rtl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: 'easeOut' }}
          className="font-arabic text-6xl md:text-8xl leading-tight text-ivory"
        >
          {brideNameAr} <span className="text-gold">&amp;</span> {groomNameAr}
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-4 font-serif italic text-3xl md:text-5xl text-ivory/90"
        >
          {brideName} <span className="text-gold not-italic">&amp;</span> {groomName}
        </motion.h2>

        <div className="my-10">
          <motion.img
            src={divider}
            alt=""
            loading="lazy"
            initial={{ opacity: 0, scaleX: 0.4 }}
            whileInView={{ opacity: 0.9, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="mx-auto h-12 md:h-16 w-auto"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="font-serif text-xl md:text-2xl text-ivory/85 tracking-wide"
        >
          {tagline}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-4 text-sm md:text-base tracking-[0.35em] uppercase text-gold"
        >
          {dateDisplay} · {venueName}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2 text-ivory/40"
        >
          <span className="text-[0.6rem] tracking-[0.5em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-10 w-[1px] bg-gradient-to-b from-gold/60 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

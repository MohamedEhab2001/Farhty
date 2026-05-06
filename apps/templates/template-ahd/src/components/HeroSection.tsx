import { useEffect, useRef, useState } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const { get } = useTemplateFields()
  const imageRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  const brideName   = get('bride_name')   ?? 'Layla'
  const groomName   = get('groom_name')   ?? 'Karim'
  const weddingDate = get('wedding_date') ?? ''
  const weddingTime = get('wedding_time') ?? '6:00 PM'
  const tagline     = get('tagline')      ?? 'Together Forever'
  const heroImage   = get('hero_image')   ?? ''
  const venueName   = get('ceremony_venue') ?? 'The Grand Venue'

  // Parallax
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const formatDate = (raw: string) => {
    if (!raw) return 'June 14, 2025'
    try {
      return new Date(raw).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    } catch { return raw }
  }

  return (
    <section
      id="hero"
      className="relative w-full"
      style={{ height: '100dvh', minHeight: '600px' }}
    >
      {/* ── Desktop: strict 50/50 split ── */}
      <div className="hidden md:flex w-full h-full">

        {/* Left — text half */}
        <div className="w-1/2 h-full flex items-center justify-center bg-ivory px-12 lg:px-20">
          <div className="w-full max-w-sm text-center">
            {/* Italic script label */}
            <motion.p
              className="font-display italic font-light text-warm-gray text-lg mb-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {tagline}
            </motion.p>

            {/* Gold line top */}
            <motion.span
              className="gold-line block mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center' }}
            />

            {/* Names */}
            <motion.h1
              className="font-sc font-light leading-none tracking-widest text-charcoal mb-2"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {groomName.toUpperCase()}
            </motion.h1>
            <motion.p
              className="font-display italic text-warm-gray text-xl mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              &amp;
            </motion.p>
            <motion.h1
              className="font-sc font-light leading-none tracking-widest text-charcoal"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              {brideName.toUpperCase()}
            </motion.h1>

            {/* Gold line bottom */}
            <motion.span
              className="gold-line block mt-8 mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center' }}
            />

            {/* Date & Venue */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <p
                className="font-body font-light tracking-[0.25em] text-warm-gray uppercase"
                style={{ fontSize: '0.7rem' }}
              >
                {formatDate(weddingDate)}
              </p>
              <p
                className="font-body font-light tracking-[0.2em] text-warm-gray uppercase"
                style={{ fontSize: '0.7rem' }}
              >
                {weddingTime} &nbsp;·&nbsp; {venueName}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right — full-bleed portrait photo */}
        <div className="w-1/2 h-full parallax-container" ref={imageRef}>
          {heroImage ? (
            <div
              className="parallax-img w-full h-[110%]"
              style={{ transform: `translateY(${scrollY * -0.12}px)` }}
            >
              <img
                src={heroImage}
                alt="Wedding portrait"
                className="w-full h-full object-cover object-center"
                style={{ marginTop: '-5%' }}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-champagne flex items-center justify-center">
              <p className="font-display italic text-warm-gray text-lg opacity-50">
                Portrait Photo
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile: photo on top 45%, text below ── */}
      <div className="flex flex-col md:hidden w-full h-full">

        {/* Photo top 45% */}
        <div className="parallax-container" style={{ height: '45%' }}>
          {heroImage ? (
            <img
              src={heroImage}
              alt="Wedding portrait"
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-champagne flex items-center justify-center">
              <p className="font-display italic text-warm-gray text-sm opacity-50">Portrait Photo</p>
            </div>
          )}
        </div>

        {/* Text bottom 55% */}
        <div className="flex-1 flex items-center justify-center bg-ivory px-8">
          <div className="text-center w-full">
            <p className="font-display italic font-light text-warm-gray text-base mb-4">
              {tagline}
            </p>
            <span className="gold-line block mb-5" />
            <h1
              className="font-sc font-light tracking-widest text-charcoal leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 8vw, 2.8rem)' }}
            >
              {groomName.toUpperCase()}
            </h1>
            <p className="font-display italic text-warm-gray text-lg my-1">&amp;</p>
            <h1
              className="font-sc font-light tracking-widest text-charcoal leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 8vw, 2.8rem)' }}
            >
              {brideName.toUpperCase()}
            </h1>
            <span className="gold-line block mt-5 mb-5" />
            <p
              className="font-body font-light tracking-[0.2em] text-warm-gray uppercase"
              style={{ fontSize: '0.65rem' }}
            >
              {formatDate(weddingDate)}
            </p>
            <p
              className="font-body font-light tracking-[0.15em] text-warm-gray uppercase mt-1"
              style={{ fontSize: '0.65rem' }}
            >
              {weddingTime} · {venueName}
            </p>
          </div>
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
      >
        <div
          className="w-px bg-warm-gray/40"
          style={{
            height: '48px',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes scrollPulse {
            0%,100% { opacity: 0.3; transform: scaleY(0.6); }
            50% { opacity: 1; transform: scaleY(1); }
          }
        `}</style>
      </motion.div>
    </section>
  )
}

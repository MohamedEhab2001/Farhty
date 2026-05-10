import { useEffect, useRef, useState } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const { get } = useTemplateFields()
  const imageRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  const brideName   = get('bride_name')     ?? 'ليلى'
  const groomName   = get('groom_name')     ?? 'كريم'
  const weddingDate = get('wedding_date')   ?? ''
  const weddingTime = get('wedding_time')   ?? '٦:٠٠ مساءً'
  const tagline     = get('tagline')        ?? 'معًا إلى الأبد'
  const heroImage   = get('hero_image')     ?? ''
  const venueName   = get('ceremony_venue') ?? 'قاعة الأفراح'

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const formatDate = (raw: string) => {
    if (!raw) return '١٤ يونيو ٢٠٢٥'
    try {
      return new Date(raw).toLocaleDateString('ar-EG', {
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
      {/* ── Desktop: split — النص يميناً، الصورة يساراً ── */}
      <div className="hidden md:flex w-full h-full flex-row-reverse">

        {/* يمين — النص */}
        <div className="w-1/2 h-full flex items-center justify-center bg-ivory px-12 lg:px-20">
          <div className="w-full max-w-sm text-center">

            {/* خط إيطالي فوق الأسماء */}
            <motion.p
              className="font-amiri italic font-light text-warm-gray text-lg mb-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {tagline}
            </motion.p>

            {/* خط ذهبي */}
            <motion.span
              className="gold-line block mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center' }}
            />

            {/* الأسماء */}
            <motion.h1
              className="font-amiri font-normal leading-none text-charcoal mb-2"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', letterSpacing: '0.05em' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {groomName}
            </motion.h1>
            <motion.p
              className="font-amiri italic text-warm-gray text-xl mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              &amp;
            </motion.p>
            <motion.h1
              className="font-amiri font-normal leading-none text-charcoal"
              style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', letterSpacing: '0.05em' }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              {brideName}
            </motion.h1>

            {/* خط ذهبي سفلي */}
            <motion.span
              className="gold-line block mt-8 mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center' }}
            />

            {/* التاريخ والمكان */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <p className="font-tajawal font-light tracking-wider text-warm-gray" style={{ fontSize: '0.82rem' }}>
                {formatDate(weddingDate)}
              </p>
              <p className="font-tajawal font-light tracking-wider text-warm-gray" style={{ fontSize: '0.82rem' }}>
                {weddingTime} · {venueName}
              </p>
            </motion.div>
          </div>
        </div>

        {/* يسار — الصورة كاملة */}
        <div className="w-1/2 h-full parallax-container" ref={imageRef}>
          {heroImage ? (
            <div
              className="parallax-img w-full h-[110%]"
              style={{ transform: `translateY(${scrollY * -0.12}px)` }}
            >
              <img
                src={heroImage}
                alt="صورة العروسين"
                className="w-full h-full object-cover object-center"
                style={{ marginTop: '-5%' }}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-champagne flex items-center justify-center">
              <p className="font-amiri italic text-warm-gray text-lg opacity-50">صورة الغلاف</p>
            </div>
          )}
        </div>
      </div>

      {/* ── الجوال: الصورة فوق ٤٢٪، النص تحت ── */}
      <div className="flex flex-col md:hidden w-full h-full">
        <div className="parallax-container" style={{ height: '42%' }}>
          {heroImage ? (
            <img src={heroImage} alt="صورة العروسين" className="w-full h-full object-cover object-top" />
          ) : (
            <div className="w-full h-full bg-champagne flex items-center justify-center">
              <p className="font-amiri italic text-warm-gray text-sm opacity-50">صورة الغلاف</p>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center bg-ivory px-5 sm:px-8">
          <div className="text-center w-full">
            <p className="font-amiri italic font-light text-warm-gray text-base mb-4">{tagline}</p>
            <span className="gold-line block mb-5" />
            <h1 className="font-amiri font-normal text-charcoal leading-tight" style={{ fontSize: 'clamp(1.8rem, 8vw, 2.8rem)' }}>
              {groomName}
            </h1>
            <p className="font-amiri italic text-warm-gray text-lg my-1">&amp;</p>
            <h1 className="font-amiri font-normal text-charcoal leading-tight" style={{ fontSize: 'clamp(1.8rem, 8vw, 2.8rem)' }}>
              {brideName}
            </h1>
            <span className="gold-line block mt-5 mb-5" />
            <p className="font-tajawal font-light text-warm-gray" style={{ fontSize: '0.8rem' }}>
              {formatDate(weddingDate)}
            </p>
            <p className="font-tajawal font-light text-warm-gray mt-1" style={{ fontSize: '0.8rem' }}>
              {weddingTime} · {venueName}
            </p>
          </div>
        </div>
      </div>

      {/* مؤشر التمرير */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
      >
        <div className="w-px bg-warm-gray/40" style={{ height: '48px', animation: 'scrollPulse 2s ease-in-out infinite' }} />
        <style>{`@keyframes scrollPulse { 0%,100%{opacity:.3;transform:scaleY(.6)}50%{opacity:1;transform:scaleY(1)} }`}</style>
      </motion.div>
    </section>
  )
}

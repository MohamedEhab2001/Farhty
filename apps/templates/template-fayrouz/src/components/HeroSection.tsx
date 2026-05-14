import { useEffect, useRef, useState } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const { get } = useTemplateFields()
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const heroImage = get('hero_image')
  const opacity = Math.max(0, 1 - scrollY / 600)

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background image with parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform"
        style={{
          backgroundImage: heroImage ? `url(${heroImage})` : undefined,
          backgroundColor: '#FAF5EE',
          transform: `translateY(${scrollY * 0.4}px) scale(1.1)`,
          filter: 'blur(2px) saturate(0.7)',
        }}
      />
      {/* Gradient overlay instead of flat color */}
      <div className="absolute inset-0 bg-gradient-to-b from-ivory/80 via-ivory/60 to-ivory/90" />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)' }} />

      {/* Corner ornaments with float animation */}
      <motion.img
        src="/corner-floral.svg"
        alt=""
        className="absolute top-4 right-4 w-24 md:w-36 opacity-60"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.img
        src="/corner-floral.svg"
        alt=""
        className="absolute top-4 left-4 w-24 md:w-36 opacity-60 -scale-x-100"
        animate={{ y: [-3, 5, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.img
        src="/corner-floral.svg"
        alt=""
        className="absolute bottom-4 right-4 w-24 md:w-36 opacity-60 -scale-y-100"
        animate={{ y: [-5, 3, -5] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.img
        src="/corner-floral.svg"
        alt=""
        className="absolute bottom-4 left-4 w-24 md:w-36 opacity-60 -scale-x-100 -scale-y-100"
        animate={{ y: [-3, 4, -3] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4" style={{ opacity }}>
        {/* Rings icon */}
        <motion.img
          src="/rings-icon.svg"
          alt=""
          className="w-16 md:w-20 mx-auto mb-6"
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0, type: 'spring', stiffness: 100 }}
        />

        {/* Groom name */}
        <motion.h1
          className="font-amiri font-bold text-espresso leading-tight"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {get('groom_name') ?? 'كريم'}
        </motion.h1>

        {/* Decorative "و" */}
        <motion.div
          className="my-2 md:my-4 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.span
            className="block w-16 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A96E)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          <motion.span
            className="font-amiri font-bold gold-shimmer inline-block"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            و
          </motion.span>
          <motion.span
            className="block w-16 h-px"
            style={{ background: 'linear-gradient(-90deg, transparent, #C9A96E)' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>

        {/* Bride name */}
        <motion.h1
          className="font-amiri font-bold text-espresso leading-tight"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          {get('bride_name') ?? 'ليلى'}
        </motion.h1>

        {/* Date & tagline */}
        <motion.div
          className="mt-6 md:mt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <p className="font-amiri gold-shimmer text-lg md:text-2xl tracking-wide">
            {get('wedding_date')
              ? new Date(get('wedding_date')).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'التاريخ قريبًا'}
          </p>
          <p className="font-naskh text-espresso/50 mt-3 text-sm md:text-base">
            {get('tagline') ?? 'بداية قصة جديدة من الحب'}
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            className="w-6 h-10 mx-auto rounded-full border-2 border-gold/40 flex justify-center pt-2"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-gold"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom floral divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <img src="/floral-divider.svg" alt="" className="w-full h-12 md:h-16 object-cover opacity-50" />
      </div>
    </section>
  )
}

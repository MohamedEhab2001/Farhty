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
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: heroImage ? `url(${heroImage})` : undefined,
          backgroundColor: '#FAF5EE',
          transform: `translateY(${scrollY * 0.5}px)`,
          filter: 'blur(2px) saturate(0.7)',
        }}
      />
      {/* Warm ivory overlay */}
      <div className="absolute inset-0 bg-ivory/70" />

      {/* Corner ornaments */}
      <img
        src="/corner-floral.svg"
        alt=""
        className="absolute top-4 right-4 w-24 md:w-32 opacity-80"
        style={{ transform: `translateY(${scrollY * -0.3}px)` }}
      />
      <img
        src="/corner-floral.svg"
        alt=""
        className="absolute top-4 left-4 w-24 md:w-32 opacity-80 -scale-x-100"
        style={{ transform: `translateY(${scrollY * -0.3}px)` }}
      />
      <img
        src="/corner-floral.svg"
        alt=""
        className="absolute bottom-4 right-4 w-24 md:w-32 opacity-80 -scale-y-100"
        style={{ transform: `translateY(${scrollY * -0.3}px)` }}
      />
      <img
        src="/corner-floral.svg"
        alt=""
        className="absolute bottom-4 left-4 w-24 md:w-32 opacity-80 -scale-x-100 -scale-y-100"
        style={{ transform: `translateY(${scrollY * -0.3}px)` }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4" style={{ opacity }}>
        {/* Rings icon */}
        <motion.img
          src="/rings-icon.svg"
          alt=""
          className="w-16 md:w-20 mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0 }}
        />

        {/* Groom name */}
        <motion.h1
          className="font-amiri font-bold text-espresso leading-tight"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {get('groom_name') ?? 'كريم'}
        </motion.h1>

        {/* Decorative "و" */}
        <motion.div
          className="my-2 md:my-4 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <span className="block w-12 h-px bg-gold/50" />
          <motion.span
            className="font-amiri font-bold text-gold inline-block"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            و
          </motion.span>
          <span className="block w-12 h-px bg-gold/50" />
        </motion.div>

        {/* Bride name */}
        <motion.h1
          className="font-amiri font-bold text-espresso leading-tight"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          {get('bride_name') ?? 'ليلى'}
        </motion.h1>

        {/* Date & tagline */}
        <motion.div
          className="mt-6 md:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="font-amiri text-gold text-lg md:text-xl tracking-wide">
            {get('wedding_date')
              ? new Date(get('wedding_date')).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'التاريخ قريبًا'}
          </p>
          <p className="font-naskh text-espresso/60 mt-2 text-sm md:text-base">
            {get('tagline') ?? 'بداية قصة جديدة من الحب'}
          </p>
        </motion.div>
      </div>

      {/* Bottom floral divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <img src="/floral-divider.svg" alt="" className="w-full h-12 md:h-16 object-cover opacity-60" />
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface HeroSectionProps {
  heroImage: string
  brideName: string
  groomName: string
  accentColor: string
}

export default function HeroSection({ heroImage, brideName, groomName, accentColor }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        if (rect.bottom > 0) {
          setScrollY(-rect.top * 0.3)
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center"
      dir="rtl"
    >
      {/* Parallax background image */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY}px)`,
          scale: '1.15',
          transition: 'transform 0.1s linear',
        }}
      >
        {heroImage ? (
          <img
            src={heroImage}
            alt="خلفية الزفاف"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.6) saturate(0.8)' }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, #3d2e1e 0%, #6b5229 40%, #4a3818 100%)`,
            }}
          />
        )}
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(253,248,240,0) 0%, rgba(61,46,30,0.3) 50%, rgba(253,248,240,0.85) 100%)',
        }}
      />

      {/* Decorative top ornament */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <svg width="80" height="40" viewBox="0 0 80 40">
          <path d="M10 35 Q25 10 40 20 Q55 10 70 35" stroke={accentColor} fill="none" strokeWidth="1" opacity="0.6" />
          <path d="M20 30 Q40 15 60 30" stroke={accentColor} fill="none" strokeWidth="0.5" opacity="0.4" />
          <circle cx="40" cy="20" r="2" fill={accentColor} opacity="0.5" />
        </svg>
      </motion.div>

      {/* Names reveal */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          <span
            className="block text-lg sm:text-xl font-body font-light tracking-widest mb-2"
            style={{ color: accentColor }}
          >
            نسأل الله التوفيق والسعادة
          </span>
        </motion.div>

        <motion.h1
          className="font-display font-bold mb-4"
          style={{
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            color: '#fefdfb',
            textShadow: '0 4px 30px rgba(201, 169, 110, 0.3)',
            lineHeight: 1.2,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.7 }}
        >
          {brideName}
        </motion.h1>

        <motion.div
          className="flex items-center justify-center gap-4 my-4"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="w-16 h-px" style={{ backgroundColor: accentColor, opacity: 0.6 }} />
          <span style={{ color: accentColor, fontSize: '1.5rem' }}>&</span>
          <div className="w-16 h-px" style={{ backgroundColor: accentColor, opacity: 0.6 }} />
        </motion.div>

        <motion.h1
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            color: '#fefdfb',
            textShadow: '0 4px 30px rgba(201, 169, 110, 0.3)',
            lineHeight: 1.2,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={loaded ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: 1.5 }}
        >
          {groomName}
        </motion.h1>

        <motion.p
          className="mt-6 font-body text-base sm:text-lg"
          style={{ color: 'rgba(253, 248, 240, 0.8)' }}
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 2 }}
        >
          يدعونكم لمشاركة فرحتهم
        </motion.p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32" style={{
        background: 'linear-gradient(transparent, #fefdfb)',
      }} />
    </section>
  )
}
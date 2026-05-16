import { useEffect, useRef, useState, useCallback } from 'react'
import { Promo } from '../hooks/usePromos'

const THEME_OVERLAY: Record<string, string> = {
  purple: 'from-[#6b3d7e]/70 via-[#6b3d7e]/30 to-transparent',
  gold:   'from-[#8a5e10]/70 via-[#8a5e10]/30 to-transparent',
  rose:   'from-[#a83050]/70 via-[#a83050]/30 to-transparent',
  dark:   'from-[#1a1220]/80 via-[#1a1220]/40 to-transparent',
}

const THEME_BTN: Record<string, string> = {
  purple: 'bg-white text-[#6b3d7e] hover:bg-white/90',
  gold:   'bg-white text-[#8a5e10] hover:bg-white/90',
  rose:   'bg-white text-[#a83050] hover:bg-white/90',
  dark:   'bg-[#a66b96] text-white hover:bg-[#955d85]',
}

const THEME_BADGE: Record<string, string> = {
  purple: 'bg-white/20 text-white border border-white/30',
  gold:   'bg-white/20 text-white border border-white/30',
  rose:   'bg-white/20 text-white border border-white/30',
  dark:   'bg-[#a66b96]/30 text-[#d49bbd] border border-[#a66b96]/40',
}

interface SlideProps {
  promo: Promo
  active: boolean
}

function Slide({ promo, active }: SlideProps) {
  const overlay = THEME_OVERLAY[promo.theme] ?? THEME_OVERLAY.dark
  const btnStyle = THEME_BTN[promo.theme] ?? THEME_BTN.purple
  const badgeStyle = THEME_BADGE[promo.theme] ?? THEME_BADGE.purple

  const handleCta = () => {
    const link = promo.ctaLink || '#templates'
    if (link.startsWith('#')) {
      document.getElementById(link.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      {/* image */}
      {promo.imageUrl ? (
        <img
          src={promo.imageUrl}
          alt={promo.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#a66b96] to-[#6b3d7e]" />
      )}

      {/* gradient overlay for text */}
      <div className={`absolute inset-0 bg-gradient-to-t ${overlay}`} />

      {/* text content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8" dir="rtl">
        {promo.badge && (
          <span className={`${badgeStyle} text-xs font-bold px-3 py-1 rounded-full self-start mb-3 backdrop-blur-sm`}>
            {promo.badge}
          </span>
        )}
        <h3 className="text-white text-xl md:text-2xl font-bold leading-snug drop-shadow mb-1">
          {promo.title}
        </h3>
        {promo.subtitle && (
          <p className="text-white/80 text-sm md:text-base mb-4 leading-relaxed max-w-lg drop-shadow">
            {promo.subtitle}
          </p>
        )}
        <button
          onClick={handleCta}
          className={`${btnStyle} text-sm font-bold px-5 py-2.5 rounded-xl self-start transition-all active:scale-[0.97] shadow-md`}
        >
          {promo.ctaLabel}
        </button>
      </div>
    </div>
  )
}

interface PromoBannersProps {
  banners: Promo[]
}

export default function PromoBanners({ banners }: PromoBannersProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const count = banners.length

  const next = useCallback(() => setCurrent(c => (c + 1) % count), [count])
  const prev = () => setCurrent(c => (c - 1 + count) % count)

  useEffect(() => {
    if (count <= 1 || paused) return
    timerRef.current = setInterval(next, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [count, paused, next])

  if (count === 0) return null

  return (
    <section className="py-6" dir="rtl">
      <div className="container-luxe">
        <div
          className="relative w-full overflow-hidden rounded-2xl shadow-lg"
          style={{ aspectRatio: '3 / 1', minHeight: '180px', maxHeight: '320px' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {banners.map((b, i) => (
            <Slide key={b._id} promo={b} active={i === current} />
          ))}

          {/* Prev / Next arrows */}
          {count > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute top-1/2 right-3 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-all"
                aria-label="السابق"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </button>
              <button
                onClick={next}
                className="absolute top-1/2 left-3 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-all"
                aria-label="التالي"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
              </button>
            </>
          )}

          {/* Dot indicators */}
          {count > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`الشريحة ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

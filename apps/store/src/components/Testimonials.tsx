import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal } from './Reveal'

const testimonialImages = import.meta.glob('../assets/testimonials/*.{png,jpg,jpeg,webp}', {
  eager: true,
  as: 'url',
})

const IMAGES = Object.values(testimonialImages) as string[]

const MARQUEE_BRANDS = ['Vogue Arabia', "Harper's Bazaar", 'Brides Egypt', 'The Wedding Edit', 'Layali Magazine', 'Arabia Weddings']

export default function Testimonials() {
  const total = IMAGES.length
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll the track so the target card is centered in the viewport
  const scrollToIndex = useCallback((index: number) => {
    const track = scrollRef.current
    if (!track) return
    const card = track.children[index] as HTMLElement
    if (!card) return
    track.scrollTo({
      left: card.offsetLeft - track.clientWidth / 2 + card.clientWidth / 2,
      behavior: 'smooth',
    })
  }, [])

  // Auto-advance every 3.5 s, paused on hover or while lightbox is open
  useEffect(() => {
    if (paused || lightbox !== null || total <= 1) return
    const id = setInterval(() => {
      setCurrent(c => {
        const next = (c + 1) % total
        scrollToIndex(next)
        return next
      })
    }, 3500)
    return () => clearInterval(id)
  }, [paused, lightbox, total, scrollToIndex])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') setLightbox(i => i === null ? null : (i - 1 + total) % total)
      if (e.key === 'ArrowLeft') setLightbox(i => i === null ? null : (i + 1) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, total])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  const goTo = (index: number) => {
    setCurrent(index)
    scrollToIndex(index)
  }
  const goPrev = () => goTo((current - 1 + total) % total)
  const goNext = () => goTo((current + 1) % total)

  const openLightbox = (index: number) => {
    setLightbox(index)
    setCurrent(index)
  }
  const closeLightbox = () => setLightbox(null)
  const lightboxPrev = (e: React.MouseEvent) => { e.stopPropagation(); setLightbox(i => i === null ? null : (i - 1 + total) % total) }
  const lightboxNext = (e: React.MouseEvent) => { e.stopPropagation(); setLightbox(i => i === null ? null : (i + 1) % total) }

  return (
    <section id="testimonials" className="py-20 sm:py-28 px-4 scroll-mt-24">
      <div className="max-w-6xl mx-auto">

        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow">آراء العملاء</span>
          <h2 className="text-4xl md:text-5xl mt-5 text-[#3d2c38]">
            ثقة عملائنا في <span className="italic text-[#955d85]">"فرحتي"</span>
          </h2>
          <div className="divider-ornament my-5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
            </svg>
          </div>
          <p className="text-[#8c7a87]">لقطات من محادثاتنا مع العرسان الذين شاركونا فرحتهم</p>
        </Reveal>

        {/* ── Carousel ── */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Prev arrow */}
          {total > 1 && (
            <button
              onClick={goPrev}
              aria-label="السابق"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-3 sm:-mr-5 w-10 h-10 rounded-full bg-white border border-[#ebdce3] shadow-md flex items-center justify-center text-[#955d85] hover:bg-[#fff7fa] hover:border-[#a66b96] transition-all duration-200 active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {total > 1 && (
            <button
              onClick={goNext}
              aria-label="التالي"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-3 sm:-ml-5 w-10 h-10 rounded-full bg-white border border-[#ebdce3] shadow-md flex items-center justify-center text-[#955d85] hover:bg-[#fff7fa] hover:border-[#a66b96] transition-all duration-200 active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Track — forced LTR so offsetLeft is predictable regardless of page direction */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
            style={{ direction: 'ltr' }}
          >
            {IMAGES.map((img, i) => (
              <div
                key={i}
                onClick={() => openLightbox(i)}
                className={`relative flex-none w-[280px] sm:w-[380px] overflow-hidden rounded-2xl border bg-white shadow-sm cursor-zoom-in transition-all duration-300 ${i === current
                    ? 'border-[#a66b96]/60 shadow-[0_4px_24px_rgba(166,107,150,0.18)] scale-[1.02]'
                    : 'border-[#ebdce3]/60 opacity-75 hover:opacity-100 hover:border-[#a66b96]/30'
                  }`}
              >
                <img
                  src={img}
                  alt={`رأي عميل ${i + 1}`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/380x200/fff7fa/a66b96?text=Farhty' }}
                />
                {/* Enlarge hint overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#3d2c38]/0 hover:bg-[#3d2c38]/20 transition-colors duration-300">
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2.5 shadow-lg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a66b96" strokeWidth="2" strokeLinecap="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          {total > 1 && (
            <div className="flex justify-center gap-2 mt-5">
              {IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`الانتقال إلى صورة ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${i === current
                      ? 'w-5 h-2 bg-[#a66b96]'
                      : 'w-2 h-2 bg-[#ebdce3] hover:bg-[#d49bbd]'
                    }`}
                />
              ))}
            </div>
          )}
        </div>


        {/* ── CTA ── */}
        <div className="mt-16 text-center">
          <p className="text-[#8c7a87] text-sm mb-6">هل تريدين أن تكون دعوتك القادمة؟</p>
          <button
            onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            استعرضي القوالب الآن
          </button>
        </div>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          >
            {/* Image container */}
            <motion.div
              key={lightbox}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
              onClick={e => e.stopPropagation()}
              className="relative max-h-[90vh] max-w-lg w-full flex items-center justify-center"
            >
              <img
                src={IMAGES[lightbox]}
                alt={`رأي عميل ${lightbox + 1}`}
                className="max-h-[90vh] max-w-full w-auto object-contain rounded-xl shadow-2xl"
                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x711/fff7fa/a66b96?text=Farhty' }}
              />
            </motion.div>

            {/* Close */}
            <button
              onClick={closeLightbox}
              aria-label="إغلاق"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Prev (right side in RTL display) */}
            {total > 1 && (
              <button
                onClick={lightboxPrev}
                aria-label="السابق"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}

            {/* Next (left side in RTL display) */}
            {total > 1 && (
              <button
                onClick={lightboxNext}
                aria-label="التالي"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm tabular-nums">
              {lightbox + 1} / {total}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

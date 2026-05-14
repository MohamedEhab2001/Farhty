import { useEffect, useRef, useState } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'

interface StoryImage { url: string }

export default function OurStorySection() {
  const { get } = useTemplateFields()
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const storyText = get('story_text') ??
    'منذ اللحظة التي التقينا فيها، أدركنا أن هذا شيء نادر وجميل. عبر كل الفصول، وكل التحديات، وكل لحظة هادئة بينهما — اخترنا بعضنا. اليوم، نحتفل ببداية الأبد.'

  const rawImages = get('story_images')
  const storyImages: StoryImage[] = (() => {
    if (Array.isArray(rawImages)) return rawImages.map((u: string) => ({ url: u }))
    if (typeof rawImages === 'string') {
      try { return (JSON.parse(rawImages) as string[]).map((u) => ({ url: u })) }
      catch { return [] }
    }
    return []
  })()

  const placeholderColors = ['#F0E8D5', '#E8DDD0', '#EDE4D4']
  const rotations = [-3.5, 2.2, -1.8]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const photos = storyImages.length > 0
    ? storyImages.slice(0, 3)
    : placeholderColors.map((c) => ({ url: '', color: c }))

  return (
    <section ref={sectionRef} id="our-story" className="py-14 md:py-36 bg-ivory overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-24">

          {/* يمين — الصور البولارويد */}
          <div
            className="relative w-full md:w-1/2 flex-shrink-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(40px)',
              transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div className="relative" style={{ minHeight: 'clamp(320px, 85vw, 480px)' }}>
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className="polaroid absolute"
                  style={{
                    width: i === 0 ? '72%' : '62%',
                    top: i === 0 ? '0' : i === 1 ? '15%' : '35%',
                    left: i === 0 ? '5%' : i === 1 ? '25%' : '10%',
                    transform: `rotate(${rotations[i]}deg)`,
                    zIndex: 3 - i,
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.transform = `rotate(${rotations[i] * 0.3}deg) scale(1.03)`
                    ;(e.currentTarget as HTMLElement).style.zIndex = '10'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.transform = `rotate(${rotations[i]}deg) scale(1)`
                    ;(e.currentTarget as HTMLElement).style.zIndex = String(3 - i)
                  }}
                >
                  {'url' in photo && photo.url ? (
                    <img
                      src={photo.url}
                      alt={`صورتنا ${i + 1}`}
                      style={{ width: '100%', aspectRatio: i === 1 ? '4/3' : '3/4', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', aspectRatio: i === 1 ? '4/3' : '3/4', background: ('color' in photo ? (photo.color as string) : '#F0E8D5') }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* يسار — النص */}
          <div
            className="w-full md:w-1/2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-40px)',
              transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1) 0.15s',
            }}
          >
            <p className="font-tajawal font-light text-warm-gray mb-4" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
              قصة حب
            </p>
            <h2
              className="font-amiri italic font-light text-charcoal leading-tight mb-6"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}
            >
              كيف بدأت الحكاية
            </h2>
            <div className="mb-8" style={{ width: '48px', height: '1px', background: 'var(--gold)' }} />
            <p
              className="font-tajawal font-light text-charcoal/70 leading-relaxed"
              style={{ fontSize: '0.95rem', lineHeight: '2' }}
            >
              {storyText}
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

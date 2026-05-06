import { useEffect, useRef, useState } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'

export default function GallerySection() {
  const { get } = useTemplateFields()
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const rawImages = get('gallery_images')
  const galleryImages: string[] = (() => {
    if (Array.isArray(rawImages)) return rawImages
    if (typeof rawImages === 'string') {
      try {
        const parsed = JSON.parse(rawImages)
        return Array.isArray(parsed) ? parsed : []
      } catch { return [] }
    }
    return []
  })()

  // Fallback placeholder colors if no images yet
  const placeholderHeights = [280, 360, 220, 300, 260, 340, 200, 320, 260]
  const placeholderColors  = [
    '#F0E8D5', '#EDE4D4', '#F5EDE0', '#E8DDD0',
    '#F0E8D5', '#EDE4D4', '#F8F2E8', '#E8DDD0', '#F0E8D5',
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const hasImages = galleryImages.length > 0

  // Split into 3 columns for masonry
  const col1: (string | null)[] = []
  const col2: (string | null)[] = []
  const col3: (string | null)[] = []

  if (hasImages) {
    galleryImages.forEach((img, i) => {
      if (i % 3 === 0) col1.push(img)
      else if (i % 3 === 1) col2.push(img)
      else col3.push(img)
    })
  } else {
    // Use 9 placeholder slots
    const count = 9
    Array.from({ length: count }).forEach((_, i) => {
      if (i % 3 === 0) col1.push(null)
      else if (i % 3 === 1) col2.push(null)
      else col3.push(null)
    })
  }

  let globalIndex = 0

  const renderItem = (src: string | null, colIndex: number, rowIndex: number) => {
    const idx = globalIndex++
    const height = placeholderHeights[idx % placeholderHeights.length]
    const color  = placeholderColors[idx % placeholderColors.length]
    const delay  = (colIndex * 0.1 + rowIndex * 0.12).toFixed(2)

    return (
      <div
        key={`${colIndex}-${rowIndex}`}
        className="gallery-item mb-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(32px)',
          transition: `all 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
          height: src ? undefined : `${height}px`,
        }}
      >
        {src ? (
          <img
            src={src}
            alt={`Gallery photo ${idx + 1}`}
            loading="lazy"
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: color }} />
        )}
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="py-24 md:py-36"
      style={{ backgroundColor: '#F8F4EC' }}
    >
      <div className="max-w-5xl mx-auto px-6">

        {/* Heading */}
        <div
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <p
            className="font-body uppercase tracking-[0.3em] text-warm-gray mb-3"
            style={{ fontSize: '0.62rem' }}
          >
            Moments
          </p>
          <h2
            className="font-display italic font-light text-charcoal"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}
          >
            Our Gallery
          </h2>
        </div>

        {/* Masonry grid — 3 columns on desktop, 2 on mobile */}
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
        >
          {/* Column 1 */}
          <div>
            {col1.map((src, rowIndex) => renderItem(src, 0, rowIndex))}
          </div>

          {/* Column 2 */}
          <div>
            {col2.map((src, rowIndex) => renderItem(src, 1, rowIndex))}
          </div>

          {/* Column 3 — hidden on mobile */}
          <div className="hidden md:block">
            {col3.map((src, rowIndex) => renderItem(src, 2, rowIndex))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 767px) {
          #gallery .grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  )
}

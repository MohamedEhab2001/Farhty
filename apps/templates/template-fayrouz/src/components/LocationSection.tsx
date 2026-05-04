import { useEffect, useRef, useState } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'

export default function LocationSection() {
  const { get } = useTemplateFields()
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const venueName = get('venue_name') ?? 'قاعة الأفراح'
  const venueAddress = get('venue_address') ?? 'العنوان'
  const mapUrl = get('map_url') ?? ''

  return (
    <section ref={ref} className="relative py-20 md:py-28 bg-ivory">
      {/* Floral divider top */}
      <div className="flex justify-center mb-10 opacity-60">
        <img src="/floral-divider.svg" alt="" className="w-72 md:w-96 h-auto" />
      </div>

      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2
          className="font-amiri text-espresso mb-8"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
        >
          مكان الاحتفال
        </h2>

        {/* Map embed */}
        {mapUrl && (
          <div
            className="rounded-2xl overflow-hidden border-2 border-gold/40 shadow-lg mx-auto transition-all duration-800"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'scale(1)' : 'scale(0.95)',
            }}
          >
            <iframe
              src={mapUrl}
              width="100%"
              height="400"
              style={{ border: 0, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[300px] md:h-[480px]"
            />
          </div>
        )}

        {/* Venue info */}
        <div
          className="mt-8 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '300ms',
          }}
        >
          <h3 className="font-amiri text-2xl text-espresso mb-2">{venueName}</h3>
          <p className="font-naskh text-espresso/60 mb-6">{venueAddress}</p>

          {mapUrl && (
            <a
              href={mapUrl.includes('embed') ? mapUrl.replace('/embed', '/place') : mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-xl bg-gold text-cream font-naskh font-semibold
                         hover:bg-gold/90 transition-colors shadow-md"
            >
              فتح في خرائط جوجل
            </a>
          )}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="mt-16">
        <img src="/wavy-divider.svg" alt="" className="w-full h-12 md:h-20" />
      </div>
    </section>
  )
}

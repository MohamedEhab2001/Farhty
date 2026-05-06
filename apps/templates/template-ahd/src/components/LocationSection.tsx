import { useEffect, useRef, useState } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'

export default function LocationSection() {
  const { get } = useTemplateFields()
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const mapEmbedUrl    = get('map_embed_url')     as string | undefined
  const mapLocationUrl = get('map_location_url')  as string | undefined
  const venueName      = get('reception_venue')   ?? 'قاعة الأفراح'
  const venueAddress   = get('reception_address') ?? ''

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  if (!mapEmbedUrl) return null

  return (
    <section ref={sectionRef} id="location" className="bg-ivory py-24 md:py-36">
      <div className="max-w-4xl mx-auto px-6">

        <div
          className="text-center mb-12"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 1s cubic-bezier(0.22,1,0.36,1)' }}
        >
          <p className="font-tajawal font-light text-warm-gray mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            اعثر علينا
          </p>
          <h2 className="font-amiri italic font-light text-charcoal mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            {venueName}
          </h2>
          {venueAddress && (
            <p className="font-tajawal font-light text-warm-gray" style={{ fontSize: '0.82rem' }}>
              {venueAddress}
            </p>
          )}
        </div>

        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1) 0.15s',
            overflow: 'hidden',
            border: '1px solid rgba(196,163,90,0.2)',
          }}
        >
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="420"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="خريطة موقع القاعة"
          />
        </div>

        {mapLocationUrl && (
          <div className="flex justify-center mt-8" style={{ opacity: visible ? 1 : 0, transition: 'opacity 1s ease 0.3s' }}>
            <a
              href={mapLocationUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.9rem 2.2rem', borderRadius: '999px',
                border: '1px solid #C4A35A', color: '#C4A35A',
                fontFamily: 'Tajawal, sans-serif', fontWeight: 300,
                fontSize: '0.85rem', textDecoration: 'none',
                transition: 'background 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = '#C4A35A'
                ;(e.currentTarget as HTMLAnchorElement).style.color = '#FDFAF4'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLAnchorElement).style.color = '#C4A35A'
              }}
            >
              <svg viewBox="0 0 20 20" fill="none" style={{ width: '14px', height: '14px' }}>
                <path d="M10 2C7.24 2 5 4.24 5 7c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="10" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              احصل على الاتجاهات
            </a>
          </div>
        )}

      </div>
    </section>
  )
}

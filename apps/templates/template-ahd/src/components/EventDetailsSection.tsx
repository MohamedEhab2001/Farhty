import { useEffect, useRef, useState } from 'react'
import { useTemplateFields } from '@farhty/template-sdk'

function CeremonyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '32px', height: '32px' }}>
      <path d="M10 40 L10 24 Q10 10 24 10 Q38 10 38 24 L38 40" stroke="#C4A35A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="6" y1="40" x2="42" y2="40" stroke="#C4A35A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="24" y1="4" x2="24" y2="12" stroke="#C4A35A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="20" y1="8" x2="28" y2="8" stroke="#C4A35A" strokeWidth="1.2" strokeLinecap="round"/>
      <rect x="19" y="28" width="10" height="12" rx="1" stroke="#C4A35A" strokeWidth="1"/>
    </svg>
  )
}

function ReceptionIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '32px', height: '32px' }}>
      <path d="M8 42 L8 20 Q8 8 24 8 Q40 8 40 20 L40 42" stroke="#C4A35A" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="4" y1="42" x2="44" y2="42" stroke="#C4A35A" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M16 42 L16 26 Q16 18 24 18 Q32 18 32 26 L32 42" stroke="#C4A35A" strokeWidth="0.8" strokeLinecap="round"/>
      <circle cx="24" cy="8" r="2.5" stroke="#C4A35A" strokeWidth="1"/>
    </svg>
  )
}

export default function EventDetailsSection() {
  const { get } = useTemplateFields()
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const ceremonyVenue   = get('ceremony_venue')   ?? 'كنيسة القديسة مريم'
  const ceremonyTime    = get('ceremony_time')    ?? '٥:٠٠ مساءً'
  const ceremonyAddress = get('ceremony_address') ?? 'شارع الكنيسة ١٢٣، القاهرة'
  const receptionVenue  = get('reception_venue')  ?? 'قاعة الأفراح الكبرى'
  const receptionTime   = get('reception_time')   ?? '٧:٠٠ مساءً'
  const receptionAddress= get('reception_address') ?? 'شارع الحديقة ٤٥٦، القاهرة'

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const cards = [
    { icon: <CeremonyIcon />,  label: 'حفل الزواج',     time: ceremonyTime,   venue: ceremonyVenue,   address: ceremonyAddress },
    { icon: <ReceptionIcon />, label: 'حفل الاستقبال',  time: receptionTime,  venue: receptionVenue,  address: receptionAddress },
  ]

  return (
    <section ref={sectionRef} id="event-details" className="py-24 md:py-36 bg-ivory">
      <div className="max-w-4xl mx-auto px-6">

        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 1s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <p className="font-tajawal font-light text-warm-gray mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            انضموا إلينا
          </p>
          <h2 className="font-amiri italic font-light text-charcoal" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
            تفاصيل الحفل
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {cards.map((card, i) => (
            <div
              key={card.label}
              className="event-card p-10 md:p-12 text-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `all 1s cubic-bezier(0.22,1,0.36,1) ${0.15 + i * 0.18}s`,
              }}
            >
              <div className="flex justify-center mb-6">{card.icon}</div>
              <p className="font-tajawal font-light text-warm-gray mb-4" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                {card.label}
              </p>
              <p className="font-amiri italic font-light text-gold mb-3" style={{ fontSize: '1.4rem' }}>
                {card.time}
              </p>
              <h3 className="font-amiri text-charcoal mb-3" style={{ fontSize: '1.1rem', fontWeight: 400 }}>
                {card.venue}
              </h3>
              <div className="mx-auto mb-4" style={{ width: '32px', height: '1px', background: 'var(--gold)', opacity: 0.5 }} />
              <p className="font-tajawal font-light text-warm-gray" style={{ fontSize: '0.82rem', lineHeight: 1.7 }}>
                {card.address}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

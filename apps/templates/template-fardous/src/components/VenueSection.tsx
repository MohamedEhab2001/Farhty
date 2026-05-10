interface Props {
  venueName: string
  venueAddress: string
  venueMapUrl: string
  venueMapLink: string
}

export default function VenueSection({ venueName, venueAddress, venueMapUrl, venueMapLink }: Props) {
  return (
    <div dir="rtl">
      <p className="text-sm tracking-[0.15em]" style={{ color: 'rgba(26,64,48,0.7)', fontFamily: 'Tajawal, sans-serif' }}>
        كيف تصل إلينا
      </p>
      <h3 className="mt-3 text-3xl md:text-4xl" style={{ color: 'var(--ink)', fontFamily: 'Amiri, serif' }}>
        {venueName}
      </h3>
      <p className="mt-1 text-sm" style={{ color: 'rgba(26,26,46,0.6)', fontFamily: 'Tajawal, sans-serif' }}>
        {venueAddress}
      </p>

      {venueMapUrl && (
        <div className="mt-6 overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(184,150,46,0.4)', boxShadow: 'var(--shadow-gold)' }}>
          <iframe
            src={venueMapUrl}
            title="موقع القاعة"
            className="h-72 w-full md:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            style={{ border: 'none', display: 'block' }}
          />
        </div>
      )}

      {venueMapLink && (
        <a
          href={venueMapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-7 py-3 text-sm tracking-[0.1em] transition-transform hover:scale-105"
          style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-gold)', color: 'var(--cream)', fontFamily: 'Tajawal, sans-serif', fontWeight: 500 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11l19-9-9 19-2-8-8-2z"/>
          </svg>
          احصل على الاتجاهات
        </a>
      )}
    </div>
  )
}

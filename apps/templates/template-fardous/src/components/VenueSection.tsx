import { Navigation } from 'lucide-react'

interface Props {
  venueName: string
  venueAddress: string
  venueMapUrl: string
  venueMapLink: string
}

export default function VenueSection({ venueName, venueAddress, venueMapUrl, venueMapLink }: Props) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.4em]" style={{ color: 'rgba(26,64,48,0.7)' }}>
        Find your way to us
      </p>
      <h3 className="mt-3 font-display text-3xl md:text-4xl" style={{ color: 'var(--ink)' }}>
        {venueName}
      </h3>
      <p className="mt-1 text-sm italic" style={{ color: 'rgba(26,26,46,0.6)' }}>{venueAddress}</p>

      {venueMapUrl && (
        <div className="mt-6 overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(184,150,46,0.4)', boxShadow: 'var(--shadow-gold)' }}>
          <iframe
            src={venueMapUrl}
            title="Venue location map"
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
          className="mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 font-display text-sm uppercase tracking-[0.3em] transition-transform hover:scale-105"
          style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--shadow-gold)', color: 'var(--cream)' }}
        >
          <Navigation className="h-4 w-4" />
          Get Directions
        </a>
      )}
    </div>
  )
}

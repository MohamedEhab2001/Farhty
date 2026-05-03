interface FooterProps {
  accentColor: string
}

export default function Footer({ accentColor }: FooterProps) {
  return (
    <footer className="py-8 px-4 text-center" style={{ background: '#fdf8f0', borderTop: `1px solid ${accentColor}15` }}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="w-8 h-px" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
        <svg width="20" height="16" viewBox="0 0 20 16">
          <path d="M0 8 Q5 0 10 8 Q15 16 20 8" stroke={accentColor} fill="none" strokeWidth="1" opacity="0.4" />
        </svg>
        <div className="w-8 h-px" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
      </div>
      <p className="font-body text-xs" style={{ color: '#7a665080' }}>
        صُنع بكل حب من فارهتي
      </p>
    </footer>
  )
}
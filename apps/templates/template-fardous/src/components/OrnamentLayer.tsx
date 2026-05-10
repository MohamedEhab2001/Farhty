export default function OrnamentLayer() {
  const particles = Array.from({ length: 22 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280
    const r = seed / 233280
    return { left: `${(r * 100).toFixed(2)}%`, delay: `${(r * 12).toFixed(2)}s`, duration: `${(14 + r * 14).toFixed(2)}s`, size: 4 + Math.round(r * 6) }
  })

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-20 top-1/4 h-72 w-72 rounded-full blur-3xl animate-float-slow" style={{ background: 'rgba(45,106,79,0.1)' }} />
      <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full blur-3xl animate-float-slow" style={{ background: 'rgba(184,150,46,0.2)', animationDelay: '2s' }} />

      <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow" style={{ opacity: 0.06 }} width="900" height="900" viewBox="0 0 200 200">
        <g fill="none" stroke="var(--emerald-deep)" strokeWidth="0.4">
          {Array.from({ length: 10 }).map((_, i) => <circle key={`c${i}`} cx="100" cy="100" r={15 + i * 9} />)}
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`l${i}`} x1="100" y1="100" x2={100 + 95 * Math.cos((i * Math.PI) / 8)} y2={100 + 95 * Math.sin((i * Math.PI) / 8)} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4
            return <path key={`p${i}`} d={`M100 100 Q${100 + 50 * Math.cos(a - 0.3)} ${100 + 50 * Math.sin(a - 0.3)} ${100 + 90 * Math.cos(a)} ${100 + 90 * Math.sin(a)}`} />
          })}
        </g>
      </svg>

      <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow" style={{ opacity: 0.04, animationDirection: 'reverse', animationDuration: '60s' }} width="1100" height="1100" viewBox="0 0 200 200">
        <g fill="none" stroke="var(--gold-deep)" strokeWidth="0.3">
          <circle cx="100" cy="100" r="95" strokeDasharray="2 4" />
          <circle cx="100" cy="100" r="80" strokeDasharray="6 6" />
        </g>
      </svg>

      {particles.map((p, i) => (
        <span key={i} className="absolute bottom-[-20px] rounded-full animate-drift-up" style={{ left: p.left, width: p.size, height: p.size, animationDelay: p.delay, animationDuration: p.duration, background: 'rgba(184,150,46,0.7)', boxShadow: '0 0 12px 2px rgba(184,150,46,0.4)' }} />
      ))}

      {Array.from({ length: 6 }).map((_, i) => (
        <svg key={`s${i}`} className="absolute animate-sparkle" style={{ left: `${15 + i * 14}%`, top: `${10 + ((i * 17) % 70)}%`, animationDelay: `${i * 0.6}s`, color: 'var(--gold)' }} width="14" height="14" viewBox="0 0 24 24">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" />
        </svg>
      ))}
    </div>
  )
}

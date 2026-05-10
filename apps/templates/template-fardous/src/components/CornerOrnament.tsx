export default function CornerOrnament({ className = '' }: { className?: string }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" className={className} aria-hidden style={{ color: 'var(--gold)' }}>
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M2 2 L2 30 M2 2 L30 2" />
        <path d="M2 14 Q14 14 14 2" />
        <circle cx="14" cy="14" r="3" />
        <path d="M22 2 Q22 8 16 8" />
      </g>
    </svg>
  )
}

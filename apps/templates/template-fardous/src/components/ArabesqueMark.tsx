export default function ArabesqueMark({ small = false }: { small?: boolean }) {
  const size = small ? 56 : 96
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto animate-shimmer">
      <defs>
        <linearGradient id="fardousGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#D4B870" />
          <stop offset="50%"  stopColor="#B8962E" />
          <stop offset="100%" stopColor="#8C6E1A" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#fardousGold)" strokeWidth="1.2">
        <circle cx="50" cy="50" r="34" />
        <circle cx="50" cy="50" r="26" />
        <path d="M50 16 C66 32 66 68 50 84 C34 68 34 32 50 16 Z" />
        <path d="M16 50 C32 34 68 34 84 50 C68 66 32 66 16 50 Z" />
        <circle cx="50" cy="50" r="6" fill="url(#fardousGold)" />
      </g>
    </svg>
  )
}

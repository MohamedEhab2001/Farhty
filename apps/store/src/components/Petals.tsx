export function Petals({ count = 12 }: { count?: number }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 97) % 100
        const dur = 14 + ((i * 7) % 12)
        const delay = (i * 1.3) % 10
        const size = 8 + ((i * 5) % 12)
        return (
          <span
            key={i}
            className="petal"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              animationDuration: `${dur}s`,
              animationDelay: `${-delay}s`,
              opacity: 0.45 + ((i % 4) * 0.1),
            }}
          />
        )
      })}
    </div>
  )
}

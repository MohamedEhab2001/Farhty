export default function FallingPetals() {
  const petals = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: 8 + Math.random() * 14,
    left: Math.random() * 100,
    delay: Math.random() * 15,
    duration: 12 + Math.random() * 10,
    drift: (Math.random() - 0.5) * 80,
    spin: Math.random() * 360,
    opacity: 0.3 + Math.random() * 0.4,
  }))

  return (
    <>
      <style>{`
        @keyframes warda-petal-fall {
          0% {
            transform: translateY(-5vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: var(--petal-opacity, 0.5); }
          90% { opacity: var(--petal-opacity, 0.5); }
          100% {
            transform: translateY(105vh) translateX(var(--petal-drift, 0px)) rotate(var(--petal-spin, 180deg));
            opacity: 0;
          }
        }
        .warda-petal {
          position: fixed;
          top: -5vh;
          pointer-events: none;
          z-index: 30;
          will-change: transform;
          animation: warda-petal-fall var(--petal-duration, 15s) linear var(--petal-delay, 0s) infinite;
        }
      `}</style>
      {petals.map(petal => (
        <div
          key={petal.id}
          className="warda-petal"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            '--petal-delay': `${petal.delay}s`,
            '--petal-duration': `${petal.duration}s`,
            '--petal-drift': `${petal.drift}px`,
            '--petal-spin': `${petal.spin}deg`,
            '--petal-opacity': petal.opacity,
            opacity: 0,
          } as React.CSSProperties}
        >
          <svg viewBox="0 0 20 20" fill="none" style={{ width: '100%', height: '100%' }}>
            <ellipse
              cx="10" cy="10"
              rx={petal.size > 15 ? 8 : 6}
              ry={petal.size > 15 ? 10 : 8}
              fill="#E8B4B4"
              opacity={petal.opacity}
              transform={`rotate(${petal.id * 25} 10 10)`}
            />
            <ellipse
              cx="10" cy="9"
              rx={petal.size > 15 ? 5 : 4}
              ry={petal.size > 15 ? 6 : 5}
              fill="#F5D0D0"
              opacity={petal.opacity * 0.7}
              transform={`rotate(${petal.id * 25} 10 10)`}
            />
          </svg>
        </div>
      ))}
    </>
  )
}
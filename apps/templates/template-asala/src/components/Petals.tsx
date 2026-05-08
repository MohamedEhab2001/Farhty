import { useMemo } from "react";

export function Petals({ count = 18 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 14,
        size: 8 + Math.random() * 14,
        opacity: 0.35 + Math.random() * 0.45,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 animate-petal"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
            background:
              "radial-gradient(ellipse at 30% 30%, oklch(0.92 0.08 25), oklch(0.55 0.18 18))",
            borderRadius: "50% 0 50% 50%",
            transform: "rotate(45deg)",
            filter: "blur(0.4px) drop-shadow(0 2px 4px oklch(0 0 0 / 0.3))",
          }}
        />
      ))}
    </div>
  );
}

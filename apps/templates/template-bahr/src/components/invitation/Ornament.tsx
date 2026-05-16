export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="ornament-line w-16 sm:w-24" />
      <svg width="24" height="24" viewBox="0 0 24 24" className="text-[var(--color-gold)]">
        <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" />
      </svg>
      <span className="ornament-line w-16 sm:w-24" />
    </div>
  );
}

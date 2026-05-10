import { useState } from 'react'
import { Template } from '../hooks/useTemplates'

interface TemplateCardProps {
  template: Template
  onBuy: (template: Template) => void
}

const LANGUAGE_LABELS: Record<string, string> = {
  ar: 'عربي',
  en: 'English',
  both: 'عربي + English',
}

const FEATURE_ICONS: Record<string, { icon: string; label: string }> = {
  music: { icon: '🎵', label: 'موسيقى' },
  gallery: { icon: '🖼️', label: 'معرض صور' },
  countdownTimer: { icon: '⏱️', label: 'عداد تنازلي' },
  rsvp: { icon: '✉️', label: 'RSVP' },
}

export default function TemplateCard({ template, onBuy }: TemplateCardProps) {
  const previewUrl = `https://preview-${template.slug}.farhty.online`
  const hasImage = template.previewImages && template.previewImages.length > 0
  const activeFeatures = Object.entries(FEATURE_ICONS).filter(
    ([key]) => template.features?.[key as keyof typeof template.features]
  )
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-luxe overflow-hidden group glint flex flex-col relative"
      dir="rtl"
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[1.25rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(166,107,150,0.08), transparent 60%)`,
            zIndex: 1,
          }}
        />
      )}

      <div className="relative aspect-[9/16] max-h-80 overflow-hidden bg-[#fdfbf7] img-zoom">
        {hasImage ? (
          <img
            src={template.previewImages[0]}
            alt={template.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-3">💍</div>
              <p className="text-[#8c7a87] text-sm">{template.name}</p>
            </div>
          </div>
        )}
        <div className="ornament-corner" />

        <div className="absolute top-3 right-3">
          <span className="bg-[#a66b96]/90 backdrop-blur-sm text-[#fdfbf7] text-xs font-semibold px-3 py-1 rounded-lg">
            {LANGUAGE_LABELS[template.language] || template.language}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'rgba(149, 93, 133, 0.55)' }}>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-luxe !bg-white !text-[#955d85] !border-white text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" /><circle cx="12" cy="12" r="3" /></svg>
            معاينة مباشرة
          </a>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl text-[#3d2c38]" style={{ fontFamily: "'Alexandria', sans-serif" }}>{template.name}</h3>
          <span className="text-[#a66b96] font-bold text-lg whitespace-nowrap mr-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {template.price} ج
          </span>
        </div>

        {template.description && (
          <p className="text-[#8c7a87] text-sm leading-relaxed mb-4 line-clamp-2">
            {template.description}
          </p>
        )}

        {/* {activeFeatures.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {activeFeatures.map(([key, { icon, label }]) => (
              <span
                key={key}
                className="bg-[#fdfbf7] border border-[#ebdce3]/60 text-[#8c7a87] text-xs px-2.5 py-1 rounded-full flex items-center gap-1"
              >
                <span>{icon}</span>
                <span>{label}</span>
              </span>
            ))}
          </div>
        )} */}

        <div className="flex gap-3 mt-auto pt-2">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            id={`preview-btn-${template.slug}`}
            className="flex-1 py-2.5 rounded-xl border border-[#ebdce3]/60 text-[#8c7a87] text-sm font-medium text-center hover:border-[#a66b96] hover:text-[#a66b96] hover:bg-[#fef8fc] active:scale-[0.98] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-2"
          >
            معاينة
          </a>
          <button
            id={`buy-btn-${template.slug}`}
            onClick={() => onBuy(template)}
            className="flex-1 py-2.5 rounded-xl bg-[#a66b96] text-[#fdfbf7] text-sm font-bold hover:bg-[#955d85] active:scale-[0.98] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-2"
          >
            اطلب الآن
          </button>
        </div>
      </div>
    </div>
  )
}

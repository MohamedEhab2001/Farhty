import { motion } from 'framer-motion'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="bg-[#fff7fa] shadow-sm border border-[#ebdce3]/50 rounded-3xl overflow-hidden card-glow transition-all duration-300 group flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[9/16] max-h-80 overflow-hidden bg-[#fdfbf7]">
        {hasImage ? (
          <img
            src={template.previewImages[0]}
            alt={template.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3">💍</div>
              <p className="text-[#8c7a87] text-sm">{template.name}</p>
            </div>
          </div>
        )}

        {/* Language badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-[#a66b96] text-[#fdfbf7] text-xs font-bold px-3 py-1 rounded-full">
            {LANGUAGE_LABELS[template.language] || template.language}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1" dir="rtl">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-[#3d2c38]">{template.name}</h3>
          <span className="text-[#d49bbd] font-bold text-lg whitespace-nowrap mr-2">
            {template.price} ج
          </span>
        </div>

        {template.description && (
          <p className="text-[#8c7a87] text-sm leading-relaxed mb-4 line-clamp-2">
            {template.description}
          </p>
        )}

        {/* Feature badges */}
        {activeFeatures.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {activeFeatures.map(([key, { icon, label }]) => (
              <span
                key={key}
                className="bg-[#fdfbf7] shadow-sm border border-[#ebdce3]/50 text-[#8c7a87] text-xs px-2 py-1 rounded-lg flex items-center gap-1"
              >
                <span>{icon}</span>
                <span>{label}</span>
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            id={`preview-btn-${template.slug}`}
            className="flex-1 py-2.5 rounded-xl shadow-sm border border-[#ebdce3]/50 text-[#8c7a87] text-sm font-medium text-center hover:border-[#a66b96] hover:text-[#a66b96] transition-all duration-200"
          >
            معاينة مباشرة
          </a>
          <button
            id={`buy-btn-${template.slug}`}
            onClick={() => onBuy(template)}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-l from-[#a66b96] to-[#d49bbd] text-[#fdfbf7] text-sm font-bold hover:from-[#d49bbd] hover:to-[#a66b96] transition-all duration-200 active:scale-95"
          >
            اطلب الآن
          </button>
        </div>
      </div>
    </motion.div>
  )
}

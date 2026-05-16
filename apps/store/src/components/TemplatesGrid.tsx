import { useTemplates } from '../hooks/useTemplates'
import { Template } from '../hooks/useTemplates'
import TemplateCard from './TemplateCard'
import { Reveal } from './Reveal'
import { IconTemplate } from './BrandIcons'

interface TemplatesGridProps {
  onBuy: (template: Template) => void
}

function SkeletonCard() {
  return (
    <div className="card-luxe overflow-hidden" dir="rtl">
      <div className="aspect-[9/16] max-h-80 bg-[#f2e0ef]/30 animate-pulse rounded-t-xl" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div className="h-5 w-24 bg-[#ebdce3]/40 rounded animate-pulse" />
          <div className="h-5 w-12 bg-[#ebdce3]/40 rounded animate-pulse" />
        </div>
        <div className="h-3 w-full bg-[#ebdce3]/30 rounded animate-pulse" />
        <div className="h-3 w-3/4 bg-[#ebdce3]/30 rounded animate-pulse" />
        <div className="flex gap-2 mt-4">
          <div className="h-3 w-14 bg-[#ebdce3]/30 rounded animate-pulse" />
          <div className="h-3 w-14 bg-[#ebdce3]/30 rounded animate-pulse" />
        </div>
        <div className="flex gap-3 mt-4 pt-2">
          <div className="flex-1 h-9 bg-[#ebdce3]/30 rounded-xl animate-pulse" />
          <div className="flex-1 h-9 bg-[#ebdce3]/40 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function TemplatesGrid({ onBuy }: TemplatesGridProps) {
  const { templates, loading, error } = useTemplates()

  return (
    <section id="templates" className="py-20 sm:py-28 px-4 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow">التصاميم</span>
          <h2 className="text-4xl md:text-5xl mt-5 text-[#3d2c38]">
            اختر تصميمك <span className="italic text-[#955d85]">المفضل</span>
          </h2>
          <div className="divider-ornament my-5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" /></svg>
          </div>
          <p className="text-[#8c7a87]">
            تصاميم دعوات رقمية تفاعلية بتصاميم فاخرة وقابلة للتخصيص الكامل — كل تفصيل مصنوع بعناية.
          </p>
        </Reveal>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#a66b96]/10 flex items-center justify-center">
              <IconTemplate size={28} className="text-[#a66b96]" />
            </div>
            <p className="text-[#8c7a87] font-medium">تعذّر تحميل التصاميم</p>
            <p className="text-[#8c7a87]/60 text-sm mt-1">يرجى المحاولة لاحقاً</p>
          </div>
        )}

        {!loading && !error && templates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#a66b96]/10 flex items-center justify-center">
              <IconTemplate size={28} className="text-[#d49bbd]" />
            </div>
            <p className="text-[#3d2c38] font-semibold text-lg">قريباً</p>
            <p className="text-[#8c7a87] text-sm mt-1">نعمل على تصاميم رائعة لكم</p>
          </div>
        )}

        {!loading && templates.length > 0 && (
          <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {templates.map(template => (
              <TemplateCard key={template._id} template={template} onBuy={onBuy} />
            ))}
          </Reveal>
        )}
      </div>
    </section>
  )
}

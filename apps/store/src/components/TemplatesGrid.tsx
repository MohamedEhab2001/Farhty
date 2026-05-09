import { motion } from 'framer-motion'
import { useTemplates } from '../hooks/useTemplates'
import { Template } from '../hooks/useTemplates'
import TemplateCard from './TemplateCard'
import { IconTemplate } from './BrandIcons'

interface TemplatesGridProps {
  onBuy: (template: Template) => void
}

function SkeletonCard() {
  return (
    <div className="bg-[#fff7fa] border border-[#ebdce3]/40 rounded-2xl overflow-hidden" dir="rtl">
      <div className="aspect-[9/16] max-h-80 bg-[#fdfbf7] animate-pulse" />
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
    <section id="templates" className="py-20 sm:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-label mb-4 block">القوالب</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c38] mb-4">
            اختر قالبك المفضل
          </h2>
          <p className="text-[#8c7a87] max-w-md mx-auto leading-relaxed">
            قوالب دعوات رقمية تفاعلية بتصاميم فاخرة وقابلة للتخصيص الكامل
          </p>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#a66b9610] flex items-center justify-center">
              <IconTemplate size={28} className="text-[#a66b96]" />
            </div>
            <p className="text-[#8c7a87] font-medium">تعذّر تحميل القوالب</p>
            <p className="text-[#8c7a87]/60 text-sm mt-1">يرجى المحاولة لاحقاً</p>
          </div>
        )}

        {!loading && !error && templates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#a66b9610] flex items-center justify-center">
              <IconTemplate size={28} className="text-[#d49bbd]" />
            </div>
            <p className="text-[#3d2c38] font-semibold text-lg">قريباً</p>
            <p className="text-[#8c7a87] text-sm mt-1">نعمل على قوالب رائعة لكم</p>
          </div>
        )}

        {!loading && templates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {templates.map(template => (
              <TemplateCard key={template._id} template={template} onBuy={onBuy} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
import { motion } from 'framer-motion'
import { useTemplates } from '../hooks/useTemplates'
import { Template } from '../hooks/useTemplates'
import TemplateCard from './TemplateCard'

interface TemplatesGridProps {
  onBuy: (template: Template) => void
}

export default function TemplatesGrid({ onBuy }: TemplatesGridProps) {
  const { templates, loading, error } = useTemplates()

  return (
    <section id="templates" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#a66b96] text-sm font-semibold tracking-widest uppercase mb-4 block">قوالبنا</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c38] mb-4">
            اختر قالبك المفضل
          </h2>
          <p className="text-[#8c7a87] max-w-xl mx-auto">
            قوالب دعوات رقمية تفاعلية بتصاميم فاخرة، قابلة للتخصيص الكامل
          </p>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#fff7fa] rounded-3xl h-96 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-[#8c7a87]">تعذّر تحميل القوالب. يرجى المحاولة لاحقاً.</p>
          </div>
        )}

        {!loading && !error && templates.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💍</div>
            <p className="text-[#8c7a87] text-lg">قريباً — نعمل على قوالب رائعة لكم!</p>
          </div>
        )}

        {!loading && templates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map(template => (
              <TemplateCard key={template._id} template={template} onBuy={onBuy} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

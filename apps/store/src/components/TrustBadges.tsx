import { motion } from 'framer-motion'
import { IconShield, IconHeadset, IconInstant, IconDiamond } from './BrandIcons'

const BADGES = [
  { icon: <IconShield size={22} className="text-[#a66b96]" />, title: 'ضمان الاسترداد', text: 'استرداد المبلغ كاملاً خلال 24 ساعة' },
  { icon: <IconHeadset size={22} className="text-[#a66b96]" />, title: 'دعم فني مجاني', text: 'مساعدة متاحة بعد الشراء' },
  { icon: <IconInstant size={22} className="text-[#a66b96]" />, title: 'تسليم فوري', text: 'دعوتك جاهزة خلال دقائق من الدفع' },
  { icon: <IconDiamond size={22} className="text-[#a66b96]" />, title: 'قوالب حصرية', text: 'تصاميم غير متاحة في أي مكان آخر' },
]

export default function TrustBadges() {
  return (
    <section className="py-20 sm:py-28 px-4 bg-[#fef8fc]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-label mb-4 block">ضمانات</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#3d2c38]">لماذا تختار فرحتي؟</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BADGES.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 bg-[#ffffff] border border-[#ebdce3]/50 rounded-xl px-5 py-4 transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(166,107,150,0.08)]"
              dir="rtl"
            >
              <div className="w-10 h-10 rounded-lg bg-[#a66b960a] border border-[#a66b9618] flex items-center justify-center flex-shrink-0">
                {badge.icon}
              </div>
              <div>
                <p className="text-[#3d2c38] font-semibold text-sm">{badge.title}</p>
                <p className="text-[#8c7a87] text-sm mt-0.5">{badge.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
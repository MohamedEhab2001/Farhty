import { motion } from 'framer-motion'
import { IconShield, IconHeadset, IconInstant, IconDiamond } from './BrandIcons'

const BADGES = [
  { icon: <IconShield size={24} className="text-[#a66b96]" />, text: 'ضمان استرداد المبلغ خلال 24 ساعة' },
  { icon: <IconHeadset size={24} className="text-[#a66b96]" />, text: 'دعم فني مجاني بعد الشراء' },
  { icon: <IconInstant size={24} className="text-[#a66b96]" />, text: 'تسليم فوري بعد تأكيد الدفع' },
  { icon: <IconDiamond size={24} className="text-[#a66b96]" />, text: 'قوالب حصرية غير متاحة في أي مكان آخر' },
]

export default function TrustBadges() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#3d2c38]">لماذا تختار فرحتي؟</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {BADGES.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 bg-[#fff7fa] shadow-sm border border-[#ebdce3]/50 rounded-2xl px-6 py-4"
              dir="rtl"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a66b9620] to-[#d49bbd20] border border-[#a66b9630] flex items-center justify-center text-2xl flex-shrink-0">
                {badge.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#a66b96] font-bold">✓</span>
                  <p className="text-[#3d2c38] font-medium text-sm">{badge.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { IconTemplate, IconChat, IconShare } from './BrandIcons'

const STEPS = [
  {
    num: '١',
    icon: <IconTemplate size={28} className="text-[#a66b96]" />,
    title: 'اختاري قالبك',
    desc: 'تصفّحي القوالب واختاري التصميم الذي يعكس ذوقك',
  },
  {
    num: '٢',
    icon: <IconChat size={28} className="text-[#a66b96]" />,
    title: 'تواصلي معنا',
    desc: 'راسلينا على واتساب لتأكيد الطلب وسداد المبلغ',
  },
  {
    num: '٣',
    icon: <IconShare size={28} className="text-[#a66b96]" />,
    title: 'شاركي دعوتك',
    desc: 'احصلي على الرابط وادخلي بياناتك وشاركيها مع ضيوفك فوراً',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 bg-[#fef8fc]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-label mb-4 block">خطوات بسيطة</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c38]">
            كيف يعمل فرحتي؟
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-8 md:gap-6 relative">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="flex-1 text-center md:text-center relative"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 rounded-2xl bg-white border border-[#ebdce3]/60 shadow-[0_2px_12px_rgba(166,107,150,0.08)] flex items-center justify-center mb-5">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-5 h-5 rounded-md bg-[#a66b96] flex items-center justify-center text-[#fdfbf7] text-[10px] font-bold">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-base font-bold text-[#3d2c38] mb-2">{step.title}</h3>
                <p className="text-[#8c7a87] text-sm leading-relaxed max-w-[220px]">{step.desc}</p>
              </div>

              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+44px)] w-[calc(50%-20px)] border-t border-dashed border-[#d49bbd]/40" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '١',
    icon: '🔍',
    title: 'اختار قالبك المفضل',
    desc: 'تصفّح قوالبنا الفاخرة واختر التصميم الذي يعكس ذوقك وشخصيتك',
  },
  {
    num: '٢',
    icon: '💬',
    title: 'تواصل معنا على واتساب',
    desc: 'راسلنا لتأكيد الطلب وسداد المبلغ بإحدى طرق الدفع المتاحة',
  },
  {
    num: '٣',
    icon: '✨',
    title: 'ادخل بياناتك وشارك دعوتك',
    desc: 'احصل على رابط دعوتك الخاصة واملأ بياناتك وشاركها مع ضيوفك فوراً',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#a66b96] text-sm font-semibold tracking-widest uppercase mb-4 block">خطوات بسيطة</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c38]">
            كيف يعمل فارهتي؟
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 right-[16.66%] left-[16.66%] h-px bg-gradient-to-l from-transparent via-[#a66b9640] to-transparent" />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#a66b9620] to-[#d49bbd20] border border-[#a66b9630] flex items-center justify-center text-4xl animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-[#a66b96] to-[#d49bbd] flex items-center justify-center text-[#fdfbf7] text-xs font-bold">
                  {step.num}
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#3d2c38] mb-3">{step.title}</h3>
              <p className="text-[#8c7a87] text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

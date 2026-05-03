import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'كيف أستلم الدعوة بعد الشراء؟',
    a: 'بعد تأكيد الدفع، نُرسل لك رابط دعوتك الخاصة فوراً على واتساب. تدخل عليه وتبدأ تعبئة بياناتك.',
  },
  {
    q: 'هل يمكنني تعديل البيانات بنفسي؟',
    a: 'نعم! الدعوة تحتوي على لوحة تحكم بسيطة تمكنك من تغيير الأسماء والتاريخ والصور بنفسك في أي وقت.',
  },
  {
    q: 'ما هي طرق الدفع المتاحة؟',
    a: 'نقبل الدفع عبر فودافون كاش على الرقم 00201027708044 أو إنستاباي على الحساب ehab201nbe.',
  },
  {
    q: 'كم يستغرق التسليم؟',
    a: 'التسليم فوري بعد تأكيد الدفع — خلال دقائق تكون دعوتك جاهزة.',
  },
  {
    q: 'هل يمكنني مشاركة الدعوة على واتساب؟',
    a: 'بالطبع! الدعوة رابط إلكتروني يمكن مشاركته بسهولة على واتساب وجميع منصات التواصل الاجتماعي.',
  },
  {
    q: 'ما هو سياسة الاسترداد؟',
    a: 'نضمن استرداد المبلغ كاملاً خلال 24 ساعة إذا لم تكن راضياً عن الخدمة لأي سبب.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#a66b96] text-sm font-semibold tracking-widest uppercase mb-4 block">الأسئلة الشائعة</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c38]">كل ما تريد معرفته</h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#fff7fa] shadow-sm border border-[#ebdce3]/50 rounded-2xl overflow-hidden"
            >
              <button
                id={`faq-btn-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-right"
              >
                <span className="text-[#3d2c38] font-semibold">{faq.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  className="text-[#a66b96] text-xl mr-4 flex-shrink-0"
                >
                  ▾
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-6 pb-5 text-[#8c7a87] leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'كيف أستلم الدعوة بعد الشراء؟',
    a: 'بعد تأكيد الدفع، نُرسل لك رابط دعوتك الخاصة فوراً على واتساب. تدخل عليه وتبدأ تعبئة بياناتك.',
  },
  {
    q: 'هل يمكنني تعديل البيانات بنفسي؟',
    a: 'نعم. الدعوة تحتوي على لوحة تحكم بسيطة تمكنك من تغيير الأسماء والتاريخ والصور بنفسك في أي وقت.',
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
    a: 'بالطبع. الدعوة رابط إلكتروني يمكن مشاركته بسهولة على واتساب وجميع منصات التواصل الاجتماعي.',
  },
  {
    q: 'ما هي سياسة الاسترداد؟',
    a: 'نضمن استرداد المبلغ كاملاً خلال 24 ساعة إذا لم تكوني راضية عن الخدمة لأي سبب.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 sm:py-28 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-label mb-4 block">الأسئلة الشائعة</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c38]">كل ما تريد معرفته</h2>
        </motion.div>

        <div className="space-y-2.5">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl overflow-hidden transition-colors duration-200 ${open === i ? 'bg-[#fff7fa] border border-[#a66b9620]' : 'bg-transparent border border-transparent'}`}
            >
              <button
                id={`faq-btn-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between text-right gap-4 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-2 rounded-xl"
              >
                <span className="text-[#3d2c38] font-semibold text-sm sm:text-[15px]">{faq.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#a66b96] text-sm flex-shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6L8 10L12 6" />
                  </svg>
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
                    <p className="px-5 pb-4 text-[#8c7a87] text-sm leading-relaxed">{faq.a}</p>
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
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal } from './Reveal'

const FAQS = [
  { q: 'كيف أستلم الدعوة بعد الشراء؟', a: 'بعد تأكيد الدفع، نُرسل لك رابط دعوتك الخاصة فوراً على واتساب. تدخل عليه وتبدأ تعبئة بياناتك.' },
  { q: 'هل يمكنني تعديل البيانات بنفسي؟', a: 'نعم. الدعوة تحتوي على لوحة تحكم بسيطة تمكنك من تغيير الأسماء والتاريخ والصور بنفسك في أي وقت.' },
  { q: 'ما هي طرق الدفع المتاحة؟', a: 'نقبل الدفع عبر فودافون كاش على الرقم 00201027708044 أو إنستاباي على الحساب ehab201nbe.' },
  { q: 'كم يستغرق التسليم؟', a: 'التسليم فوري بعد تأكيد الدفع — خلال دقائق تكون دعوتك جاهزة.' },
  { q: 'هل يمكنني مشاركة الدعوة على واتساب؟', a: 'بالطبع. الدعوة رابط إلكتروني يمكن مشاركته بسهولة على واتساب وجميع منصات التواصل الاجتماعي.' },
  { q: 'ما هي سياسة الاسترداد؟', a: 'نضمن استرداد المبلغ كاملاً خلال ٢٤ ساعة إذا لم تكوني راضية عن الخدمة لأي سبب.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 sm:py-28 px-4 scroll-mt-24">
      <div className="container-luxe max-w-3xl">
        <Reveal className="text-center mb-14">
          <span className="eyebrow">الأسئلة الشائعة</span>
          <h2 className="text-4xl md:text-5xl mt-5 text-[#3d2c38]">
            كل ما تريدين <span className="italic text-[#955d85]">معرفته</span>
          </h2>
          <div className="divider-ornament my-5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" /></svg>
          </div>
        </Reveal>

        <Reveal stagger className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="card-luxe !p-0 overflow-hidden">
              <button
                id={`faq-btn-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-right gap-4 hover:bg-[#a66b96]/5 transition-colors focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-2"
              >
                <span className="text-[#3d2c38] font-semibold text-sm sm:text-base">{faq.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#a66b96] flex-shrink-0"
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
                    <p className="px-6 pb-5 text-[#8c7a87] text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

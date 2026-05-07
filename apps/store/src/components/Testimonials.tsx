import { motion } from 'framer-motion'
import { useTestimonials } from '../hooks/useTestimonials'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className={i <= rating ? 'text-[#a66b96]' : 'text-[#ebdce3]'}
          fill="currentColor"
        >
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-[#fff7fa] border border-[#ebdce3]/40 rounded-2xl p-6">
      <div className="flex gap-0.5 mb-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="w-3.5 h-3.5 bg-[#ebdce3]/40 rounded animate-pulse" />
        ))}
      </div>
      <div className="h-3 w-full bg-[#ebdce3]/30 rounded animate-pulse mb-2" />
      <div className="h-3 w-3/4 bg-[#ebdce3]/30 rounded animate-pulse mb-5" />
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#ebdce3]/40 animate-pulse" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-20 bg-[#ebdce3]/40 rounded animate-pulse" />
          <div className="h-2.5 w-24 bg-[#ebdce3]/30 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { testimonials, loading } = useTestimonials()

  return (
    <section id="testimonials" className="py-20 sm:py-28 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-label mb-4 block">آراء العملاء</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c38] mb-3">
            ماذا يقول عملاؤنا؟
          </h2>
          <p className="text-[#8c7a87] max-w-md mx-auto">
            أزواج كثيرون اختاروا فرحتي لدعوة زفافهم
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map(i => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#fff7fa] border border-[#ebdce3]/40 rounded-2xl p-6 transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(166,107,150,0.1)]"
                dir="rtl"
              >
                <Stars rating={t.rating} />
                <p className="text-[#3d2c38] mt-3 mb-5 leading-relaxed text-sm">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a66b96] to-[#d49bbd] flex items-center justify-center text-[#fdfbf7] font-bold text-sm flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[#3d2c38] text-sm">{t.name}</p>
                    <p className="text-[#8c7a87] text-xs">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
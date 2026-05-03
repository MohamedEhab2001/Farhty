import { motion } from 'framer-motion'
import { useTestimonials } from '../hooks/useTestimonials'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 justify-end">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? 'text-[#d49bbd]' : 'text-[#ebdce3]'}>★</span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const { testimonials, loading } = useTestimonials()

  return (
    <section id="testimonials" className="py-24 px-4 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#a66b96] text-sm font-semibold tracking-widest uppercase mb-4 block">آراء العملاء</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c38] mb-4">
            ماذا يقول عملاؤنا؟
          </h2>
          <p className="text-[#8c7a87]">مئات الأزواج اختاروا فارهتي لدعوة زفافهم</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#fff7fa] rounded-3xl h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#fff7fa] shadow-sm border border-[#ebdce3]/50 rounded-3xl p-6 card-glow"
                dir="rtl"
              >
                <Stars rating={t.rating} />
                <p className="text-[#3d2c38] mt-4 mb-5 leading-relaxed text-sm">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a66b96] to-[#d49bbd] flex items-center justify-center text-[#fdfbf7] font-bold text-sm flex-shrink-0">
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

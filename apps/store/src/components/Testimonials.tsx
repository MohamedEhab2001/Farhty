import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

// Dynamically import all images from the testimonials folder
const testimonialImages = import.meta.glob('../assets/testimonials/*.{png,jpg,jpeg,webp}', {
  eager: true,
  as: 'url',
})

const TESTIMONIAL_IMAGES = Object.values(testimonialImages)

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        const maxScroll = scrollWidth - clientWidth
        
        if (scrollLeft >= maxScroll - 10) {
          // Reset to start if at the end
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          // Scroll by one card width + gap
          const itemWidth = scrollRef.current.firstElementChild?.clientWidth || 300
          scrollRef.current.scrollBy({ left: itemWidth + 20, behavior: 'smooth' })
        }
      }
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="testimonials" className="py-20 sm:py-28 px-4 bg-[#fff7fa]/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-label mb-4 block">آراء العملاء</span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c38] mb-3">
            ثقة عملائنا في "فرحتي"
          </h2>
          <p className="text-[#8c7a87] max-w-md mx-auto">
            لقطات من محادثاتنا مع العرسان الذين شاركونا فرحتهم
          </p>
        </motion.div>

        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth px-4 -mx-4 sm:px-0 sm:mx-0"
          >
            {TESTIMONIAL_IMAGES.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative flex-none w-[320px] sm:w-[450px] aspect-video rounded-2xl overflow-hidden border border-[#ebdce3]/60 bg-white group/item cursor-zoom-in snap-center shadow-sm"
              >
                <img
                  src={img}
                  alt={`رأي عميل ${i + 1}`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/item:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'https://placehold.co/400x711/fff7fa/a66b96?text=Farhty+Review'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d2c38]/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>

          {/* Optional: Add hint for scrolling on desktop */}
          <div className="hidden md:flex justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-[#8c7a87] text-xs">اسحب لليمين أو اليسار لرؤية المزيد</span>
          </div>
        </div>


        <div className="mt-16 text-center">
          <p className="text-[#8c7a87] text-sm mb-6">هل تريدين أن تكون دعوتك القادمة؟</p>
          <a
            href="#templates"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="btn-primary"
          >
            استعرضي القوالب الآن
          </a>
        </div>
      </div>
    </section>
  )
}
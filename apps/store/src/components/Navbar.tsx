import { WHATSAPP_NUMBER } from '../api/client'
import { motion } from 'framer-motion'

export default function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 inset-x-0 z-40 bg-[#fdfbf7]/80 backdrop-blur-xl border-b border-[#ebdce3]"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/فرحتي بنفسجي.png" alt="فرحتي" className="h-10 w-auto" />
        </div>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollTo('templates')} className="text-[#8c7a87] hover:text-[#a66b96] text-sm transition-colors">
            القوالب
          </button>
          <button onClick={() => scrollTo('how-it-works')} className="text-[#8c7a87] hover:text-[#a66b96] text-sm transition-colors">
            كيف يعمل
          </button>
          <button onClick={() => scrollTo('testimonials')} className="text-[#8c7a87] hover:text-[#a66b96] text-sm transition-colors">
            آراء العملاء
          </button>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm text-[#8c7a87] hover:text-[#a66b96] transition-colors"
          >
            <img src="/whatsapp-gold.svg" alt="WhatsApp" className="w-5 h-5" />
          </a>
          <button
            id="navbar-cta-btn"
            onClick={() => scrollTo('templates')}
            className="px-5 py-2 rounded-xl bg-gradient-to-l from-[#a66b96] to-[#d49bbd] text-[#fdfbf7] font-bold text-sm hover:from-[#d49bbd] hover:to-[#a66b96] transition-all duration-200 active:scale-95"
          >
            اطلب الآن
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

import { WHATSAPP_NUMBER } from '../api/client'
import { motion } from 'framer-motion'
import { IconWhatsApp } from './BrandIcons'

export default function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 inset-x-0 z-40 bg-[#fdfbf7]/80 backdrop-blur-xl border-b border-[#ebdce3]/60"
      dir="rtl"
      role="navigation"
      aria-label="التنقل الرئيسي"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-2 rounded-sm">
          <img src="/فرحتي بنفسجي.png" alt="فرحتي" className="h-9 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollTo('templates')}
            className="text-[#8c7a87] hover:text-[#3d2c38] text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-4 rounded-sm"
          >
            القوالب
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="text-[#8c7a87] hover:text-[#3d2c38] text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-4 rounded-sm"
          >
            كيف يعمل
          </button>
          <button
            onClick={() => scrollTo('testimonials')}
            className="text-[#8c7a87] hover:text-[#3d2c38] text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-4 rounded-sm"
          >
            آراء العملاء
          </button>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل عبر واتساب"
            className="hidden sm:flex items-center gap-2 text-sm text-[#8c7a87] hover:text-[#a66b96] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-4 rounded-sm"
          >
            <IconWhatsApp size={20} />
          </a>
          <button
            id="navbar-cta-btn"
            onClick={() => scrollTo('templates')}
            className="px-5 py-2 rounded-xl bg-[#a66b96] text-[#fdfbf7] font-semibold text-sm hover:bg-[#955d85] active:scale-[0.97] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-3"
          >
            اطلب الآن
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
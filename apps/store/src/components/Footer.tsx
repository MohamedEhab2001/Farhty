import { Link } from 'react-router-dom'
import { WHATSAPP_NUMBER } from '../api/client'
import { IconWhatsApp, IconTikTok } from './BrandIcons'

export default function Footer() {
  const scrollTo = (id: string) => {
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="py-16 px-4 border-t border-[#ebdce3]/60 bg-[#fdfbf7]" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <div className="text-center md:text-right">
            <Link to="/" className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <img src="/فرحتي بنفسجي.png" alt="فرحتي" className="h-10 w-auto" />
            </Link>
            <p className="text-[#8c7a87] text-sm max-w-xs leading-relaxed">
              منصة دعوات الزفاف الرقمية الأولى في مصر
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="واتساب"
              className="w-10 h-10 rounded-xl bg-[#a66b960a] border border-[#a66b9615] flex items-center justify-center text-[#8c7a87] hover:text-[#a66b96] hover:border-[#a66b9630] hover:bg-[#a66b9610] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-2"
            >
              <IconWhatsApp size={20} />
            </a>
            <a
              href="https://tiktok.com/@farhty.online"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تيك توك"
              className="w-10 h-10 rounded-xl bg-[#a66b960a] border border-[#a66b9615] flex items-center justify-center text-[#8c7a87] hover:text-[#a66b96] hover:border-[#a66b9630] hover:bg-[#a66b9610] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-2"
            >
              <IconTikTok size={20} />
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-sm mb-8">
          <button
            onClick={() => scrollTo('faq')}
            className="text-[#8c7a87] hover:text-[#3d2c38] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-2 rounded"
          >
            الأسئلة الشائعة
          </button>
          <button
            onClick={() => scrollTo('templates')}
            className="text-[#8c7a87] hover:text-[#3d2c38] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-2 rounded"
          >
            القوالب
          </button>
          <span className="text-[#ebdce3] hidden sm:inline">|</span>
          <Link to="/privacy" className="text-[#8c7a87] hover:text-[#3d2c38] transition-colors duration-200">سياسة الخصوصية</Link>
          <Link to="/terms" className="text-[#8c7a87] hover:text-[#3d2c38] transition-colors duration-200">شروط الاستخدام</Link>
        </div>


        <div className="section-divider mb-8" />

        <p className="text-center text-[#8c7a87]/70 text-xs">
          &copy; {new Date().getFullYear()} فرحتي — جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  )
}
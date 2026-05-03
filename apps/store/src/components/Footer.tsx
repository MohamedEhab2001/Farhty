import { WHATSAPP_NUMBER } from '../api/client'

export default function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-[#ebdce3]" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-right">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <img src="/فرحتي بنفسجي.png" alt="فارهتي" className="h-12 w-auto" />
            </div>
            <p className="text-[#8c7a87] text-sm max-w-xs">
              منصة دعوات الزفاف الرقمية الأولى في مصر
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                title="واتساب"
              >
                <img src="/whatsapp-gold.svg" alt="WhatsApp" className="w-6 h-6" />
              </a>
              <a
                href={`https://tiktok.com/@farhty.online`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-110 transition-transform"
                title="تيك توك"
              >
                <img src="/tiktok-gold.svg" alt="TikTok" className="w-6 h-6" />
              </a>
            </div>
            <button
              onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[#8c7a87] hover:text-[#a66b96] text-sm transition-colors"
            >
              الأسئلة الشائعة
            </button>
            <button
              onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-[#8c7a87] hover:text-[#a66b96] text-sm transition-colors"
            >
              القوالب
            </button>
          </div>
        </div>

        <div className="section-divider my-8" />

        <p className="text-center text-[#8c7a87] text-xs">
          © {new Date().getFullYear()} فارهتي — جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  )
}

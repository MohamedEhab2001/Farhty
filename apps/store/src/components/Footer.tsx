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
    <footer className="pt-16 pb-10 border-t border-[#ebdce3]/60 bg-[#fff7fa]/50" dir="rtl">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <img src="/فرحتي بنفسجي.png" alt="فرحتي" className="h-10 w-auto" />
            </Link>
            <p className="text-sm text-[#8c7a87] mt-2 max-w-sm leading-relaxed">
              منصة دعوات الزفاف الرقمية الأولى في مصر — تصاميم فاخرة، تجربة استثنائية.
            </p>
          </div>

          <nav className="flex flex-wrap gap-6 text-sm text-[#8c7a87]">
            <button onClick={() => scrollTo('templates')} className="hover:text-[#955d85] transition-colors duration-200">القوالب</button>
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-[#955d85] transition-colors duration-200">كيف يعمل</button>
            <button onClick={() => scrollTo('faq')} className="hover:text-[#955d85] transition-colors duration-200">الأسئلة الشائعة</button>
            <Link to="/privacy" className="hover:text-[#955d85] transition-colors duration-200">سياسة الخصوصية</Link>
            <Link to="/terms" className="hover:text-[#955d85] transition-colors duration-200">شروط الاستخدام</Link>
          </nav>

          <div className="flex gap-2">
            {[
              {
                label: 'WhatsApp',
                href: `https://wa.me/${WHATSAPP_NUMBER}`,
                icon: <IconWhatsApp size={16} />,
              },
              {
                label: 'TikTok',
                href: 'https://tiktok.com/@farhty.online',
                icon: <IconTikTok size={16} />,
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-full bg-[#fff7fa] border border-[#ebdce3] flex items-center justify-center text-[#955d85] hover:bg-[#a66b96]/5 hover:border-[#a66b96]/30 transition duration-200 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-2"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#ebdce3]/60 text-center text-xs text-[#8c7a87]/70 tracking-wide">
          &copy; {new Date().getFullYear()} فرحتي — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  )
}

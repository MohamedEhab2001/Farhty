import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { WHATSAPP_NUMBER } from '../api/client'
import { IconWhatsApp } from './BrandIcons'

const NAV_LINKS = [
  { id: 'templates', label: 'القوالب' },
  { id: 'how-it-works', label: 'كيف يعمل' },
  { id: 'testimonials', label: 'آراء العملاء' },
  { id: 'faq', label: 'الأسئلة' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setOpen(false)
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-3 backdrop-blur-xl bg-[#fdfbf7]/80 border-b border-[#ebdce3]/60 shadow-[0_8px_30px_-20px_rgba(166,107,150,0.25)]'
          : 'py-5'
      }`}
      dir="rtl"
      role="navigation"
      aria-label="التنقل الرئيسي"
    >
      <div className="container-luxe flex items-center justify-between gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-2 rounded-sm"
        >
          <img src="/فرحتي بنفسجي.png" alt="فرحتي" className="h-9 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="px-4 py-2 text-sm text-[#3d2c38]/80 hover:text-[#955d85] transition-colors relative group focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-4 rounded-sm"
            >
              {l.label}
              <span className="absolute bottom-1 right-4 left-4 h-px bg-[#a66b96] scale-x-0 group-hover:scale-x-100 origin-center transition-transform" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل عبر واتساب"
            className="hidden sm:inline-flex w-10 h-10 rounded-full border border-[#ebdce3] bg-[#fff7fa] items-center justify-center text-[#955d85] hover:bg-[#a66b96]/5 transition"
          >
            <IconWhatsApp size={18} />
          </a>
          <button
            id="navbar-cta-btn"
            onClick={() => scrollTo('templates')}
            className="btn-primary !py-2.5 !px-5 text-sm"
          >
            اطلب الآن
          </button>
          <button
            className="lg:hidden w-10 h-10 rounded-full border border-[#ebdce3] bg-[#fff7fa] flex items-center justify-center text-[#3d2c38]"
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={open ? 'M6 6l12 12M6 18L18 6' : 'M3 6h18M3 12h18M3 18h18'} strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden container-luxe mt-3 py-4 rounded-2xl bg-[#fff7fa] border border-[#ebdce3] shadow-[var(--shadow-soft)] flex flex-col">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="px-4 py-3 text-[#3d2c38]/80 hover:bg-[#a66b96]/5 rounded-lg text-right transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}

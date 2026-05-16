import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Promo } from '../hooks/usePromos'

const POPUP_KEY = 'farhty_popup_seen'

const THEMES = {
  purple: {
    accent: '#a66b96',
    accentDark: '#6b3d7e',
    badge: 'bg-[#a66b96]/10 text-[#a66b96] border border-[#a66b96]/20',
    btn: 'bg-[#a66b96] hover:bg-[#955d85] text-white',
    icon: 'from-[#a66b96] to-[#d49bbd]',
  },
  gold: {
    accent: '#e8b857',
    accentDark: '#b07d20',
    badge: 'bg-[#e8b857]/10 text-[#b07d20] border border-[#e8b857]/30',
    btn: 'bg-[#e8b857] hover:bg-[#d4a840] text-[#3d2c38]',
    icon: 'from-[#e8b857] to-[#f0d080]',
  },
  rose: {
    accent: '#e88a7d',
    accentDark: '#a83050',
    badge: 'bg-[#e88a7d]/10 text-[#a83050] border border-[#e88a7d]/20',
    btn: 'bg-[#e88a7d] hover:bg-[#d4706a] text-white',
    icon: 'from-[#e88a7d] to-[#f0b0a8]',
  },
  dark: {
    accent: '#a66b96',
    accentDark: '#3d2c38',
    badge: 'bg-[#3d2c38]/10 text-[#3d2c38] border border-[#3d2c38]/20',
    btn: 'bg-[#3d2c38] hover:bg-[#2a1e2a] text-white',
    icon: 'from-[#3d2c38] to-[#6b3d7e]',
  },
}

interface PromoPopupProps {
  popup: Promo | null
}

export default function PromoPopup({ popup }: PromoPopupProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!popup) return
    if (sessionStorage.getItem(POPUP_KEY)) return
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [popup])

  const dismiss = () => {
    sessionStorage.setItem(POPUP_KEY, '1')
    setVisible(false)
  }

  const handleCta = () => {
    if (!popup) return
    dismiss()
    const link = popup.ctaLink || '#templates'
    if (link.startsWith('#')) {
      setTimeout(() => document.getElementById(link.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 200)
    } else {
      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  if (!popup) return null

  const t = THEMES[popup.theme] ?? THEMES.purple

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 z-[60] bg-[#3d2c38]/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto bg-[#fff7fa] border border-[#ebdce3]/60 rounded-2xl p-7 max-w-sm w-full shadow-[0_24px_80px_rgba(61,44,56,0.25)] relative overflow-hidden"
              dir="rtl"
              role="dialog"
              aria-label="عرض خاص"
            >
              {/* top decorative gradient bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${t.icon}`} />

              <button
                onClick={dismiss}
                className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-[#ebdce3]/60 text-[#8c7a87] hover:bg-[#ebdce3] hover:text-[#3d2c38] transition-all duration-200 flex items-center justify-center"
                aria-label="إغلاق"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 2L12 12M12 2L2 12" />
                </svg>
              </button>

              {/* icon */}
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${t.icon} flex items-center justify-center text-2xl shadow-md`}>
                ⚡
              </div>

              {popup.badge && (
                <div className="flex justify-center mb-3">
                  <span className={`${t.badge} text-xs font-bold px-3 py-1 rounded-full`}>
                    {popup.badge}
                  </span>
                </div>
              )}

              <h2 className="text-xl font-bold text-center text-[#3d2c38] mb-2">
                {popup.title}
              </h2>

              {popup.subtitle && (
                <p className="text-center text-[#8c7a87] text-sm leading-relaxed mb-5">
                  {popup.subtitle}
                </p>
              )}

              <button
                onClick={handleCta}
                className={`w-full py-3.5 rounded-xl font-bold text-base ${t.btn} active:scale-[0.98] transition-all duration-200 mt-2`}
              >
                {popup.ctaLabel}
              </button>

              <button
                onClick={dismiss}
                className="w-full text-center text-[#8c7a87]/70 text-xs mt-3 hover:text-[#8c7a87] transition-colors"
              >
                لا شكراً، سأتصفح لاحقاً
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

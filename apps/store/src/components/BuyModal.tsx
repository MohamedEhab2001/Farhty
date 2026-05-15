import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Template } from '../hooks/useTemplates'
import { apiClient, WHATSAPP_NUMBER } from '../api/client'
import { IconDiamond, IconWhatsApp } from './BrandIcons'

interface BuyModalProps {
  template: Template | null
  onClose: () => void
}

export default function BuyModal({ template, onClose }: BuyModalProps) {
  const [sending, setSending] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!template) return
    apiClient.post('/api/admin/orders', {
      templateId: template._id,
      paymentMethod: 'vodafone',
      status: 'pending',
      notes: `طلب عبر الموقع — قالب ${template.name}`,
    }).catch(() => {})
  }, [template])

  useEffect(() => {
    if (!template) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    modalRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [template, onClose])

  const isOnSale = !!template?.salePrice && (
    !template.saleEndsAt || new Date(template.saleEndsAt).getTime() > Date.now()
  )
  const effectivePrice = template && isOnSale ? template.salePrice! : template?.price

  const handleWhatsApp = () => {
    if (!template) return
    setSending(true)
    const priceNote = isOnSale
      ? `بسعر العرض ${effectivePrice} جنيه (بدلاً من ${template.price} جنيه)`
      : `بسعر ${effectivePrice} جنيه`
    const text = encodeURIComponent(
      `مرحبا، أنا مهتم بقالب ${template.name} ${priceNote}.\nممكن تبعتلي تفاصيل الدفع؟`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
    setTimeout(() => { setSending(false) }, 1000)
  }

  return (
    <AnimatePresence>
      {template && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#3d2c38]/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              ref={modalRef}
              tabIndex={-1}
              className="pointer-events-auto bg-[#fff7fa] border border-[#ebdce3]/60 rounded-2xl p-7 max-w-sm w-full shadow-[0_24px_80px_rgba(61,44,56,0.2)] relative"
              dir="rtl"
              role="dialog"
              aria-label={`طلب قالب ${template.name}`}
            >
              <button
                onClick={onClose}
                className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-[#ebdce3]/60 text-[#8c7a87] hover:bg-[#ebdce3] hover:text-[#3d2c38] transition-all duration-200 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-2"
                aria-label="إغلاق"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 2L12 12M12 2L2 12" />
                </svg>
              </button>

              <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-gradient-to-br from-[#a66b96] to-[#d49bbd] flex items-center justify-center text-[#fdfbf7]">
                <IconDiamond size={26} />
              </div>

              <h2 className="text-xl font-bold text-center text-[#3d2c38] mb-1">
                {template.name}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <p className="text-center text-[#a66b96] text-lg font-semibold">
                  {effectivePrice} جنيه
                </p>
                {isOnSale && (
                  <p className="text-center text-[#8c7a87] text-sm line-through">
                    {template.price} جنيه
                  </p>
                )}
              </div>

              <div className="bg-[#fdfbf7] rounded-xl p-4 mb-5 border border-[#ebdce3]/40">
                <p className="text-[#8c7a87] text-sm text-center leading-relaxed">
                  للطلب، راسلنا على واتساب وسنرسل لك تفاصيل الدفع فوراً
                </p>
              </div>

              <button
                id="buy-modal-whatsapp-btn"
                onClick={handleWhatsApp}
                disabled={sending}
                className="w-full py-3.5 rounded-xl font-bold text-base text-[#fdfbf7] bg-[#a66b96] hover:bg-[#955d85] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-3"
              >
                <IconWhatsApp size={22} />
                ابدأ المحادثة
              </button>

              <p className="text-center text-[#8c7a87]/70 text-xs mt-3">
                سنرد عليك خلال دقائق بتفاصيل الدفع
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
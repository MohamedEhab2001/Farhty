import { useState, useEffect } from 'react'
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

  // Create pending order in DB when modal opens
  useEffect(() => {
    if (!template) return
    apiClient.post('/api/admin/orders', {
      templateId: template._id,
      paymentMethod: 'vodafone',
      status: 'pending',
      notes: `طلب عبر الموقع — قالب ${template.name}`,
    }).catch(() => {/* silent */})
  }, [template])

  const handleWhatsApp = () => {
    if (!template) return
    setSending(true)
    const text = encodeURIComponent(
      `مرحبا، أنا مهتم بقالب ${template.name} بسعر ${template.price} جنيه.\nممكن تبعتلي تفاصيل الدفع؟`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank')
    setTimeout(() => { setSending(false) }, 1000)
  }

  return (
    <AnimatePresence>
      {template && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto bg-[#fff7fa] shadow-sm border border-[#ebdce3]/50 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
              dir="rtl"
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-[#ebdce3] text-[#8c7a87] hover:text-white hover:bg-[#3e3850] transition-all flex items-center justify-center"
                aria-label="إغلاق"
              >
                ✕
              </button>

              {/* Gold ring icon */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#a66b96] to-[#d49bbd] flex items-center justify-center text-[#fdfbf7]">
                <IconDiamond size={32} />
              </div>

              <h2 className="text-2xl font-bold text-center text-[#3d2c38] mb-1">
                {template.name}
              </h2>
              <p className="text-center text-[#d49bbd] text-xl font-semibold mb-6">
                {template.price} جنيه
              </p>

              <div className="bg-[#fdfbf7] rounded-2xl p-4 mb-6 shadow-sm border border-[#ebdce3]/50">
                <p className="text-[#8c7a87] text-sm text-center leading-relaxed">
                  للطلب، راسلنا على واتساب وسنرسل لك تفاصيل الدفع فوراً
                </p>
              </div>

              <button
                id="buy-modal-whatsapp-btn"
                onClick={handleWhatsApp}
                disabled={sending}
                className="w-full py-4 rounded-2xl font-bold text-lg text-[#fdfbf7] bg-gradient-to-l from-[#a66b96] to-[#d49bbd] hover:from-[#d49bbd] hover:to-[#a66b96] transition-all duration-300 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3 group"
              >
                <IconWhatsApp size={24} className="group-hover:scale-110 transition-transform" />
                ابدأ المحادثة
              </button>

              <p className="text-center text-[#8c7a87] text-xs mt-4">
                سنرد عليك خلال دقائق بتفاصيل الدفع وطرق السداد المتاحة
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

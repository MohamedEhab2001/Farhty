import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Template } from '../hooks/useTemplates'
import { apiClient } from '../api/client'

interface BuyModalProps {
  template: Template | null
  onClose: () => void
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/

function isValidSlug(s: string) {
  return SLUG_RE.test(s) && s.length >= 3 && s.length <= 40
}

type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid'

export default function BuyModal({ template, onClose }: BuyModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Step 1 fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Step 2 fields
  const [slug, setSlug] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle')

  const [step, setStep] = useState<1 | 2>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset on open
  useEffect(() => {
    if (template) {
      setStep(1); setName(''); setEmail(''); setPhone('')
      setSlug(''); setPassword(''); setSlugStatus('idle'); setError(null)
    }
  }, [template])

  useEffect(() => {
    if (!template) return
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    modalRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [template, onClose])

  // Debounced slug availability check
  const checkSlug = useCallback((value: string) => {
    if (!isValidSlug(value)) {
      setSlugStatus(value.length === 0 ? 'idle' : 'invalid')
      return
    }
    setSlugStatus('checking')
    apiClient.get<{ available: boolean }>(`/api/instances/check-slug?slug=${value}`)
      .then(r => setSlugStatus(r.data.available ? 'available' : 'taken'))
      .catch(() => setSlugStatus('idle'))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => checkSlug(slug), 500)
    return () => clearTimeout(timer)
  }, [slug, checkSlug])

  const isOnSale = !!template?.salePrice && (
    !template.saleEndsAt || new Date(template.saleEndsAt).getTime() > Date.now()
  )
  const effectivePrice = template && isOnSale ? template.salePrice! : template?.price

  const step1Valid = name.trim().length >= 2 && /\S+@\S+\.\S+/.test(email) && phone.trim().length >= 10
  const step2Valid = slugStatus === 'available' && password.length >= 6

  const handleNext = () => {
    if (step1Valid) setStep(2)
  }

  const handlePay = async () => {
    if (!template || !step2Valid) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await apiClient.post<{ redirectUrl: string }>('/api/payments/easykash/initiate', {
        templateId: template._id,
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        instanceSlug: slug.trim(),
        instancePassword: password,
      })
      window.location.href = res.data.redirectUrl
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error
      setError(msg || 'حدث خطأ، حاول مرة أخرى')
      setSubmitting(false)
    }
  }

  const slugHint: Record<SlugStatus, { text: string; color: string } | null> = {
    idle: null,
    checking: { text: 'جاري التحقق...', color: '#8c7a87' },
    available: { text: 'متاح', color: '#5a9e6f' },
    taken: { text: 'هذا الرابط محجوز، جرب اسما آخر', color: '#c0614e' },
    invalid: { text: 'أحرف إنجليزية صغيرة وأرقام وشرطة فقط (3 أحرف على الأقل)', color: '#c0614e' },
  }

  return (
    <AnimatePresence>
      {template && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
              aria-label={`طلب تصميم ${template.name}`}
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-[#ebdce3]/60 text-[#8c7a87] hover:bg-[#ebdce3] hover:text-[#3d2c38] transition-all duration-200 flex items-center justify-center"
                aria-label="إغلاق"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 2L12 12M12 2L2 12" />
                </svg>
              </button>

              {/* Header */}
              <img src="/فرحتي بنفسجي.png" alt="فرحتي" className="h-10 w-auto mx-auto mb-4" />
              <h2 className="text-lg font-bold text-center text-[#3d2c38] mb-0.5">{template.name}</h2>
              <div className="flex items-center justify-center gap-2 mb-5">
                <p className="text-[#a66b96] text-base font-semibold">{effectivePrice} جنيه</p>
                {isOnSale && <p className="text-[#8c7a87] text-sm line-through">{template.price} جنيه</p>}
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mb-5">
                {[1, 2].map(n => (
                  <div
                    key={n}
                    className={`h-1.5 rounded-full transition-all duration-300 ${n === step ? 'w-8 bg-[#a66b96]' : n < step ? 'w-4 bg-[#a66b96]/40' : 'w-4 bg-[#ebdce3]'}`}
                  />
                ))}
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-xs text-[#8c7a87] font-medium mb-1">بياناتك</p>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="الاسم الكامل"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#ebdce3] bg-[#fdfbf7] text-[#3d2c38] text-sm placeholder-[#c4b0bc] focus:outline-none focus:border-[#a66b96] transition-colors"
                  />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="البريد الإلكتروني"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#ebdce3] bg-[#fdfbf7] text-[#3d2c38] text-sm placeholder-[#c4b0bc] focus:outline-none focus:border-[#a66b96] transition-colors"
                  />
                  <input
                    type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="رقم الهاتف (01xxxxxxxxx)"
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#ebdce3] bg-[#fdfbf7] text-[#3d2c38] text-sm placeholder-[#c4b0bc] focus:outline-none focus:border-[#a66b96] transition-colors text-right"
                  />
                  <button
                    onClick={handleNext}
                    disabled={!step1Valid}
                    className="w-full py-3 rounded-xl font-bold text-sm text-[#fdfbf7] bg-[#a66b96] hover:bg-[#955d85] disabled:opacity-40 transition-all duration-200"
                  >
                    التالي
                  </button>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-3">
                  <p className="text-xs text-[#8c7a87] font-medium mb-1">تفاصيل دعوتك</p>

                  {/* Slug input */}
                  <div>
                    <div className="flex items-center rounded-xl border border-[#ebdce3] bg-[#fdfbf7] overflow-hidden focus-within:border-[#a66b96] transition-colors">
                      <input
                        type="text" value={slug}
                        onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="ahmed-sara"
                        dir="ltr"
                        className="flex-1 px-4 py-2.5 bg-transparent text-[#3d2c38] text-sm placeholder-[#c4b0bc] focus:outline-none"
                      />
                      <span className="px-3 text-xs text-[#8c7a87] border-r border-[#ebdce3] whitespace-nowrap">.farhty.online</span>
                    </div>
                    {slugHint[slugStatus] && (
                      <p className="text-xs mt-1 pr-1" style={{ color: slugHint[slugStatus]!.color }}>
                        {slugHint[slugStatus]!.text}
                      </p>
                    )}
                  </div>

                  {/* Password input */}
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="كلمة مرور للوحة التحكم (6 أحرف+)"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#ebdce3] bg-[#fdfbf7] text-[#3d2c38] text-sm placeholder-[#c4b0bc] focus:outline-none focus:border-[#a66b96] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7a87] hover:text-[#3d2c38] text-xs"
                    >
                      {showPassword ? 'إخفاء' : 'إظهار'}
                    </button>
                  </div>

                  <p className="text-xs text-[#8c7a87] leading-relaxed bg-[#fdfbf7] rounded-xl p-3 border border-[#ebdce3]/40">
                    احفظ كلمة المرور — ستحتاجها لتعديل تفاصيل دعوتك لاحقاً
                  </p>

                  {error && (
                    <p className="text-xs text-[#c0614e] text-center">{error}</p>
                  )}

                  <button
                    onClick={handlePay}
                    disabled={!step2Valid || submitting}
                    className="w-full py-3 rounded-xl font-bold text-sm text-[#fdfbf7] bg-[#a66b96] hover:bg-[#955d85] disabled:opacity-40 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        ادفع الآن {effectivePrice} جنيه
                      </>
                    )}
                  </button>

                  <button onClick={() => setStep(1)} className="w-full text-xs text-[#8c7a87] hover:text-[#3d2c38] transition-colors">
                    رجوع
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

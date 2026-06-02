import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { apiClient, WHATSAPP_NUMBER } from '../api/client'
import { IconWhatsApp } from '../components/BrandIcons'

// Statuses EasyKash may send in the redirect URL (case-insensitive)
const FAILED_STATUSES = ['failed', 'canceled', 'expired', 'refunded']
const MAX_POLLS = 20 // ~60 seconds

type OrderStatus = 'pending' | 'confirmed' | 'deployed'

interface ResultData {
  status: OrderStatus
  instanceSlug: string
  templateName: string
}

export default function PaymentResult() {
  const [params] = useSearchParams()
  const ekStatus = params.get('status')        // from EasyKash: success / NEW / PAID / FAILED / CANCELED …
  const orderId = params.get('customerReference')

  const [result, setResult] = useState<ResultData | null>(null)
  const [pollError, setPollError] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const pollCount = useRef(0)

  const paymentFailed =
    FAILED_STATUSES.includes((ekStatus ?? '').toLowerCase()) ||
    (!orderId && ekStatus !== null)

  useEffect(() => {
    if (paymentFailed || !orderId) return

    let stopped = false

    const poll = async () => {
      if (stopped) return
      if (pollCount.current >= MAX_POLLS) {
        setTimedOut(true)
        return
      }
      try {
        const res = await apiClient.get<ResultData>(`/api/payments/easykash/result?orderId=${orderId}`)
        setResult(res.data)
        if (res.data.status !== 'deployed' && !stopped) {
          pollCount.current += 1
          setTimeout(poll, 3000)
        }
      } catch {
        setPollError(true)
      }
    }

    poll()
    return () => { stopped = true }
  }, [orderId, paymentFailed])

  const supportMessage = encodeURIComponent(
    `مرحبا، أنا واجهت مشكلة في طلبي رقم ${orderId ?? ''}، ممكن تساعدني؟`
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${supportMessage}`

  return (
    <div className="min-h-screen bg-[#fdf8fb] flex flex-col items-center justify-center p-6" dir="rtl">
      <div className="bg-[#fff7fa] border border-[#ebdce3]/60 rounded-2xl p-8 max-w-sm w-full shadow-[0_24px_80px_rgba(61,44,56,0.12)] text-center">

        {/* Payment failed */}
        {paymentFailed && (
          <>
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#fce8e4] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0614e" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#3d2c38] mb-2">لم تكتمل عملية الدفع</h1>
            <p className="text-[#8c7a87] text-sm mb-6 leading-relaxed">
              يبدو أن الدفع لم يتم. إذا تم خصم أي مبلغ أو تواجه مشكلة، تواصل معنا.
            </p>
            <Link to="/" className="block w-full py-3 rounded-xl font-bold text-sm text-[#fdfbf7] bg-[#a66b96] hover:bg-[#955d85] transition-all mb-3">
              العودة للمتجر
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-[#3d2c38] bg-[#ebdce3] hover:bg-[#e0ccd6] transition-all">
              <IconWhatsApp size={18} />
              تواصل معنا على واتساب
            </a>
          </>
        )}

        {/* Poll error */}
        {!paymentFailed && pollError && (
          <>
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#fce8e4] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c0614e" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#3d2c38] mb-2">تعذّر تحميل بيانات الطلب</h1>
            <p className="text-[#8c7a87] text-sm mb-6 leading-relaxed">
              إذا كانت عملية الدفع تمت بنجاح سنتواصل معك قريباً.
            </p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-[#3d2c38] bg-[#ebdce3] hover:bg-[#e0ccd6] transition-all">
              <IconWhatsApp size={18} />
              تواصل معنا على واتساب
            </a>
          </>
        )}

        {/* Timed out — still pending after 60s */}
        {!paymentFailed && !pollError && timedOut && (
          <>
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#fef9ec] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c8973a" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#3d2c38] mb-2">الإنشاء يستغرق وقتاً أطول من المعتاد</h1>
            <p className="text-[#8c7a87] text-sm mb-6 leading-relaxed">
              دعوتك قيد المعالجة — إذا لم تصلك في أقرب وقت تواصل معنا وسنساعدك فوراً.
            </p>
            <p className="text-xs text-[#8c7a87]/70 mb-6">
              رقم الطلب: <span className="font-mono" dir="ltr">{orderId}</span>
            </p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-[#fdfbf7] bg-[#a66b96] hover:bg-[#955d85] transition-all">
              <IconWhatsApp size={18} />
              تواصل معنا على واتساب
            </a>
          </>
        )}

        {/* Processing / confirmed */}
        {!paymentFailed && !pollError && !timedOut && (!result || result.status !== 'deployed') && (
          <>
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#f5edf9] flex items-center justify-center">
              <svg className="animate-spin w-7 h-7 text-[#a66b96]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#3d2c38] mb-2">جاري تجهيز دعوتك</h1>
            <p className="text-[#8c7a87] text-sm mb-6 leading-relaxed">
              تم استلام الدفع بنجاح — دعوتك قيد الإنشاء وستكون جاهزة خلال دقائق.
            </p>
            <p className="text-xs text-[#8c7a87]/70 mb-6">
              رقم الطلب: <span className="font-mono" dir="ltr">{orderId}</span>
            </p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-[#3d2c38] bg-[#ebdce3] hover:bg-[#e0ccd6] transition-all">
              <IconWhatsApp size={18} />
              واجهت مشكلة؟ تواصل معنا
            </a>
          </>
        )}

        {/* Deployed / ready */}
        {!paymentFailed && !pollError && !timedOut && result?.status === 'deployed' && (
          <>
            <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-[#e4f5ea] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5a9e6f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#3d2c38] mb-2">دعوتك جاهزة!</h1>
            <p className="text-[#8c7a87] text-sm mb-5 leading-relaxed">
              تم إنشاء دعوة <span className="font-semibold text-[#3d2c38]">{result.templateName}</span> بنجاح
            </p>

            <div className="bg-[#fdfbf7] rounded-xl p-4 mb-5 border border-[#ebdce3]/40 text-right space-y-2">
              <div>
                <p className="text-xs text-[#8c7a87] mb-0.5">رابط دعوتك</p>
                <a
                  href={`https://${result.instanceSlug}.farhty.online`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-mono font-semibold text-[#a66b96] hover:underline"
                  dir="ltr"
                >
                  {result.instanceSlug}.farhty.online
                </a>
              </div>
              <div>
                <p className="text-xs text-[#8c7a87] mb-0.5">كلمة المرور</p>
                <p className="text-sm text-[#3d2c38]">كلمة المرور التي اخترتها عند الشراء</p>
              </div>
            </div>

            <a
              href={`https://${result.instanceSlug}.farhty.online`}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-3 rounded-xl font-bold text-sm text-[#fdfbf7] bg-[#a66b96] hover:bg-[#955d85] transition-all mb-3"
            >
              افتح دعوتك
            </a>

            <a href={whatsappUrl} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-[#3d2c38] bg-[#ebdce3] hover:bg-[#e0ccd6] transition-all">
              <IconWhatsApp size={18} />
              واجهت مشكلة؟ تواصل معنا
            </a>
          </>
        )}
      </div>
    </div>
  )
}

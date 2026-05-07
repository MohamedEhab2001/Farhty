import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAKE_PURCHASES = [
  { name: 'أحمد', city: 'القاهرة', template: 'ليلى', ago: '3 دقائق' },
  { name: 'مريم', city: 'الإسكندرية', template: 'نور', ago: '7 دقائق' },
  { name: 'يوسف', city: 'الجيزة', template: 'سحر', ago: '12 دقيقة' },
  { name: 'سارة', city: 'الإسماعيلية', template: 'ليلى', ago: '2 دقيقة' },
  { name: 'عمر', city: 'المنصورة', template: 'نور', ago: '18 دقيقة' },
  { name: 'فاطمة', city: 'أسيوط', template: 'جوهر', ago: '5 دقائق' },
  { name: 'محمود', city: 'الأقصر', template: 'ليلى', ago: '25 دقيقة' },
  { name: 'هبة', city: 'بورسعيد', template: 'سحر', ago: '9 دقائق' },
  { name: 'خالد', city: 'سوهاج', template: 'نور', ago: '14 دقيقة' },
  { name: 'نهى', city: 'الفيوم', template: 'جوهر', ago: '6 دقائق' },
  { name: 'طارق', city: 'دمياط', template: 'ليلى', ago: '31 دقيقة' },
  { name: 'رنا', city: 'الزقازيق', template: 'نور', ago: '4 دقائق' },
  { name: 'أنس', city: 'شرم الشيخ', template: 'سحر', ago: '22 دقيقة' },
  { name: 'نادية', city: 'طنطا', template: 'جوهر', ago: '8 دقائق' },
  { name: 'حسن', city: 'قنا', template: 'ليلى', ago: '16 دقيقة' },
]

export default function FakePurchaseToast() {
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState(FAKE_PURCHASES[0])

  useEffect(() => {
    const show = () => {
      const item = FAKE_PURCHASES[Math.floor(Math.random() * FAKE_PURCHASES.length)]
      setCurrent(item)
      setVisible(true)
      setTimeout(() => setVisible(false), 4000)
    }

    const schedule = () => {
      const delay = Math.random() * (45000 - 25000) + 25000
      return setTimeout(() => { show(); setTimeout(schedule, 1000) }, delay)
    }

    // First show after short delay
    const first = setTimeout(show, 8000)
    let recurring: ReturnType<typeof setTimeout>
    const afterFirst = setTimeout(() => { recurring = schedule() }, 13000)

    return () => {
      clearTimeout(first)
      clearTimeout(afterFirst)
      clearTimeout(recurring)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 60, y: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-24 left-4 z-50 max-w-xs"
          dir="rtl"
        >
          <div className="flex items-center gap-3 bg-[#fff7fa] border border-[#a66b9640] rounded-2xl px-4 py-3 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a66b96] to-[#d49bbd] flex items-center justify-center text-[#fdfbf7] font-bold text-sm flex-shrink-0">
              {current.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-[#3d2c38] leading-tight">
                <span className="font-semibold text-[#d49bbd]">{current.name}</span>
                {' '}من{' '}{current.city}
              </p>
              <p className="text-xs text-[#8c7a87] truncate">
                اشترى قالب <span className="text-[#a66b96]">{current.template}</span> منذ {current.ago}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

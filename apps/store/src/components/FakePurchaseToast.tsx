import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAKE_PURCHASES = [
  { name: 'أحمد', city: 'القاهرة', template: 'عهد', ago: '3 دقائق' },
  { name: 'مريم', city: 'الإسكندرية', template: 'فيروز', ago: '7 دقائق' },
  { name: 'يوسف', city: 'الجيزة', template: 'أريج', ago: '12 دقيقة' },
  { name: 'سارة', city: 'الإسماعيلية', template: 'أصالة', ago: '2 دقيقة' },
  { name: 'عمر', city: 'الدقهلية', template: 'عهد', ago: '18 دقيقة' },
  { name: 'فاطمة', city: 'أسيوط', template: 'فيروز', ago: '5 دقائق' },
  { name: 'محمود', city: 'الأقصر', template: 'أريج', ago: '25 دقيقة' },
  { name: 'هبة', city: 'بورسعيد', template: 'أصالة', ago: '9 دقائق' },
  { name: 'خالد', city: 'سوهاج', template: 'عهد', ago: '14 دقيقة' },
  { name: 'نهى', city: 'الفيوم', template: 'فيروز', ago: '6 دقائق' },
  { name: 'طارق', city: 'دمياط', template: 'أريج', ago: '31 دقيقة' },
  { name: 'رنا', city: 'الغربية', template: 'أصالة', ago: '4 دقائق' },
  { name: 'أنس', city: 'جنوب سيناء', template: 'عهد', ago: '22 دقيقة' },
  { name: 'نادية', city: 'المنوفية', template: 'فيروز', ago: '8 دقائق' },
  { name: 'حسن', city: 'قنا', template: 'أريج', ago: '16 دقيقة' },
  { name: 'ليلى', city: 'شمال سيناء', template: 'أصالة', ago: '10 دقائق' },
  { name: 'مصطفى', city: 'المنيا', template: 'عهد', ago: '19 دقيقة' },
  { name: 'زينب', city: 'السويس', template: 'فيروز', ago: '11 دقيقة' },
  { name: 'كريم', city: 'البحر الأحمر', template: 'أريج', ago: '13 دقيقة' },
  { name: 'منى', city: 'كفر الشيخ', template: 'أصالة', ago: '15 دقيقة' },
  { name: 'إبراهيم', city: 'بني سويف', template: 'عهد', ago: '21 دقيقة' },
  { name: 'روان', city: 'القليوبية', template: 'فيروز', ago: '2 دقيقة' },
  { name: 'زياد', city: 'البحيرة', template: 'أريج', ago: '27 دقيقة' },
  { name: 'آية', city: 'الوادي الجديد', template: 'أصالة', ago: '1 دقيقة' },
  { name: 'حمزة', city: 'الشرقية', template: 'عهد', ago: '33 دقيقة' },
  { name: 'سلمى', city: 'أسوان', template: 'فيروز', ago: '3 دقائق' },
  { name: 'ياسين', city: 'مطروح', template: 'أريج', ago: '45 دقيقة' },
  { name: 'داليا', city: 'القاهرة', template: 'أصالة', ago: '6 دقائق' },
  { name: 'عمار', city: 'الإسكندرية', template: 'عهد', ago: '20 دقيقة' },
  { name: 'شروق', city: 'الجيزة', template: 'فيروز', ago: '12 دقيقة' },
  { name: 'بلال', city: 'الدقهلية', template: 'أريج', ago: '8 دقائق' },
  { name: 'ريتاج', city: 'البحر الأحمر', template: 'أصالة', ago: '14 دقيقة' },
  { name: 'مالك', city: 'البحيرة', template: 'عهد', ago: '5 دقائق' },
  { name: 'لجين', city: 'الفيوم', template: 'فيروز', ago: '22 دقيقة' },
  { name: 'يحيى', city: 'الغربية', template: 'أريج', ago: '17 دقيقة' },
  { name: 'جميلة', city: 'الإسماعيلية', template: 'أصالة', ago: '9 دقائق' },
  { name: 'معتز', city: 'المنوفية', template: 'عهد', ago: '31 دقيقة' },
  { name: 'بسمة', city: 'المنيا', template: 'فيروز', ago: '4 دقائق' },
  { name: 'علي', city: 'القليوبية', template: 'أريج', ago: '28 دقيقة' },
  { name: 'نور', city: 'الوادي الجديد', template: 'أصالة', ago: '6 دقائق' },
  { name: 'ياسر', city: 'الشرقية', template: 'عهد', ago: '15 دقيقة' },
  { name: 'خلود', city: 'السويس', template: 'فيروز', ago: '34 دقيقة' },
  { name: 'سيف', city: 'أسوان', template: 'أريج', ago: '11 دقيقة' },
  { name: 'منة', city: 'أسيوط', template: 'أصالة', ago: '23 دقيقة' },
  { name: 'رامي', city: 'بني سويف', template: 'عهد', ago: '7 دقائق' },
  { name: 'ندى', city: 'بورسعيد', template: 'فيروز', ago: '40 دقيقة' },
  { name: 'هاني', city: 'دمياط', template: 'أريج', ago: '18 دقيقة' },
  { name: 'ولاء', city: 'كفر الشيخ', template: 'أصالة', ago: '2 دقيقة' },
  { name: 'صلاح', city: 'مطروح', template: 'عهد', ago: '52 دقيقة' },
  { name: 'أميرة', city: 'قنا', template: 'فيروز', ago: '9 دقائق' },
  { name: 'مجدي', city: 'شمال سيناء', template: 'أريج', ago: '26 دقيقة' },
  { name: 'دنيا', city: 'سوهاج', template: 'أصالة', ago: '13 دقيقة' },
  { name: 'شريف', city: 'جنوب سيناء', template: 'عهد', ago: '4 دقائق' },
  { name: 'ريهام', city: 'الأقصر', template: 'فيروز', ago: '37 دقيقة' },
  { name: 'وائل', city: 'القاهرة', template: 'أريج', ago: '29 دقيقة' },
  { name: 'أسماء', city: 'الإسكندرية', template: 'أصالة', ago: '16 دقيقة' },
  { name: 'إيهاب', city: 'الجيزة', template: 'عهد', ago: '24 دقيقة' },
  { name: 'مي', city: 'الدقهلية', template: 'فيروز', ago: '5 دقائق' },
  { name: 'باسم', city: 'البحر الأحمر', template: 'أريج', ago: '42 دقيقة' },
  { name: 'هدى', city: 'البحيرة', template: 'أصالة', ago: '3 دقائق' },
  { name: 'عمرو', city: 'الفيوم', template: 'عهد', ago: '55 دقيقة' },
  { name: 'يارا', city: 'الغربية', template: 'فيروز', ago: '8 دقائق' },
  { name: 'سامح', city: 'الإسماعيلية', template: 'أريج', ago: '21 دقيقة' },
  { name: 'دعاء', city: 'المنوفية', template: 'أصالة', ago: '11 دقيقة' },
  { name: 'سعد', city: 'المنيا', template: 'عهد', ago: '30 دقيقة' },
  { name: 'إسراء', city: 'القليوبية', template: 'فيروز', ago: '14 دقيقة' },
  { name: 'فادي', city: 'الوادي الجديد', template: 'أريج', ago: '19 دقيقة' },
  { name: 'عبير', city: 'الشرقية', template: 'أصالة', ago: '2 دقيقة' },
  { name: 'تامر', city: 'السويس', template: 'عهد', ago: '36 دقيقة' },
  { name: 'صفاء', city: 'أسوان', template: 'فيروز', ago: '5 دقائق' },
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
                اشترى تصميم <span className="text-[#a66b96]">{current.template}</span> منذ {current.ago}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

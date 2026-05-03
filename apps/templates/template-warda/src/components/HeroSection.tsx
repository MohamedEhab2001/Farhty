import { useTemplateFields } from '@farhty/template-sdk'
import { motion } from 'framer-motion'
import { RoseLargeSVG, OrnamentSVG, DividerSVG } from './Decorations'

export default function HeroSection() {
  const { get } = useTemplateFields()
  const brideName = get('bride_name') ?? 'ليلى'
  const groomName = get('groom_name') ?? 'كريم'
  const fatherBride = get('father_bride_name') ?? ''
  const fatherGroom = get('father_groom_name') ?? ''
  const weddingDate = get('wedding_date') ?? ''

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(d)
    } catch {
      return dateStr
    }
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blush-50 via-blush-100/30 to-blush-50 px-4 py-16">
      <RoseLargeSVG className="absolute top-0 left-0 w-[320px] h-[320px] opacity-[0.08] animate-float" />
      <RoseLargeSVG className="absolute bottom-0 right-0 w-[280px] h-[280px] opacity-[0.07] animate-float" style={{ animationDelay: '4s' }} />
      <RoseLargeSVG className="absolute top-1/4 right-0 w-[200px] h-[200px] opacity-[0.06] animate-float" style={{ animationDelay: '2s' }} />
      <RoseLargeSVG className="absolute bottom-1/4 left-0 w-[220px] h-[220px] opacity-[0.06] animate-float" style={{ animationDelay: '6s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-lg mx-auto"
      >
        {fatherBride && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-tajawal text-blush-500 text-sm mb-2"
          >
            مع الأسرة الطيبة لوالد العروسة / {fatherBride}
          </motion.p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-amiri text-5xl md:text-7xl text-blush-900 leading-tight"
        >
          {brideName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="my-4 flex justify-center"
        >
          <svg viewBox="0 0 60 30" className="w-16 h-8" fill="none">
            <path d="M5 15 Q15 5 30 15 Q45 25 55 15" stroke="#C69B7B" strokeWidth="1.2" fill="none" />
            <path d="M5 15 Q15 25 30 15 Q45 5 55 15" stroke="#C69B7B" strokeWidth="1.2" fill="none" />
            <circle cx="30" cy="15" r="2.5" fill="#C69B7B" />
            <path d="M20 15 Q25 10 30 12" stroke="#B8A99A" strokeWidth="0.8" fill="none" />
            <path d="M40 15 Q35 10 30 12" stroke="#B8A99A" strokeWidth="0.8" fill="none" />
            <path d="M20 15 Q25 20 30 18" stroke="#B8A99A" strokeWidth="0.8" fill="none" />
            <path d="M40 15 Q35 20 30 18" stroke="#B8A99A" strokeWidth="0.8" fill="none" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="font-amiri text-5xl md:text-7xl text-blush-900 leading-tight"
        >
          {groomName}
        </motion.h1>

        {fatherGroom && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="font-tajawal text-blush-500 text-sm mt-2"
          >
            مع الأسرة الطيبة لوالد العريس / {fatherGroom}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-6"
        >
          <DividerSVG className="w-48 mx-auto" />
        </motion.div>

        {weddingDate && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="font-amiri text-lg md:text-xl text-blush-600 mt-4 tracking-wide"
          >
            {formatDate(weddingDate)}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="font-tajawal text-blush-400 text-sm mt-3 italic"
        >
          يوم لا يُنسى
        </motion.p>
      </motion.div>
    </section>
  )
}
import { motion } from 'framer-motion'
import { WHATSAPP_NUMBER } from '../api/client'
import { IconDiamond, IconWhatsApp, BotanicalRose, BotanicalBranch, BotanicalFlower, BotanicalWheat } from './BrandIcons'

export default function Hero() {
  const scrollToTemplates = () => {
    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff7fa] via-[#fefcfe] to-[#fdfbf7]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #a66b96 0%, transparent 50%), radial-gradient(circle at 70% 60%, #d49bbd 0%, transparent 45%)' }} />

      <div className="absolute top-12 right-[10%] animate-float" style={{ animationDuration: '6s', animationDelay: '0s' }}>
        <BotanicalRose size={100} className="text-[#a66b96]" opacity={0.1} />
      </div>
      <div className="absolute top-48 left-[8%] animate-float hidden md:block" style={{ animationDuration: '7s', animationDelay: '1s' }}>
        <BotanicalBranch size={110} className="text-[#d49bbd]" opacity={0.12} />
      </div>
      <div className="absolute bottom-24 right-[15%] animate-float hidden sm:block" style={{ animationDuration: '5s', animationDelay: '2s' }}>
        <BotanicalFlower size={80} className="text-[#a66b96]" opacity={0.12} />
      </div>
      <div className="absolute bottom-40 left-[12%] animate-float" style={{ animationDuration: '8s', animationDelay: '1.5s' }}>
        <BotanicalWheat size={90} className="text-[#d49bbd]" opacity={0.1} />
      </div>
      <div className="absolute top-20 left-[30%] animate-float hidden lg:block" style={{ animationDuration: '6.5s', animationDelay: '3s' }}>
        <BotanicalFlower size={60} className="text-[#a66b96]" opacity={0.06} />
      </div>

      <div className="absolute top-4 right-4 w-80 h-80 rounded-full bg-[#a66b9606] blur-3xl pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-64 h-64 rounded-full bg-[#d49bbd06] blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7] via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 px-4 max-w-3xl mx-auto text-start sm:text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="section-label inline-flex items-center gap-2 bg-[#a66b9610] border border-[#a66b9625] rounded-full px-4 py-1.5 mb-8"
        >
          <IconDiamond size={14} />
          دعوات زفاف رقمية فاخرة
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold text-[#3d2c38] leading-[1.15] tracking-tight mb-5"
        >
          دعوة زفافك...{' '}
          <span className="text-gradient-gold font-black" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            حكاية تبدأ من هنا
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[#8c7a87] text-base sm:text-lg md:text-xl max-w-xl sm:mx-auto leading-relaxed mb-10"
        >
          تصاميم رومانسية ناعمة بتفاصيل تخطف الأنظار، ودعوة تفاعلية تشاركها مع أحبابك بلمسة زر
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start sm:justify-center gap-3"
        >
          <button
            id="hero-browse-btn"
            onClick={scrollToTemplates}
            className="btn-primary w-full sm:w-auto"
          >
            استعرض القوالب الآن
            <IconDiamond size={18} />
          </button>
          <a
            id="hero-whatsapp-btn"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحبا، أريد معرفة المزيد عن دعوات فرحتي')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost w-full sm:w-auto"
          >
            <IconWhatsApp size={20} />
            تحدث معنا
          </a>
        </motion.div>
      </div>
    </section>
  )
}
import { motion } from 'framer-motion'
import { WHATSAPP_NUMBER } from '../api/client'
import { IconDiamond, IconWhatsApp, BotanicalRose, BotanicalBranch, BotanicalFlower, BotanicalWheat } from './BrandIcons'

export default function Hero() {
  const scrollToTemplates = () => {
    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden pt-32 pb-16"
      dir="rtl"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff7fa] via-[#ffffff] to-[#fdfbf7]" />

      {/* Floating Botanical Particles */}
      <div className="absolute top-12 right-[10%] animate-float" style={{ animationDuration: '6s', animationDelay: '0s' }}>
        <BotanicalRose size={100} className="text-[#a66b96]" opacity={0.12} />
      </div>
      <div className="absolute top-48 left-[8%] animate-float hidden md:block" style={{ animationDuration: '7s', animationDelay: '1s' }}>
        <BotanicalBranch size={110} className="text-[#d49bbd]" opacity={0.15} />
      </div>
      <div className="absolute bottom-24 right-[15%] animate-float hidden sm:block" style={{ animationDuration: '5s', animationDelay: '2s' }}>
        <BotanicalFlower size={80} className="text-[#a66b96]" opacity={0.15} />
      </div>
      <div className="absolute bottom-40 left-[12%] animate-float" style={{ animationDuration: '8s', animationDelay: '1.5s' }}>
        <BotanicalWheat size={90} className="text-[#d49bbd]" opacity={0.12} />
      </div>
      <div className="absolute top-24 left-[30%] animate-float hidden lg:block" style={{ animationDuration: '6.5s', animationDelay: '3s' }}>
        <BotanicalFlower size={60} className="text-[#a66b96]" opacity={0.08} />
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-[#a66b960a] blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-[#d49bbd0a] blur-3xl pointer-events-none" />

      {/* Soft gradient overlay for blending */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7] via-transparent to-transparent" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 bg-[#a66b9615] border border-[#a66b9630] rounded-full px-5 py-2 mb-6 shadow-sm"
        >
          <span className="text-[#a66b96] text-sm font-semibold flex items-center gap-2">
            <IconDiamond size={16} />
            لا تنسي أن تصنعي ذكريات لا تُنسى
            <IconDiamond size={16} />
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#3d2c38] leading-tight mb-4 tracking-tight"
        >
          دعوة زفافك... 
          <br />
          <span className="text-gradient-gold drop-shadow-sm">حكاية خرافية تبدأ من هنا</span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-[#8c7a87] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8"
        >
          تصاميم رومانسية ناعمة، تفاصيل تخطف الأنظار، ودعوة تفاعلية تشاركينها مع أحبابك بلمسة زر لتكتمل فرحتك!
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            id="hero-browse-btn"
            onClick={scrollToTemplates}
            className="w-full sm:w-auto px-8 py-4 rounded-full shadow-lg shadow-[#a66b9630] bg-gradient-to-r from-[#a66b96] to-[#d49bbd] text-[#ffffff] font-bold text-lg hover:from-[#d49bbd] hover:to-[#a66b96] transition-all duration-300 active:scale-95 animate-pulse-gold flex items-center justify-center gap-2"
          >
            استعرضي القوالب الآن
            <IconDiamond size={20} color="currentColor" />
          </button>
          <a
            id="hero-whatsapp-btn"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحبا، أريد معرفة المزيد عن دعوات فرحتي')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full shadow-sm border border-[#ebdce3]/50 bg-white text-[#3d2c38] font-semibold text-lg hover:border-[#a66b96] hover:text-[#a66b96] hover:bg-[#fff7fa] transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <IconWhatsApp size={20} className="group-hover:scale-110 transition-transform" />
            تحدثي معنا
          </a>
        </motion.div>
      </div>
    </section>
  )
}

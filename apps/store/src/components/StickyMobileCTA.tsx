export default function StickyMobileCTA() {
  const scrollTo = () => {
    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 md:hidden"
      dir="rtl"
    >
      <div className="bg-[#fdfbf7]/90 backdrop-blur-xl border-t border-[#ebdce3] px-4 py-3">
        <button
          id="sticky-mobile-cta-btn"
          onClick={scrollTo}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-l from-[#a66b96] to-[#d49bbd] text-[#fdfbf7] font-bold text-base active:scale-95 transition-transform"
        >
          💍 اطلب دعوتك الآن
        </button>
      </div>
    </div>
  )
}

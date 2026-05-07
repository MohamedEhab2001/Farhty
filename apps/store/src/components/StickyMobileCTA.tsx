import { IconDiamond } from './BrandIcons'

export default function StickyMobileCTA() {
  const scrollTo = () => {
    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-40 md:hidden"
      dir="rtl"
    >
      <div className="bg-[#fdfbf7]/90 backdrop-blur-xl border-t border-[#ebdce3]/60 px-4 py-3">
        <button
          id="sticky-mobile-cta-btn"
          onClick={scrollTo}
          className="w-full py-3 rounded-xl bg-[#a66b96] text-[#fdfbf7] font-bold text-base active:scale-[0.98] transition-transform duration-150 flex justify-center items-center gap-2 focus-visible:outline-2 focus-visible:outline-[#a66b96] focus-visible:outline-offset-3"
        >
          <IconDiamond size={18} />
          اطلبي دعوتك الآن
        </button>
      </div>
    </div>
  )
}
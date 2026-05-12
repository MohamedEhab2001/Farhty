import { Reveal } from './Reveal'
import { IconTemplate, IconChat, IconShare } from './BrandIcons'

const STEPS = [
  {
    num: '١',
    icon: <IconTemplate size={26} className="text-[#a66b96]" />,
    title: 'اختر قالبك',
    desc: 'تصفح القوالب الفاخرة واختر التصميم الذي يعكس ذوقك ويحكي قصتك.',
    iconPath: 'M4 6h16M4 12h16M4 18h10',
  },
  {
    num: '٢',
    icon: <IconChat size={26} className="text-[#a66b96]" />,
    title: 'تواصل معنا',
    desc: 'راسلنا على واتساب لتأكيد الطلب وإرسال البيانات وسداد المبلغ بكل سهولة.',
    iconPath: 'M21 15a4 4 0 0 1-4 4H8l-5 4V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z',
  },
  {
    num: '٣',
    icon: <IconShare size={26} className="text-[#a66b96]" />,
    title: 'شارك دعوتك',
    desc: 'احصل على رابط دعوتك خلال دقائق، أدخل بياناتك وشاركها مع ضيوفك فوراً.',
    iconPath: 'M4 12v.01M4 6v.01M4 18v.01M9 6h11M9 12h11M9 18h11',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 scroll-mt-24">
      <div className="container-luxe">
        <Reveal className="text-center max-w-2xl mx-auto mb-20">
          <span className="eyebrow">خطوات بسيطة</span>
          <h2 className="text-4xl md:text-5xl mt-5 text-[#3d2c38]">
            كيف يعمل <span className="italic text-[#955d85]">فرحتي؟</span>
          </h2>
          <div className="divider-ornament my-5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" /></svg>
          </div>
          <p className="text-[#8c7a87]">من اللحظة التي تختار فيها التصميم وحتى يصل ضيوفك — تجربة سلسة وأنيقة.</p>
        </Reveal>

        <Reveal stagger className="relative grid md:grid-cols-3 gap-6">
          <div aria-hidden className="hidden md:block absolute top-20 right-[16.6%] left-[16.6%] h-px bg-gradient-to-r from-transparent via-[#a66b96]/30 to-transparent" />
          {STEPS.map((s) => (
            <div key={s.num} className="card-luxe p-8 text-center relative tilt">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#a66b96] text-[#fdfbf7] flex items-center justify-center text-sm font-bold shadow-[var(--shadow-soft)] animate-pulse-glow" style={{ fontFamily: "'Alexandria', sans-serif" }}>
                {s.num}
              </div>
              <div className="w-16 h-16 mx-auto mt-2 rounded-2xl bg-[#fef0f8] border border-[#ebdce3] flex items-center justify-center transition-transform duration-500 hover:rotate-6 hover:scale-110">
                {s.icon}
              </div>
              <h3 className="text-2xl mt-5 text-[#3d2c38]">{s.title}</h3>
              <p className="text-sm text-[#8c7a87] mt-3 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

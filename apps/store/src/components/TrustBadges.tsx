import { Reveal } from './Reveal'
import { IconShield, IconHeadset, IconInstant, IconDiamond } from './BrandIcons'

const ITEMS = [
  { icon: <IconShield size={22} className="text-[#fdfbf7]" />, title: 'ضمان الاسترداد', desc: 'استرداد المبلغ كاملاً خلال ٢٤ ساعة دون أي أسئلة.' },
  { icon: <IconHeadset size={22} className="text-[#fdfbf7]" />, title: 'دعم فني مجاني', desc: 'فريقنا متاح لمساعدتكِ في كل خطوة قبل وبعد الشراء.' },
  { icon: <IconInstant size={22} className="text-[#fdfbf7]" />, title: 'تسليم فوري', desc: 'دعوتكِ جاهزة خلال دقائق من الدفع — لا انتظار.' },
  { icon: <IconDiamond size={22} className="text-[#fdfbf7]" />, title: 'قوالب حصرية', desc: 'تصاميم لا تجدينها في أي مكان آخر — مصنوعة بحب لِفرحتكِ.' },
]

export default function TrustBadges() {
  return (
    <section className="py-20 sm:py-28 px-4 scroll-mt-24">
      <div className="container-luxe">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="eyebrow">ضمانات</span>
          <h2 className="text-4xl md:text-5xl mt-5 text-[#3d2c38]">
            لماذا تختارين <span className="italic text-[#955d85]">فرحتي؟</span>
          </h2>
          <div className="divider-ornament my-5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" /></svg>
          </div>
        </Reveal>

        <Reveal stagger className="grid sm:grid-cols-2 gap-5">
          {ITEMS.map((it) => (
            <div key={it.title} className="card-luxe p-6 flex items-start gap-5 group tilt glint">
              <div
                className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                style={{ background: 'var(--gradient-primary)' }}
              >
                {it.icon}
              </div>
              <div>
                <h3 className="text-xl text-[#3d2c38]">{it.title}</h3>
                <p className="text-sm text-[#8c7a87] mt-1.5 leading-relaxed">{it.desc}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

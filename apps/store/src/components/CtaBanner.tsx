import { Reveal } from './Reveal'
import { Petals } from './Petals'
import { WHATSAPP_NUMBER } from '../api/client'
import { IconWhatsApp } from './BrandIcons'

export function CtaBanner() {
  const scrollToTemplates = () => {
    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="order" className="py-24 scroll-mt-24 px-4">
      <div className="container-luxe">
        <Reveal blur>
          <div
            className="relative overflow-hidden rounded-[2rem] p-10 md:p-16 text-center"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Petals count={14} />
            <div aria-hidden className="absolute inset-0 opacity-15">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 400" fill="none" stroke="white" strokeWidth="0.5">
                {[...Array(20)].map((_, i) => {
                  const cx = (i * 137) % 800
                  const cy = (i * 89) % 400
                  const r = 20 + ((i * 23) % 80)
                  return <circle key={i} cx={cx} cy={cy} r={r} />
                })}
              </svg>
            </div>

            <span className="relative inline-flex eyebrow !bg-white/15 !text-white !border-white/30">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              ابدئي رحلتك الآن
            </span>
            <h2 className="relative text-4xl md:text-6xl mt-6 text-[#fdfbf7]">
              دعوة زفافك تستحق <span className="italic text-[#E8B174] font-bold">الأفضل</span>
            </h2>
            <p className="relative text-[#fdfbf7]/85 mt-5 max-w-xl mx-auto leading-relaxed">
              انضمي لآلاف العرائس اللاتي اخترن فرحتي — تصميم فاخر، تسليم فوري، وذكرى لا تُنسى.
            </p>
            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={scrollToTemplates}
                className="btn-ghost-luxe !bg-white !text-[#955d85] !border-white"
              >
                استعرضي القوالب
              </button>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحبا، أريد الطلب من فرحتي')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-[#fdfbf7] border border-white/40 hover:bg-white/10 transition"
              >
                <IconWhatsApp size={18} />
                تواصلي على واتساب
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { WHATSAPP_NUMBER } from '../api/client'
import { IconDiamond, IconWhatsApp } from './BrandIcons'
import { Petals } from './Petals'

const visitors = Math.floor(Math.random() * 1000)


function Counter({ to, suffix = '', duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = performance.now()
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration)
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(Math.floor(eased * to))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        io.disconnect()
      }
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])
  return <span ref={ref}>{val.toLocaleString('ar-EG')}{suffix}</span>
}

export default function Hero() {
  const [parY, setParY] = useState(0)

  useEffect(() => {
    const onScroll = () => setParY(Math.min(120, window.scrollY * 0.18))
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTemplates = () => {
    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="top" className="relative pt-36 pb-24 overflow-hidden" dir="rtl">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 right-[6%] w-40 h-40 rounded-full bg-[#a66b96]/5 blur-3xl animate-float-slow" />
        <div className="absolute top-60 left-[8%] w-56 h-56 rounded-full bg-[#d49bbd]/15 blur-3xl animate-float-slow [animation-delay:2s]" />
        <svg aria-hidden className="absolute top-24 right-10 w-24 h-24 text-[#a66b96]/20 animate-spin-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6">
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="20" />
          {[...Array(12)].map((_, i) => (
            <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos((i * Math.PI) / 6)} y2={50 + 40 * Math.sin((i * Math.PI) / 6)} />
          ))}
        </svg>
      </div>
      <Petals count={10} />

      <div className="container-luxe relative grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-12">
        <div className="flex flex-col items-center lg:items-start text-center lg:text-right animate-blur-in">
          {/* <span className="eyebrow mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a66b96] animate-pulse" />
            دعوات زفاف رقمية فاخرة
          </span> */}

          <h1 className="text-[clamp(2rem,5.5vw,4rem)] leading-[1.05] text-[#3d2c38] max-w-2xl">
            <p className='mb-2'>دعوة فرحتك</p>
            <span className="italic text-[#955d85] relative inline-block">
              تستاهل تبقي ذكرى
              <svg aria-hidden className="absolute -bottom-3 right-0 left-0 w-full" viewBox="0 0 300 14" preserveAspectRatio="none">
                <path
                  d="M2 8 Q 75 1, 150 8 T 298 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  className="text-[#a66b96]/60"
                  style={{ strokeDasharray: 320, strokeDashoffset: 320, animation: 'draw 1.6s ease-out .6s forwards' }}
                />
              </svg>
              <style>{`@keyframes draw { to { stroke-dashoffset: 0 } }`}</style>
            </span>
          </h1>

          <div className="divider-ornament my-7 self-center lg:self-start">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" /></svg>
          </div>

          <p className="max-w-xl text-base md:text-lg text-[#8c7a87] leading-relaxed">
            مع فرحتي، دعوة فرحك مش مجرد تصميم حلو…
            دي أول إحساس بيوصل لضيوفك عن
            <span className="text-[#3d2c38]/85"> يومكم المميز.</span>
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <button id="hero-browse-btn" onClick={scrollToTemplates} className="btn-primary group">
              <IconDiamond size={18} />
              استعرض التصاميم الآن
            </button>
            <a
              id="hero-whatsapp-btn"
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('مرحبا، أريد معرفة المزيد عن دعوات فرحتي')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-luxe group"
            >
              <IconWhatsApp size={18} />
              تواصل معنا
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            {[
              { val: 120, suffix: '+', label: 'عملاء سعداء' },
              { val: 49, suffix: '★', label: 'تقييم العملاء', divisor: 10 },
              { val: 5, suffix: ' د', label: 'تسليم فوري' },
              { val: 24, suffix: '/٧', label: 'دعم فني' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center lg:items-start">
                <div className="text-2xl md:text-3xl text-[#955d85] font-bold" style={{ fontFamily: "'Alexandria', sans-serif" }}>
                  {s.divisor
                    ? <>{(s.val / s.divisor).toLocaleString('ar-EG', { minimumFractionDigits: 1 })}{s.suffix}</>
                    : <Counter to={s.val} suffix={s.suffix} />
                  }
                </div>
                <div className="text-xs text-[#8c7a87] mt-1 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero image */}
        <div className="relative animate-rise [animation-delay:.2s]" style={{ transform: `translateY(${-parY * 0.3}px)` }}>
          <div className="relative aspect-[4/5] max-w-md mx-auto">
            <svg aria-hidden className="absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)] text-[#a66b96]/25 animate-spin-slow" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="98" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
            </svg>

            <div className="absolute inset-0 rounded-[2rem] overflow-hidden img-zoom shadow-[var(--shadow-elegant)] border border-[#a66b96]/15">
              <img src={"https://scontent.fspx1-1.fna.fbcdn.net/v/t39.30808-6/698990080_122098373661315584_2908464142913695598_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=upTkBHYADTMQ7kNvwGt0GRa&_nc_oc=AdqLJsWN3oru4kuJZjgU16fZLCLURn99AibvUGWZxfrljfDbH_ECj-uZK9vLfujpSrM&_nc_zt=23&_nc_ht=scontent.fspx1-1.fna&_nc_gid=Fk4rJ_nnfHj1rIf3cbr6JQ&_nc_ss=7b2a8&oh=00_Af53vh-EAWW-ekNaRw8IXcZuEM6dDQjo067Vy7iQCbuu3A&oe=6A0EB308"} alt="عروسان بلباس فاخر" className="w-full h-full object-cover" width={1536} height={1024} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7]/60 via-transparent to-transparent" />
            </div>

            {/* Floating chip — RSVP */}
            <div className="absolute -top-4 -right-4 card-luxe px-4 py-2.5 flex items-center gap-2.5 animate-float-slow">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-glow" />
              <div className="text-[11px] leading-tight">
                <div className="font-semibold text-[#3d2c38]">الزوار</div>
                <div className="text-[#8c7a87]">{visitors} ضيف</div>
              </div>
            </div>
            {/* 
           
            <div className="absolute -bottom-5 -left-5 card-luxe px-4 py-3 animate-float-slow [animation-delay:1.5s]">
              <div className="text-[10px] tracking-widest text-[#8c7a87]">يبدأ الفرح خلال</div>
              <div className="flex items-baseline gap-1 text-[#955d85]" style={{ fontFamily: "'Alexandria', sans-serif" }}>
                <span className="text-2xl font-bold">١٢</span><span className="text-xs">يوم</span>
                <span className="text-2xl font-bold mr-1">٠٧</span><span className="text-xs">ساعة</span>
              </div>
            </div>
             */}

            {/* Floating chip — heart */}
            <div className="absolute top-1/3 -left-8 card-luxe w-12 h-12 rounded-full grid place-items-center animate-float-slow [animation-delay:.8s]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#a66b96]">
                <path d="M12 21s-7-4.35-9.5-8.5C.5 9 3 5 6.5 5c2 0 3.5 1.5 5.5 4 2-2.5 3.5-4 5.5-4 3.5 0 6 4 4 7.5C19 16.65 12 21 12 21Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

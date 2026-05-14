'use client'

import { motion } from 'framer-motion'
import { useTemplateFields } from '@farhty/template-sdk'

export default function HeroSection() {
  const { get } = useTemplateFields()

  const brideName = get('bride_name') ?? 'ليلى'
  const groomName = get('groom_name') ?? 'كريم'
  const tagline = get('tagline') ?? 'يسعدنا أن نشارككم فرحتنا'
  const heroImage = get('hero_image') as string | undefined
  const weddingDate = get('wedding_date') as string | undefined

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-ivory">

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blush-50 via-ivory to-white" />

      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='1.5' fill='%23D4627F'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Section flower-frame corners ── */}
      <div className="absolute top-0 left-0 pointer-events-none z-10">
        <img src="/assets/blossom-1.png" alt="" className="w-20 md:w-44 opacity-70" />
      </div>
      <div className="absolute top-0 right-0 pointer-events-none z-10">
        <img src="/assets/blossom-1.png" alt="" className="w-20 md:w-44 opacity-70" style={{ transform: 'scaleX(-1)' }} />
      </div>
      <div className="absolute bottom-0 left-0 pointer-events-none z-10">
        <img src="/assets/peony-1.png" alt="" className="w-24 md:w-52 opacity-60" style={{ transform: 'scaleY(-1)' }} />
      </div>
      <div className="absolute bottom-0 right-0 pointer-events-none z-10">
        <img src="/assets/peony-1.png" alt="" className="w-24 md:w-52 opacity-60" style={{ transform: 'scale(-1,-1)' }} />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-24 flex flex-col items-center gap-6">

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-body text-rose/55 text-sm md:text-base tracking-[0.22em] text-center"
        >
          {tagline}
        </motion.p>

        {/* ── Names + Circle row ── */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 lg:gap-16 w-full">

          {/* Bride name — right in RTL */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-2 min-w-[120px]"
          >
            <span className="font-body text-rose/40 text-xs tracking-widest">العروسة</span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight leading-normal text-deep-rose text-center">
              {brideName}
            </h1>
          </motion.div>

          {/* ── Circular image with flower frame ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex-shrink-0 flex items-center justify-center"
            style={{ width: 'clamp(180px, 50vw, 320px)', height: 'clamp(180px, 50vw, 320px)' }}
          >
            {/* Flower ring — 8 petals orbiting the circle */}
            {[
              { img: '/assets/petal-1.png',   angle: 0,    size: 48, delay: 0.8 },
              { img: '/assets/blossom-1.png', angle: 45,   size: 52, delay: 0.9 },
              { img: '/assets/petal-1.png',   angle: 90,   size: 44, delay: 1.0 },
              { img: '/assets/peony-1.png',   angle: 135,  size: 56, delay: 1.1 },
              { img: '/assets/petal-1.png',   angle: 180,  size: 48, delay: 1.2 },
              { img: '/assets/blossom-1.png', angle: 225,  size: 52, delay: 1.3 },
              { img: '/assets/petal-1.png',   angle: 270,  size: 44, delay: 1.4 },
              { img: '/assets/peony-1.png',   angle: 315,  size: 56, delay: 1.5 },
            ].map(({ img, angle, size, delay }, i) => {
              const rad = (angle * Math.PI) / 180
              const r = 50          // % radius from center — sits just outside the circle edge
              const cx = 50 + r * Math.cos(rad)
              const cy = 50 + r * Math.sin(rad)
              return (
                <motion.img
                  key={i}
                  src={img}
                  alt=""
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.85, scale: 1 }}
                  transition={{ delay, duration: 0.5, type: 'spring', stiffness: 200 }}
                  style={{
                    position: 'absolute',
                    left: `${cx}%`,
                    top: `${cy}%`,
                    width: size,
                    height: size,
                    transform: `translate(-50%, -50%) rotate(${angle + 45}deg)`,
                    pointerEvents: 'none',
                    zIndex: 2,
                  }}
                />
              )
            })}

            {/* Outer decorative ring */}
            <div className="absolute inset-0 rounded-full border-2 border-rose/15 z-1" style={{ margin: '-12px' }} />
            {/* Inner glow ring */}
            <div className="absolute inset-0 rounded-full shadow-[0_0_0_6px_rgba(212,98,127,0.06),0_0_0_14px_rgba(212,98,127,0.03)]" />

            {/* Circle image */}
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_20px_50px_-10px_rgba(212,98,127,0.22)] border-4 border-white z-1">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt="صورة الزفاف"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blush-100 to-blush-50 flex flex-col items-center justify-center gap-2">
                  <img src="/assets/blossom-1.png" alt="" className="w-16 opacity-40" />
                  <p className="text-warm-charcoal/30 text-xs font-body">صورة الغلاف</p>
                </div>
              )}
              {/* Soft vignette */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-transparent to-rose/10 pointer-events-none" />
            </div>
          </motion.div>

          {/* Groom name — left in RTL */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-2 min-w-[120px]"
          >
            <span className="font-body text-rose/40 text-xs tracking-widest">العريس</span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight leading-normal text-deep-rose text-center">
              {groomName}
            </h1>
          </motion.div>
        </div>

        {/* Ampersand + divider below names */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-px bg-gradient-to-l from-rose/35 to-transparent" />
          <img src="/assets/petal-1.png" alt="" className="w-5 h-5 opacity-60" />
          <span className="font-amiri text-xl text-rose/40">&</span>
          <img src="/assets/petal-1.png" alt="" className="w-5 h-5 opacity-60" style={{ transform: 'scaleX(-1)' }} />
          <div className="w-12 h-px bg-gradient-to-r from-rose/35 to-transparent" />
        </motion.div>

        {/* Wedding date */}
        {weddingDate && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="font-body text-warm-charcoal/35 text-sm tracking-[0.18em] text-center"
          >
            {formatDate(weddingDate)}
          </motion.p>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-ivory to-transparent z-20 pointer-events-none" />
    </section>
  )
}

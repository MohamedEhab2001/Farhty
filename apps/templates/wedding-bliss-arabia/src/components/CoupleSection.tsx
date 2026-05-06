import { useTemplateFields } from '@farhty/template-sdk'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import coupleImg from '../assets/couple.jpg'

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function CoupleSection() {
  const { get } = useTemplateFields()
  const coupleImage = get('couple_image') || coupleImg
  const storyText = get('our_story') ?? 'Two hearts met and a love story began — a bond blessed by family, faith, and the gentle mercy of Allah. Your presence is the light that will make our day complete.'
  const storyTextAr = get('our_story_ar') ?? 'قصتنا'

  return (
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <FadeUp>
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden border border-gold/30"
            style={{ boxShadow: 'var(--shadow-elegant)' }}
          >
            <img
              src={coupleImage}
              alt="Couple"
              loading="lazy"
              className="w-full h-[560px] object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, transparent 60%, oklch(0.22 0.06 155) 100%)',
              }}
            />
          </motion.div>
        </FadeUp>

        <div>
          <FadeUp>
            <p dir="rtl" className="font-arabic text-3xl text-gold mb-3">
              {storyTextAr}
            </p>
            <h3 className="font-serif text-4xl md:text-5xl mb-8">
              Our Story
            </h3>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="font-serif text-lg leading-relaxed text-ivory/80">
              {storyText}
            </p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <div className="mt-8 flex items-center gap-3 text-gold/80">
              <Heart className="h-4 w-4" />
              <span className="text-xs tracking-[0.4em] uppercase">
                A love story
              </span>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

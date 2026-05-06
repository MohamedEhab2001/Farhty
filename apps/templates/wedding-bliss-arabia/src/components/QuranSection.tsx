import { useTemplateFields } from '@farhty/template-sdk'
import { motion } from 'framer-motion'
import ornament from '../assets/ornament-bg.jpg'
import divider from '../assets/divider.png'

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

export default function QuranSection() {
  const { get } = useTemplateFields()
  const verseAr = get('quran_verse_ar') ?? 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً'
  const verseEn = get('quran_verse_en') ?? '"And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy."'
  const verseRef = get('quran_verse_ref') ?? 'Ar-Rum 30:21'

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{ backgroundImage: `url(${ornament})`, backgroundSize: '400px' }}
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <FadeUp>
          <p className="text-[0.7rem] tracking-[0.5em] uppercase text-gold mb-3">
            Surah
          </p>
          <h3 className="font-serif text-3xl md:text-4xl mb-12 text-ivory/90">
            The Most Merciful
          </h3>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div dir="rtl" className="font-arabic text-3xl md:text-4xl leading-[2.2] text-gold">
            <p>{verseAr}</p>
          </div>
        </FadeUp>

        <FadeUp delay={0.5}>
          <div className="my-12">
            <motion.img
              src={divider}
              alt=""
              loading="lazy"
              initial={{ opacity: 0, scaleX: 0.4 }}
              whileInView={{ opacity: 0.9, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="mx-auto h-12 md:h-16 w-auto"
            />
          </div>
          <p className="font-serif italic text-lg md:text-xl text-ivory/75 leading-relaxed max-w-2xl mx-auto">
            {verseEn}
          </p>
          <p className="mt-4 text-xs tracking-[0.4em] uppercase text-gold/70">
            — {verseRef}
          </p>
        </FadeUp>
      </div>
    </section>
  )
}

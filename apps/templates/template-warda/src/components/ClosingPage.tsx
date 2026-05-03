import { motion } from 'framer-motion'
import { useTemplateFields } from '@farhty/template-sdk'
import { RoseLargeSVG, DividerSVG } from './Decorations'
import ShareButtons from './ShareButtons'

export default function ClosingPage() {
  const { get } = useTemplateFields()
  const brideName = get('bride_name') ?? 'ليلى'
  const groomName = get('groom_name') ?? 'كريم'
  const customerMessage = get('customer_message') ?? 'شاركونا أجمل لحظات حياتنا'

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blush-50 via-blush-100/20 to-blush-50 py-16 px-4">
      <RoseLargeSVG className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-[350px] h-[350px] opacity-[0.1]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <svg viewBox="0 0 200 200" className="w-32 h-32 mx-auto" fill="none" opacity="0.25">
            <circle cx="100" cy="80" r="35" fill="#E8B4B4" />
            <circle cx="88" cy="73" r="22" fill="#D4A0A0" opacity="0.7" />
            <circle cx="112" cy="73" r="20" fill="#E8B4B4" opacity="0.6" />
            <circle cx="100" cy="88" r="24" fill="#C69B7B" opacity="0.5" />
            <ellipse cx="100" cy="76" rx="13" ry="13" fill="#FFE8E8" opacity="0.7" />
            <path d="M100 102 Q95 130 82 150" stroke="#B8A99A" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M100 102 Q105 132 115 152" stroke="#B8A99A" strokeWidth="2" fill="none" opacity="0.5" />
            <ellipse cx="80" cy="148" rx="8" ry="5" fill="#B8A99A" opacity="0.4" transform="rotate(-20 80 148)" />
            <ellipse cx="118" cy="150" rx="7" ry="4" fill="#B8A99A" opacity="0.35" transform="rotate(15 118 150)" />
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="font-amiri text-xl md:text-2xl text-blush-800 leading-relaxed mb-6"
        >
          {customerMessage}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          <DividerSVG className="w-40 mx-auto mb-6" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
          className="font-amiri text-lg text-blush-600 mb-8"
        >
          {brideName} و {groomName}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1 }}
        >
          <ShareButtons />
        </motion.div>
      </motion.div>
    </section>
  )
}
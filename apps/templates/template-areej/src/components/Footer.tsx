import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="relative py-12 text-center overflow-hidden border-t border-rose/10 bg-ivory">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10"
      >
        <div className="w-24 h-px mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,169,110,0.3), transparent)' }} />
        <p className="font-amiri text-lg rose-shimmer mb-2">
          أريج
        </p>
        <p className="font-body text-warm-charcoal/30 text-xs">
          صُمّمت بكل حب بواسطة <span className="rose-shimmer font-bold">فرحتي</span>
        </p>
      </motion.div>
    </footer>
  )
}
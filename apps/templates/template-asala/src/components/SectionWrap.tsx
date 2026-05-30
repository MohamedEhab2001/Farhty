import { motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

interface SectionWrapProps {
  id: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  onActive: (id: string) => void;
}

export function SectionWrap({ id, eyebrow, title, children, onActive }: SectionWrapProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onActive(id);
        });
      },
      { threshold: 0.45 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [id, onActive]);

  return (
    <section
      id={id}
      ref={ref}
      className="relative flex items-center justify-center px-5 py-12 md:py-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-20 w-full max-w-3xl mx-auto text-center"
      >
        {eyebrow && (
          <div className="text-gold/80 text-xs md:text-sm tracking-[0.5em] mb-4 font-body uppercase">
            {eyebrow}
          </div>
        )}
        {title && (
          <h2 className="font-arabic text-4xl md:text-6xl text-gradient-gold mb-6 leading-tight">
            {title}
          </h2>
        )}
        {title && <div className="ornament-divider w-32 mx-auto mb-6" />}
        {children}
      </motion.div>
    </section>
  );
}

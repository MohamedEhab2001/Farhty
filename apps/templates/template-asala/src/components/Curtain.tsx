import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CurtainProps {
  onOpen?: () => void;
}

export function Curtain({ onOpen }: CurtainProps) {
  const [opened, setOpened] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setOpened(true);
      onOpen?.();
    }, 600);
    const t2 = setTimeout(() => setGone(true), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onOpen]);

  if (gone) return null;

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-hidden
      style={{ perspective: "1200px" }}
    >
      {/* Top valance */}
      <motion.div
        initial={{ y: 0 }}
        animate={opened ? { y: "-110%" } : { y: 0 }}
        transition={{ duration: 1.2, ease: [0.83, 0, 0.17, 1], delay: 0.1 }}
        className="absolute top-0 left-0 right-0 h-32 bg-gradient-curtain pointer-events-auto"
        style={{
          boxShadow: "0 10px 40px oklch(0 0 0 / 0.6)",
          background:
            "linear-gradient(180deg, oklch(0.30 0.18 22), oklch(0.18 0.14 20))",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-gold opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-gold" />
        {/* Tassels */}
        <div className="absolute inset-x-0 -bottom-3 flex justify-around">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-5 bg-gradient-gold rounded-b-full opacity-90"
            />
          ))}
        </div>
      </motion.div>

      {/* Left curtain panel */}
      <motion.div
        initial={{ x: 0, rotateY: 0 }}
        animate={opened ? { x: "-105%", rotateY: -25 } : { x: 0 }}
        transition={{ duration: 1.4, ease: [0.83, 0, 0.17, 1], delay: 0.2 }}
        className="absolute top-0 bottom-0 left-0 w-[52%] curtain-velvet pointer-events-auto"
        style={{
          transformOrigin: "left center",
          boxShadow: "inset -40px 0 60px oklch(0 0 0 / 0.7), 20px 0 60px oklch(0 0 0 / 0.5)",
        }}
      />

      {/* Right curtain panel */}
      <motion.div
        initial={{ x: 0, rotateY: 0 }}
        animate={opened ? { x: "105%", rotateY: 25 } : { x: 0 }}
        transition={{ duration: 1.4, ease: [0.83, 0, 0.17, 1], delay: 0.2 }}
        className="absolute top-0 bottom-0 right-0 w-[52%] curtain-velvet pointer-events-auto"
        style={{
          transformOrigin: "right center",
          boxShadow: "inset 40px 0 60px oklch(0 0 0 / 0.7), -20px 0 60px oklch(0 0 0 / 0.5)",
        }}
      />

      {/* Initial centered text before opening */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: opened ? 0 : 1, scale: opened ? 1.1 : 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-gold/70 text-xs tracking-[0.4em] mb-4 font-body">
            FARHTY · فرحتي
          </div>
          <div className="font-arabic text-4xl md:text-6xl text-gradient-gold animate-shimmer">
            بسم الله نبدأ
          </div>
          <div className="mt-6 ornament-divider w-40 mx-auto" />
        </div>
      </motion.div>
    </div>
  );
}

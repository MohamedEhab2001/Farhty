import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Curtain } from "@/components/Curtain";
import { Petals } from "@/components/Petals";
import { CoupleBubbles } from "@/components/CoupleBubbles";
import { SectionWrap } from "@/components/SectionWrap";
import hallBg from "@/assets/hall-bg.jpg";
import couple from "@/assets/couple.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const BRIDE = "ليلى";
const GROOM = "أحمد";
const DATE_AR = "السبت ١٥ يونيو ٢٠٢٥";
const DATE_ISO = "2025-06-15T20:00:00";
const VENUE = "قاعة الماسة الكبرى — القاهرة";

const MESSAGES = [
  { id: "hero", speaker: "bride" as const, text: `أهلًا بكم في رحلة فرحنا… أنا ${BRIDE}.` },
  { id: "invitation", speaker: "groom" as const, text: `يشرّفنا حضوركم في أجمل ليالي العمر، أنا ${GROOM}.` },
  { id: "story", speaker: "bride" as const, text: "كل قصة حب تبدأ بنظرة… وقصتنا بدأت بابتسامة." },
  { id: "countdown", speaker: "groom" as const, text: "قلوبنا تعدّ الأيام معكم حتى يحلّ الفرح." },
  { id: "venue", speaker: "bride" as const, text: "ننتظركم في المكان الذي اخترناه بكل حب." },
  { id: "rsvp", speaker: "groom" as const, text: "حضوركم هو أغلى هدية… أكّدوا لنا تشرّفكم." },
];

function Index() {
  const [active, setActive] = useState<string>("hero");
  const [bubblesVisible, setBubblesVisible] = useState(false);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date(DATE_ISO).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative min-h-screen text-ivory">
      {/* Fixed atmospheric background */}
      <div className="fixed inset-0 z-0">
        <img
          src={hallBg}
          alt="قاعة الفرح"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.10 0.04 25 / 0.78) 0%, oklch(0.16 0.05 22 / 0.62) 40%, oklch(0.10 0.04 25 / 0.85) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, oklch(0.85 0.12 80 / 0.4), transparent 60%)",
          }}
        />
      </div>

      <Petals count={20} />
      <Curtain onOpen={() => setBubblesVisible(true)} />
      <CoupleBubbles messages={MESSAGES} activeId={active} visible={bubblesVisible} />

      {/* HERO */}
      <SectionWrap id="hero" onActive={setActive}>
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: 1.6, ease: "easeOut" }}
          className="mx-auto mb-10 relative w-44 h-44 md:w-56 md:h-56"
        >
          <div
            className="absolute inset-0 rounded-full bg-gradient-gold blur-2xl opacity-50 animate-shimmer"
          />
          <div
            className="relative w-full h-full rounded-full overflow-hidden"
            style={{
              boxShadow:
                "0 0 0 2px var(--gold), 0 0 0 8px oklch(0.18 0.02 25 / 0.6), 0 0 0 9px var(--gold), 0 30px 80px oklch(0 0 0 / 0.6)",
            }}
          >
            <img src={couple} alt={`${BRIDE} و ${GROOM}`} className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <div className="text-gold/80 text-xs tracking-[0.5em] uppercase mb-3 font-body">
          دعوة زفاف
        </div>
        <h1 className="font-arabic text-5xl md:text-7xl leading-[1.1] mb-6">
          <span className="text-gradient-gold">{BRIDE}</span>
          <span className="block text-2xl md:text-3xl my-3 text-ivory/70 font-display italic">
            &amp;
          </span>
          <span className="text-gradient-gold">{GROOM}</span>
        </h1>
        <div className="ornament-divider w-40 mx-auto mb-6" />
        <p className="font-arabic text-lg md:text-xl text-ivory/80 max-w-xl mx-auto leading-loose">
          نشارككم لحظة كتبها القلب قبل الورق، ونزفّ إليكم دعوتنا لحضور حفل قراننا.
        </p>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16 text-gold/60 text-xs tracking-[0.4em]"
        >
          ↓ تابعوا الرحلة
        </motion.div>
      </SectionWrap>

      {/* INVITATION */}
      <SectionWrap id="invitation" eyebrow="THE INVITATION" title="بشرى سارّة" onActive={setActive}>
        <div className="glass-card rounded-2xl p-8 md:p-12 shadow-deep">
          <p className="font-arabic text-base md:text-lg leading-loose text-ivory/90">
            بكل الحب والامتنان، نتشرّف نحن عائلتي
            <span className="text-gold mx-2">السيد محمود الحسيني</span>
            و
            <span className="text-gold mx-2">السيد كريم منصور</span>
            بدعوتكم لحضور حفل زفاف ولدينا
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 font-arabic text-2xl md:text-3xl">
            <span className="text-gradient-gold">{BRIDE}</span>
            <span className="font-display italic text-ivory/50">&</span>
            <span className="text-gradient-gold">{GROOM}</span>
          </div>
        </div>
      </SectionWrap>

      {/* STORY */}
      <SectionWrap id="story" eyebrow="OUR JOURNEY" title="قصتنا" onActive={setActive}>
        <div className="space-y-8">
          {[
            { year: "٢٠٢١", title: "اللقاء الأول", text: "نظرة في حفل صديق… غيّرت مسار حياتنا." },
            { year: "٢٠٢٣", title: "الخطوبة", text: "تحت ضوء القمر، قلنا نعم لرحلة العمر." },
            { year: "٢٠٢٥", title: "الزفاف", text: "اليوم الذي ننتظره… ونريدكم فيه." },
          ].map((s, i) => (
            <motion.div
              key={s.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="glass-card rounded-xl p-6 flex items-center gap-5 text-right"
            >
              <div className="font-display text-3xl text-gradient-gold shrink-0 w-20">
                {s.year}
              </div>
              <div className="flex-1">
                <div className="font-arabic text-xl text-gold mb-1">{s.title}</div>
                <p className="font-arabic text-ivory/80 leading-relaxed">{s.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrap>

      {/* COUNTDOWN + DATE */}
      <SectionWrap id="countdown" eyebrow="SAVE THE DATE" title={DATE_AR} onActive={setActive}>
        <div className="grid grid-cols-4 gap-3 md:gap-5 max-w-xl mx-auto">
          {[
            { v: countdown.d, l: "يوم" },
            { v: countdown.h, l: "ساعة" },
            { v: countdown.m, l: "دقيقة" },
            { v: countdown.s, l: "ثانية" },
          ].map((c) => (
            <div key={c.l} className="glass-card rounded-xl p-4 md:p-6">
              <div className="font-display text-3xl md:text-5xl text-gradient-gold tabular-nums">
                {String(c.v).padStart(2, "0")}
              </div>
              <div className="text-xs md:text-sm text-ivory/70 font-arabic mt-2">{c.l}</div>
            </div>
          ))}
        </div>
        <p className="font-arabic mt-10 text-ivory/80 text-lg">الحفل يبدأ الساعة الثامنة مساءً</p>
      </SectionWrap>

      {/* VENUE */}
      <SectionWrap id="venue" eyebrow="THE VENUE" title="مكان الحفل" onActive={setActive}>
        <div className="glass-card rounded-2xl overflow-hidden shadow-deep">
          <div className="aspect-[16/9] w-full bg-burgundy/30 relative">
            <iframe
              title="موقع الحفل"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.778!2d31.235!3d30.044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM4LjQiTiAzMcKwMTQnMDYuMCJF!5e0!3m2!1sen!2seg!4v1700000000000"
              className="absolute inset-0 w-full h-full grayscale-[40%] contrast-110"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="p-6 md:p-8 text-center">
            <div className="font-arabic text-2xl text-gradient-gold mb-2">{VENUE}</div>
            <p className="text-ivory/70 font-arabic">قاعة فاخرة بإطلالة آسرة وقوشة من الذهب والورود.</p>
          </div>
        </div>
      </SectionWrap>

      {/* RSVP */}
      <SectionWrap id="rsvp" eyebrow="WILL YOU JOIN US" title="تأكيد الحضور" onActive={setActive}>
        <RSVP />
      </SectionWrap>

      {/* FOOTER */}
      <footer className="relative z-20 text-center py-16 px-5">
        <div className="ornament-divider w-32 mx-auto mb-6" />
        <p className="font-arabic text-gold text-lg">شكرًا لكونكم جزءًا من فرحتنا</p>
        <p className="text-xs text-ivory/40 tracking-[0.3em] mt-4 font-body">
          FARHTY · فرحتي
        </p>
      </footer>
    </main>
  );
}

function RSVP() {
  const [name, setName] = useState("");
  const [count, setCount] = useState("1");
  const [attend, setAttend] = useState<"yes" | "no" | null>(null);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card rounded-2xl p-10"
      >
        <div className="font-arabic text-2xl text-gradient-gold mb-3">شكرًا {name} 🤍</div>
        <p className="font-arabic text-ivory/80">تم تسجيل ردّك بنجاح، نراكم على خير.</p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name && attend) setSent(true);
      }}
      className="glass-card rounded-2xl p-6 md:p-10 space-y-5 text-right"
    >
      <div>
        <label className="block text-xs text-gold tracking-[0.3em] mb-2 font-body">
          الاسم الكريم
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent border border-gold/30 rounded-lg px-4 py-3 font-arabic text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition"
          placeholder="اكتب اسمك هنا"
        />
      </div>

      <div>
        <label className="block text-xs text-gold tracking-[0.3em] mb-2 font-body">
          عدد الأشخاص
        </label>
        <input
          type="number"
          min={1}
          max={10}
          value={count}
          onChange={(e) => setCount(e.target.value)}
          dir="ltr"
          className="w-full bg-transparent border border-gold/30 rounded-lg px-4 py-3 font-arabic text-ivory focus:outline-none focus:border-gold transition"
        />
      </div>

      <div>
        <label className="block text-xs text-gold tracking-[0.3em] mb-3 font-body">
          هل ستشرّفوننا؟
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { v: "yes" as const, l: "بكل سرور" },
            { v: "no" as const, l: "اعتذر" },
          ].map((opt) => (
            <button
              type="button"
              key={opt.v}
              onClick={() => setAttend(opt.v)}
              className={`py-3 rounded-lg font-arabic transition border ${
                attend === opt.v
                  ? "bg-gradient-gold text-primary-foreground border-transparent shadow-gold"
                  : "border-gold/30 text-ivory/80 hover:border-gold"
              }`}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!name || !attend}
        className="w-full py-4 rounded-lg bg-gradient-gold text-primary-foreground font-arabic text-lg shadow-gold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] transition"
      >
        إرسال الردّ
      </button>
    </form>
  );
}

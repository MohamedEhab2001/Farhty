import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

function Stars() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const stars = useMemo(
    () =>
      Array.from({ length: 24 }, () => ({
        w: 2 + Math.random() * 2,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 3,
      })),
    []
  );
  if (!mounted) return null;
  return (
    <div className="absolute inset-0 opacity-40 pointer-events-none">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-shimmer"
          style={{
            width: s.w,
            height: s.w,
            top: `${s.top}%`,
            left: `${s.left}%`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
import gateVideo from "@/assets/gate-opening.mp4.asset.json";
import seaHero from "@/assets/sea-hero.jpg";
import florals from "@/assets/florals.jpg";
import venue from "@/assets/venue.jpg";
import { Ornament } from "@/components/invitation/Ornament";
import { Reveal } from "@/components/invitation/Reveal";
import { Countdown } from "@/components/invitation/Countdown";

export const Route = createFileRoute("/")({
  component: Invitation,
  head: () => ({
    meta: [
      { title: "دعوة زفاف · علي و مها" },
      { name: "description", content: "بكل فرح ندعوكم لمشاركتنا فرحة عمرنا · An Arabian seaside wedding invitation" },
    ],
  }),
});

type Stage = "intro" | "video" | "invite";

function Invitation() {
  const [stage, setStage] = useState<Stage>("intro");
  const [videoFading, setVideoFading] = useState(false);

  const openGate = () => {
    setStage("video");
    // Total video ~5s. Start fade at 4.2s, switch at 5s.
    setTimeout(() => setVideoFading(true), 4200);
    setTimeout(() => setStage("invite"), 5200);
  };

  useEffect(() => {
    if (stage === "invite") window.scrollTo(0, 0);
  }, [stage]);

  return (
    <main dir="rtl" className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {stage === "intro" && <IntroScreen onOpen={openGate} />}
      {stage === "video" && <GateVideo fading={videoFading} />}
      {stage === "invite" && <Invite />}
    </main>
  );
}

/* ───────────── Intro ───────────── */
function IntroScreen({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer group"
      style={{ background: "var(--gradient-sea)" }}
      aria-label="افتح الدعوة"
    >
      <Stars />

      <div className="relative z-10 flex flex-col items-center animate-float">
        <svg width="44" height="44" viewBox="0 0 24 24" className="text-[var(--color-sand)] opacity-90">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" />
        </svg>
        <p
          className="mt-10 text-2xl sm:text-3xl text-[var(--color-sand)] tracking-wide"
          style={{ fontFamily: "var(--font-arabic)" }}
        >
          اضغط لفتح الدعوة
        </p>
        <p className="mt-2 text-sm text-[var(--color-sand)]/70 italic tracking-[0.3em] uppercase">
          Tap to open
        </p>
      </div>

      <div className="absolute bottom-8 text-[var(--color-sand)]/50 text-xs tracking-[0.4em] uppercase">
        Ali · Maha
      </div>
    </button>
  );
}

/* ───────────── Gate Video ───────────── */
function GateVideo({ fading }: { fading: boolean }) {
  return (
    <div
      className="fixed inset-0 w-full h-full bg-black z-50 transition-opacity duration-1000"
      style={{ opacity: fading ? 0 : 1 }}
    >
      <video
        src={gateVideo.url}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}

/* ───────────── Invitation Body ───────────── */
function Invite() {
  return (
    <div className="animate-[fade-up_1.4s_ease-out]">
      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <img
          src={seaHero}
          alt=""
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-sea)]/10 to-background" />

        <div className="relative z-10 text-center px-6">
          <Reveal>
            <p
              className="text-lg sm:text-xl text-primary/80 mb-6"
              style={{ fontFamily: "var(--font-arabic)" }}
            >
              بسم الله الرحمن الرحيم
            </p>
          </Reveal>
          <Reveal delay={300}>
            <Ornament className="mb-8" />
          </Reveal>
          <Reveal delay={600}>
            <h1
              className="text-6xl sm:text-8xl md:text-9xl font-light text-primary leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ali <span className="text-[var(--color-gold)] italic mx-2">&</span> Maha
            </h1>
          </Reveal>
          <Reveal delay={900}>
            <p
              className="mt-6 text-3xl sm:text-4xl text-primary"
              style={{ fontFamily: "var(--font-arabic)" }}
            >
              علي و مها
            </p>
          </Reveal>
          <Reveal delay={1200}>
            <p className="mt-10 text-sm tracking-[0.4em] uppercase text-muted-foreground">
              18 · 07 · 2026
            </p>
          </Reveal>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground animate-float">
          <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
            <path d="M10 2v24m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* Bismillah / blessing */}
      <section className="py-28 px-6 text-center max-w-3xl mx-auto">
        <Reveal>
          <Ornament className="mb-10" />
        </Reveal>
        <Reveal delay={200}>
          <p
            className="text-2xl sm:text-3xl leading-loose text-primary"
            style={{ fontFamily: "var(--font-arabic)" }}
          >
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
            <br />
            لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
          </p>
        </Reveal>
        <Reveal delay={500}>
          <p className="mt-6 text-sm italic text-muted-foreground tracking-wide">
            "And among His signs is that He created for you mates from yourselves,
            that you may find tranquility in them; and He placed between you affection and mercy."
          </p>
        </Reveal>
      </section>

      {/* Florals + invitation message */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ background: "var(--color-secondary)" }}>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
          <Reveal>
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-[var(--shadow-soft)]">
              <img src={florals} alt="" width={1280} height={1600} loading="lazy" className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="text-center md:text-right">
              <Ornament className="mb-6" />
              <h2
                className="text-3xl sm:text-4xl text-primary mb-6"
                style={{ fontFamily: "var(--font-arabic)" }}
              >
                يتشرّفان بدعوتكم
              </h2>
              <p
                className="text-lg leading-loose text-muted-foreground"
                style={{ fontFamily: "var(--font-arabic-sans)" }}
              >
                بكل فرحٍ وسرور
                <br />
                ندعوكم لمشاركتنا فرحة العمر
                <br />
                وحضور حفل زفافنا على ضفاف البحر
              </p>
              <p className="mt-6 text-sm italic text-muted-foreground/80">
                Together with their families, request the honour of your presence at the celebration of their marriage by the sea.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Countdown */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <p
            className="text-2xl sm:text-3xl text-primary mb-3"
            style={{ fontFamily: "var(--font-arabic)" }}
          >
            العدّ التنازلي
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-10">Counting the days</p>
        </Reveal>
        <Reveal delay={400}>
          <Countdown />
        </Reveal>
      </section>

      {/* Venue */}
      <section className="relative">
        <div className="relative h-[80vh] overflow-hidden">
          <img src={venue} alt="" width={1600} height={1088} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-sea-deep)]/85 via-[var(--color-sea-deep)]/30 to-transparent" />
          <div className="absolute inset-0 flex items-end pb-20 px-6">
            <div className="max-w-3xl mx-auto text-center w-full text-[var(--color-sand)]">
              <Reveal>
                <Ornament className="mb-6 [&_span]:bg-gradient-to-r [&_span]:from-transparent [&_span]:via-[var(--color-sand)] [&_span]:to-transparent" />
              </Reveal>
              <Reveal delay={200}>
                <h2 className="text-5xl sm:text-6xl mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  By the Sea
                </h2>
              </Reveal>
              <Reveal delay={400}>
                <p className="text-2xl mb-2" style={{ fontFamily: "var(--font-arabic)" }}>
                  منتجع شاطئ الياسمين · جدة
                </p>
              </Reveal>
              <Reveal delay={600}>
                <p className="text-sm tracking-[0.3em] uppercase opacity-80">
                  Yasmine Beach Resort · Jeddah Corniche
                </p>
              </Reveal>
              <Reveal delay={800}>
                <a
                  href="https://maps.google.com/?q=Jeddah+Corniche"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-10 px-8 py-3 border border-[var(--color-sand)]/60 text-sm tracking-[0.3em] uppercase hover:bg-[var(--color-sand)] hover:text-[var(--color-sea-deep)] transition-all duration-500"
                >
                  Open in Maps
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="py-28 px-6 max-w-4xl mx-auto">
        <Reveal>
          <Ornament className="mb-12" />
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-10 text-center">
          {[
            { ar: "التاريخ", en: "Date", v: "السبت ١٨ يوليو", sub: "Saturday, July 18" },
            { ar: "الوقت", en: "Time", v: "السابعة مساءً", sub: "7:00 PM" },
            { ar: "اللباس", en: "Dress code", v: "رسمي ساحلي", sub: "Coastal Formal" },
          ].map((d, i) => (
            <Reveal key={d.en} delay={i * 200}>
              <div>
                <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground mb-3">{d.en}</p>
                <p className="text-2xl text-primary mb-1" style={{ fontFamily: "var(--font-arabic)" }}>{d.v}</p>
                <p className="text-sm italic text-muted-foreground">{d.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RSVP */}
      <section
        className="py-32 px-6 text-center relative overflow-hidden"
        style={{ background: "var(--gradient-sea)" }}
      >
        {/* Wave decoration */}
        <svg className="absolute top-0 left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ height: 50, color: "var(--color-background)" }}>
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1440,30 1440,40 L1440,0 L0,0 Z" fill="currentColor" />
        </svg>

        <div className="relative z-10 max-w-xl mx-auto text-[var(--color-sand)]">
          <Reveal>
            <p className="text-3xl mb-3" style={{ fontFamily: "var(--font-arabic)" }}>
              تأكيد الحضور
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-xs tracking-[0.4em] uppercase opacity-80 mb-10">Kindly RSVP</p>
          </Reveal>
          <Reveal delay={400}>
            <p
              className="text-lg leading-loose opacity-90 mb-10"
              style={{ fontFamily: "var(--font-arabic-sans)" }}
            >
              نتمنى أن تكونوا معنا في هذا اليوم المميز.
              <br />
              يرجى تأكيد حضوركم قبل ١٠ يوليو ٢٠٢٦
            </p>
          </Reveal>
          <Reveal delay={600}>
            <a
              href="https://wa.me/"
              className="inline-block px-10 py-4 bg-[var(--color-sand)] text-[var(--color-sea-deep)] tracking-[0.3em] uppercase text-sm hover:bg-[var(--color-gold)] transition-all duration-500"
            >
              Confirm Attendance
            </a>
          </Reveal>

          <Reveal delay={800}>
            <div className="mt-20">
              <Ornament className="mb-6 [&_span]:bg-gradient-to-r [&_span]:from-transparent [&_span]:via-[var(--color-sand)] [&_span]:to-transparent" />
              <p
                className="text-2xl mb-2"
                style={{ fontFamily: "var(--font-arabic)" }}
              >
                بانتظاركم لمشاركتنا الفرح
              </p>
              <p className="text-xs tracking-[0.4em] uppercase opacity-70">Ali · Maha · 2026</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

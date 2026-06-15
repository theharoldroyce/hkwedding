"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const WEDDING_DATE = new Date("2026-08-18T00:00:00");

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calc() {
      const diff = WEDDING_DATE.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      };
    }
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex items-center justify-center rounded-md border border-border bg-card shadow-sm"
        style={{ width: "clamp(72px, 18vw, 110px)", height: "clamp(72px, 18vw, 110px)" }}
      >
        <span
          className="font-serif font-semibold tabular-nums text-gold"
          style={{ fontSize: "clamp(2rem, 7vw, 3.5rem)" }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="font-serif uppercase tracking-[0.3em] text-muted-foreground" style={{ fontSize: "0.65rem" }}>
        {label}
      </span>
    </div>
  );
}

function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown();
  return (
    <section className="flex flex-col items-center gap-8 py-16 px-4 bg-background">
      <div className="flex flex-col items-center gap-1">
        <p className="font-serif uppercase tracking-[0.4em] text-gold" style={{ fontSize: "0.75rem" }}>
          Counting down to
        </p>
        <h2 className="font-script text-foreground" style={{ fontSize: "clamp(2rem, 6vw, 3.2rem)" }}>
          The Big Day
        </h2>
      </div>

      <div className="flex items-start gap-4 sm:gap-8">
        <CountdownUnit value={days}    label="Days"    />
        <span className="font-serif text-gold mt-4" style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}>·</span>
        <CountdownUnit value={hours}   label="Hours"   />
        <span className="font-serif text-gold mt-4" style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}>·</span>
        <CountdownUnit value={minutes} label="Minutes" />
        <span className="font-serif text-gold mt-4" style={{ fontSize: "clamp(1.5rem, 5vw, 2.5rem)" }}>·</span>
        <CountdownUnit value={seconds} label="Seconds" />
      </div>
    </section>
  );
}

const GALLERY = [
  { src: "/1-3.jpg", alt: "Harold and Karen" },
  { src: "/download.jpeg", alt: "Harold and Karen" },
  { src: "/download (1).jpeg", alt: "Harold and Karen" },
  { src: "/images.jpg", alt: "Harold and Karen" },
  { src: "/images (1).jpg", alt: "Harold and Karen" },
];

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function PhotoCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  function scroll(dir: "left" | "right") {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.72;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  }

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }

  return (
    <div className="relative w-full overflow-hidden bg-background">
      {/* left arrow */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-background/80 p-3 text-gold shadow-md backdrop-blur-sm transition hover:bg-butter disabled:opacity-30"
        disabled={!canLeft}
      >
        <ArrowLeft />
      </button>

      {/* track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex gap-3 overflow-x-auto scroll-smooth px-16 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {GALLERY.map((img) => (
          <div
            key={img.src}
            className="relative aspect-[4/5] h-[55vh] max-h-[480px] min-h-[280px] flex-none overflow-hidden rounded-sm"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 80vw, 30vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* right arrow */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-background/80 p-3 text-gold shadow-md backdrop-blur-sm transition hover:bg-butter disabled:opacity-30"
        disabled={!canRight}
      >
        <ArrowRight />
      </button>
    </div>
  );
}

function OurStory() {
  return (
    <section className="w-full bg-card py-20 px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">

        {/* photo */}
        <div className="relative w-full max-w-sm flex-none overflow-hidden rounded-sm shadow-lg lg:w-95" style={{ aspectRatio: "4/5" }}>
          <Image
            src="/images (1).jpg"
            alt="Harold and Karen"
            fill
            sizes="(max-width: 1024px) 80vw, 380px"
            className="object-cover object-center"
          />
        </div>

        {/* story content */}
        <div className="flex flex-col gap-6 text-center lg:text-left">
          <h2
            className="font-script leading-none text-foreground"
            style={{ fontSize: "clamp(2.4rem, 6vw, 3.8rem)" }}
          >
            Our Story
          </h2>

          <div
            className="flex flex-col gap-4 font-serif leading-relaxed text-muted-foreground"
            style={{ fontSize: "clamp(0.9rem, 2vw, 1.05rem)" }}
          >
            <p>
              It started with a simple hello — the kind you almost miss if you
              blink. We were in the same room, the same moment, and somehow the
              world got a little quieter.
            </p>
            <p>
              What began as shared laughs and late-night conversations slowly
              grew into something neither of us had planned for, but both of us
              had hoped for. Every moment together felt like coming home.
            </p>
            <p>
              And now, here we are — choosing each other, every single day.
              We can&apos;t wait to celebrate this next chapter with the people
              who matter most.
            </p>
          </div>

          {/* small ornament */}
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <div className="h-px w-8 bg-border" />
            <span className="font-script text-gold" style={{ fontSize: "1.4rem" }}>H &amp; K</span>
            <div className="h-px w-8 bg-border" />
          </div>
        </div>

      </div>
    </section>
  );
}

function SacredPromise() {
  return (
    <section className="w-full bg-[#f7f4f0] py-16 px-6">
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-2xl bg-card px-10 py-14 shadow-sm border border-border text-center">

        {/* decorative dots */}
        <span className="absolute left-6 top-1/2 -translate-y-1/2 size-2 rounded-full bg-gold/20" />
        <span className="absolute right-6 top-1/2 -translate-y-1/2 size-2 rounded-full bg-gold/20" />

        {/* heart */}
        <svg viewBox="0 0 24 24" className="size-6 fill-[#f0b8b0]" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>

        {/* label */}
        <p className="font-serif uppercase tracking-[0.35em] text-gold" style={{ fontSize: "0.7rem" }}>
          Our Sacred Promise
        </p>

        {/* quote */}
        <blockquote
          className="font-serif italic leading-snug text-foreground"
          style={{ fontSize: "clamp(1.4rem, 4vw, 2.1rem)" }}
        >
          &ldquo;I have found the one whom my soul loves.&rdquo;
        </blockquote>

        {/* citation */}
        <p className="font-serif uppercase tracking-[0.3em] text-gold" style={{ fontSize: "0.72rem" }}>
          Song of Solomon 3:4
        </p>
      </div>
    </section>
  );
}

export function WeddingMain() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      {/* ── Hero ── */}
      <section className="relative h-[65vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="/pexels-dax-dexter-delada-2150239947-31044632 (1).jpg"
          alt="Harold and Karen"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/55" />

        {/* text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-white">
          <p
            className="font-serif uppercase tracking-[0.45em]"
            style={{ fontSize: "clamp(0.7rem, 2vw, 1rem)" }}
          >
            Save the Date
          </p>
          <h1
            className="font-serif font-semibold uppercase leading-none tracking-[0.15em]"
            style={{ fontSize: "clamp(2.4rem, 8vw, 6rem)" }}
          >
            Harold &amp; Karen
          </h1>
          <p
            className="font-serif tracking-[0.28em] opacity-90"
            style={{ fontSize: "clamp(0.75rem, 1.8vw, 1rem)" }}
          >
            TUESDAY · THE EIGHTEENTH OF AUGUST · 2026
          </p>
        </div>
      </section>

            {/* ── Photo Gallery ── */}
      <PhotoCarousel />

      {/* ── Countdown ── */}
      <Countdown />

      {/* ── Our Story ── */}
      <OurStory />

      {/* ── Sacred Promise ── */}
      <SacredPromise />

      {/* ── Footer bar ── */}
      <div className="py-6 text-center">
        <p className="font-serif text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Harold &amp; Karen · 2026
        </p>
      </div>
    </main>
  );
}

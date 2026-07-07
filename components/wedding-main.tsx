"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PrenupAlbums } from "@/components/prenup-albums";
import { GuestUploader } from "@/components/guest-gallery";

// Reveal each section as it scrolls into view. Classes are added on mount
// (not in the markup) so visitors without JS still see all content, and the
// hero — the only section above the fold — is left untouched.
function useSectionReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(root.children).filter(
      (el): el is HTMLElement => el.tagName === "SECTION",
    );
    const reveals = sections.slice(1); // skip hero
    reveals.forEach((el) => el.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ref]);
}

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
        style={{ width: "clamp(58px, 16vw, 110px)", height: "clamp(58px, 16vw, 110px)" }}
      >
        <span
          className="font-serif font-semibold tabular-nums text-gold"
          style={{ fontSize: "clamp(1.6rem, 6vw, 3.5rem)" }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="font-serif uppercase tracking-[0.15em] text-muted-foreground" style={{ fontSize: "0.72rem" }}>
        {label}
      </span>
    </div>
  );
}

function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown();
  return (
    <section className="flex flex-col items-center gap-8 py-16 px-6 sm:px-4 bg-background">
      <div className="flex flex-col items-center gap-1">
        <p className="font-serif uppercase tracking-[0.18em] text-gold" style={{ fontSize: "0.75rem" }}>
          Counting down to
        </p>
        <h2 className="font-script text-foreground" style={{ fontSize: "clamp(2rem, 6vw, 3.2rem)" }}>
          The Big Day
        </h2>
      </div>

      <div className="flex items-start gap-2 sm:gap-8">
        <CountdownUnit value={days}    label="Days"    />
        <span className="font-serif text-gold mt-4" style={{ fontSize: "clamp(1rem, 4vw, 2.5rem)" }}>·</span>
        <CountdownUnit value={hours}   label="Hours"   />
        <span className="font-serif text-gold mt-4" style={{ fontSize: "clamp(1rem, 4vw, 2.5rem)" }}>·</span>
        <CountdownUnit value={minutes} label="Minutes" />
        <span className="font-serif text-gold mt-4" style={{ fontSize: "clamp(1rem, 4vw, 2.5rem)" }}>·</span>
        <CountdownUnit value={seconds} label="Seconds" />
      </div>
    </section>
  );
}

function OurStory() {
  return (
    <section className="w-full bg-card py-20 px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">

        {/* photo */}
        <div className="relative w-full max-w-sm flex-none overflow-hidden rounded-sm shadow-lg lg:w-95" style={{ aspectRatio: "4/5" }}>
          <Image
            src="/ourstory.jpg"
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
        </div>
      </div>
    </section>
  );
}

function SacredPromise() {
  return (
    <section className="w-full bg-background py-20 px-6">
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-2xl bg-card px-10 py-16 border border-border text-center"
        style={{ boxShadow: "0 8px 40px -16px rgba(139,124,70,0.18)" }}
      >

        {/* corner botanical marks */}
        <span className="absolute left-5 top-5 size-1.5 rounded-full bg-gold/30" />
        <span className="absolute right-5 top-5 size-1.5 rounded-full bg-gold/30" />
        <span className="absolute left-5 bottom-5 size-1.5 rounded-full bg-gold/30" />
        <span className="absolute right-5 bottom-5 size-1.5 rounded-full bg-gold/30" />

        {/* top gold divider */}
        <span className="block h-px w-16 bg-gold/40" />

        {/* label */}
        <p className="font-serif uppercase tracking-[0.18em] text-gold/80" style={{ fontSize: "0.72rem" }}>
          Our Sacred Promise
        </p>

        {/* quote */}
        <blockquote
          className="font-script leading-snug text-foreground"
          style={{ fontSize: "clamp(1.5rem, 4.5vw, 2.3rem)" }}
        >
          &ldquo;I have found the one whom my soul loves.&rdquo;
        </blockquote>

        {/* bottom gold divider */}
        <span className="block h-px w-16 bg-gold/40" />

        {/* citation */}
        <p className="font-serif uppercase tracking-[0.15em] text-gold/70" style={{ fontSize: "0.72rem" }}>
          Song of Solomon 3:4
        </p>
      </div>
    </section>
  );
}

function VenueSection() {
  return (
    <section className="w-full bg-background py-20 px-6">

      {/* heading */}
      <div className="mx-auto mb-12 flex max-w-4xl flex-col items-center gap-3 text-center">
        <span className="font-script text-gold" style={{ fontSize: "2rem", lineHeight: 1, opacity: 0.85 }}>
          When &amp; Where
        </span>
        <span className="block h-px w-10 bg-gold/40" />
        <p className="font-serif uppercase tracking-[0.2em] text-foreground" style={{ fontSize: "0.72rem" }}>
          Ceremony &amp; Reception
        </p>
      </div>

      {/* two venue cards */}
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">

        {/* ── Buhid Garden (left) ── */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* 2-photo stack */}
          <div className="relative h-56 overflow-hidden">
            <Image
              src="/509437400_702077375908419_2419330391475427747_n.jpg"
              alt="Buhid Garden"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {/* small overlapping photo */}
            <div className="absolute bottom-3 right-3 z-10 h-20 w-28 overflow-hidden rounded-md shadow-lg ring-2 ring-white/80">
              <Image
                src="/473431309_587440460583770_3183536903597118604_n.jpg"
                alt="Buhid Garden path"
                fill
                sizes="112px"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* text */}
          <div className="flex flex-col items-center gap-2 px-6 py-6 text-center">
            <p className="font-serif uppercase tracking-[0.18em] text-gold/80" style={{ fontSize: "0.72rem" }}>
              Ceremony
            </p>
            <p className="font-script text-foreground leading-none" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2rem)" }}>
              Buhid Garden
            </p>
            <span className="block h-px w-8 bg-gold/30" />
            <p className="font-serif uppercase tracking-[0.15em] text-muted-foreground" style={{ fontSize: "0.72rem" }}>
              4:00 PM
            </p>
          </div>
        </div>

        {/* ── Balai Lobby (right) ── */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* 2-photo stack */}
          <div className="relative h-56 overflow-hidden">
            <Image
              src="/480174835_607247395391418_8208699960041686637_n (1).jpg"
              alt="Balai Lobby"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {/* small overlapping photo */}
            <div className="absolute bottom-3 left-3 z-10 h-20 w-28 overflow-hidden rounded-md shadow-lg ring-2 ring-white/80">
              <Image
                src="/498599390_677713648344792_6684281367715147112_n.jpg"
                alt="Balai Lobby interior"
                fill
                sizes="112px"
                className="object-cover object-center"
              />
            </div>
          </div>

          {/* text */}
          <div className="flex flex-col items-center gap-2 px-6 py-6 text-center">
            <p className="font-serif uppercase tracking-[0.18em] text-gold/80" style={{ fontSize: "0.72rem" }}>
              Reception
            </p>
            <p className="font-script text-foreground leading-none" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2rem)" }}>
              Balai Lobby
            </p>
            <span className="block h-px w-8 bg-gold/30" />
            <p className="font-serif uppercase tracking-[0.15em] text-muted-foreground" style={{ fontSize: "0.72rem" }}>
              To follow
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

const PROGRAM = [
  { time: "3:30 PM", label: "Arrival of Guests" },
  { time: "4:00 PM", label: "Entourage" },
  { time: "4:30 PM", label: "Worship" },
  { time: "5:00 PM", label: "Ceremony" },
  { time: "6:00 PM", label: "Preparation" },
  { time: "7:00 PM", label: "Reception" },
];

function ProgramTimeline() {
  return (
    <section className="w-full bg-card py-20 px-6">

      {/* heading */}
      <div className="mx-auto mb-14 flex max-w-xl flex-col items-center gap-3 text-center">
        <span className="font-script text-gold" style={{ fontSize: "2rem", lineHeight: 1, opacity: 0.85 }}>
          The Programme
        </span>
        <span className="block h-px w-10 bg-gold/40" />
        <p className="font-serif uppercase tracking-[0.2em] text-foreground" style={{ fontSize: "0.72rem" }}>
          Order of Events
        </p>
      </div>

      {/* timeline */}
      <div className="relative mx-auto max-w-sm">

        {/* vertical gold line */}
        <span className="absolute left-[72px] top-0 h-full w-px bg-gold/25" />

        <ol className="flex flex-col gap-0">
          {PROGRAM.map((item, i) => (
            <li key={i} className="relative flex items-start gap-6 pb-10 last:pb-0">

              {/* time — right-aligned to the line */}
              <span
                className="w-[72px] shrink-0 pt-0.5 text-right font-serif uppercase tracking-[0.12em] text-gold/80"
                style={{ fontSize: "0.72rem" }}
              >
                {item.time}
              </span>

              {/* dot on the line */}
              <span className="relative z-10 mt-1 shrink-0">
                <span className="block size-2.5 rounded-full border-2 border-gold/50 bg-card" />
              </span>

              {/* label */}
              <span
                className="font-serif text-foreground leading-none"
                style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)" }}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
   </section>
  );
}

type Swatch = { name: string; hex: string };

// Palettes drawn from the reference attire photos.
const SPONSOR_COLORS: Swatch[] = [
  { name: "Champagne",    hex: "#E6D2A6" },
  { name: "Ecru",         hex: "#EFE6CE" },
  { name: "Sand Beige",   hex: "#D3BF97" },
  { name: "Antique Gold", hex: "#C0A063" },
];

const PRINCIPAL_SPONSORS_ATTIRE = {
  group: "Principal Sponsors",
  note: "Formal long gown & barong in champagne and cream",
  colors: SPONSOR_COLORS,
};

// Secondary Sponsors dress as Team Groom (gentlemen) & Team Bride (ladies).
const SECONDARY_SPONSORS_ATTIRE: { group: string; note: string; colors: Swatch[] }[] = [
  {
    group: "Team Groom",
    note: "White long-sleeved top with khaki trousers",
    colors: [
      { name: "White", hex: "#FBFAF6" },
      { name: "Khaki", hex: "#C4A87A" },
    ],
  },
  {
    group: "Team Bride",
    note: "Butter yellow",
    colors: [{ name: "Butter Yellow", hex: "#F0E29A" }],
  },
];

const GUEST_COLORS: Swatch[] = [
  { name: "Buttermilk Yellow", hex: "#F5F0B0" },
  { name: "Golden Butter",     hex: "#E8B84A" },
  { name: "Toasted Caramel",   hex: "#A0602A" },
  { name: "Khaki",             hex: "#D4C4A8" },
];

function ColorSwatch({ color }: { color: Swatch }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="rounded-full"
        style={{
          width: "clamp(72px, 15vw, 108px)",
          height: "clamp(72px, 15vw, 108px)",
          backgroundColor: color.hex,
          boxShadow: "0 0 0 3px #1B3D2F",
        }}
      />
      <p className="font-serif text-foreground" style={{ fontSize: "clamp(0.72rem, 1.7vw, 0.88rem)" }}>
        {color.name}
      </p>
    </div>
  );
}

function AttireGroup({ group, note, colors }: { group: string; note: string; colors: Swatch[] }) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-1.5">
        <p
          className="font-serif font-semibold uppercase tracking-[0.14em] text-gold"
          style={{ fontSize: "clamp(1.05rem, 3.2vw, 1.5rem)" }}
        >
          {group}
        </p>
        <p className="font-serif italic text-muted-foreground" style={{ fontSize: "0.82rem" }}>
          {note}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 sm:gap-x-10">
        {colors.map((color) => (
          <ColorSwatch key={`${group}-${color.name}`} color={color} />
        ))}
      </div>
    </div>
  );
}

function DressCode() {
  return (
    <section className="w-full bg-card py-20 px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-14 text-center">

        {/* heading */}
        <div className="flex flex-col items-center gap-3">
          <p className="font-serif uppercase tracking-[0.2em] text-foreground" style={{ fontSize: "0.72rem" }}>
            Dress Guide
          </p>
          <h2 className="font-script text-foreground leading-none" style={{ fontSize: "clamp(2.4rem, 6vw, 3.5rem)" }}>
            The Finer Details
          </h2>
          <span className="block h-px w-10 bg-gold/40 mt-1" />
          <p className="font-serif italic text-muted-foreground" style={{ fontSize: "clamp(0.85rem, 2vw, 0.98rem)" }}>
            A little guide to help you dress for our celebration.
          </p>
        </div>

        {/* Principal Sponsors */}
        <AttireGroup {...PRINCIPAL_SPONSORS_ATTIRE} />

        <span className="block h-px w-16 bg-gold/25" aria-hidden="true" />

        {/* Secondary Sponsors — dress as Team Groom & Team Bride */}
        <div className="flex w-full flex-col items-center gap-10">
          <p
            className="font-serif font-semibold uppercase tracking-[0.14em] text-gold"
            style={{ fontSize: "clamp(1.15rem, 3.6vw, 1.65rem)" }}
          >
            Secondary Sponsors
          </p>
          <div className="grid w-full gap-12 sm:grid-cols-2">
            {SECONDARY_SPONSORS_ATTIRE.map((g) => (
              <AttireGroup key={g.group} {...g} />
            ))}
          </div>
        </div>

        <span className="block h-px w-16 bg-gold/25" aria-hidden="true" />

        {/* guests */}
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1.5">
            <p
              className="font-serif font-semibold uppercase tracking-[0.14em] text-gold"
              style={{ fontSize: "clamp(1.05rem, 3.2vw, 1.5rem)" }}
            >
              Guests
            </p>
            <p className="font-serif italic text-muted-foreground" style={{ fontSize: "0.82rem" }}>
              Warm butter, gold, caramel & khaki tones
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 sm:gap-x-10">
            {GUEST_COLORS.map((color) => (
              <ColorSwatch key={`guest-${color.name}`} color={color} />
            ))}
          </div>
          <p className="mt-2 font-serif font-semibold text-foreground" style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)" }}>
            Strictly NO WHITE and BLACK!
          </p>
        </div>

      </div>
    </section>
  );
}

function VenueMap() {
  return (
    <section className="w-full bg-background py-20 px-6">

      {/* heading */}
      <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-3 text-center">
        <span className="font-script text-gold" style={{ fontSize: "2rem", lineHeight: 1, opacity: 0.85 }}>
          Find Us
        </span>
        <span className="block h-px w-10 bg-gold/40" />
        <p className="font-serif uppercase tracking-[0.2em] text-foreground" style={{ fontSize: "0.72rem" }}>
          Venue Location
        </p>
      </div>

      {/* map card */}
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border shadow-sm">
        <iframe
          title="Balai Mindoro location"
          src="https://maps.google.com/maps?q=13.372032,121.167106&z=16&output=embed"
          width="100%"
          height="380"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* address bar */}
        <div className="flex items-start gap-3 bg-card px-6 py-5">
          {/* pin icon */}
          <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0" fill="none" aria-hidden="true">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              fill="var(--gold)"
              opacity="0.75"
            />
          </svg>
          <div className="flex flex-col gap-0.5">
            <p className="font-serif font-medium text-foreground" style={{ fontSize: "0.85rem" }}>
              Balai Mindoro
            </p>
            <p className="font-serif text-muted-foreground" style={{ fontSize: "0.78rem" }}>
              Strong Republic Nautical Hwy, Calapan City, 5200 Oriental Mindoro
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}

const PRINCIPAL_SPONSORS = [
  "Mr. Jody Sodusta  &  Mrs. Lea Sodusta",
  "Dr. Lord Jim Ricardo  &  Mrs. GiGi Ricardo",
  "Mr. Joel Acuzar  &  Mrs. Mariz Acuzar",
  "Mr. Pastor Jumadas  &  Mrs. Gracelyn Jumadas",
  "Mr. Melvin Valdez  &  Mrs. Amerose Valdez",
  "Mr. Narciso Clerigo  &  Mrs. Maricris Clerigo",
  "Mrs. Naomi Lyn C. Abellana",
  "Mrs. Sucilyn Villanueva",
  "Mr. Pedro Anonuevo",
  "Mrs. Delsie A. Cosme",
  "Mr. Aries Guilles",
  "Mrs. Edgardo Leido, Jr.",
  "Mrs. Menalyn Jane Saludo",
  "Mr. Mark. Laurence Guilles",
  "Mr. Nikko Jay Marquez",


];

const SECONDARY_SPONSORS = [
  { role: "Candle", names: "Patrick D. Anonuevo  &  Carmela Cadiz" },
  { role: "Veil",   names: "Ram C. Guilles  &  Jenny Madrigal" },
  { role: "Cord",   names: "Jess Vincent Anonuevo  &  Kimberly Caraig" },
  { role: null,     names: "Gebriel Guilles  &  Catalyne Cosme" },
  { role: null,     names: "Alpher Cuenca  &  Tricia Anne Bernadino" },
];

const CHILDREN_ROLES = [
  { role: "Coin Bearer",  name: "Avril Eunice Anonuevo",  dog: false },
  { role: "Bible Bearer", name: "Raizen Richard Guilles", dog: false },
  { role: "Flower Girl",  name: "Kasheya Mai Guilles",    dog: false },
  { role: "Ring Bearer",  name: "Kallie",                 dog: true  },
];

function PawPrint() {
  return (
    <svg viewBox="0 0 24 24" className="inline-block size-3.5" fill="var(--gold)" opacity={0.65} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.5 11c.83 0 1.5-.67 1.5-1.5S5.33 8 4.5 8 3 8.67 3 9.5 3.67 11 4.5 11zm2-5.5C6.5 4.67 7.17 4 8 4s1.5.67 1.5 1.5S8.83 7 8 7 6.5 6.33 6.5 5.5zm7 0C13.5 4.67 14.17 4 15 4s1.5.67 1.5 1.5S15.83 7 15 7s-1.5-.67-1.5-1.5zm2 5.5c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-4.5.5c-2.33 0-7 1.17-7 3.5V17h14v-2c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
  );
}

function ESectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-serif uppercase tracking-[0.18em] text-gold/75" style={{ fontSize: "0.72rem" }}>
      {children}
    </p>
  );
}

function EDivider() {
  return <span className="block h-px w-16 bg-gold/25" />;
}

function EntourageSection() {
  return (
    <section className="w-full bg-background py-20 px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-12 text-center">

        {/* heading */}
        <div className="flex flex-col items-center gap-3">
          <span className="font-script text-gold" style={{ fontSize: "2rem", lineHeight: 1, opacity: 0.85 }}>
            The Entourage
          </span>
          <span className="block h-px w-10 bg-gold/40" />
          <p className="font-serif uppercase tracking-[0.2em] text-foreground" style={{ fontSize: "0.72rem" }}>
            With the blessings of
          </p>
        </div>

        {/* Officiating Pastor */}
        <div className="flex flex-col items-center gap-2">
          <ESectionLabel>Officiating Pastor</ESectionLabel>
          <p className="font-serif text-foreground" style={{ fontSize: "clamp(1rem, 2.8vw, 1.2rem)" }}>
            Ps. Dave Perico
          </p>
        </div>

        <EDivider />

        {/* Parents */}
        <div className="grid w-full gap-10 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-2">
            <ESectionLabel>Parents of the Groom</ESectionLabel>
            <p className="font-serif text-foreground leading-snug" style={{ fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)" }}>Nemesio S. Anonuevo</p>
            <span className="font-serif text-muted-foreground" style={{ fontSize: "0.8rem" }}>&amp;</span>
            <p className="font-serif text-foreground leading-snug" style={{ fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)" }}>Violeta D. Anonuevo</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ESectionLabel>Parents of the Bride</ESectionLabel>
            <p className="font-serif text-foreground leading-snug" style={{ fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)" }}>Ramil L. Guilles</p>
            <span className="font-serif text-muted-foreground" style={{ fontSize: "0.8rem" }}>&amp;</span>
            <p className="font-serif text-foreground leading-snug" style={{ fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)" }}>Selestina C. Guilles</p>
          </div>
        </div>

        <EDivider />

        {/* Best Man & Maid of Honor */}
        <div className="grid w-full gap-10 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-2">
            <ESectionLabel>Best Man</ESectionLabel>
            <p className="font-serif text-foreground" style={{ fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)" }}>Rustom C. Guilles</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ESectionLabel>Maid of Honor</ESectionLabel>
            <p className="font-serif text-foreground" style={{ fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)" }}>Iowa Kim D. Anonuevo</p>
          </div>
        </div>

        <EDivider />

        {/* Principal Sponsors */}
        <div className="flex w-full flex-col items-center gap-6">
          <ESectionLabel>Principal Sponsors</ESectionLabel>
          <ul className="grid w-full gap-x-8 gap-y-3 sm:grid-cols-2">
            {PRINCIPAL_SPONSORS.map((name, i) => (
              <li key={i} className="flex flex-col items-center gap-1">
                <span className="block h-px w-6 bg-gold/30" />
                <p className="font-serif text-foreground text-center" style={{ fontSize: "clamp(0.88rem, 2.2vw, 1rem)" }}>{name}</p>
              </li>
            ))}
          </ul>
        </div>

        <EDivider />

        {/* Secondary Sponsors */}
        <div className="flex w-full flex-col items-center gap-6">
          <ESectionLabel>Secondary Sponsors</ESectionLabel>
          <ul className="flex w-full flex-col gap-4">
            {SECONDARY_SPONSORS.map((s, i) => (
              <li key={i} className="flex flex-col items-center gap-0.5">
                {s.role && (
                  <span className="font-serif uppercase tracking-[0.15em] text-gold/60" style={{ fontSize: "0.68rem" }}>
                    {s.role}
                  </span>
                )}
                <p className="font-serif text-foreground" style={{ fontSize: "clamp(0.88rem, 2.2vw, 1rem)" }}>{s.names}</p>
              </li>
            ))}
          </ul>
        </div>

        <EDivider />

        {/* Children's roles */}
        <div className="flex w-full flex-col items-center gap-6">
          <ESectionLabel>The Little Ones</ESectionLabel>

          {/* Coin Bearer · Bible Bearer · Flower Girl — 3 in one row */}
          <ul className="grid w-full grid-cols-1 gap-y-5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-0">
            {CHILDREN_ROLES.filter(c => !c.dog).map((c, i) => (
              <li key={i} className="flex flex-col items-center gap-1">
                <span className="font-serif uppercase tracking-[0.15em] text-gold/60" style={{ fontSize: "0.68rem" }}>{c.role}</span>
                <p className="font-serif text-foreground text-center leading-tight" style={{ fontSize: "clamp(0.9rem, 2.2vw, 1rem)" }}>
                  {c.name}
                </p>
              </li>
            ))}
          </ul>

          {/* Ring Bearer — alone, centered, paws on both sides */}
          {CHILDREN_ROLES.filter(c => c.dog).map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="font-serif uppercase tracking-[0.15em] text-gold/60" style={{ fontSize: "0.68rem" }}>{c.role}</span>
              <p className="font-serif text-foreground inline-flex items-center gap-2" style={{ fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)" }}>
                <PawPrint /><PawPrint />
                {c.name}
                <PawPrint /><PawPrint />
              </p>
              <span className="font-serif italic text-muted-foreground" style={{ fontSize: "0.72rem" }}>our fur baby</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GiftNote() {
  return (
    <section className="w-full bg-card py-20 px-6">
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-2xl bg-background px-10 py-14 border border-border text-center"
        style={{ boxShadow: "0 8px 40px -16px rgba(139,124,70,0.15)" }}
      >
        {/* corner dots */}
        <span className="absolute left-5 top-5 size-1.5 rounded-full bg-gold/25" />
        <span className="absolute right-5 top-5 size-1.5 rounded-full bg-gold/25" />
        <span className="absolute left-5 bottom-5 size-1.5 rounded-full bg-gold/25" />
        <span className="absolute right-5 bottom-5 size-1.5 rounded-full bg-gold/25" />

        {/* gift icon */}
        <svg viewBox="0 0 24 24" className="size-7" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path
            d="M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"
            stroke="var(--gold)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>

        <span className="block h-px w-10 bg-gold/40" />

        <p className="font-serif uppercase tracking-[0.18em] text-gold/80" style={{ fontSize: "0.72rem" }}>
          Note on Gifts
        </p>

        <div className="flex flex-col gap-4 font-serif leading-relaxed text-muted-foreground" style={{ fontSize: "clamp(0.85rem, 2vw, 0.98rem)" }}>
          <p>
            Your love, laughter, and presence are the only gifts we truly need.
            We are grateful to celebrate this special day surrounded by those we cherish most.
          </p>
          <p>
            For those who would like to give a gift, a monetary blessing toward
            our new journey together would be deeply appreciated.
          </p>
        </div>

        {/* payment QR codes */}
        <div className="mt-2 flex w-full flex-col items-center gap-5">
          <p className="font-serif uppercase tracking-[0.15em] text-gold/70" style={{ fontSize: "0.7rem" }}>
            Scan to send your gift
          </p>
          <div className="grid w-full max-w-md gap-6 sm:grid-cols-2">
            {[
              { src: "/gift-gcash.jpeg",    label: "GCash",    alt: "GCash InstaPay QR code",    w: 1050, h: 1560 },
              { src: "/gift-landbank.jpeg", label: "Landbank", alt: "Landbank InstaPay QR code", w: 876,  h: 1334 },
            ].map((qr) => (
              <figure key={qr.label} className="flex flex-col items-center gap-3">
                <div className="w-full overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                  <Image
                    src={qr.src}
                    alt={qr.alt}
                    width={qr.w}
                    height={qr.h}
                    sizes="(max-width: 640px) 80vw, 220px"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption
                  className="font-serif uppercase tracking-[0.15em] text-muted-foreground"
                  style={{ fontSize: "0.72rem" }}
                >
                  {qr.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <span className="block h-px w-10 bg-gold/40" />

      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "Can I bring someone with me?",
    a: "No — unless we have personally confirmed this with you. Please refer to the number of seats allocated for you. As much as we love to have everyone celebrate with us, we can only accommodate a limited number of guests.",
  },
  {
    q: "Can we bring our kids to the wedding?",
    a: "We love children, but we cannot accommodate them at the venue. The only kids attending are those who are part of the entourage. Babies-in-arms are of course welcome. We hope you understand.",
  },
  {
    q: "Where do I park?",
    a: "There is a large parking area inside the venue — parking is first come, first served. Outside parking is also available if the inside lot is full.",
  },
  {
    q: "Is RSVP really important?",
    a: "Yes! Please RSVP on or before April 18 to ensure you are included in our final guest list. If you have already RSVP'd but find that you will not be able to make it, please notify us so we can adjust accordingly.",
  },
];

function WeddingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(prev => (prev === i ? null : i));
  }

  return (
    <section className="w-full bg-background py-20 px-6">

      {/* heading */}
      <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-3 text-center">
        <span className="font-script text-gold" style={{ fontSize: "2rem", lineHeight: 1, opacity: 0.85 }}>
          Questions?
        </span>
        <span className="block h-px w-10 bg-gold/40" />
        <p className="font-serif uppercase tracking-[0.2em] text-foreground" style={{ fontSize: "0.72rem" }}>
          Wedding FAQs
        </p>
      </div>

      {/* accordion */}
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-border bg-card"
              style={{ boxShadow: "0 2px 12px -6px rgba(139,124,70,0.12)" }}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-serif text-foreground" style={{ fontSize: "clamp(0.85rem, 2vw, 0.98rem)" }}>
                  {faq.q}
                </span>
                {/* +/– icon */}
                <span
                  className="shrink-0 text-gold transition-transform duration-300"
                  style={{ fontSize: "1.2rem", lineHeight: 1, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              {/* answer */}
              <div
                style={{
                  maxHeight: isOpen ? "400px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                <p
                  className="px-6 pb-6 font-serif leading-relaxed text-muted-foreground"
                  style={{ fontSize: "clamp(0.82rem, 1.8vw, 0.92rem)" }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}

function RSVPSection() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | "">("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !attending) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), attending }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
    } catch {
      setError('Could not reach the server. Please check your connection.');
      setLoading(false);
      return;
    }
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section className="w-full bg-card py-20 px-6">

      {/* heading */}
      <div className="mx-auto mb-12 flex max-w-xl flex-col items-center gap-3 text-center">
        <span className="font-script text-gold" style={{ fontSize: "2rem", lineHeight: 1, opacity: 0.85 }}>
          RSVP
        </span>
        <span className="block h-px w-10 bg-gold/40" />
        <p className="font-serif uppercase tracking-[0.2em] text-foreground" style={{ fontSize: "0.72rem" }}>
          Kindly Reply by April 18
        </p>
      </div>

      {/* card */}
      <div
        className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-border bg-background"
        style={{ boxShadow: "0 8px 40px -16px rgba(139,124,70,0.18)" }}
      >
        {/* corner dots */}
        <span className="absolute left-4 top-4 size-1.5 rounded-full bg-gold/25" />
        <span className="absolute right-4 top-4 size-1.5 rounded-full bg-gold/25" />

        {submitted ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center gap-5 px-10 py-16 text-center">
            <svg viewBox="0 0 24 24" className="size-10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="var(--gold)" strokeWidth="1.5" opacity="0.5" />
              <path d="M8 12l3 3 5-5" stroke="var(--gold)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="block h-px w-10 bg-gold/40" />
            <p className="font-script text-foreground" style={{ fontSize: "clamp(1.4rem, 4vw, 1.8rem)" }}>
              {attending === "yes" ? "We can't wait to see you!" : "We'll miss you dearly."}
            </p>
            <p className="font-serif leading-relaxed text-muted-foreground" style={{ fontSize: "0.85rem" }}>
              {attending === "yes"
                ? `Thank you, ${name}! Your RSVP has been received. See you on August 18.`
                : `Thank you, ${name}. We understand and appreciate you letting us know.`}
            </p>
            <span className="font-script text-gold" style={{ fontSize: "1.4rem", opacity: 0.6 }} aria-hidden="true">H &amp; K</span>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="flex flex-col gap-7 px-8 py-12">

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="rsvp-name"
                className="font-serif uppercase tracking-[0.15em] text-gold/80"
                style={{ fontSize: "0.72rem" }}
              >
                Your Name
              </label>
              <input
                id="rsvp-name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                className="rounded-lg border border-border bg-card px-4 py-3 font-serif text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/60 transition-colors"
                style={{ fontSize: "0.9rem" }}
              />
            </div>

            {/* Attendance */}
            <div className="flex flex-col gap-3">
              <p
                className="font-serif uppercase tracking-[0.15em] text-gold/80"
                style={{ fontSize: "0.72rem" }}
              >
                Are you attending?
              </p>

              {/* Yes */}
              <label className={`flex cursor-pointer items-start gap-3 rounded-xl border px-5 py-4 transition-colors ${attending === "yes" ? "border-gold/60 bg-butter/20" : "border-border bg-card hover:border-gold/30"}`}>
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  checked={attending === "yes"}
                  onChange={() => setAttending("yes")}
                  className="sr-only"
                />
                <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${attending === "yes" ? "border-gold bg-gold" : "border-border"}`}>
                  {attending === "yes" && <span className="size-1.5 rounded-full bg-white" />}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-serif text-foreground" style={{ fontSize: "0.88rem" }}>Yes, will be attending</span>
                  <span className="font-serif italic text-muted-foreground" style={{ fontSize: "0.75rem" }}>with joy</span>
                </span>
              </label>

              {/* No */}
              <label className={`flex cursor-pointer items-start gap-3 rounded-xl border px-5 py-4 transition-colors ${attending === "no" ? "border-gold/60 bg-butter/20" : "border-border bg-card hover:border-gold/30"}`}>
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  checked={attending === "no"}
                  onChange={() => setAttending("no")}
                  className="sr-only"
                />
                <span className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${attending === "no" ? "border-gold bg-gold" : "border-border"}`}>
                  {attending === "no" && <span className="size-1.5 rounded-full bg-white" />}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-serif text-foreground" style={{ fontSize: "0.88rem" }}>No, unable to attend</span>
                  <span className="font-serif italic text-muted-foreground" style={{ fontSize: "0.75rem" }}>with regrets</span>
                </span>
              </label>
            </div>

            {/* Error */}
            {error && (
              <p
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 font-serif text-destructive text-center"
                style={{ fontSize: "0.82rem" }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!name.trim() || !attending || loading}
              className="rounded-xl bg-gold px-6 py-3.5 font-serif uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-85 disabled:opacity-40"
              style={{ fontSize: "0.78rem" }}
            >
              {loading ? "Sending…" : "Send RSVP"}
            </button>

          </form>
        )}
      </div>

    </section>
  );
}

export function WeddingMain() {
  const mainRef = useRef<HTMLElement>(null);
  useSectionReveal(mainRef);

  return (
    <main ref={mainRef} className="flex min-h-dvh flex-col bg-background">
      {/* ── Hero ── */}
      <section className="relative h-dvh w-full overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Harold and Karen"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/20 to-black/55" />

        {/* text */}
        <div className="absolute inset-0 flex flex-col items-center justify-end gap-3 px-6 pb-[18vh] text-center text-white">
          <p
            className="hero-fade font-serif uppercase tracking-[0.3em] sm:tracking-[0.45em]"
            style={{ fontSize: "clamp(0.7rem, 2vw, 1rem)", animationDelay: "0.2s" }}
          >
            Save the Date
          </p>
          <h1
            className="hero-fade font-serif font-semibold uppercase leading-none tracking-[0.1em] sm:tracking-[0.15em]"
            style={{ fontSize: "clamp(2.4rem, 8vw, 6rem)", animationDelay: "0.4s" }}
          >
            Harold<span className="hidden sm:inline"> </span><br className="sm:hidden" />&amp;<span className="hidden sm:inline"> </span><br className="sm:hidden" />Karen
          </h1>
          <p
            className="hero-fade font-serif uppercase tracking-[0.12em] opacity-90 sm:tracking-[0.28em]"
            style={{ fontSize: "clamp(0.62rem, 2.6vw, 1rem)", animationDelay: "0.65s" }}
          >
            TUESDAY · THE EIGHTEENTH OF AUGUST · 2026
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <OurStory />

      {/* ── Countdown ── */}
      <Countdown />

     {/* ── Sacred Promise ── */}
      <SacredPromise />
 

      {/* ── Prenup Albums ── */}
      <PrenupAlbums />


      {/* ── Venue ── */}
      <VenueSection />

      {/* ── Map ── */}
      <VenueMap />

      {/* ── Dress Code ── */}
      <DressCode />

      {/* ── Program ── */}
      <ProgramTimeline />

      {/* ── Entourage ── */}
      <EntourageSection />

      {/* ── Gifts ── */}
      <GiftNote />

      {/* ── Guest Photo Upload ── */}
      <GuestUploader />

      {/* ── FAQs ── */}
      <WeddingFAQ />

      {/* ── RSVP ── */}
      <RSVPSection />

      {/* ── Footer bar ── */}
      <div className="py-6 text-center">
        <p className="font-serif text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Harold &amp; Karen · 2026
        </p>
      </div>
    </main>
  );
}

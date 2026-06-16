"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function FloralSprig() {
  // Stylised wildflower sprig — sage greenery with butter / peach / cream blooms.
  return (
    <svg
      viewBox="0 0 200 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* stems */}
      <g stroke="#9aa873" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M150 350 C120 280 132 200 110 150 C95 116 100 70 118 36" />
        <path d="M150 350 C140 300 150 250 165 210 C176 180 172 140 158 110" />
        <path d="M150 350 C135 300 110 280 80 268 C56 258 40 232 36 206" />
        <path d="M150 350 C138 305 132 270 120 240" />
      </g>

      {/* leaves */}
      <g fill="#aeb982">
        <path d="M110 150 C90 142 74 152 66 170 C86 174 104 168 110 150 Z" />
        <path d="M165 210 C184 202 198 210 200 228 C181 234 167 226 165 210 Z" />
        <path d="M80 268 C62 262 48 270 44 288 C64 292 78 284 80 268 Z" />
        <path d="M120 240 C104 236 92 246 90 262 C108 264 120 256 120 240 Z" />
        <path d="M118 90 C100 84 86 92 82 108 C100 112 114 104 118 90 Z" />
      </g>
      <g fill="#c2cb9a">
        <path d="M132 120 C150 112 166 120 170 138 C150 144 134 136 132 120 Z" />
        <path d="M96 200 C78 194 64 202 60 220 C80 224 94 216 96 200 Z" />
      </g>

      {/* small sprig buds */}
      <g fill="#d8c87e">
        <circle cx="36" cy="206" r="5" />
        <circle cx="44" cy="194" r="4" />
        <circle cx="52" cy="184" r="3.5" />
      </g>

      {/* peach rose cluster */}
      <g>
        <circle cx="118" cy="36" r="26" fill="#f1c9a0" />
        <circle cx="118" cy="36" r="17" fill="#f6d8b6" />
        <circle cx="118" cy="36" r="8" fill="#eebf95" />
      </g>

      {/* butter-yellow bloom */}
      <g>
        <circle cx="158" cy="110" r="21" fill="#ecdc8f" />
        <g fill="#f4ebb4">
          <circle cx="158" cy="93" r="8" />
          <circle cx="175" cy="105" r="8" />
          <circle cx="169" cy="124" r="8" />
          <circle cx="147" cy="124" r="8" />
          <circle cx="141" cy="105" r="8" />
        </g>
        <circle cx="158" cy="110" r="7" fill="#d6b75c" />
      </g>

      {/* cream daisy */}
      <g>
        <g fill="#fcf8ec">
          <ellipse cx="66" cy="170" rx="6" ry="13" />
          <ellipse cx="66" cy="170" rx="6" ry="13" transform="rotate(60 66 170)" />
          <ellipse cx="66" cy="170" rx="6" ry="13" transform="rotate(120 66 170)" />
        </g>
        <circle cx="66" cy="170" r="6" fill="#e9cf6f" />
      </g>

      {/* soft blue accent flower */}
      <g>
        <g fill="#cdd6e8">
          <circle cx="100" cy="206" r="5.5" />
          <circle cx="112" cy="200" r="5.5" />
          <circle cx="112" cy="212" r="5.5" />
          <circle cx="88" cy="200" r="5.5" />
          <circle cx="88" cy="212" r="5.5" />
        </g>
        <circle cx="100" cy="206" r="4" fill="#e9cf6f" />
      </g>

      {/* tiny berries */}
      <g fill="#e7be8e">
        <circle cx="200" cy="228" r="4" />
        <circle cx="194" cy="240" r="3.5" />
        <circle cx="44" cy="288" r="4" />
      </g>
    </svg>
  );
}

export function EnvelopeLanding() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleOpen() {
    if (open) return;
    setOpen(true);
    setTimeout(() => router.push("/main"), 3500);
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-2 overflow-hidden bg-background px-4 py-16">
      {/* header */}
      <h1
        className="font-script leading-none text-gold"
        style={{ fontSize: "clamp(3.5rem, 11vw, 6.5rem)" }}
      >
        Harold &amp; Karen
      </h1>

      <div className="relative mt-6 flex items-center justify-center">
        <button
          type="button"
          aria-label={open ? "Invitation opened" : "Click to open the invitation"}
          aria-expanded={open}
          onClick={handleOpen}
          className={`envelope-scene group cursor-pointer border-0 bg-transparent p-0 ${
            open ? "is-open" : ""
          }`}
        >
          <span className="floral floral-left">
            <FloralSprig />
          </span>
          <span className="floral floral-right">
            <FloralSprig />
          </span>

          <span className="env-back" />
          <span className="env-card" aria-live="polite">
            <span
              style={{
                fontFamily: "var(--font-script), cursive",
                fontSize: "clamp(0.75rem, 2.2vw, 1rem)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: "0.5em",
              }}
            >
              You are invited to
            </span>
            <span
              style={{
                fontFamily: "var(--font-script), cursive",
                fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
                color: "var(--text)",
                lineHeight: 1.15,
              }}
            >
              Our Wedding
            </span>
            <span
              style={{
                marginTop: "0.75em",
                width: "40%",
                height: "1px",
                background: "var(--gold)",
                opacity: 0.5,
                display: "block",
              }}
            />
            <span
              style={{
                marginTop: "0.75em",
                fontFamily: "var(--font-serif), serif",
                fontSize: "clamp(0.7rem, 1.8vw, 0.85rem)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--gold)",
                opacity: 0.8,
              }}
            >
              Harold &amp; Karen
            </span>
          </span>
          <span className="env-pocket" />
          <span className="env-flap" />
          <span className="env-seal">
            <span>HK</span>
          </span>
        </button>
      </div>

      {/* prompt below the envelope */}
      <p
        className={`env-prompt ${open ? "is-hidden" : ""}`}
        aria-hidden={open}
      >
        Click to open
      </p>
    </main>
  );
}

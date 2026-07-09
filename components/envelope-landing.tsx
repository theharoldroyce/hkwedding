"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
          <span className="env-back" />
          <span className="env-card" aria-live="polite">
            <span
              style={{
                fontFamily: "var(--font-serif), serif",
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
                fontFamily: "var(--font-serif), serif",
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
            <Image
              src="/official-logo.png"
              alt="Harold &amp; Karen monogram"
              width={80}
              height={80}
              className="env-seal-logo"
              priority
            />
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

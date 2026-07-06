"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export type PrenupPhoto = { src: string; caption: string | null };

export function PrenupGallery({ photos }: { photos: PrenupPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  );

  // keyboard controls + scroll lock while the lightbox is open
  useEffect(() => {
    if (openIndex === null) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, prev, next]);

  if (photos.length === 0) {
    return (
      <p className="mx-auto max-w-md text-center font-serif italic text-muted-foreground" style={{ fontSize: "0.95rem" }}>
        Photos coming soon — check back closer to the big day.
      </p>
    );
  }

  const active = openIndex === null ? null : photos[openIndex];

  return (
    <>
      {/* grid */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-card"
            aria-label={`Open photo ${i + 1}`}
          >
            <Image
              src={photo.src}
              alt={photo.caption ?? `Prenup photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* close */}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 rounded-full border border-white/40 p-2.5 text-white/90 transition hover:bg-white/15"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* prev */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/40 p-3 text-white/90 transition hover:bg-white/15 sm:left-6"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* image */}
          <div
            className="relative flex max-h-[85vh] w-full max-w-4xl flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[75vh] w-full">
              <Image
                src={active.src}
                alt={active.caption ?? `Prenup photo ${openIndex! + 1}`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
            {active.caption && (
              <p className="text-center font-serif text-white/85" style={{ fontSize: "0.9rem" }}>
                {active.caption}
              </p>
            )}
            <p className="font-serif uppercase tracking-[0.2em] text-white/50" style={{ fontSize: "0.7rem" }}>
              {openIndex! + 1} / {photos.length}
            </p>
          </div>

          {/* next */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/40 p-3 text-white/90 transition hover:bg-white/15 sm:right-6"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}

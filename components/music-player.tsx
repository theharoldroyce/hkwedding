"use client";

import { useEffect, useRef, useState } from "react";

// Animated vinyl record that plays the wedding background music.
// Tries to auto-play on mount; browsers that block silent-start audio
// will start it on the visitor's first interaction instead. Loops
// continuously, and the record only spins while it's actually playing.
export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  // Keep the spin state in sync with real playback.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  // Auto-play continuously, with a first-gesture fallback.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const start = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };
    start();

    const onFirstGesture = () => {
      if (audio.paused) start();
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
    window.addEventListener("pointerdown", onFirstGesture);
    window.addEventListener("keydown", onFirstGesture);
    return () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/bg music.mp3" loop preload="auto" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        aria-pressed={playing}
        className="fixed bottom-5 right-4 z-20 flex flex-col items-center gap-2 border-0 bg-transparent p-0 sm:bottom-6 sm:right-6"
      >
        {/* record + pulsing rings */}
        <span className="relative flex size-16 items-center justify-center sm:size-20">
          {playing && (
            <>
              <span
                className="pointer-events-none absolute inset-0 rounded-full border border-gold/50"
                style={{ animation: "vinyl-ripple 1.8s ease-out infinite" }}
              />
              <span
                className="pointer-events-none absolute inset-0 rounded-full border border-gold/50"
                style={{ animation: "vinyl-ripple 1.8s ease-out infinite", animationDelay: "0.9s" }}
              />
            </>
          )}

          <span
            className="relative flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20"
            style={{
              background:
                "repeating-radial-gradient(circle at center, #1a1a1a 0px, #1a1a1a 2px, #2b2b2b 3px, #1a1a1a 4px)",
              boxShadow: playing
                ? "0 6px 18px -6px rgba(0,0,0,0.55), 0 0 16px -2px var(--gold)"
                : "0 6px 18px -6px rgba(0,0,0,0.55)",
              animation: "vinyl-spin 4s linear infinite",
              animationPlayState: playing ? "running" : "paused",
              transition: "box-shadow 0.4s ease",
            }}
          >
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.18), transparent 55%)" }}
            />
            <span
              className="relative flex size-6 items-center justify-center rounded-full sm:size-7"
              style={{ background: "radial-gradient(circle at 40% 35%, var(--butter-light), var(--gold))" }}
            >
              <span className="size-1 rounded-full bg-background" />
            </span>
          </span>
        </span>

        {/* status: animated equalizer bars while playing */}
        <span className="flex items-center gap-1.5">
          {playing && (
            <span className="flex h-3 items-end gap-0.5" aria-hidden="true">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className="w-0.5 rounded-full bg-gold"
                  style={{ animation: "eq-bar 0.9s ease-in-out infinite", animationDelay: `${n * 0.18}s` }}
                />
              ))}
            </span>
          )}
          <span
            className="font-serif uppercase tracking-[0.18em] text-gold"
            style={{ fontSize: "0.55rem" }}
          >
            {playing ? "Playing" : "Music"}
          </span>
        </span>
      </button>
    </>
  );
}

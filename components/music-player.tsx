"use client";

import { useEffect, useRef, useState } from "react";

// Animated vinyl record that plays the wedding background music.
// Browsers block audible autoplay before any interaction, so we start the
// track MUTED on load (which is allowed) and keep it looping. On the
// visitor's first tap/click anywhere, we unmute — so sound comes in the
// instant they engage. The record only spins while the audio is actually
// AUDIBLE (playing and unmuted), never while it's silently primed.
export function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [everPlayed, setEverPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused && !audio.muted) {
      audio.pause();
    } else {
      audio.muted = false;
      audio.play().catch(() => {});
    }
  }

  // Reflect true AUDIBLE state (playing AND unmuted) in the UI. Fires on
  // play/pause and on mute changes (volumechange).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const sync = () => {
      const audible = !audio.paused && !audio.muted;
      setPlaying(audible);
      if (audible) setEverPlayed(true);
    };
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("volumechange", sync);
    return () => {
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
      audio.removeEventListener("volumechange", sync);
    };
  }, []);

  // Muted autoplay on load, then unmute on the first interaction.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    audio.play().catch(() => {});

    const cleanup = () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("touchstart", onGesture);
    };
    const onGesture = (e: Event) => {
      // If the first interaction is the vinyl button itself, let its own
      // onClick handle it — avoids unmute + toggle firing on one tap.
      if (btnRef.current && e.target instanceof Node && btnRef.current.contains(e.target)) {
        cleanup();
        return;
      }
      audio.muted = false;
      if (audio.paused) audio.play().catch(() => {});
      cleanup();
    };
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    window.addEventListener("touchstart", onGesture);
    return cleanup;
  }, []);

  return (
    <>
      <audio ref={audioRef} src="/bg-music.mp3" loop preload="auto" />

      {/* "tap for sound" hint — shown until the music first starts */}
      {!everPlayed && (
        <span
          aria-hidden="true"
          className="fixed bottom-28 right-4 z-20 animate-pulse rounded-full border border-gold/40 bg-card/90 px-3 py-1.5 font-serif uppercase tracking-[0.15em] text-gold shadow-md backdrop-blur-sm sm:bottom-32 sm:right-6"
          style={{ fontSize: "0.6rem" }}
        >
          🔊 Tap for sound
        </span>
      )}

      <button
        ref={btnRef}
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

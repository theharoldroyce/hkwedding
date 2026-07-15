import Image from "next/image";
import Link from "next/link";
import { GuestUploader, GuestAlbum } from "@/components/guest-gallery";

export const metadata = {
  title: "Wedding Snapshots · Harold & Karen",
  description: "Share and view photos from Harold & Karen's wedding day.",
};

/* ──────────────────────────────────────────────────────────────
   Dedicated QR-scan landing page.
   Guests scanning the table/signage QR land here — a focused,
   mobile-first page with just the photo-sharing uploader and the
   live album, rather than the full home page.
   ────────────────────────────────────────────────────────────── */
export default function SnapshotsPage() {
  return (
    <main className="flex min-h-dvh flex-col bg-background">
      {/* header — monogram + names, kept compact for phones */}
      <header className="w-full px-6 pt-12 pb-2">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <Image
            src="/official-logo.png"
            alt="Harold &amp; Karen monogram"
            width={72}
            height={72}
            priority
            className="h-16 w-16 object-contain"
          />
          <span className="font-script text-gold" style={{ fontSize: "1.6rem", lineHeight: 1, opacity: 0.9 }}>
            Harold &amp; Karen
          </span>
          <p className="font-serif uppercase tracking-[0.28em] text-muted-foreground" style={{ fontSize: "0.62rem" }}>
            August 18, 2026
          </p>
        </div>
      </header>

      {/* uploader — reuses the same "Share Your Photos" section as the
          home page, but unlocked here so QR-scan guests can share right
          away. The main page keeps its wedding-day gate. */}
      <GuestUploader alwaysOpen />

      {/* album — live gallery of everything guests have shared */}
      <section className="w-full bg-background px-4 pb-16 sm:px-6">
        <div className="mx-auto mb-8 flex max-w-md flex-col items-center gap-3 text-center">
          <span className="block h-px w-10 bg-gold/40" />
          <span className="font-script text-gold" style={{ fontSize: "1.9rem", lineHeight: 1, opacity: 0.85 }}>
            The Album
          </span>
          <p className="font-serif uppercase tracking-[0.2em] text-muted-foreground" style={{ fontSize: "0.66rem" }}>
            Everything guests have shared
          </p>
        </div>
        <GuestAlbum />
      </section>

      {/* footer */}
      <div className="mt-auto py-6 text-center">
        <Link
          href="/main"
          className="font-serif uppercase tracking-[0.2em] text-gold/70 transition-colors hover:text-gold"
          style={{ fontSize: "0.64rem" }}
        >
          Visit our wedding site
        </Link>
        <p className="mt-3 font-serif text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Harold &amp; Karen · 2026
        </p>
      </div>
    </main>
  );
}

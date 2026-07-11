import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/server";
import { PrenupGallery, type PrenupPhoto } from "@/components/prenup-gallery";
import { GuestAlbum } from "@/components/guest-gallery";
import { MusicPlayer } from "@/components/music-player";

const ALBUMS: Record<string, { eyebrow: string; title: string; subtitle: string }> = {
  v1: { eyebrow: "Prenup", title: "Volume One", subtitle: "Golden hour in the open fields" },
  v2: { eyebrow: "Prenup", title: "Volume Two", subtitle: "Quiet moments, just the two of us" },
  guest: { eyebrow: "From Our Guests", title: "Wedding Snapshots", subtitle: "Photos taken during the celebration" },
};

export function generateStaticParams() {
  return Object.keys(ALBUMS).map((album) => ({ album }));
}

export async function generateMetadata({ params }: { params: Promise<{ album: string }> }) {
  const { album } = await params;
  const meta = ALBUMS[album];
  return { title: meta ? `Prenup · ${meta.title} · Harold & Karen` : "Prenup · Harold & Karen" };
}

export default async function PrenupAlbumPage({ params }: { params: Promise<{ album: string }> }) {
  const { album } = await params;
  const meta = ALBUMS[album];
  if (!meta) notFound();

  const isGuest = album === "guest";

  let photos: PrenupPhoto[] = [];
  if (!isGuest) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("prenup_photos")
      .select("path, caption")
      .eq("album", album)
      .order("sort_order", { ascending: true });

    photos = (data ?? []).map((row) => ({
      src: supabase.storage.from("prenup").getPublicUrl(row.path as string).data.publicUrl,
      caption: (row.caption as string | null) ?? null,
    }));
  }

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      {/* background music — same floating vinyl player as the home page */}
      <MusicPlayer />

      {/* header */}
      <header className="w-full px-6 pt-16 pb-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
          <Link
            href="/main"
            className="mb-2 inline-flex items-center gap-2 font-serif uppercase tracking-[0.15em] text-gold/80 transition-colors hover:text-gold"
            style={{ fontSize: "0.7rem" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to Home
          </Link>
          <span className="font-script text-gold" style={{ fontSize: "2rem", lineHeight: 1, opacity: 0.85 }}>
            {meta.eyebrow}
          </span>
          <h1 className="font-script leading-none text-foreground" style={{ fontSize: "clamp(2.4rem, 7vw, 3.8rem)" }}>
            {meta.title}
          </h1>
          <span className="block h-px w-10 bg-gold/40" />
          <p className="font-serif uppercase tracking-[0.18em] text-muted-foreground" style={{ fontSize: "0.72rem" }}>
            {meta.subtitle}
          </p>
        </div>
      </header>

      {/* gallery */}
      <section className="w-full px-4 pb-24 sm:px-6">
        {isGuest ? <GuestAlbum /> : <PrenupGallery photos={photos} />}
      </section>

      {/* footer */}
      <div className="mt-auto py-6 text-center">
        <p className="font-serif text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Harold &amp; Karen · 2026
        </p>
      </div>
    </main>
  );
}

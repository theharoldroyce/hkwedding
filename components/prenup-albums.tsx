"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { supabaseImageLoader, isRemotePhoto } from "@/lib/image-loader";

const ALBUMS = [
  {
    key: "v1",
    eyebrow: "Prenup",
    title: "Volume One",
    blurb: "Golden hour in the open fields",
    placeholder: "/v1 pre 1.jpg",
  },
  {
    key: "v2",
    eyebrow: "Prenup",
    title: "Volume Two",
    blurb: "Quiet moments, just the two of us",
    placeholder: "/v2 pre 1.jpg",
  },
  {
    key: "guest",
    eyebrow: "From Our Guests",
    title: "Wedding Snapshots",
    blurb: "Photos taken during the celebration",
    placeholder: "/v1 pre 9.jpg",
  },
] as const;

type AlbumInfo = { cover: string | null; count: number };

export function PrenupAlbums() {
  const [info, setInfo] = useState<Record<string, AlbumInfo>>({});

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    (async () => {
      const map: Record<string, AlbumInfo> = {};

      const { data } = await supabase
        .from("prenup_photos")
        .select("album, path")
        .order("sort_order", { ascending: true });

      for (const row of data ?? []) {
        const album = row.album as string;
        if (!map[album]) map[album] = { cover: null, count: 0 };
        if (!map[album].cover) {
          map[album].cover = supabase.storage
            .from("prenup")
            .getPublicUrl(row.path as string).data.publicUrl;
        }
        map[album].count += 1;
      }

      // guest album count (cover always uses the placeholder)
      const { count: guestCount } = await supabase
        .from("guest_photos")
        .select("*", { count: "exact", head: true });
      map["guest"] = { cover: null, count: guestCount ?? 0 };

      if (active) setInfo(map);
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="w-full bg-background py-20 px-6">
      {/* heading */}
      <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-3 text-center">
        <span className="font-script text-gold" style={{ fontSize: "2.6rem", lineHeight: 1, opacity: 0.9 }}>
          Our Photo Albums
        </span>
        <span className="block h-px w-10 bg-gold/40" />
      </div>

      {/* album cards — the guest album only appears once it has photos.
          Flex-wrap + center so 2 or 3 cards always stay centered. */}
      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6">
        {ALBUMS.filter((album) => album.key !== "guest" || (info.guest?.count ?? 0) > 0).map((album) => {
          const cover = info[album.key]?.cover ?? album.placeholder;
          const count = info[album.key]?.count ?? 0;
          return (
            <Link
              key={album.key}
              href={`/prenup/${album.key}`}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm sm:w-[300px] lg:w-[320px]"
            >
              {/* cover photo — remote Supabase covers go through our resizer;
                  bundled local placeholders use Next's default optimizer. */}
              <Image
                src={cover}
                loader={isRemotePhoto(cover) ? supabaseImageLoader : undefined}
                alt={`Prenup ${album.title}`}
                fill
                sizes="(max-width: 640px) 90vw, 45vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

              {/* text */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-6 text-center text-white">
                <p className="font-serif uppercase tracking-[0.2em]" style={{ fontSize: "0.68rem", opacity: 0.9 }}>
                  {album.eyebrow}
                </p>
                <h3 className="font-script leading-none" style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)" }}>
                  {album.title}
                </h3>
                <p className="font-serif" style={{ fontSize: "0.8rem", opacity: 0.85 }}>
                  {album.blurb}
                </p>
                <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/50 px-4 py-1.5 font-serif uppercase tracking-[0.15em] backdrop-blur-sm transition-colors group-hover:bg-white/15" style={{ fontSize: "0.68rem" }}>
                  View Album
                  {count > 0 && <span className="opacity-70">· {count} photos</span>}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

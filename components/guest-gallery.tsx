"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/client";
import { PrenupGallery, type PrenupPhoto } from "@/components/prenup-gallery";

const BUCKET = "guest-photos";
const TABLE = "guest_photos";

function sanitize(name: string) {
  const dot = name.lastIndexOf(".");
  const base = (dot === -1 ? name : name.slice(0, dot))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const ext = dot === -1 ? "" : name.slice(dot).toLowerCase();
  return `${base || "photo"}${ext}`;
}

export function GuestGallery() {
  // Create the browser client once so callback identities stay stable.
  const [supabase] = useState(() => createClient());
  const [photos, setPhotos] = useState<PrenupPhoto[]>([]);
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [justUploaded, setJustUploaded] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from(TABLE)
      .select("path, uploader_name")
      .order("created_at", { ascending: false });

    // Stay silent on read errors (e.g. table not set up yet) — the album
    // simply stays hidden until there are photos to show.
    if (error) return;

    setPhotos(
      (data ?? []).map((row) => ({
        src: supabase.storage.from(BUCKET).getPublicUrl(row.path as string).data.publicUrl,
        caption: (row.uploader_name as string | null)
          ? `Shared by ${row.uploader_name as string}`
          : null,
      })),
    );
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (list.length === 0) return;

      setError(null);
      setJustUploaded(0);
      setUploading(list.length);

      const who = name.trim() || null;
      let ok = 0;

      for (const file of list) {
        const path = `${Date.now()}-${Math.round(Math.random() * 1e6)}-${sanitize(file.name)}`;

        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (upErr) {
          setError(`Upload failed for ${file.name}: ${upErr.message}`);
          setUploading((n) => n - 1);
          continue;
        }

        const { error: insErr } = await supabase.from(TABLE).insert({ path, uploader_name: who });

        if (insErr) {
          // roll back the orphaned file so storage and table stay in sync
          await supabase.storage.from(BUCKET).remove([path]);
          setError(`Could not save ${file.name}: ${insErr.message}`);
        } else {
          ok += 1;
        }

        setUploading((n) => n - 1);
      }

      setUploading(0);
      setJustUploaded(ok);
      await load();
    },
    [supabase, name, load],
  );

  const busy = uploading > 0;

  return (
    <section className="w-full bg-background py-20 px-6">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10">

        {/* heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="font-script text-gold" style={{ fontSize: "2rem", lineHeight: 1, opacity: 0.85 }}>
            Wedding Snapshots
          </span>
          <span className="block h-px w-10 bg-gold/40" />
          <p className="font-serif uppercase tracking-[0.2em] text-foreground" style={{ fontSize: "0.72rem" }}>
            Share Your Photos
          </p>
          <p className="max-w-md font-serif italic text-muted-foreground" style={{ fontSize: "clamp(0.85rem, 2vw, 0.98rem)" }}>
            Took a photo during the celebration? Add it here so we can all relive
            the day together.
          </p>
        </div>

        {/* uploader */}
        <div className="flex w-full max-w-md flex-col gap-4">
          {/* optional name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="rounded-lg border border-border bg-card px-4 py-3 font-serif text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/60 transition-colors"
            style={{ fontSize: "0.9rem" }}
          />

          {/* dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => { if (!busy) fileInput.current?.click(); }}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              dragOver ? "border-gold bg-butter/20" : "border-border hover:border-gold/50"
            } ${busy ? "pointer-events-none opacity-60" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="size-7 text-gold/70">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <path d="M17 8l-5-5-5 5" />
              <path d="M12 3v12" />
            </svg>
            <p className="font-serif text-foreground" style={{ fontSize: "0.9rem" }}>
              Tap to choose photos, or drag &amp; drop
            </p>
            <p className="font-serif text-muted-foreground" style={{ fontSize: "0.75rem" }}>
              You can select several at once.
            </p>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
            />
          </div>

          {/* status */}
          {busy && (
            <p className="text-center font-serif text-gold" style={{ fontSize: "0.82rem" }}>
              Uploading {uploading} photo{uploading === 1 ? "" : "s"}…
            </p>
          )}
          {!busy && justUploaded > 0 && (
            <p className="text-center font-serif text-foreground" style={{ fontSize: "0.85rem" }}>
              Thank you! {justUploaded} photo{justUploaded === 1 ? "" : "s"} added. 💛
            </p>
          )}
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-center font-serif text-destructive" style={{ fontSize: "0.82rem" }}>
              {error}
            </p>
          )}
        </div>

        {/* guest album — only shown once there is at least one photo */}
        {photos.length > 0 && (
          <div className="flex w-full flex-col items-center gap-6 pt-4">
            <p className="font-serif uppercase tracking-[0.18em] text-gold/80" style={{ fontSize: "0.72rem" }}>
              From Our Guests · {photos.length} photo{photos.length === 1 ? "" : "s"}
            </p>
            <PrenupGallery photos={photos} />
          </div>
        )}
      </div>
    </section>
  );
}

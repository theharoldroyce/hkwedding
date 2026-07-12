import type { ImageLoaderProps } from "next/image";

// Routes a Supabase-hosted photo through our own /api/img resizer instead of
// Next's built-in optimizer. The originals are ~18 MB, which trips Next's
// hard-coded 7 s upstream-fetch timeout; our route resizes with sharp to the
// requested width at high quality (visually identical on screen) and serves a
// small, hard-cached WebP. See app/api/img/route.ts.
export function supabaseImageLoader({ src, width, quality }: ImageLoaderProps) {
  return `/api/img?src=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 82}`;
}

// True for remote Supabase photos (which must go through the resizer) and
// false for bundled local placeholders like "/v1 pre 1.jpg" (which Next's
// default optimizer handles fine, and which our route would reject anyway).
export function isRemotePhoto(src: string) {
  return /^https?:\/\//.test(src);
}

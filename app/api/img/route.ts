import sharp from 'sharp'

// On-the-fly image resizer for the Supabase-hosted prenup/guest photos.
//
// Why this exists: the source photos in Supabase are ~18 MB each. Next.js's
// built-in <Image> optimizer aborts any upstream fetch that takes longer than
// a HARD-CODED 7 seconds, and an 18 MB download routinely exceeds that — so the
// optimizer returned 500s. Supabase's own image-transform add-on is not enabled
// on this project either. So we do the resize ourselves: fetch the original
// once (with a generous timeout), downscale with sharp to the requested width
// at high quality, and serve a small WebP with a long immutable cache. The
// output is visually identical on screen — we only drop pixels no display can
// show — while cutting ~18 MB down to a few hundred KB.

export const runtime = 'nodejs'

// Only proxy images from our own Supabase storage — never an arbitrary URL
// (that would make this an open image proxy / SSRF vector).
const ALLOWED_PREFIX = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`

const MAX_WIDTH = 3840 // enough for the largest retina/4K display
const UPSTREAM_TIMEOUT_MS = 25_000

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const src = searchParams.get('src')
  const widthParam = searchParams.get('w')
  const qualityParam = searchParams.get('q')

  if (!src || !src.startsWith(ALLOWED_PREFIX)) {
    return new Response('Invalid "src"', { status: 400 })
  }

  const clamp = (v: string | null, fallback: number, min: number, max: number) => {
    const n = v === null ? NaN : Number(v)
    return Number.isFinite(n) ? Math.min(Math.max(Math.round(n), min), max) : fallback
  }

  const width = clamp(widthParam, 1600, 16, MAX_WIDTH)
  const quality = clamp(qualityParam, 82, 40, 95)

  let upstream: Response
  try {
    upstream = await fetch(src, { signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS) })
  } catch {
    return new Response('Upstream fetch failed', { status: 504 })
  }

  if (!upstream.ok) {
    return new Response('Upstream error', { status: 502 })
  }

  const input = Buffer.from(await upstream.arrayBuffer())

  try {
    const output = await sharp(input)
      .rotate() // honour EXIF orientation before we strip metadata
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer()

    return new Response(new Uint8Array(output), {
      headers: {
        'Content-Type': 'image/webp',
        // Derivatives are deterministic for a given (src, w, q), so cache hard.
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Image processing failed', { status: 500 })
  }
}

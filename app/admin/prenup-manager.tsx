'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/client'

type Photo = {
  id: string
  album: string
  path: string
  sort_order: number
  caption: string | null
  url: string
}

const ALBUMS = [
  { key: 'v1', label: 'Volume One' },
  { key: 'v2', label: 'Volume Two' },
] as const

function sanitize(name: string) {
  const dot = name.lastIndexOf('.')
  const base = (dot === -1 ? name : name.slice(0, dot))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const ext = dot === -1 ? '' : name.slice(dot).toLowerCase()
  return `${base || 'photo'}${ext}`
}

export function PrenupManager() {
  const [album, setAlbum] = useState<'v1' | 'v2'>('v1')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const load = useCallback(
    async (which: 'v1' | 'v2') => {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('prenup_photos')
        .select('id, album, path, sort_order, caption')
        .eq('album', which)
        .order('sort_order', { ascending: true })

      if (error) {
        setError(error.message)
        setPhotos([])
      } else {
        setPhotos(
          (data ?? []).map((r) => ({
            ...(r as Omit<Photo, 'url'>),
            url: supabase.storage.from('prenup').getPublicUrl(r.path as string).data.publicUrl,
          })),
        )
      }
      setLoading(false)
    },
    [supabase],
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on album change
    load(album)
  }, [album, load])

  async function handleFiles(files: FileList | File[]) {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (list.length === 0) return

    setError(null)
    setUploading(list.length)

    // start numbering after the current highest sort_order
    let nextOrder = photos.reduce((max, p) => Math.max(max, p.sort_order), 0)

    for (const file of list) {
      const path = `${album}/${Date.now()}-${Math.round(Math.random() * 1e6)}-${sanitize(file.name)}`

      const { error: upErr } = await supabase.storage
        .from('prenup')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (upErr) {
        setError(`Upload failed for ${file.name}: ${upErr.message}`)
        setUploading((n) => n - 1)
        continue
      }

      nextOrder += 1
      const { error: insErr } = await supabase
        .from('prenup_photos')
        .insert({ album, path, sort_order: nextOrder, caption: null })

      if (insErr) {
        // roll back the orphaned file so storage and table stay in sync
        await supabase.storage.from('prenup').remove([path])
        setError(`Could not save ${file.name}: ${insErr.message}`)
      }

      setUploading((n) => n - 1)
    }

    setUploading(0)
    await load(album)
  }

  async function remove(photo: Photo) {
    if (!confirm('Remove this photo? This cannot be undone.')) return
    setError(null)
    await supabase.storage.from('prenup').remove([photo.path])
    const { error } = await supabase.from('prenup_photos').delete().eq('id', photo.id)
    if (error) setError(error.message)
    await load(album)
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir
    if (target < 0 || target >= photos.length) return
    const a = photos[index]
    const b = photos[target]
    setError(null)
    // swap their sort_order values
    await Promise.all([
      supabase.from('prenup_photos').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('prenup_photos').update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
    await load(album)
  }

  async function saveCaption(photo: Photo, caption: string) {
    const value = caption.trim() || null
    if (value === photo.caption) return
    await supabase.from('prenup_photos').update({ caption: value }).eq('id', photo.id)
    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? { ...p, caption: value } : p)))
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* header */}
      <div className="border-b border-border px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="font-serif text-foreground" style={{ fontSize: '1rem' }}>
            Prenup Albums
          </h2>
          <p className="font-serif text-muted-foreground" style={{ fontSize: '0.75rem' }}>
            Upload, reorder, and caption the prenup photos
          </p>
        </div>

        {/* album tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
          {ALBUMS.map((a) => (
            <button
              key={a.key}
              onClick={() => setAlbum(a.key)}
              className={`rounded-md px-3 py-1.5 font-serif uppercase tracking-[0.1em] transition-colors ${
                album === a.key ? 'bg-gold text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{ fontSize: '0.68rem' }}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">
        {/* dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
          onClick={() => fileInput.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            dragOver ? 'border-gold bg-butter/20' : 'border-border hover:border-gold/50'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="size-7 text-gold/70">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M17 8l-5-5-5 5" />
            <path d="M12 3v12" />
          </svg>
          <p className="font-serif text-foreground" style={{ fontSize: '0.9rem' }}>
            Drag &amp; drop photos here, or click to choose
          </p>
          <p className="font-serif text-muted-foreground" style={{ fontSize: '0.75rem' }}>
            Uploading to {ALBUMS.find((a) => a.key === album)?.label}. You can select many at once.
          </p>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = '' }}
          />
        </div>

        {/* status */}
        {uploading > 0 && (
          <p className="font-serif text-gold" style={{ fontSize: '0.82rem' }}>
            Uploading {uploading} photo{uploading === 1 ? '' : 's'}…
          </p>
        )}
        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 font-serif text-destructive" style={{ fontSize: '0.82rem' }}>
            {error}
          </p>
        )}

        {/* photo grid */}
        {loading ? (
          <p className="font-serif text-muted-foreground" style={{ fontSize: '0.85rem' }}>Loading…</p>
        ) : photos.length === 0 ? (
          <p className="py-6 text-center font-serif text-muted-foreground" style={{ fontSize: '0.85rem' }}>
            No photos in this album yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {photos.map((photo, i) => (
              <div key={photo.id} className="flex flex-col gap-2 rounded-lg border border-border bg-background p-2">
                <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-card">
                  <Image src={photo.url} alt={photo.caption ?? 'Prenup photo'} fill sizes="200px" className="object-cover" />
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-black/60 px-2 py-0.5 font-serif text-white" style={{ fontSize: '0.6rem' }}>
                    #{i + 1}
                  </span>
                </div>

                <input
                  type="text"
                  defaultValue={photo.caption ?? ''}
                  placeholder="Caption (optional)"
                  onBlur={(e) => saveCaption(photo, e.target.value)}
                  className="rounded-md border border-border bg-card px-2 py-1.5 font-serif text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/60"
                  style={{ fontSize: '0.72rem' }}
                />

                <div className="flex items-center justify-between gap-1">
                  <div className="flex gap-1">
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Move earlier"
                      className="rounded-md border border-border px-2 py-1 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground disabled:opacity-30"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === photos.length - 1}
                      aria-label="Move later"
                      className="rounded-md border border-border px-2 py-1 text-muted-foreground transition-colors hover:border-gold/40 hover:text-foreground disabled:opacity-30"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                  </div>
                  <button
                    onClick={() => remove(photo)}
                    aria-label="Delete photo"
                    className="rounded-md border border-border px-2 py-1 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="size-3.5"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

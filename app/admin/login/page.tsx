'use client'

import { useActionState } from 'react'
import { login } from '../actions'

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card"
        style={{ boxShadow: '0 8px 40px -16px rgba(139,124,70,0.2)' }}
      >
        {/* corner dots */}
        <span className="absolute left-4 top-4 size-1.5 rounded-full bg-gold/25" />
        <span className="absolute right-4 top-4 size-1.5 rounded-full bg-gold/25" />

        <div className="flex flex-col gap-6 px-8 py-10">
          {/* heading */}
          <div className="flex flex-col items-center gap-2 text-center">
            <span
              className="font-script text-foreground"
              style={{ fontSize: '2rem', lineHeight: 1 }}
            >
              H &amp; K
            </span>
            <span className="block h-px w-10 bg-gold/40" />
            <p className="font-serif uppercase tracking-[0.18em] text-gold/80" style={{ fontSize: '0.72rem' }}>
              Admin Access
            </p>
          </div>

          <form action={action} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-serif uppercase tracking-[0.15em] text-gold/80"
                style={{ fontSize: '0.68rem' }}
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="rounded-lg border border-border bg-background px-4 py-3 font-serif text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/60 transition-colors"
                style={{ fontSize: '0.9rem' }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="font-serif uppercase tracking-[0.15em] text-gold/80"
                style={{ fontSize: '0.68rem' }}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="rounded-lg border border-border bg-background px-4 py-3 font-serif text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-gold/60 transition-colors"
                style={{ fontSize: '0.9rem' }}
              />
            </div>

            {state?.error && (
              <p
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2.5 font-serif text-destructive"
                style={{ fontSize: '0.82rem' }}
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-1 rounded-xl bg-gold px-6 py-3.5 font-serif uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-85 disabled:opacity-40"
              style={{ fontSize: '0.78rem' }}
            >
              {pending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

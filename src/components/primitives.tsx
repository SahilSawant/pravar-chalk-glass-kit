import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { initials as toInitials } from '../lib/format'

/* ───────────────────────────────────────────────────────────────────────────
 Primitives.

 Before this file the app had nine variants of the same primary button
 (bg-teal at px-3/px-3.5/px-4 × py-1.5/py-2/py-2.5 × five font sizes), the
 avatar circle written out in four places, and errors surfaced through
 window.alert(). None of that was a decision; it was drift.

 Everything here is sized from the named type and radius scales rather than
 arbitrary bracket values, so a change to the scale moves the whole product.
 ─────────────────────────────────────────────────────────────────────────── */

/* ── Button ──────────────────────────────────────────────────────────────── */

/** A button's fill and weight. */
export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger'
/** A button's height and padding step. */
export type ButtonSize = 'sm' | 'md' | 'lg'

/* --color-on-teal, not white. The primary fill is bottle on paper in light and
 bottle-300 in dark; a hardcoded white foreground measured ~1.4:1 on the dark
 one. The token flips with the fill and is documented in index.css for this
 exact purpose — the primitive simply was not using it.

 danger USED to say the same thing and get it wrong: the comment here claimed
 --color-danger does not flip, and index.css flips it to the lifted #d9756a.
 chalk-50 on that measures 2.91:1. It now takes --color-on-danger, which each
 theme owns against its own fill — paper on light, deep bottle on dark. */
const BUTTON_VARIANT: Record<ButtonVariant, string> = {
 primary: 'bg-accent text-on-accent hover:bg-accent-hover',
 secondary: 'bg-raised border border-hair-strong text-ink shadow-tile hover:border-accent',
 quiet: 'text-ink-muted hover:bg-sunken hover:text-ink',
 danger: 'destructive bg-danger text-on-danger hover:brightness-95',
}

const BUTTON_SIZE: Record<ButtonSize, string> = {
 sm: 'h-7 px-3 text-label',
 md: 'h-9 px-4 text-body-lg',
 lg: 'h-10 px-5 text-body-lg',
}

/** The one button — variant is fill and weight, size is height and padding. */
export function Button({
 variant = 'primary',
 size = 'md',
 loading = false,
 full = false,
 className = '',
 children,
 ...rest
}: {
 variant?: ButtonVariant
 size?: ButtonSize
 loading?: boolean
 full?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
 return (
 <button
 {...rest}
 disabled={rest.disabled || loading}
 aria-busy={loading || undefined}
 className={`inline-flex items-center justify-center gap-1.5 rounded-card font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
 BUTTON_VARIANT[variant]
 } ${BUTTON_SIZE[size]} ${full ? 'w-full' : ''} ${className}`}
 >
 {loading && <span className="animate-ring-spin h-3 w-3 rounded-full border-2 border-current border-t-transparent" />}
 {children}
 </button>
 )
}

/* ── Field ───────────────────────────────────────────────────────────────── */

/** A labelled form field with a hint or error line beneath its control. */
export function Field({
 label,
 hint,
 error,
 children,
}: {
 label?: string
 hint?: ReactNode
 error?: string | null
 children: ReactNode
}) {
 return (
 <label className="flex flex-col gap-1.5">
 {label && <span className="text-caption font-bold text-ink">{label}</span>}
 {children}
 {error ? (
 <span className="text-micro text-danger-ink">{error}</span>
 ) : (
 hint && <span className="text-micro text-ink-light">{hint}</span>
 )}
 </label>
 )
}

/* The focus ring comes from the global :focus-visible rule in index.css, so
 this must NOT set ` `. It used to, alongside `focus:border-teal`
 on an element that has no border utility at all — so the colour landed on a
 zero-width border and the app had no visible keyboard focus anywhere. */
/** Shared class string for a text input; pair with `Field`. */
export const inputClass =
 'w-full rounded-card border border-hair-strong bg-raised px-3.5 py-2.5 text-body text-ink shadow-tile transition-colors placeholder:text-ink-faint focus:border-accent'

/* ── Avatar ──────────────────────────────────────────────────────────────── */

const AVATAR_SIZE = {
 xs: 'h-6 w-6 font-mono text-[10px]',
 sm: 'h-8 w-8 text-micro',
 md: 'h-10 w-10 text-caption',
 lg: 'h-14 w-14 text-h4',
}

/** A circular initials mark for a person or account. */
export function Avatar({
 name,
 size = 'md',
 tone = 'quiet',
 initials,
}: {
 name: string | null | undefined
 size?: keyof typeof AVATAR_SIZE
 /* `quiet` is the design's default — pale accent tint, accent glyph. `solid`
 and `ink` are the filled variants. The tint is OPAQUE, not an alpha fill:
 an avatar sits on both --raised and --sunken rows, and an alpha would let
 the row colour through so the same avatar rendered two different colours. */
 tone?: 'quiet' | 'solid' | 'ink'
 initials?: string
}) {
 const TONE = {
 quiet: 'bg-accent-quiet text-accent',
 solid: 'bg-accent text-on-accent',
 ink: 'bg-ink text-on-ink',
 }
 return (
 <span
 className={`flex flex-shrink-0 items-center justify-center rounded-pill font-semibold ${AVATAR_SIZE[size]} ${TONE[tone]}`}
 aria-hidden="true"
 >
 {initials ?? (name ? toInitials(name) : '—')}
 </span>
 )
}

/* ── FilterChip ───────────────────────────────────────────────────────────
   A CONTROL, not a chip. `Chip`/`chipBase` are labels — 9.5px uppercase, no
   interaction. This is the toggle that changes what a list shows, and the
   design gives it one selected treatment everywhere: accent-quiet fill,
   accent text, no border, weight 600. Unselected is a bordered raised chip.

   It exists as a primitive because five surfaces had five answers to "what
   does selected look like" — two of them 8px apart in the same row. */
/** A togglable filter pill — the selected/unselected pair used across list filters. */
export function FilterChip({
  active,
  className = '',
  children,
  ...rest
}: { active: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      {...rest}
      className={`flex h-[26px] items-center gap-1.5 whitespace-nowrap rounded-chip px-[11px] text-body transition-colors ${
        active
          ? 'border border-transparent bg-accent-quiet font-semibold text-accent'
          : 'border border-hair-strong bg-raised font-normal text-ink-muted hover:text-ink'
      } ${className}`}
    >
      {children}
    </button>
  )
}

/* ── Chip ────────────────────────────────────────────────────────────────── */

/** A static label chip; pair its colour classes with `semantics.ts`'s `TONE`. */
export function Chip({ className = '', children }: { className?: string; children: ReactNode }) {
 return (
 <span className={`inline-flex items-center gap-1 rounded-chip px-2.5 py-0.5 text-micro font-semibold ${className}`}>
 {children}
 </span>
 )
}

/* ── Tabs ────────────────────────────────────────────────────────────────────
 There were two of these. This one, and a hand-rolled copy on the relationship
 hub that existed only because that bar is driven by ?tab= rather than local
 state — and which had drifted to a different active colour (teal, not ink)
 and a different count badge. Two tab bars in one product is two answers to
 "what does selected look like".

 The copy is gone. `onChange` is indifferent to where the caller keeps the
 value, so a search-param bar needs no new component; it needed the scroll
 behaviour the copy had and this one did not. */

/** A horizontal tab bar with optional per-tab counts; caller owns the active state. */
export function Tabs<T extends string>({
 tabs,
 active,
 onChange,
}: {
 tabs: { key: T; label: string; count?: number }[]
 active: T
 onChange: (key: T) => void
}) {
 return (
 <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-hair">
 {tabs.map((t) => {
 const on = t.key === active
 return (
 <button
 key={t.key}
 role="tab"
 aria-selected={on}
 onClick={() => onChange(t.key)}
 className={`-mb-px flex flex-shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-body font-semibold transition-colors ${
 on ? 'border-ink text-ink' : 'border-transparent text-ink-light hover:text-ink'
 }`}
 >
 {t.label}
 {t.count != null && t.count > 0 && (
 <span className={`rounded-chip px-1.5 text-micro ${on ? 'bg-ink text-on-ink' : 'bg-sunken text-ink-light'}`}>
 {t.count}
 </span>
 )}
 </button>
 )
 })}
 </div>
 )
}

/* ── Skeleton ────────────────────────────────────────────────────────────────
 Replaces the single global spinner for content that has a known shape: a
 list still looks like a list while it loads, so the page does not jump. */

/** A single pulsing placeholder bar. */
export function Skeleton({ className = 'h-4 w-full' }: { className?: string }) {
 return <div className={`animate-pulse-soft rounded bg-sunken ${className}`} aria-hidden="true" />
}

/** A stack of card-shaped skeleton rows, for loading a list. */
export function SkeletonRows({ rows = 4 }: { rows?: number }) {
 return (
 <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading">
 {Array.from({ length: rows }, (_, i) => (
 <div key={i} className="rounded-xl bg-raised p-4 shadow-lift">
 <Skeleton className="h-3.5 w-1/3" />
 <Skeleton className="mt-2 h-3 w-2/3" />
 </div>
 ))}
 </div>
 )
}

/* ── Tooltip ─────────────────────────────────────────────────────────────────
 CSS-only, so it cannot desync from React state. Focus-visible as well as
 hover, so it is reachable from the keyboard. */

/** A CSS-only tooltip, shown on hover and keyboard focus alike. */
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
 return (
 <span className="group/tt relative inline-flex">
 {children}
 <span
 role="tooltip"
 className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-micro font-medium text-on-ink opacity-0 transition-opacity group-hover/tt:opacity-100 group-focus-within/tt:opacity-100"
 >
 {label}
 </span>
 </span>
 )
}

/* ── Toast ───────────────────────────────────────────────────────────────────
 window.alert() blocks the page, cannot be styled, and in a demo it reads as
 a bug. A toast says what went wrong without stopping the room. */

type Toast = { id: number; message: string; tone: 'error' | 'success' }
const ToastCtx = createContext<(message: string, tone?: Toast['tone']) => void>(() => {})

/** Reach for this inside `ToastProvider` to push an error or success toast. */
export function useToast() {
 return useContext(ToastCtx)
}

/** Mounts the toast viewport and context; wrap the app once, near the root. */
export function ToastProvider({ children }: { children: ReactNode }) {
 const [toasts, setToasts] = useState<Toast[]>([])

 const push = useCallback((message: string, tone: Toast['tone'] = 'error') => {
 const id = Date.now() + Math.random()
 setToasts((t) => [...t, { id, message, tone }])
 setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000)
 }, [])

 const value = useMemo(() => push, [push])

 return (
 <ToastCtx.Provider value={value}>
 {children}
 {createPortal(
 <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex -translate-x-1/2 flex-col gap-2" role="status" aria-live="polite">
 {toasts.map((t) => (
 <div
 key={t.id}
 className={`animate-fade-in pointer-events-auto rounded-xl px-4 py-2.5 text-caption font-medium shadow-lift-lg ${
 t.tone === 'error' ? 'bg-danger text-on-danger' : 'bg-ink text-on-ink'
 }`}
 >
 {t.message}
 </div>
 ))}
 </div>,
 document.body,
 )}
 </ToastCtx.Provider>
 )
}

/* ── Table ───────────────────────────────────────────────────────────────────
 A wrapper rather than a data grid: the app's tables differ too much in
 content to abstract, but they should agree on density, the sticky header
 and figure alignment.

 `density` is the one knob. Compact fits a full book on one screen; that is
 what an advisor scanning sixteen relationships actually wants. */

type Density = 'comfortable' | 'compact' | 'dense'
const DensityCtx = createContext<Density>('comfortable')

/* Height, not padding. Padding makes row height a function of content, so a
 cell holding a 24px avatar and one holding bare text disagree. `height` on a
 td acts as a minimum, so a wrapping cell still grows. Values are the
 design's density scale: 40 / 32 / 26. */
/** Cell height class per density step — apply to each `td`. */
export const CELL_PAD: Record<Density, string> = {
 comfortable: 'h-10 px-4',
 compact: 'h-8 px-3',
 dense: 'h-[26px] px-2',
}

/** A table shell with a sticky opaque header and a density knob. */
export function Table({
 head,
 density = 'comfortable',
 children,
}: {
 head: ReactNode
 density?: Density
 children: ReactNode
}) {
 return (
 <DensityCtx.Provider value={density}>
 {/* `overflow-clip`, never `overflow-hidden` or `overflow-x-auto`. Both of
 those make this a scroll container on BOTH axes, so `position:sticky`
 on the thead resolves against a box with no vertical overflow and
 never fires. `clip` clips without creating a scroll container.

 The header is OPAQUE. It was `bg-cream/80 backdrop-blur`, a
 translucent blurred surface that scrolls over the AUM column — a
 figure showing through glass, which the design forbids outright. */}
 <div className="overflow-clip rounded-card border border-hair bg-raised shadow-card">
 <table className="w-full text-left text-body">
 <thead className="sticky top-0 z-10 bg-sunken">
 <tr className="h-9 border-b border-hair-strong font-mono text-[9.5px] uppercase tracking-[.1em] text-ink-muted">{head}</tr>
 </thead>
 <tbody>{children}</tbody>
 </table>
 </div>
 </DensityCtx.Provider>
 )
}

/** Reads the density set by the enclosing `Table`. */
export function useDensity() {
 return useContext(DensityCtx)
}

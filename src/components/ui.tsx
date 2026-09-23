import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** A ring spinner for content with no known shape yet. */
export function Spinner({ label }: { label?: string }) {
 return (
 <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-light">
 <div className="relative h-9 w-9">
 <div className="absolute inset-0 rounded-full border-[3px] border-hair" />
 <div className="animate-ring-spin absolute inset-0 rounded-full border-[3px] border-transparent border-t-teal" />
 </div>
 {label && <p className="text-caption">{label}</p>}
 </div>
 )
}

/* Errors say three things or they say nothing useful: what happened, why, and
 what to try next. "Couldn't load this data" alone leaves the advisor with no
 move — and in a demo, a dead end is worse than a visible failure.

 The cause is inferred from the message rather than invented: a fetch that
 never reached the backend is a different problem from a 403, and they have
 different next steps. */

function diagnose(message: string): { why: string; next: string } {
 const m = message.toLowerCase()
 if (m.includes('backend') || m.includes('failed to fetch') || m.includes('networkerror')) {
 return {
 why: 'The browser could not reach the Pravar engine.',
 next: 'Check that the backend is running, then try again.',
 }
 }
 if (m.includes('signed in as') || m.includes('403') || m.includes('forbidden')) {
 return {
 why: 'This surface belongs to a different desk.',
 next: 'Sign in with the role that owns it, or go back.',
 }
 }
 if (m.includes('not found') || m.includes('404')) {
 return {
 why: 'The record no longer exists, or was never created in this demo session.',
 next: 'Go back and pick it from the list, which always reflects the live data.',
 }
 }
 return {
 why: 'The engine rejected the request.',
 next: 'Try again. If it repeats, the detail above is what to report.',
 }
}

/** An error panel that names what happened, why, and what to try next. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
 const { why, next } = diagnose(message)
 return (
 <div role="alert" className="rounded-card bg-raised px-5 py-5 text-caption text-ink shadow-[inset_3px_0_0_var(--color-danger),var(--shadow-lift)]">
 <div className="text-body font-semibold text-danger-ink">Couldn't load this data</div>
 <dl className="mt-2.5 grid grid-cols-[64px_minmax(0,1fr)] gap-x-3.5 gap-y-1.5">
 <dt className="font-mono text-micro uppercase tracking-wider text-ink-light">What</dt>
 <dd className="m-0 text-ink-light">{message}</dd>
 <dt className="font-mono text-micro uppercase tracking-wider text-ink-light">Why</dt>
 <dd className="m-0 text-ink-light">{why}</dd>
 <dt className="font-mono text-micro uppercase tracking-wider text-ink-light">Next</dt>
 <dd className="m-0 text-ink-light">{next}</dd>
 </dl>
 {onRetry && (
 <button
 onClick={onRetry}
 className="mt-3.5 rounded-chip bg-teal px-4 py-2 text-caption font-semibold text-on-teal hover:bg-teal-dark"
 >
 Try again
 </button>
 )}
 </div>
 )
}

/** A blank-slate panel for a list or section with nothing in it yet. */
export function EmptyState({ glyph = '◌', title, blurb }: { glyph?: string; title: string; blurb?: string }) {
 return (
 <div className="rounded-card bg-raised px-6 py-12 text-center shadow-[inset_0_0_0_1px_var(--color-hair-strong)]">
 {/* accent-ink, not the bright accent: this glyph sits on paper, where
 lime-400 is decorative-only at 1.7:1. lime-800 carries at 5.38:1. */}
 <div className="mb-2 text-3xl text-ink-light">{glyph}</div>
 <div className="text-body font-bold text-ink">{title}</div>
 {blurb && <p className="mx-auto mt-1 max-w-sm text-caption leading-relaxed text-ink-light">{blurb}</p>}
 </div>
 )
}

/** A raised surface panel — the base container for most content blocks. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
 return <div className={`rounded-card bg-raised ${className} shadow-lift`}>{children}</div>
}

/** A page-level title block with an optional eyebrow, subtitle and actions. */
export function PageHeader({ eyebrow, title, subtitle, actions }: { eyebrow?: string; title: string; subtitle?: ReactNode; actions?: ReactNode }) {
 return (
 <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
 <div>
 {eyebrow && <p className="mb-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[.19em] text-ink-light">{eyebrow}</p>}
 <h1 className="text-h1 font-semibold leading-[1.08] tracking-[-.03em] text-ink">{title}</h1>
 {subtitle && <div className="mt-1 max-w-2xl text-body text-ink-light">{subtitle}</div>}
 </div>
 {actions && <div className="flex items-center gap-2">{actions}</div>}
 </div>
 )
}

/* Note: this duplicates `Chip` in primitives.tsx and differed from it only by
 radius — one meaning, two primitives. Squared to match; the merge itself is
 left for a pass that can touch every call site. */
/** A static label badge; near-identical to `Chip`, kept separate pending a merge. */
export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
 return (
 <span className={`inline-flex items-center gap-1 rounded-chip px-2.5 py-1 text-micro font-semibold ${className}`}>
 {children}
 </span>
 )
}

/* ───────────────────────────────────────────────────────────────────────────
 Overlays.

 Both surfaces below share one behaviour hook. They used to share only a
 keydown listener: no scroll lock, so the page scrolled behind the dialog; no
 focus management, so Tab walked out of the dialog into the page underneath
 and the trigger never got focus back; and no ARIA, so a screen reader was
 never told a dialog had opened at all.

 That was survivable while modals held small confirmations. The Ask thread and
 the agent-action drawer are primary flows, and a primary flow you can Tab out
 of without noticing is a bug, not a rough edge.
 ─────────────────────────────────────────────────────────────────────────── */

const FOCUSABLE =
 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function useOverlay(onClose: () => void) {
 const ref = useRef<HTMLDivElement>(null)

 useEffect(() => {
 const opener = document.activeElement as HTMLElement | null

 // Lock the page. Compensating for the scrollbar's width keeps the layout
 // from jumping sideways the moment the overlay opens.
 const { overflow, paddingRight } = document.body.style
 const gap = window.innerWidth - document.documentElement.clientWidth
 document.body.style.overflow = 'hidden'
 if (gap > 0) document.body.style.paddingRight = `${gap}px`

 // Focus the first thing worth focusing, falling back to the panel itself so
 // focus is never left behind on the page under the overlay.
 const first = ref.current?.querySelector<HTMLElement>(FOCUSABLE)
 ;(first ?? ref.current)?.focus()

 const onKey = (e: KeyboardEvent) => {
 if (e.key === 'Escape') {
 onClose()
 return
 }
 if (e.key !== 'Tab' || !ref.current) return
 const items = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
 (el) => el.offsetParent !== null,
 )
 if (items.length === 0) return
 const edge = e.shiftKey ? items[0] : items[items.length - 1]
 if (document.activeElement === edge || !ref.current.contains(document.activeElement)) {
 e.preventDefault()
 ;(e.shiftKey ? items[items.length - 1] : items[0]).focus()
 }
 }

 document.addEventListener('keydown', onKey)
 return () => {
 document.removeEventListener('keydown', onKey)
 document.body.style.overflow = overflow
 document.body.style.paddingRight = paddingRight
 opener?.focus?.()
 }
 }, [onClose])

 return ref
}

// A centered modal dialog. Closes on backdrop click and Escape. The caller owns
// the open/closed state and conditionally renders <Modal>…</Modal>.
/** A centered dialog, portalled to `body`; closes on backdrop click and Escape. */
export function Modal({ title, subtitle, onClose, children, width = 'max-w-md' }:
 { title?: string; subtitle?: ReactNode; onClose: () => void; children: ReactNode; width?: string }) {
 const ref = useOverlay(onClose)
 const titleId = useId()
 // Portal to <body> so a transformed/animated ancestor (e.g. animate-fade-in)
 // can't become the containing block for our fixed overlay and shove it off-screen.
 return createPortal(
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div className="absolute inset-0 bg-scrim backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
 <div
 ref={ref}
 role="dialog"
 aria-modal="true"
 aria-labelledby={title ? titleId : undefined}
 tabIndex={-1}
 className={`relative w-full ${width} animate-fade-in rounded-panel bg-raised p-6 shadow-2xl shadow-lift `}
 >
 {title && <h2 id={titleId} className="text-h3 font-semibold tracking-[-.02em] text-ink">{title}</h2>}
 {subtitle && <p className="mt-1 text-caption leading-relaxed text-ink-light">{subtitle}</p>}
 <div className={title ? 'mt-4' : ''}>{children}</div>
 </div>
 </div>,
 document.body,
 )
}

/* A right-hand drawer.

 Same contract as Modal — caller owns open state, closes on backdrop and
 Escape — but it enters from the edge rather than the middle. The distinction
 is not decorative: a modal interrupts to ask one question, a drawer opens a
 record for inspection beside the list it came from. Agent actions are the
 second kind, so the list stays visible and in place behind it. */

/** A right-edge drawer for inspecting a record beside the list it came from. */
export function Drawer({ eyebrow, title, subtitle, onClose, children, footer }: {
 eyebrow?: ReactNode
 title: string
 subtitle?: ReactNode
 onClose: () => void
 children: ReactNode
 footer?: ReactNode
}) {
 const ref = useOverlay(onClose)
 const titleId = useId()
 return createPortal(
 <div className="fixed inset-0 z-50 flex justify-end">
 <div className="absolute inset-0 bg-scrim backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
 <div
 ref={ref}
 role="dialog"
 aria-modal="true"
 aria-labelledby={titleId}
 tabIndex={-1}
 className="animate-slide-in relative flex h-full w-full max-w-[440px] flex-col bg-raised shadow-2xl "
 >
 <div className="flex items-start gap-3 border-b border-hair px-5 pb-4 pt-5">
 <div className="min-w-0 flex-1">
 {eyebrow && (
 <div className="font-mono text-[9.5px] font-semibold uppercase tracking-[.19em] text-ink-light">{eyebrow}</div>
 )}
 <h2 id={titleId} className="mt-1.5 text-lead font-semibold leading-tight tracking-[-.01em] text-ink">{title}</h2>
 {/* A div, not a p: callers pass chip rows and other block content,
 and a div inside a p is invalid nesting the browser silently
 unwraps — which then breaks the layout it was meant to carry. */}
 {subtitle && <div className="mt-1 text-label text-ink-light">{subtitle}</div>}
 </div>
 <button
 onClick={onClose}
 aria-label="Close"
 className="-mr-1.5 -mt-1 shrink-0 rounded-chip px-2 py-1 text-lead leading-none text-ink-light transition-colors hover:bg-sunken hover:text-ink"
 >
 ×
 </button>
 </div>
 <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
 {footer && <div className="border-t border-hair px-5 py-4">{footer}</div>}
 </div>
 </div>,
 document.body,
 )
}

// Minimal, dependency-free markdown renderer for narrative prose — supports
// ## headings, **bold**, and - bullet lists, so LLM output reads as formatted
// text instead of showing raw ** / ## symbols.
function renderInline(text: string): ReactNode[] {
 return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
 const bold = /^\*\*([^*]+)\*\*$/.exec(part)
 return bold ? <strong key={i} className="font-semibold text-ink">{bold[1]}</strong> : <span key={i}>{part}</span>
 })
}

/** A minimal, dependency-free markdown renderer for headings, bold and bullets. */
export function Markdown({ text, className = '' }: { text: string; className?: string }) {
 const lines = (text ?? '').replace(/\r/g, '').split('\n')
 const blocks: ReactNode[] = []
 let para: string[] = []
 let list: string[] = []
 const flushPara = () => {
 if (para.length) { blocks.push(<p key={blocks.length} className="mb-3 leading-relaxed last:mb-0">{renderInline(para.join(' '))}</p>); para = [] }
 }
 const flushList = () => {
 if (list.length) {
 blocks.push(<ul key={blocks.length} className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{list.map((li, i) => <li key={i}>{renderInline(li)}</li>)}</ul>)
 list = []
 }
 }
 for (const raw of lines) {
 const line = raw.trimEnd()
 const heading = /^(#{1,4})\s+(.*)$/.exec(line)
 const bullet = /^[-*]\s+(.*)$/.exec(line)
 if (heading) { flushPara(); flushList(); blocks.push(<h4 key={blocks.length} className="mb-1.5 mt-2 text-lead font-semibold text-ink first:mt-0">{renderInline(heading[2])}</h4>) }
 else if (bullet) { flushPara(); list.push(bullet[1]) }
 else if (line.trim() === '') { flushPara(); flushList() }
 else { flushList(); para.push(line) }
 }
 flushPara(); flushList()
 if (blocks.length === 0) return <div className={className} />
 return <div className={className}>{blocks}</div>
}

/** A labelled stat tile — label, value, optional hint and accent colour class. */
export function Stat({ label, value, hint, accent }: { label: string; value: ReactNode; hint?: ReactNode; accent?: string }) {
 return (
 <div className="rounded-card bg-raised p-5 shadow-lift">
 <div className="font-mono text-[9px] font-semibold uppercase tracking-[.09em] text-ink-light">{label}</div>
 <div className={`mt-2 text-[20px] font-semibold tabular-nums tracking-[-.03em] ${accent ?? 'text-ink'}`}>{value}</div>
 {hint && <div className="mt-1 text-label text-ink-light">{hint}</div>}
 </div>
 )
}

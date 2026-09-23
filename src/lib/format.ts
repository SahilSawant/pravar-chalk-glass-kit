/* Currency and dates for a US desk.

   ONE constant carries the locale-and-currency decision. The product was an INR
   mutual-fund desk and may be one again for another tenant, so the two facts
   that differ — the symbol and the scale words — sit here rather than being
   spelled out at each of the thirty-odd call sites. Change these three lines and
   the whole app moves currency. */
const CURRENCY_SYMBOL = '$'
const LOCALE = 'en-US'
/** Largest first. Anything above the threshold prints in that unit. */
const SCALE: [number, string][] = [
  [1e9, 'B'],
  [1e6, 'M'],
]

/** Renders a currency amount, optionally compacted to B/M/K. */
export function formatMoney(value: number | undefined | null, opts: { compact?: boolean } = {}): string {
  if (value === undefined || value === null) return '—'
  if (opts.compact) {
    for (const [size, suffix] of SCALE) {
      if (Math.abs(value) >= size) return `${CURRENCY_SYMBOL}${(value / size).toFixed(2)}${suffix}`
    }
    if (Math.abs(value) >= 1e3) return `${CURRENCY_SYMBOL}${Math.round(value / 1e3)}K`
  }
  return `${CURRENCY_SYMBOL}${value.toLocaleString(LOCALE, { maximumFractionDigits: 0 })}`
}

/** Renders an ISO date as a short human date, or an em dash when absent. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(LOCALE, { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Renders an ISO timestamp as a relative phrase ("3 hours ago"). */
export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diffMs = then - Date.now()
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const mins = Math.round(diffMs / 60_000)
  if (Math.abs(mins) < 1) return 'just now'
  if (Math.abs(mins) < 60) return rtf.format(mins, 'minute')
  const hours = Math.round(diffMs / 3_600_000)
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour')
  const days = Math.round(diffMs / 86_400_000)
  return rtf.format(days, 'day')
}

/** Tokens that are not part of a name: titles, and middle initials. */
const NOT_A_NAME = /^(dr|mr|mrs|ms|mx|prof|sir|jr|sr|[a-z])\.?$/i

/** Two-letter initials for an avatar — first and last token, titles dropped. */
export function initials(name: string): string {
  // First and LAST, not the first two words.
  //
  // Two seeded people break the naive rule and both are on screen constantly:
  // "Dr. Helen Voss" initialled "DH" — a title rendered as a given name — and
  // "Laura M. Bennett" initialled "LM", which is a first name and a middle
  // initial. Dropping titles and single-letter tokens first, then taking the
  // ends, gets both right and needs no special case for either.
  //
  // This used to route through the household name PARSER as well, because one
  // record was called "Meera & Sanjay Kapoor (HUF)" and produced "M&". A
  // household is a real group of individual records now; no single record names
  // two people, so there is nothing left to parse.
  const parts = name
    .replace(/\(.*?\)/g, '')
    .trim()
    .split(/\s+/)
    .filter((p) => p && !NOT_A_NAME.test(p))
  if (parts.length === 0) return '–'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Two-line stamp for the audit trail: the date a record was made, and the time
// it was made at. Backend timestamps are local-naive by convention, so no
// timezone shifting here.
/** Two-line date + time stamp for an audit trail. */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const date = d.toLocaleDateString(LOCALE, { month: 'short', day: 'numeric' })
  const time = d.toLocaleTimeString(LOCALE, { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${date}\n${time}`
}

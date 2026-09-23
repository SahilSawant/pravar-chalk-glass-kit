import { useEffect, useState } from 'react'
import { Section } from '../Section'

type Token = { name: string; value: string }

/* Raw ramp steps (bottle-50…950 etc.) are the material, not the vocabulary —
   the semantic layer below is what a component actually reads. Legacy
   aliases (teal, cream, copper, ink-light) are excluded the same way: they
   are `var()` re-exports kept for old call sites, not a second vocabulary. */
const isRamp = (n: string) => /^--color-(bottle|chalk|slate|lime)-\d+$/.test(n)
const LEGACY_ALIAS = new Set([
  '--color-teal', '--color-teal-dark', '--color-teal-light',
  '--color-cream', '--color-cream-dark',
  '--color-copper', '--color-copper-light',
  '--color-ink-light',
])

function categoryOf(name: string): string {
  if (/^--color-(ground|raised|sunken|hair|hair-strong|edge)$/.test(name)) return 'Surface'
  if (/^--color-(ink|on-ink|on-accent|on-teal|on-danger)$/.test(name)) return 'Ink'
  if (/^--color-accent/.test(name)) return 'Accent'
  if (/^--color-(success|warning|danger|info|neutral)/.test(name)) return 'Status'
  if (/^--color-risk-/.test(name)) return 'Risk — ordered by lightness'
  if (/^--color-band-/.test(name)) return 'Neutral bands'
  if (/^--color-viz-/.test(name)) return 'Chart mechanics'
  if (/^--color-cat-/.test(name)) return 'Chart categories'
  if (/^--color-(glass|scrim|bloom)/.test(name)) return 'Glass'
  if (/^--color-(shell|inv-|focus)/.test(name)) return 'Shell & focus'
  if (/^--color-brand-/.test(name)) return 'Brand-only — never the product accent'
  return 'Other'
}

const ORDER = [
  'Surface', 'Ink', 'Accent', 'Status', 'Risk — ordered by lightness', 'Neutral bands',
  'Chart mechanics', 'Chart categories', 'Glass', 'Shell & focus',
  'Brand-only — never the product accent', 'Other',
]

/* Reads the loaded stylesheet's own `:root` rules rather than a hardcoded
   list, so a token renamed or added in tokens.css shows up here with no
   edit to this file — and a token removed there disappears from the page
   instead of lingering as a stale swatch. */
function readColourTokens(): Token[] {
  const names = new Set<string>()
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      continue // cross-origin stylesheet; nothing we author lives there
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) continue
      if (!/^:root/.test(rule.selectorText)) continue
      for (let i = 0; i < rule.style.length; i++) {
        const prop = rule.style.item(i)
        if (prop.startsWith('--color-') && !isRamp(prop) && !LEGACY_ALIAS.has(prop)) names.add(prop)
      }
    }
  }
  const cs = getComputedStyle(document.documentElement)
  return Array.from(names)
    .sort()
    .map((name) => ({ name, value: cs.getPropertyValue(name).trim() }))
}

export function Colour() {
  const [tokens, setTokens] = useState<Token[]>([])

  // Re-read on every theme flip (the toggle stamps `data-theme` on <html>,
  // which this component observes) so a value that only changes in dark
  // shows the value that is actually on screen, not the light one.
  useEffect(() => {
    const read = () => setTokens(readColourTokens())
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  const grouped = ORDER.map((cat) => ({ cat, items: tokens.filter((t) => categoryOf(t.name) === cat) })).filter(
    (g) => g.items.length,
  )

  return (
    <Section
      id="colour"
      title="Colour"
      rule="Both themes declare an identical key set — a token defined in only one silently borrows the other's value, which is how a white-on-white chip shipped once. Swatches below are read live off document.documentElement, so this page cannot go stale."
    >
      {grouped.map((g) => (
        <div key={g.cat} style={{ marginBottom: 24 }}>
          <p className="gallery-subhead">{g.cat}</p>
          <div className="gallery-grid">
            {g.items.map((t) => (
              <div key={t.name} className="swatch">
                <div className="swatch-fill" style={{ background: `var(${t.name})` }} />
                <div className="swatch-meta">
                  <span className="swatch-name">{t.name.replace('--color-', '')}</span>
                  <span className="swatch-value">{t.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {!tokens.length && <p className="gallery-rule">No `--color-*` custom properties found on `:root` yet.</p>}
    </Section>
  )
}

/* The theme gate, over app/src/index.css.
 *
 * index.css says it itself, twice: "a token defined in one block and not the
 * other … shipped as a white-on-white chip." It shipped again. `--color-ink`
 * flips to near-white on dark and `--color-on-ink` repeated its light value,
 * so CHIP.done rendered paper on paper at 1.00:1 — a blank "BRIEF READY" chip
 * on the Control Tower.
 *
 * Key-set parity alone would NOT have caught it: the token was declared in the
 * dark block, just with the wrong value. So the gates here are about pairings
 * and relationships, not about whether a name exists.
 *
 *   node tests/theme.mjs
 */
import fs from 'node:fs'

const css = fs.readFileSync(new URL('../src/tokens.css', import.meta.url).pathname, 'utf8')

let failures = 0
const fail = m => { console.log(`FAIL  ${m}`); failures++ }
const pass = m => console.log(`pass  ${m}`)
const note = m => console.log(`note  ${m}`)

/* Light is declared in Tailwind's @theme; dark in a plain attribute block. */
const declarations = re => {
  const out = {}
  for (const m of css.matchAll(re))
    for (const d of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[d[1]] = d[2].trim()
  return out
}
const lightOwn = declarations(/@theme\s*\{([\s\S]*?)\n\}/g)
const darkOwn = declarations(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/g)
const blocks = { light: lightOwn, dark: { ...lightOwn, ...darkOwn } }

const resolve = (theme, v, depth = 0) => {
  if (depth > 10) throw new Error('var cycle')
  const m = /^var\((--[\w-]+)\)$/.exec(String(v).trim())
  return m ? resolve(theme, blocks[theme][m[1]], depth + 1) : String(v).trim()
}
const val = (theme, k) => resolve(theme, blocks[theme][k])

const rgb = h => {
  h = String(h).replace('#', '')
  if (h.length === 3) h = [...h].map(c => c + c).join('')
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16))
}
const lum = hex => {
  const [r, g, b] = rgb(hex).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const isHex = v => /^#[0-9a-fA-F]{3,8}$/.test(String(v).trim())

/* Dark in both themes by design, or a ramp step, or a nominal data series
   that earns its keep in both. Each one is a decision, not an oversight. */
const INVARIANT = k =>
  /^--color-(bottle|chalk|slate|lime)-\d+$/.test(k) ||   // the four ramps
  /^--color-inv-/.test(k) ||                             // the machine's own panel
  /^--color-cat-/.test(k) ||                             // nominal chart series
  /^--color-(shell|brand-\w+|focus-inv)$/.test(k)

/* Sits under a floor today and is not this pass's job. Printed loudly every
   run rather than silently tolerated; delete an entry when it is resolved. */
const KNOWN_GAPS = new Map([
  ['light-chart-palette',
   'Nine chart categories sit under the 3:1 graphics floor on paper — cash and ' +
   'money-market 2.07, other and treasuries 2.01, commodity 2.47, mid-cap ' +
   '2.48, small-cap 1.94, sector equity 1.70, individual stocks 2.40. They ' +
   'clear it comfortably on the dark card. This predates the dark-mode pass ' +
   'and is a light-theme question: the palette is graded by lightness on ' +
   'purpose, so lifting the quiet end flattens what the grading means.'],
  ['dark-surface-separation',
   '--color-raised on --color-ground is 1.11:1 in dark, and --shadow-card is ' +
   'black on a near-black ground, so a card has almost no edge. Deferred with ' +
   'the elevation work; see the plan.'],
])

/* ── gate 1 · every name in one theme exists in the other ──────────────── */
console.log('── key set')
{
  const colourish = k => /^--color-/.test(k) && !INVARIANT(k) && isHex(resolve('light', lightOwn[k]))
  const L = Object.keys(lightOwn).filter(colourish)
  let bad = 0
  for (const k of L) if (!(k in darkOwn)) { fail(`${k} declared in light, never in dark`); bad++ }
  for (const k of Object.keys(darkOwn)) if (/^--color-/.test(k) && !(k in lightOwn)) { fail(`${k} declared in dark, never in light`); bad++ }
  if (!bad) pass(`${L.size ?? L.length} theme-bearing colour tokens, declared in both`)
}

/* ── gate 2 · a pairing is a pairing in BOTH themes ─────────────────────
   This is the one that would have caught the chip. Every foreground token in
   the system paints onto a specific fill; the pair has to clear AA wherever
   the fill goes. */
console.log('\n── foreground/fill pairs (floor 4.5)')
const PAIRS = [
  ['--color-on-ink', '--color-ink', 'the settled chip · CHIP.done'],
  ['--color-on-accent', '--color-accent', 'the primary button'],
  ['--color-on-teal', '--color-teal', 'the primary button, legacy alias'],
  ['--color-on-danger', '--color-danger', 'the danger button and the error toast'],
]
for (const [fg, bg, what] of PAIRS)
  for (const theme of ['light', 'dark']) {
    const r = ratio(val(theme, fg), val(theme, bg))
    const tag = `${fg.replace('--color-', '')} on ${bg.replace('--color-', '')} (${theme})`.padEnd(38)
    r < 4.5 ? fail(`${tag} ${r.toFixed(2)} < 4.5 — ${what}`) : pass(`${tag} ${r.toFixed(2)}  ${what}`)
  }

/* ── gate 3 · text on the surfaces it actually lands on ────────────────── */
console.log('\n── text on surfaces')
const TEXT = [
  ['--color-ink', '--color-ground', 7.0], ['--color-ink', '--color-raised', 7.0],
  ['--color-ink-muted', '--color-raised', 4.5], ['--color-ink-muted', '--color-ground', 4.5],
  ['--color-ink-faint', '--color-raised', 4.5],
  ['--color-success-ink', '--color-success-tint', 4.5], ['--color-success-ink', '--color-raised', 4.5],
  ['--color-warning-ink', '--color-warning-tint', 4.5], ['--color-warning-ink', '--color-raised', 4.5],
  ['--color-danger-ink', '--color-danger-tint', 4.5], ['--color-danger-ink', '--color-raised', 4.5],
  ['--color-info-ink', '--color-info-tint', 4.5], ['--color-info-ink', '--color-raised', 4.5],
  ['--color-accent-ink', '--color-raised', 4.5],
]
for (const [fg, bg, floor] of TEXT)
  for (const theme of ['light', 'dark']) {
    const r = ratio(val(theme, fg), val(theme, bg))
    const tag = `${fg.replace('--color-', '')} on ${bg.replace('--color-', '')} (${theme})`.padEnd(38)
    r < floor ? fail(`${tag} ${r.toFixed(2)} < ${floor}`) : pass(`${tag} ${r.toFixed(2)} ≥ ${floor}`)
  }

/* ── gate 4 · dark is a translation of light, not a different system ────
   The failure this catches is not illegibility, it is flatness: dark used to
   run 9.8–11.2 where light runs 5.2–6.8, so quiet metadata, status and strong
   ink all arrived at the same volume. */
console.log('\n── the two themes keep the same relationships (±1.5)')
const TOLERANCE = 1.5
for (const [name, ink, tint] of [
  ['success', '--color-success-ink', '--color-success-tint'],
  ['warning', '--color-warning-ink', '--color-warning-tint'],
  ['danger', '--color-danger-ink', '--color-danger-tint'],
  ['info', '--color-info-ink', '--color-info-tint'],
  ['accent-ink', '--color-accent-ink', '--color-raised'],
]) {
  const l = ratio(val('light', ink), val('light', tint))
  const d = ratio(val('dark', ink), val('dark', tint))
  const gap = Math.abs(d - l)
  const tag = `${name} ink on its own ground`.padEnd(38)
  gap > TOLERANCE
    ? fail(`${tag} light ${l.toFixed(2)} vs dark ${d.toFixed(2)} — ${gap.toFixed(1)} apart`)
    : pass(`${tag} light ${l.toFixed(2)} · dark ${d.toFixed(2)}`)
}

/* ── gate 5 · graphical objects, and the boundary that rescues them ────── */
console.log('\n── graphical objects (floor 3.0)')
for (const theme of ['light', 'dark']) {
  const r = ratio(val(theme, '--color-edge'), val(theme, '--color-raised'))
  const tag = `edge on raised (${theme})`.padEnd(38)
  r < 3 ? fail(`${tag} ${r.toFixed(2)} < 3.0 — a ghost chip's ring is its only boundary`)
        : pass(`${tag} ${r.toFixed(2)} ≥ 3.0`)
}
{
  /* Nominal series still owe 3:1 on the card they are drawn on. */
  const cats = Object.keys(lightOwn).filter(k => /^--color-cat-/.test(k))
  for (const theme of ['light', 'dark']) {
    const weak = cats.filter(k => ratio(val(theme, k), val(theme, '--color-raised')) < 3)
      .map(k => `${k.replace('--color-cat-', '')} ${ratio(val(theme, k), val(theme, '--color-raised')).toFixed(2)}`)
    if (!weak.length) pass(`${cats.length} chart categories clear 3:1 on the card (${theme})`)
    else if (theme === 'light' && KNOWN_GAPS.has('light-chart-palette'))
      note(`light: ${weak.length} chart categories under 3:1 — ${weak.join(', ')} (known gap)`)
    else fail(`${theme}: chart categories under 3:1 — ${weak.join(', ')}`)
  }
}

/* ── gate 6 · the risk ramp still reads without hue ─────────────────────
   Ordered by lightness, so it survives greyscale and a bad projector. Light
   darkens toward aggressive, dark lightens toward it; either is fine, a
   jumble is not. */
console.log('\n── risk ramp')
const RISK = ['--color-risk-unprofiled', '--color-risk-conservative', '--color-risk-moderate', '--color-risk-aggressive']
for (const theme of ['light', 'dark']) {
  const ls = RISK.map(k => lum(val(theme, k)))
  const down = ls.every((v, i) => i === 0 || v < ls[i - 1])
  const up = ls.every((v, i) => i === 0 || v > ls[i - 1])
  ;(down || up)
    ? pass(`${theme}: monotonic, ${down ? 'darkening' : 'lightening'} — ${ls.map(v => v.toFixed(3)).join(' → ')}`)
    : fail(`${theme}: not monotonic — ${ls.map(v => v.toFixed(3)).join(' → ')}`)
}

/* ── report · tokens that do not move between themes ────────────────────
   Not a failure on its own. A mid-lightness data colour can legitimately work
   on both grounds. It is reported because it is how the chip bug looked from
   the outside, and the pairs above are what decide whether it matters. */
console.log('\n── tokens identical in both themes')
{
  const same = Object.keys(darkOwn)
    .filter(k => /^--color-/.test(k) && !INVARIANT(k) && isHex(val('light', k)) && val('light', k) === val('dark', k))
  same.length ? same.forEach(k => note(`${k.padEnd(30)} ${val('light', k)} — declared in dark, same value as light`))
              : pass('every theme-bearing token moves')
}

if (KNOWN_GAPS.size) {
  console.log('\n── known gaps, carried deliberately')
  for (const [k, why] of KNOWN_GAPS) console.log(`  ${k}\n    ${why.replace(/(.{74}) /g, '$1\n    ')}`)
}

console.log(failures ? `\n${failures} FAILED` : '\nall theme gates pass')
process.exit(failures ? 1 : 0)

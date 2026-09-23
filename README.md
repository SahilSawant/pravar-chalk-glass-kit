# Pravar Chalk · Glass

This is the design system for the Pravar AI Wealth Intelligence Portal's
Relationship Manager flow. It ships as tokens plus React components — colours,
type, spacing and elevation as CSS custom properties, and the primitives built
on top of them. Both themes, light and dark, are complete from day one.

## Install and use

```
npm i @pravar/chalk-glass
```

```tsx
import '@pravar/chalk-glass/tokens.css'
import { Card, Button } from '@pravar/chalk-glass'

function Example() {
  return (
    <Card className="p-5">
      <p>Equity is 2.4pp beyond the target band.</p>
      <Button variant="primary">Review</Button>
    </Card>
  )
}
```

`tokens.css` has to be imported once, near the root — it defines every custom
property the components read. Nothing in this package inlines a colour, so a
component with no tokens loaded renders with no colours at all, not the wrong
ones.

## Theming

Every themeable value is a CSS custom property, declared once for light on
`:root` and again for dark on `:root[data-theme="dark"]`. Stamp `data-theme`
to `"light"` or `"dark"` on `<html>` and the whole tree repaints — there is no
per-component theme prop.

There are three states a user can choose — light, dark, or "match the OS" —
but only two values ever land on the attribute. `system` is resolved in
JavaScript, once, at the moment it is applied:

```ts
const isDark = theme === 'system'
  ? window.matchMedia('(prefers-color-scheme: dark)').matches
  : theme === 'dark'
document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
```

This is deliberate, not a shortcut. The alternative — leaving `data-theme`
unset for "system" and letting a `prefers-color-scheme` media query pick the
dark values — means every dark declaration in `tokens.css` has to exist twice:
once under `[data-theme="dark"]` for a user who chose dark explicitly, and
once inside the media query for a user on "system" whose OS is dark. That is
how a token gets defined in one of the two places and not the other, and it
has shipped a white-on-white chip before. Resolving `system` in JS means
`tokens.css` needs exactly one dark selector, so there is only one place for a
token to go missing from, and the theme-parity test below can actually catch
it.

## The rules that will bite you

These come straight out of `design-authority.md`. They are not style
preferences — each one exists because breaking it shipped a visible bug once.

- Body text is 13px. There is no smaller "default" size hiding in a
  component.
- Every figure — money, percentages, counts, dates — is JetBrains Mono,
  right-aligned, and tabular. A number set in Archivo is a bug, not a style
  choice.
- A number never sits on a translucent surface. Glass is for chrome and prose
  only; anything with a figure sits on `--raised`, solid.
- Status colour means state, and it never doubles as a chart series colour. A
  "churned" chip and an equity slice must never share a hue.
- A dash is not a zero. A zero is a fact; a dash is an absence, and every dash
  carries a stated reason.
- Errors are three stanzas: WHAT happened, WHY, and NEXT — what to try. Never
  the server's own words, and never an environment variable name.
- No hex literal in a component. Every colour is a token reference.
- No new button, avatar or chip variant outside the primitive set. A fifth
  button colour is a call site that needed a composition, not a new
  primitive.
- Density is a table-level decision, never per-row, and at most two levels on
  one screen.
- Risk is ordered by lightness, never re-mapped onto red/amber/green. It has
  to survive greyscale and a bad projector.

## Contrast is measured, not claimed

```
node tests/theme.mjs
```

This runs in CI and gates the token layer directly — not a screenshot, the
actual declared values. It guarantees:

- both themes declare an identical set of colour-bearing tokens;
- the pairings a component actually uses (chip ink on its fill, button text on
  its fill, body and caption ink on both grounds, status ink on its own tint)
  clear their AA floor in both themes;
- dark is a translation of light's contrast relationships, not a flatter or
  louder copy of them — the same ink keeps roughly the same distance from its
  own ground in both themes;
- graphical objects (hairlines, chart categories, the risk ramp) clear the
  3:1 floor for non-text contrast, and the risk ramp stays monotonic by
  lightness in both themes.

It does not guarantee every colour pairing anyone could construct clears a
floor — only the ones above. Two gaps are known, deliberate, and printed by
the test itself every time it runs, in its own `KNOWN_GAPS`:

- **Nine chart categories sit under the 3:1 graphics floor on the light
  theme** — cash and money-market at 2.07, other and treasuries at 2.01,
  commodity at 2.47, mid-cap at 2.48, small-cap at 1.94, sector equity at
  1.70, individual stocks at 2.40. They clear 3:1 comfortably on the dark
  card. The palette is graded by lightness on purpose, so lifting the quiet
  end of it to pass the floor would flatten the grading it exists to carry.
  This is a light-theme question, not a dark-mode regression.
- **In dark, `--color-raised` on `--color-ground` measures 1.11:1**, and
  `--shadow-card` is a near-black shadow on a near-black ground, so a card has
  almost no visible edge in dark mode. This is deferred alongside the
  elevation work.

Neither gap is hidden. If you see a flat-looking card in dark mode or a faint
chart category swatch on paper, this is why, and the test tells you the exact
number every time you run it.

## Running the gallery locally

```
npm i
npx vite --config docs/vite.config.ts
```

or, to produce a static build:

```
npx vite build --config docs/vite.config.ts
```

The gallery lives under `docs/` and imports the kit from `../src` the same
way a consumer imports the published package. It renders every component —
colour tokens read live off `document.documentElement` so the page cannot go
stale, type, buttons, chips and status, cards, forms, a table at all three
densities, charts, and the feedback set (toasts, modals, empty and error
states) — with a light/dark toggle, so a change to a token or a component
shows up in one place without wiring up the full product.

## Licence

MIT. See `LICENSE`.

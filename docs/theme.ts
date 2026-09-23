export type Theme = 'light' | 'dark' | 'system'

const KEY = 'chalk-glass-gallery-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

/* Same mechanism as the product's app/src/lib/theme.ts: three stored states,
   but ONE stamped value. `system` is resolved here, in JS, rather than by a
   `prefers-color-scheme` media query, so tokens.css needs exactly one dark
   selector instead of that block duplicated under a media query — which is
   the split that shipped a token defined in one and not the other. */

export function readTheme(): Theme {
  const v = localStorage.getItem(KEY)
  return v === 'light' || v === 'dark' ? v : 'system'
}

/** Light-first is the brand's position, so that is what "system" falls back
 *  to when the OS expresses no preference. */
export function resolvedTheme(t: Theme): 'light' | 'dark' {
  if (t !== 'system') return t
  return window.matchMedia?.(DARK_QUERY).matches ? 'dark' : 'light'
}

export function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', resolvedTheme(t))
  localStorage.setItem(KEY, t)
  syncMetaThemeColor()
}

/* --color-shell is the sidebar token and is dark in both themes by design —
   the one colour this gallery's own chrome borrows from the product shell. */
function syncMetaThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]')
  if (!meta) return
  const ground = getComputedStyle(document.documentElement).getPropertyValue('--color-ground').trim()
  if (ground) meta.setAttribute('content', ground)
}

/** Re-stamps on an OS-level flip while the user is on "system", and tells the
 *  toggle to repaint its own active state. Returns an unsubscribe. */
export function watchSystemTheme(onChange: () => void): () => void {
  const mq = window.matchMedia?.(DARK_QUERY)
  if (!mq) return () => {}
  const handler = () => {
    if (readTheme() === 'system') applyTheme('system')
    onChange()
  }
  mq.addEventListener('change', handler)
  return () => mq.removeEventListener('change', handler)
}

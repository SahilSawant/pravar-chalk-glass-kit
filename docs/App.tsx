import { useEffect, useState } from 'react'
import { ToastProvider } from '../src'
import { applyTheme, readTheme, watchSystemTheme, type Theme } from './theme'
import { Colour } from './sections/Colour'
import { Type } from './sections/Type'
import { Buttons } from './sections/Buttons'
import { ChipsStatus } from './sections/ChipsStatus'
import { CardsSurfaces } from './sections/CardsSurfaces'
import { Forms } from './sections/Forms'
import { TableSection } from './sections/TableSection'
import { Charts } from './sections/Charts'
import { Feedback } from './sections/Feedback'

const THEMES: Theme[] = ['light', 'dark', 'system']

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(readTheme)
  const [, force] = useState(0)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => watchSystemTheme(() => force((n) => n + 1)), [])

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {THEMES.map((t) => (
        <button key={t} type="button" aria-pressed={t === theme} onClick={() => setTheme(t)}>
          {t}
        </button>
      ))}
    </div>
  )
}

export function App() {
  return (
    <ToastProvider>
      <header className="gallery-header">
        <div>
          <h1>Pravar Chalk · Glass</h1>
          <p>Tokens and components for the RM flow — every state, both themes, one screen.</p>
        </div>
        <ThemeToggle />
      </header>
      <main className="gallery-page">
        <Colour />
        <Type />
        <Buttons />
        <ChipsStatus />
        <CardsSurfaces />
        <Forms />
        <TableSection />
        <Charts />
        <Feedback />
      </main>
    </ToastProvider>
  )
}

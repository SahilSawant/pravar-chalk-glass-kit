import type { ReactNode } from 'react'

/** One gallery section: a title, the rule that governs it, and the demo. */
export function Section({ id, title, rule, children }: { id: string; title: string; rule: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="gallery-section">
      <h2>{title}</h2>
      <p className="gallery-rule">{rule}</p>
      {children}
    </section>
  )
}

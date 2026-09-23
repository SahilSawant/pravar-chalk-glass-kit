import { useState, type ReactNode } from 'react'

/** A trigger-button popover; caller renders the trigger glyph and the panel content. */
export function Dropdown({
  trigger,
  children,
  align = 'right',
  panelClassName = '',
}: {
  trigger: (open: boolean) => ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  panelClassName?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
          open ? 'bg-teal/10 text-teal' : 'text-ink-light hover:bg-cream hover:text-ink'
        }`}
      >
        {trigger(open)}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={`absolute top-11 z-20 w-72 rounded-xl bg-raised py-2 shadow-lg ${
              align === 'right' ? 'right-0' : 'left-0'
            } ${panelClassName} shadow-lift`}
          >
            {children}
          </div>
        </>
      )}
    </div>
  )
}

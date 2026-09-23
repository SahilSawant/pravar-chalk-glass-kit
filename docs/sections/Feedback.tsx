import { useState } from 'react'
import { Button, EmptyState, ErrorState, Markdown, Modal, Drawer, useToast } from '../../src'
import { Section } from '../Section'

const NOTE = `## Investment lens

The equity sleeve is **2.4pp** beyond the target band.

- One rebalancing action is proposed
- Tax lot review is recommended before executing`

function ToastDemo() {
  const push = useToast()
  return (
    <div className="gallery-row">
      <Button variant="secondary" onClick={() => push('Saved.', 'success')}>
        Fire a success toast
      </Button>
      <Button variant="danger" onClick={() => push('Could not save — the model timed out.', 'error')}>
        Fire an error toast
      </Button>
    </div>
  )
}

export function Feedback() {
  const [modal, setModal] = useState(false)
  const [drawer, setDrawer] = useState(false)

  return (
    <Section
      id="feedback"
      title="Feedback"
      rule="Errors are three stanzas — WHAT, WHY, NEXT — never the server's own words. A dash is not a zero: an empty state says why nothing is there, and a toast carries Undo instead of asking window.confirm()."
    >
      <p className="gallery-subhead">Toasts</p>
      <ToastDemo />

      <p className="gallery-subhead" style={{ marginTop: 24 }}>Modal and drawer</p>
      <div className="gallery-row" style={{ marginBottom: 24 }}>
        <Button variant="secondary" onClick={() => setModal(true)}>Open modal</Button>
        <Button variant="secondary" onClick={() => setDrawer(true)}>Open drawer</Button>
      </div>
      {modal && (
        <Modal title="Remove from book?" subtitle="This relationship stays on file; it leaves your active book." onClose={() => setModal(false)}>
          <div className="gallery-row">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setModal(false)}>Remove</Button>
          </div>
        </Modal>
      )}
      {drawer && (
        <Drawer eyebrow="Relationships · Karan Malhotra" title="Investment lens" onClose={() => setDrawer(false)}>
          <div style={{ padding: 20 }}>
            <Markdown text={NOTE} />
          </div>
        </Drawer>
      )}

      <p className="gallery-subhead" style={{ marginTop: 24 }}>Empty and error states</p>
      <div className="gallery-grid">
        <EmptyState title="No relationships on your book" blurb="Clients are mapped to you by an administrator. Nothing has been mapped to this login yet." />
        <ErrorState message="Failed to fetch: could not reach the Pravar engine" onRetry={() => {}} />
      </div>
    </Section>
  )
}

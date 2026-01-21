import type { ReactNode } from 'react'

type DrawerProps = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  busy?: boolean
}

const Drawer = ({ open, title, onClose, children, footer, busy = false }: DrawerProps) => {
  return (
    <div className={`drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <button
        className="drawer__overlay"
        type="button"
        onClick={onClose}
        aria-label="Close drawer"
        disabled={busy}
      />
      <aside className={`drawer__panel${busy ? ' is-busy' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="drawer__header">
          <h3>{title}</h3>
          <button className="link-button" type="button" onClick={onClose} disabled={busy}>
            Close
          </button>
        </div>
        <div className="drawer__body">{children}</div>
        {footer ? <div className="drawer__footer">{footer}</div> : null}
        {busy ? (
          <div className="drawer__busy" aria-live="polite">
            <span className="inline-spinner" aria-hidden="true" />
            <span>Saving…</span>
          </div>
        ) : null}
      </aside>
    </div>
  )
}

export default Drawer

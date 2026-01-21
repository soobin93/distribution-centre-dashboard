import Badge from '@/features/ui/badge/Badge.component'
import Spinner from '@/features/ui/spinner/Spinner.component'
import { useApprovals } from '@/api/queries'

const statusTone = (status: string) => {
  if (status === 'approved') return 'success'
  if (status === 'pending') return 'warning'
  return 'danger'
}

const Approvals = () => {
  const { data: items = [], isLoading: loading, isError } = useApprovals()

  if (loading) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Approvals Workflow</h1>
            <p className="page__subtitle">Loading approvals.</p>
          </div>
        </div>
        <Spinner label="Loading approvals" />
      </section>
    )
  }

  if (isError) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Approvals Workflow</h1>
            <p className="page__subtitle">Approval data could not be loaded.</p>
          </div>
        </div>
        <div className="notice">Please try again shortly.</div>
      </section>
    )
  }

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Approvals Workflow</h1>
          <p className="page__subtitle">
            Pending and completed approvals across all project entities.
          </p>
        </div>
      </div>

      <div className="table">
        <div className="table__header">
          <span>Entity</span>
          <span>Requested By</span>
          <span>Requested</span>
          <span>Reviewed</span>
          <span>Status</span>
          <span>Decision</span>
        </div>
        {items.map((approval) => (
          <div className="table__row" key={approval.id}>
            <div>
              <strong>{approval.entity_type}</strong>
              <div className="subtle">{approval.entity_id}</div>
            </div>
            <span>{approval.requested_by}</span>
            <span>{approval.requested_at.split('T')[0]}</span>
            <span>{approval.reviewed_at?.split('T')[0] ?? '—'}</span>
            <Badge label={approval.status} tone={statusTone(approval.status)} />
            <span className="subtle">{approval.decision_note}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Approvals

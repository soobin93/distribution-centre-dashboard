import Badge from '../../components/Badge'
import { activityLogs } from './mock'

const actionTone = (action: string) => {
  if (action === 'approve') return 'success'
  if (action === 'reject') return 'danger'
  if (action === 'submit') return 'info'
  return 'neutral'
}

const ActivityPage = () => {
  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Activity & Audit Log</h1>
          <p className="page__subtitle">
            Recent changes recorded for traceability and governance.
          </p>
        </div>
      </div>

      <div className="activity">
        {activityLogs.map((log) => (
          <div className="activity__item" key={log.id}>
            <div className="activity__time">{log.created_at.split('T')[0]}</div>
            <div className="activity__content">
              <div className="activity__header">
                <div>
                  <strong>{log.actor}</strong> {log.action} {log.entity_type}
                </div>
                <Badge label={log.action} tone={actionTone(log.action)} />
              </div>
              <div className="subtle">Entity: {log.entity_id}</div>
              <div className="activity__meta">
                {Object.entries(log.metadata).map(([key, value]) => (
                  <span key={key}>
                    {key}: {value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ActivityPage

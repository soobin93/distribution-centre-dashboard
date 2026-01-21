import Badge from '@/features/ui/badge/Badge.component'
import Spinner from '@/features/ui/spinner/Spinner.component'
import { useMilestones } from '@/api/queries'

const statusTone = (status: string) => {
  if (status === 'done') return 'success'
  if (status === 'at_risk') return 'danger'
  if (status === 'in_progress') return 'info'
  return 'neutral'
}

const Milestones = () => {
  const { data: items = [], isLoading: loading, isError } = useMilestones()

  if (loading) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Timeline & Milestones</h1>
            <p className="page__subtitle">Loading milestone data.</p>
          </div>
        </div>
        <Spinner label="Loading milestones" />
      </section>
    )
  }

  if (isError) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Timeline & Milestones</h1>
            <p className="page__subtitle">Milestone data could not be loaded.</p>
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
          <h1>Timeline & Milestones</h1>
          <p className="page__subtitle">
            Planned vs actual dates with completion visibility.
          </p>
        </div>
      </div>

      <div className="timeline">
        {items.map((milestone) => (
          <div className="timeline__item" key={milestone.id}>
            <div className="timeline__marker" />
            <div className="timeline__content">
              <div className="timeline__header">
                <div>
                  <h3>{milestone.name}</h3>
                  <p className="subtle">{milestone.description}</p>
                </div>
                <Badge label={milestone.status.replace('_', ' ')} tone={statusTone(milestone.status)} />
              </div>
              <div className="timeline__meta">
                <span>Planned: {milestone.planned_date}</span>
                <span>Actual: {milestone.actual_date ?? '—'}</span>
                <span>Complete: {milestone.percent_complete}%</span>
              </div>
              <div className="progress">
                <div className="progress__bar" style={{ width: `${milestone.percent_complete}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Milestones

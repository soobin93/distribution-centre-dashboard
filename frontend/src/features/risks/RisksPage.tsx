import Badge from '@/components/Badge'
import Spinner from '@/components/Spinner'
import { useRisks } from '@/api/queries'

const ratingTone = (rating: number) => {
  if (rating >= 16) return 'danger'
  if (rating >= 10) return 'warning'
  return 'success'
}

const RisksPage = () => {
  const { data: items = [], isLoading: loading, isError } = useRisks()

  if (loading) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Risk Register</h1>
            <p className="page__subtitle">Loading risk data.</p>
          </div>
        </div>
        <Spinner label="Loading risks" />
      </section>
    )
  }

  if (isError) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Risk Register</h1>
            <p className="page__subtitle">Risk data could not be loaded.</p>
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
          <h1>Risk Register</h1>
          <p className="page__subtitle">
            Likelihood, impact, owner, and mitigation across both projects.
          </p>
        </div>
      </div>

      <div className="table">
        <div className="table__header">
          <span>Risk</span>
          <span>Category</span>
          <span>Rating</span>
          <span>Owner</span>
          <span>Status</span>
          <span>Mitigation</span>
        </div>
        {items.map((risk) => (
          <div className="table__row" key={risk.id}>
            <div>
              <strong>{risk.title}</strong>
              <div className="subtle">{risk.description}</div>
            </div>
            <span>{risk.category}</span>
            <Badge label={`${risk.rating}`} tone={ratingTone(risk.rating)} />
            <span>{risk.owner}</span>
            <Badge label={risk.status} tone={risk.status === 'closed' ? 'success' : 'warning'} />
            <span className="subtle">{risk.mitigation_plan}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RisksPage

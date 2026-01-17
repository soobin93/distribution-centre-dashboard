import Badge from '../../components/Badge'
import { budgetItems } from './mock'

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)

const statusTone = (status: string) => {
  if (status === 'on_track') return 'success'
  if (status === 'at_risk') return 'warning'
  return 'danger'
}

const BudgetsPage = () => {
  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Budget Tracking</h1>
          <p className="page__subtitle">
            Original budget, approved variations, forecast and actuals by category.
          </p>
        </div>
      </div>

      <div className="table">
        <div className="table__header">
          <span>Category</span>
          <span>Original</span>
          <span>Variations</span>
          <span>Forecast</span>
          <span>Actual</span>
          <span>Status</span>
        </div>
        {budgetItems.map((item) => (
          <div className="table__row" key={item.id}>
            <div>
              <strong>{item.category}</strong>
              <div className="subtle">{item.description}</div>
            </div>
            <span>{formatCurrency(item.original_budget, item.currency)}</span>
            <span>{formatCurrency(item.approved_variations, item.currency)}</span>
            <span>{formatCurrency(item.forecast_cost, item.currency)}</span>
            <span>{formatCurrency(item.actual_spent, item.currency)}</span>
            <Badge label={item.status.replace('_', ' ')} tone={statusTone(item.status)} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default BudgetsPage

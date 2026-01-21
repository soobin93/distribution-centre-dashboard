import '@/features/ui/stat-card/StatCard.component.css'

type StatCardProps = {
  label: string
  value: string
  helper?: string
}

const StatCard = ({ label, value, helper }: StatCardProps) => {
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      {helper ? <div className="stat-card__helper">{helper}</div> : null}
    </div>
  )
}

export default StatCard

import './Badge.css'

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

type BadgeProps = {
  label: string
  tone?: BadgeTone
}

const Badge = ({ label, tone = 'neutral' }: BadgeProps) => {
  return <span className={`badge badge--${tone}`}>{label}</span>
}

export default Badge

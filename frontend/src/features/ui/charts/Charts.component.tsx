import '@/features/ui/charts/Charts.component.css'

type DonutChartProps = {
  value: number
  total: number
  size?: number
  strokeWidth?: number
  label?: string
}

export const DonutChart = ({
  value,
  total,
  size = 140,
  strokeWidth = 16,
  label,
}: DonutChartProps) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const safeTotal = total > 0 ? total : 1
  const progress = Math.min(Math.max(value / safeTotal, 0), 1)
  const dash = circumference * progress

  return (
    <div className="donut">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={label}>
        <circle
          className="donut__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="donut__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="donut__label">
        <strong>{Math.round(progress * 100)}%</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

type BarChartItem = {
  label: string
  value: number
  color: string
}

type BarChartProps = {
  items: BarChartItem[]
}

export const BarChart = ({ items }: BarChartProps) => {
  const max = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="bar-chart">
      {items.map((item) => (
        <div className="bar" key={item.label}>
          <div className="bar__label">{item.label}</div>
          <div className="bar__track">
            <div
              className="bar__fill"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color }}
            />
          </div>
          <div className="bar__value">{item.value.toLocaleString('en-AU')}</div>
        </div>
      ))}
    </div>
  )
}

type SkeletonProps = {
  className?: string
}

export const SkeletonLine = ({ className = '' }: SkeletonProps) => (
  <span className={`skeleton skeleton-line ${className}`.trim()} />
)

export const SkeletonPill = ({ className = '' }: SkeletonProps) => (
  <span className={`skeleton skeleton-pill ${className}`.trim()} />
)

export const SkeletonCard = ({ className = '' }: SkeletonProps) => (
  <div className={`card card--light skeleton-card ${className}`.trim()} />
)

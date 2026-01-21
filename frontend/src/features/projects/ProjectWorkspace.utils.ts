export const formatCurrency = (value: number | string, currency: string) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value))

export const budgetStatusTone = (status: string) => {
  if (status === 'on_track') return 'success'
  if (status === 'at_risk') return 'warning'
  return 'danger'
}

export const milestoneTone = (status: string) => {
  if (status === 'done') return 'success'
  if (status === 'in_progress') return 'info'
  return 'warning'
}

export const rfiTone = (status: string) => {
  if (status === 'answered') return 'success'
  if (status === 'open') return 'warning'
  return 'neutral'
}

export const approvalTone = (status: string) => {
  if (status === 'approved') return 'success'
  if (status === 'pending') return 'warning'
  return 'danger'
}

export const mediaTone = (type: string) => {
  if (type === 'camera_feed') return 'info'
  if (type === 'photo') return 'success'
  return 'neutral'
}

export const formatDate = (value?: string | null) => {
  if (!value) return '—'
  if (!value.includes('T')) return value
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const pad = (input: number) => String(input).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const formatDateTime = (value?: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const pad = (input: number) => String(input).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

export const resolveProjectId = (item: { project_id?: string; project?: string }) =>
  item.project_id ?? item.project ?? ''

export const toDateInput = (value?: string | null) => (value ? formatDate(value) : '')

export const toDateTimeInput = (value?: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (input: number) => String(input).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

export const toDateTimePayload = (value: string) => (value ? new Date(value).toISOString() : null)

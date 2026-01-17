export type Milestone = {
  id: string
  project_id: string
  name: string
  description: string
  planned_date: string
  actual_date: string | null
  status: 'not_started' | 'in_progress' | 'done' | 'at_risk'
  percent_complete: number
  created_at: string
  updated_at: string
}

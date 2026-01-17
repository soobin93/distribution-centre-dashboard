export type ProjectStatus = 'planned' | 'active' | 'on_hold' | 'complete'

export type Project = {
  id: string
  name: string
  location: string
  status: ProjectStatus
  start_date: string
  end_date: string
  description: string
  program_name: string
  phase?: string
  created_at: string
  updated_at: string
}

export type ProgramSummary = {
  total_original_budget: number
  total_variations: number
  total_forecast_cost: number
  total_actual_spend: number
  milestones_completed: {
    completed: number
    total: number
  }
  open_risks: number
  pending_approvals: number
}

export type BudgetItem = {
  id: string
  project_id: string
  category: string
  description: string
  original_budget: number
  approved_variations: number
  forecast_cost: number
  actual_spent: number
  currency: string
  cost_code: string
  status: 'on_track' | 'at_risk' | 'over'
  created_at: string
  updated_at: string
}

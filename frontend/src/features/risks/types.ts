export type Risk = {
  id: string
  project_id: string
  title: string
  description: string
  category: string
  likelihood: number
  impact: number
  rating: number
  status: 'open' | 'mitigating' | 'closed'
  owner: string
  due_date: string
  mitigation_plan: string
  created_at: string
  updated_at: string
}

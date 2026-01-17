export type Rfi = {
  id: string
  project_id: string
  rfi_number: string
  title: string
  question: string
  status: 'open' | 'answered' | 'closed'
  raised_by: string
  raised_at: string
  due_date: string
  responded_at: string | null
  response_summary: string
  created_at: string
  updated_at: string
}

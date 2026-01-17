export type Approval = {
  id: string
  project_id: string
  entity_type: string
  entity_id: string
  status: 'pending' | 'approved' | 'rejected'
  requested_by: string
  requested_at: string
  reviewed_by: string | null
  reviewed_at: string | null
  decision_note: string
  created_at: string
  updated_at: string
}

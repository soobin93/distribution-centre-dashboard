export type ActivityLog = {
  id: string
  project_id: string
  actor: string
  action: 'submit' | 'approve' | 'reject' | 'update'
  entity_type: string
  entity_id: string
  metadata: Record<string, string | number>
  created_at: string
}

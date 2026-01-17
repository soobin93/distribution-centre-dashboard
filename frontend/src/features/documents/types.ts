export type Document = {
  id: string
  project_id: string
  doc_type: 'plan' | 'approval' | 'report' | 'other'
  title: string
  description: string
  file_url: string
  version: string
  status: 'draft' | 'approved' | 'superseded'
  uploaded_by: string
  uploaded_at: string
  created_at: string
  updated_at: string
}

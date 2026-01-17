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
  created_at: string
  updated_at: string
}

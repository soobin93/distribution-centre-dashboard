export type MediaItem = {
  id: string
  project_id: string
  title: string
  description: string
  media_type: 'photo' | 'update' | 'camera_feed'
  media_url: string
  captured_at: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

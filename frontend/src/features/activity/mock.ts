import type { ActivityLog } from './types'

export const activityLogs: ActivityLog[] = [
  {
    id: 'act-001',
    project_id: 'proj-nb-001',
    actor: 'S. Patel',
    action: 'submit',
    entity_type: 'document',
    entity_id: 'doc-101',
    metadata: { title: 'Structural GA v3' },
    created_at: '2026-01-12T02:05:00Z',
  },
  {
    id: 'act-002',
    project_id: 'proj-sb-002',
    actor: 'E. Grant',
    action: 'approve',
    entity_type: 'approval',
    entity_id: 'appr-001',
    metadata: { decision: 'Approved', note: 'Compliance complete' },
    created_at: '2026-01-10T05:40:00Z',
  },
  {
    id: 'act-003',
    project_id: 'proj-nb-001',
    actor: 'T. Wong',
    action: 'update',
    entity_type: 'milestone',
    entity_id: 'ms-002',
    metadata: { percent_complete: 65 },
    created_at: '2026-01-09T00:10:00Z',
  },
]

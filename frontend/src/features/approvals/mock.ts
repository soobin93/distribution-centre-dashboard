import type { Approval } from './types'

export const approvals: Approval[] = [
  {
    id: 'appr-001',
    project_id: 'proj-nb-001',
    entity_type: 'document',
    entity_id: 'doc-101',
    status: 'approved',
    requested_by: 'S. Patel',
    requested_at: '2025-12-01T02:30:00Z',
    reviewed_by: 'E. Grant',
    reviewed_at: '2025-12-03T00:45:00Z',
    decision_note: 'Approved per compliance checklist.',
    created_at: '2025-12-01T02:30:00Z',
    updated_at: '2025-12-03T00:45:00Z',
  },
  {
    id: 'appr-002',
    project_id: 'proj-sb-002',
    entity_type: 'budget_item',
    entity_id: 'bud-003',
    status: 'pending',
    requested_by: 'N. Brown',
    requested_at: '2026-01-09T01:15:00Z',
    reviewed_by: null,
    reviewed_at: null,
    decision_note: 'Variation request for fit-out scope.',
    created_at: '2026-01-09T01:15:00Z',
    updated_at: '2026-01-09T01:15:00Z',
  },
]

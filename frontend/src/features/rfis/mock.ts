import type { Rfi } from './types'

export const rfis: Rfi[] = [
  {
    id: 'rfi-014',
    project_id: 'proj-nb-001',
    rfi_number: 'RFI-014',
    title: 'Warehouse roof insulation spec',
    question: 'Confirm R-value requirement for cold storage zone.',
    status: 'answered',
    raised_by: 'T. Wong',
    raised_at: '2025-12-10T09:00:00Z',
    due_date: '2025-12-17',
    responded_at: '2025-12-15T04:00:00Z',
    response_summary: 'R5.0 insulation required per updated spec.',
    created_at: '2025-12-10T09:00:00Z',
    updated_at: '2025-12-15T04:00:00Z',
  },
  {
    id: 'rfi-022',
    project_id: 'proj-sb-002',
    rfi_number: 'RFI-022',
    title: 'Automation interface protocol',
    question: 'Clarify PLC communication requirements.',
    status: 'open',
    raised_by: 'M. Singh',
    raised_at: '2026-01-05T10:30:00Z',
    due_date: '2026-01-20',
    responded_at: null,
    response_summary: 'Pending vendor clarification.',
    created_at: '2026-01-05T10:30:00Z',
    updated_at: '2026-01-12T01:45:00Z',
  },
]

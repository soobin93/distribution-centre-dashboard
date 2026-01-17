import type { Project } from './types'

export const projects: Project[] = [
  {
    id: 'proj-nb-001',
    name: 'North Brisbane Distribution Centre',
    location: 'Brendale, QLD',
    status: 'active',
    start_date: '2025-07-01',
    end_date: '2026-12-15',
    description: 'Greenfield distribution hub with cold-chain capability.',
    program_name: 'Distribution Centres',
    phase: 'Construction',
    created_at: '2025-06-12T09:00:00Z',
    updated_at: '2026-01-08T04:10:00Z',
  },
  {
    id: 'proj-sb-002',
    name: 'South Brisbane Distribution Centre',
    location: 'Logan, QLD',
    status: 'active',
    start_date: '2025-09-15',
    end_date: '2027-03-30',
    description: 'High-throughput automation upgrade to existing facility.',
    program_name: 'Distribution Centres',
    phase: 'Design + Procurement',
    created_at: '2025-08-02T11:30:00Z',
    updated_at: '2026-01-10T01:45:00Z',
  },
]

export const programSummary = {
  total_original_budget: 312000000,
  total_variations: 16600000,
  total_forecast_cost: 328600000,
  total_actual_spend: 141200000,
  milestones_completed: { completed: 18, total: 34 },
  open_risks: 7,
  pending_approvals: 4,
}

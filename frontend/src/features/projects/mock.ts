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
    created_at: '2025-08-02T11:30:00Z',
    updated_at: '2026-01-10T01:45:00Z',
  },
]

export const programSummary = {
  total_original_budget: '$312.0M',
  total_forecast_cost: '$328.6M',
  total_actual_spend: '$141.2M',
  milestones_completed: '18 / 34',
  open_risks: '7',
  pending_approvals: '4',
}

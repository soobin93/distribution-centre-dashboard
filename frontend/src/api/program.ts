import { fetchJson, unwrapResults } from '@/api/client'
import type { ProgramSummary, Project } from '@/features/projects/types'
import type { BudgetItem } from '@/features/budgets/types'
import type { Milestone } from '@/features/milestones/types'
import type { Risk } from '@/features/risks/types'
import type { Rfi } from '@/features/rfis/types'
import type { Document } from '@/features/documents/types'
import type { MediaItem } from '@/features/media_items/types'
import type { Approval } from '@/features/approvals/types'
import type { ActivityLog } from '@/features/activity/types'

export const getProgramSummary = async () => fetchJson<ProgramSummary>('summary')

export const getProjects = async () => {
  const payload = await fetchJson<Project[] | { results: Project[] }>('projects')
  return unwrapResults(payload)
}

export const getBudgets = async (projectId?: string) => {
  const query = projectId ? `budgets?project_id=${encodeURIComponent(projectId)}` : 'budgets'
  const payload = await fetchJson<BudgetItem[] | { results: BudgetItem[] }>(query)
  return unwrapResults(payload)
}

export const getMilestones = async (projectId?: string) => {
  const query = projectId ? `milestones?project_id=${encodeURIComponent(projectId)}` : 'milestones'
  const payload = await fetchJson<Milestone[] | { results: Milestone[] }>(query)
  return unwrapResults(payload)
}

export const getRisks = async (projectId?: string) => {
  const query = projectId ? `risks?project_id=${encodeURIComponent(projectId)}` : 'risks'
  const payload = await fetchJson<Risk[] | { results: Risk[] }>(query)
  return unwrapResults(payload)
}

export const getRfis = async (projectId?: string) => {
  const query = projectId ? `rfis?project_id=${encodeURIComponent(projectId)}` : 'rfis'
  const payload = await fetchJson<Rfi[] | { results: Rfi[] }>(query)
  return unwrapResults(payload)
}

export const getDocuments = async (projectId?: string) => {
  const query = projectId ? `documents?project_id=${encodeURIComponent(projectId)}` : 'documents'
  const payload = await fetchJson<Document[] | { results: Document[] }>(query)
  return unwrapResults(payload)
}

export const getMediaItems = async (projectId?: string) => {
  const query = projectId ? `media-items?project_id=${encodeURIComponent(projectId)}` : 'media-items'
  const payload = await fetchJson<MediaItem[] | { results: MediaItem[] }>(query)
  return unwrapResults(payload)
}

export const getApprovals = async (projectId?: string) => {
  const query = projectId ? `approvals?project_id=${encodeURIComponent(projectId)}` : 'approvals'
  const payload = await fetchJson<Approval[] | { results: Approval[] }>(query)
  return unwrapResults(payload)
}

export const approveApproval = async (approvalId: string, decisionNote = '') =>
  fetchJson<Approval>(`approvals/${approvalId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ decision_note: decisionNote }),
  })

export const rejectApproval = async (approvalId: string, decisionNote = '') =>
  fetchJson<Approval>(`approvals/${approvalId}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ decision_note: decisionNote }),
  })

export const submitApproval = async (approvalId: string) =>
  fetchJson<Approval>(`approvals/${approvalId}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

export type PaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const getActivityLogs = async (projectId?: string, page = 1, pageSize = 20) => {
  const params = new URLSearchParams()
  if (projectId) {
    params.set('project_id', projectId)
  }
  if (pageSize > 0) {
    params.set('page_size', String(pageSize))
  }
  if (page > 1) {
    params.set('page', String(page))
  }
  const query = params.toString() ? `activity?${params.toString()}` : 'activity'
  const payload = await fetchJson<ActivityLog[] | PaginatedResponse<ActivityLog>>(query)
  if (Array.isArray(payload)) {
    return { count: payload.length, next: null, previous: null, results: payload }
  }
  return payload
}

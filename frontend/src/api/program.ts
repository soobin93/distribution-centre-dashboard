import { fetchJson, unwrapResults } from './client'
import type { ProgramSummary, Project } from '../features/projects/types'
import type { BudgetItem } from '../features/budgets/types'
import type { Milestone } from '../features/milestones/types'
import type { Risk } from '../features/risks/types'
import type { Rfi } from '../features/rfis/types'
import type { Document } from '../features/documents/types'
import type { MediaUpdate } from '../features/media_updates/types'
import type { Approval } from '../features/approvals/types'
import type { ActivityLog } from '../features/activity/types'

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

export const getMediaUpdates = async (projectId?: string) => {
  const query = projectId ? `media-updates?project_id=${encodeURIComponent(projectId)}` : 'media-updates'
  const payload = await fetchJson<MediaUpdate[] | { results: MediaUpdate[] }>(query)
  return unwrapResults(payload)
}

export const getApprovals = async (projectId?: string) => {
  const query = projectId ? `approvals?project_id=${encodeURIComponent(projectId)}` : 'approvals'
  const payload = await fetchJson<Approval[] | { results: Approval[] }>(query)
  return unwrapResults(payload)
}

export const getActivityLogs = async (projectId?: string) => {
  const query = projectId ? `activity?project_id=${encodeURIComponent(projectId)}` : 'activity'
  const payload = await fetchJson<ActivityLog[] | { results: ActivityLog[] }>(query)
  return unwrapResults(payload)
}

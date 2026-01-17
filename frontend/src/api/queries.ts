import { useQuery } from '@tanstack/react-query'
import {
  getActivityLogs,
  getApprovals,
  getBudgets,
  getDocuments,
  getMediaUpdates,
  getMilestones,
  getProgramSummary,
  getProjects,
  getRfis,
  getRisks,
} from './program'

export const useProgramSummary = () =>
  useQuery({ queryKey: ['programSummary'], queryFn: getProgramSummary })

export const useProjects = () => useQuery({ queryKey: ['projects'], queryFn: getProjects })

export const useBudgets = (projectId?: string) =>
  useQuery({ queryKey: ['budgets', projectId ?? 'all'], queryFn: () => getBudgets(projectId) })

export const useMilestones = (projectId?: string) =>
  useQuery({ queryKey: ['milestones', projectId ?? 'all'], queryFn: () => getMilestones(projectId) })

export const useRisks = (projectId?: string) =>
  useQuery({ queryKey: ['risks', projectId ?? 'all'], queryFn: () => getRisks(projectId) })

export const useRfis = (projectId?: string) =>
  useQuery({ queryKey: ['rfis', projectId ?? 'all'], queryFn: () => getRfis(projectId) })

export const useDocuments = (projectId?: string) =>
  useQuery({ queryKey: ['documents', projectId ?? 'all'], queryFn: () => getDocuments(projectId) })

export const useMediaUpdates = (projectId?: string) =>
  useQuery({ queryKey: ['media', projectId ?? 'all'], queryFn: () => getMediaUpdates(projectId) })

export const useApprovals = (projectId?: string) =>
  useQuery({ queryKey: ['approvals', projectId ?? 'all'], queryFn: () => getApprovals(projectId) })

export const useActivityLogs = (projectId?: string) =>
  useQuery({ queryKey: ['activity', projectId ?? 'all'], queryFn: () => getActivityLogs(projectId) })

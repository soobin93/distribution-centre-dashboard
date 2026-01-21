import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import Badge from '@/features/ui/badge/Badge.component'
import StatCard from '@/features/ui/stat-card/StatCard.component'
import { SkeletonCard, SkeletonLine, SkeletonPill } from '@/features/ui/skeleton/Skeleton.component'
import Drawer from '@/features/ui/drawer/Drawer.component'
import {
  approvalTone,
  budgetStatusTone,
  formatCurrency,
  formatDate,
  formatDateTime,
  mediaTone,
  milestoneTone,
  rfiTone,
  resolveProjectId,
  toDateInput,
  toDateTimeInput,
  toDateTimePayload,
} from '@/features/projects/ProjectWorkspace.utils'
import {
  useActivityLogs,
  useApprovals,
  useBudgets,
  useDocuments,
  useMediaItems,
  useMilestones,
  useProjects,
  useRfis,
  useRisks,
} from '@/api/queries'
import {
  approveApproval,
  createBudget,
  createRfi,
  createRisk,
  deleteBudget,
  deleteRfi,
  deleteRisk,
  submitApproval,
  updateBudget,
  updateRfi,
  updateRisk,
  rejectApproval,
} from '@/api/program'
import type { BudgetItem } from '@/features/budgets/Budgets.component.types'
import type { Risk } from '@/features/risks/Risks.component.types'
import type { Rfi } from '@/features/rfis/Rfis.component.types'
import type { BudgetItemInput, RiskInput, RfiInput } from '@/api/program'


type SkeletonTableProps = {
  headers: string[]
  rows?: number
  className?: string
  badgeIndex?: number
}

type TableOverlayProps = {
  active: boolean
  message: string
}

type FieldLabelProps = {
  text: string
  required?: boolean
}

const SkeletonTable = ({ headers, rows = 3, className = '', badgeIndex }: SkeletonTableProps) => (
  <div className={`table ${className}`.trim()}>
    <div className="table__header">
      {headers.map((header) => (
        <span key={header}>{header}</span>
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div className="table__row" key={`skeleton-row-${rowIndex}`}>
        {headers.map((_, colIndex) => {
          if (colIndex === 0) {
            return (
              <div key={`cell-${rowIndex}-${colIndex}`}>
                <SkeletonLine className="skeleton-wide" />
                <SkeletonLine className="skeleton-narrow" />
              </div>
            )
          }
          if (badgeIndex === colIndex) {
            return (
              <div className="table__badge" key={`cell-${rowIndex}-${colIndex}`}>
                <SkeletonPill />
              </div>
            )
          }
          return <SkeletonLine key={`cell-${rowIndex}-${colIndex}`} />
        })}
      </div>
    ))}
  </div>
)

const TableOverlay = ({ active, message }: TableOverlayProps) =>
  active ? (
    <div className="table__overlay" aria-live="polite">
      <span className="inline-spinner" aria-hidden="true" />
      <span className="subtle">{message}</span>
    </div>
  ) : null

const FieldLabel = ({ text, required }: FieldLabelProps) => (
  <span className="field-label">
    {text}
    {required ? <span className="field-required">*</span> : <span className="field-optional">Optional</span>}
  </span>
)

type BudgetFormProps = {
  initial: BudgetItemInput
  submitting: boolean
  onSubmit: (payload: BudgetItemInput) => void
  onCancel: () => void
}

const BudgetForm = ({ initial, submitting, onSubmit, onCancel }: BudgetFormProps) => {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})


  const clearError = (key: string) => {
    if (!errors[key]) return
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  return (
    <form
      className="drawer__form"
      onSubmit={(event) => {
        event.preventDefault()
        const nextErrors: Record<string, string> = {}
        if (!form.category.trim()) nextErrors.category = 'Category is required.'
        if (!form.cost_code.trim()) nextErrors.cost_code = 'Cost code is required.'
        if (!form.currency.trim()) nextErrors.currency = 'Currency is required.'
        if (form.original_budget < 0) nextErrors.original_budget = 'Must be 0 or greater.'
        if (form.approved_variations < 0) nextErrors.approved_variations = 'Must be 0 or greater.'
        if (form.forecast_cost < 0) nextErrors.forecast_cost = 'Must be 0 or greater.'
        if (form.actual_spent < 0) nextErrors.actual_spent = 'Must be 0 or greater.'
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0) {
          return
        }
        onSubmit(form)
      }}
    >
      <p className="drawer__legend">
        Required fields marked <span className="field-required">*</span>.
      </p>
      <label className="drawer__field">
        <FieldLabel text="Category" required />
        <input
          value={form.category}
          onChange={(event) => {
            setForm({ ...form, category: event.target.value })
            clearError('category')
          }}
          required
          className={errors.category ? 'is-error' : ''}
        />
        {errors.category ? <span className="field-error">{errors.category}</span> : null}
      </label>
      <label className="drawer__field">
        <FieldLabel text="Description" />
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
      </label>
      <div className="drawer__grid">
        <label className="drawer__field">
          <FieldLabel text="Original budget" required />
          <input
            type="number"
            min="0"
            value={form.original_budget}
            onChange={(event) => {
              setForm({ ...form, original_budget: Number(event.target.value) })
              clearError('original_budget')
            }}
            required
            className={errors.original_budget ? 'is-error' : ''}
          />
          {errors.original_budget ? <span className="field-error">{errors.original_budget}</span> : null}
        </label>
        <label className="drawer__field">
          <FieldLabel text="Approved variations" required />
          <input
            type="number"
            min="0"
            value={form.approved_variations}
            onChange={(event) => {
              setForm({ ...form, approved_variations: Number(event.target.value) })
              clearError('approved_variations')
            }}
            required
            className={errors.approved_variations ? 'is-error' : ''}
          />
          {errors.approved_variations ? (
            <span className="field-error">{errors.approved_variations}</span>
          ) : null}
        </label>
        <label className="drawer__field">
          <FieldLabel text="Forecast cost" required />
          <input
            type="number"
            min="0"
            value={form.forecast_cost}
            onChange={(event) => {
              setForm({ ...form, forecast_cost: Number(event.target.value) })
              clearError('forecast_cost')
            }}
            required
            className={errors.forecast_cost ? 'is-error' : ''}
          />
          {errors.forecast_cost ? <span className="field-error">{errors.forecast_cost}</span> : null}
        </label>
        <label className="drawer__field">
          <FieldLabel text="Actual spent" required />
          <input
            type="number"
            min="0"
            value={form.actual_spent}
            onChange={(event) => {
              setForm({ ...form, actual_spent: Number(event.target.value) })
              clearError('actual_spent')
            }}
            required
            className={errors.actual_spent ? 'is-error' : ''}
          />
          {errors.actual_spent ? <span className="field-error">{errors.actual_spent}</span> : null}
        </label>
      </div>
      <div className="drawer__grid">
        <label className="drawer__field">
          <FieldLabel text="Currency" required />
          <input
            value={form.currency}
            onChange={(event) => {
              setForm({ ...form, currency: event.target.value })
              clearError('currency')
            }}
            required
            className={errors.currency ? 'is-error' : ''}
          />
          {errors.currency ? <span className="field-error">{errors.currency}</span> : null}
        </label>
        <label className="drawer__field">
          <FieldLabel text="Cost code" required />
          <input
            value={form.cost_code}
            onChange={(event) => {
              setForm({ ...form, cost_code: event.target.value })
              clearError('cost_code')
            }}
            required
            className={errors.cost_code ? 'is-error' : ''}
          />
          {errors.cost_code ? <span className="field-error">{errors.cost_code}</span> : null}
        </label>
        <label className="drawer__field">
          <FieldLabel text="Status" />
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value as BudgetItemInput['status'] })}
          >
            <option value="on_track">On track</option>
            <option value="at_risk">At risk</option>
            <option value="off_track">Off track</option>
          </select>
        </label>
      </div>
      <div className="drawer__actions">
        <button className="link-button" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button className="link-button" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

type RiskFormProps = {
  initial: RiskInput
  submitting: boolean
  onSubmit: (payload: RiskInput) => void
  onCancel: () => void
}

const RiskForm = ({ initial, submitting, onSubmit, onCancel }: RiskFormProps) => {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const rating = form.likelihood * form.impact


  const clearError = (key: string) => {
    if (!errors[key]) return
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  return (
    <form
      className="drawer__form"
      onSubmit={(event) => {
        event.preventDefault()
        const nextErrors: Record<string, string> = {}
        if (!form.title.trim()) nextErrors.title = 'Title is required.'
        if (!form.category.trim()) nextErrors.category = 'Category is required.'
        if (!form.owner.trim()) nextErrors.owner = 'Owner is required.'
        if (!form.due_date) nextErrors.due_date = 'Due date is required.'
        if (form.likelihood < 1 || form.likelihood > 5) nextErrors.likelihood = '1–5 required.'
        if (form.impact < 1 || form.impact > 5) nextErrors.impact = '1–5 required.'
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0) {
          return
        }
        onSubmit({ ...form, rating })
      }}
    >
      <p className="drawer__legend">
        Required fields marked <span className="field-required">*</span>.
      </p>
      <label className="drawer__field">
        <FieldLabel text="Title" required />
        <input
          value={form.title}
          onChange={(event) => {
            setForm({ ...form, title: event.target.value })
            clearError('title')
          }}
          required
          className={errors.title ? 'is-error' : ''}
        />
        {errors.title ? <span className="field-error">{errors.title}</span> : null}
      </label>
      <label className="drawer__field">
        <FieldLabel text="Description" />
        <textarea
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
      </label>
      <div className="drawer__grid">
        <label className="drawer__field">
          <FieldLabel text="Category" required />
          <input
            value={form.category}
            onChange={(event) => {
              setForm({ ...form, category: event.target.value })
              clearError('category')
            }}
            required
            className={errors.category ? 'is-error' : ''}
          />
          {errors.category ? <span className="field-error">{errors.category}</span> : null}
        </label>
        <label className="drawer__field">
          <FieldLabel text="Owner" required />
          <input
            value={form.owner}
            onChange={(event) => {
              setForm({ ...form, owner: event.target.value })
              clearError('owner')
            }}
            required
            className={errors.owner ? 'is-error' : ''}
          />
          {errors.owner ? <span className="field-error">{errors.owner}</span> : null}
        </label>
        <label className="drawer__field">
          <FieldLabel text="Status" />
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value as RiskInput['status'] })}
          >
            <option value="open">Open</option>
            <option value="mitigating">Mitigating</option>
            <option value="closed">Closed</option>
          </select>
        </label>
      </div>
      <div className="drawer__grid">
        <label className="drawer__field">
          <FieldLabel text="Likelihood" required />
          <input
            type="number"
            min="1"
            max="5"
            value={form.likelihood}
            onChange={(event) => {
              setForm({ ...form, likelihood: Number(event.target.value) })
              clearError('likelihood')
            }}
            required
            className={errors.likelihood ? 'is-error' : ''}
          />
          {errors.likelihood ? <span className="field-error">{errors.likelihood}</span> : null}
        </label>
        <label className="drawer__field">
          <FieldLabel text="Impact" required />
          <input
            type="number"
            min="1"
            max="5"
            value={form.impact}
            onChange={(event) => {
              setForm({ ...form, impact: Number(event.target.value) })
              clearError('impact')
            }}
            required
            className={errors.impact ? 'is-error' : ''}
          />
          {errors.impact ? <span className="field-error">{errors.impact}</span> : null}
        </label>
        <label className="drawer__field">
          <FieldLabel text="Rating" />
          <input type="number" value={rating} readOnly />
        </label>
      </div>
      <label className="drawer__field">
        <FieldLabel text="Due date" required />
        <input
          type="date"
          value={form.due_date}
          onChange={(event) => {
            setForm({ ...form, due_date: event.target.value })
            clearError('due_date')
          }}
          required
          className={errors.due_date ? 'is-error' : ''}
        />
        {errors.due_date ? <span className="field-error">{errors.due_date}</span> : null}
      </label>
      <label className="drawer__field">
        <FieldLabel text="Mitigation plan" />
        <textarea
          value={form.mitigation_plan}
          onChange={(event) => setForm({ ...form, mitigation_plan: event.target.value })}
        />
      </label>
      <div className="drawer__actions">
        <button className="link-button" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button className="link-button" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

type RfiFormProps = {
  initial: RfiInput
  submitting: boolean
  onSubmit: (payload: RfiInput) => void
  onCancel: () => void
}

const RfiForm = ({ initial, submitting, onSubmit, onCancel }: RfiFormProps) => {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})


  const clearError = (key: string) => {
    if (!errors[key]) return
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  return (
    <form
      className="drawer__form"
      onSubmit={(event) => {
        event.preventDefault()
        const nextErrors: Record<string, string> = {}
        if (!form.rfi_number.trim()) nextErrors.rfi_number = 'RFI number is required.'
        if (!form.title.trim()) nextErrors.title = 'Title is required.'
        if (!form.raised_by.trim()) nextErrors.raised_by = 'Raised by is required.'
        if (!form.raised_at) nextErrors.raised_at = 'Raised at is required.'
        if (!form.due_date) nextErrors.due_date = 'Due date is required.'
        setErrors(nextErrors)
        if (Object.keys(nextErrors).length > 0) {
          return
        }
        onSubmit({
          ...form,
          raised_at: toDateTimePayload(form.raised_at) ?? form.raised_at,
          responded_at: form.responded_at ? toDateTimePayload(form.responded_at) : null,
        })
      }}
    >
      <p className="drawer__legend">
        Required fields marked <span className="field-required">*</span>.
      </p>
      <div className="drawer__grid">
        <label className="drawer__field">
          <FieldLabel text="RFI number" required />
          <input
            value={form.rfi_number}
            onChange={(event) => {
              setForm({ ...form, rfi_number: event.target.value })
              clearError('rfi_number')
            }}
            required
            className={errors.rfi_number ? 'is-error' : ''}
          />
          {errors.rfi_number ? <span className="field-error">{errors.rfi_number}</span> : null}
        </label>
        <label className="drawer__field">
          <FieldLabel text="Status" />
          <select
            value={form.status}
            onChange={(event) => setForm({ ...form, status: event.target.value as RfiInput['status'] })}
          >
            <option value="open">Open</option>
            <option value="answered">Answered</option>
            <option value="closed">Closed</option>
          </select>
        </label>
      </div>
      <label className="drawer__field">
        <FieldLabel text="Title" required />
        <input
          value={form.title}
          onChange={(event) => {
            setForm({ ...form, title: event.target.value })
            clearError('title')
          }}
          required
          className={errors.title ? 'is-error' : ''}
        />
        {errors.title ? <span className="field-error">{errors.title}</span> : null}
      </label>
      <label className="drawer__field">
        <FieldLabel text="Question" />
        <textarea
          value={form.question}
          onChange={(event) => setForm({ ...form, question: event.target.value })}
        />
      </label>
      <div className="drawer__grid">
        <label className="drawer__field">
          <FieldLabel text="Raised by" required />
          <input
            value={form.raised_by}
            onChange={(event) => {
              setForm({ ...form, raised_by: event.target.value })
              clearError('raised_by')
            }}
            required
            className={errors.raised_by ? 'is-error' : ''}
          />
          {errors.raised_by ? <span className="field-error">{errors.raised_by}</span> : null}
        </label>
        <label className="drawer__field">
          <FieldLabel text="Raised at" required />
          <input
            type="datetime-local"
            value={form.raised_at}
            onChange={(event) => {
              setForm({ ...form, raised_at: event.target.value })
              clearError('raised_at')
            }}
            required
            className={errors.raised_at ? 'is-error' : ''}
          />
          {errors.raised_at ? <span className="field-error">{errors.raised_at}</span> : null}
        </label>
        <label className="drawer__field">
          <FieldLabel text="Due date" required />
          <input
            type="date"
            value={form.due_date}
            onChange={(event) => {
              setForm({ ...form, due_date: event.target.value })
              clearError('due_date')
            }}
            required
            className={errors.due_date ? 'is-error' : ''}
          />
          {errors.due_date ? <span className="field-error">{errors.due_date}</span> : null}
        </label>
      </div>
      <label className="drawer__field">
        <FieldLabel text="Response summary" />
        <textarea
          value={form.response_summary}
          onChange={(event) => setForm({ ...form, response_summary: event.target.value })}
        />
      </label>
      <label className="drawer__field">
        <FieldLabel text="Responded at" />
        <input
          type="datetime-local"
          value={form.responded_at ?? ''}
          onChange={(event) =>
            setForm({
              ...form,
              responded_at: event.target.value || null,
            })
          }
        />
      </label>
      <div className="drawer__actions">
        <button className="link-button" type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button className="link-button" type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

const ProjectWorkspace = () => {
  const { projectId } = useParams()
  const queryClient = useQueryClient()
  const [activityPage, setActivityPage] = useState(1)
  const [activityPageSize, setActivityPageSize] = useState(10)
  const activityFetchSize = 1000
  const [expandedBudgetId, setExpandedBudgetId] = useState<string | null>(null)
  const [expandedRiskId, setExpandedRiskId] = useState<string | null>(null)
  const [expandedRfiId, setExpandedRfiId] = useState<string | null>(null)
  const [approvalAction, setApprovalAction] = useState<{
    id: string
    type: 'approve' | 'reject' | 'reopen'
  } | null>(null)
  const [drawerState, setDrawerState] = useState<{
    type: 'budget' | 'risk' | 'rfi'
    mode: 'create' | 'edit'
    item?: BudgetItem | Risk | Rfi
  } | null>(null)
  const { data: projects = [], isLoading: loadingProjects, isError: projectsError } = useProjects()
  const {
    data: budgets = [],
    isLoading: loadingBudgets,
    isError: budgetsError,
    isFetching: budgetsFetching,
  } = useBudgets(projectId)
  const {
    data: milestoneItems = [],
    isLoading: loadingMilestones,
    isError: milestonesError,
    isFetching: milestonesFetching,
  } = useMilestones(projectId)
  const {
    data: riskItems = [],
    isLoading: loadingRisks,
    isError: risksError,
    isFetching: risksFetching,
  } = useRisks(projectId)
  const {
    data: rfiItems = [],
    isLoading: loadingRfis,
    isError: rfisError,
    isFetching: rfisFetching,
  } = useRfis(projectId)
  const {
    data: documentItems = [],
    isLoading: loadingDocuments,
    isError: documentsError,
    isFetching: documentsFetching,
  } = useDocuments(projectId)
  const { data: mediaItems = [], isLoading: loadingMedia, isError: mediaError } = useMediaItems(projectId)
  const {
    data: approvalItems = [],
    isLoading: loadingApprovals,
    isError: approvalsError,
    isFetching: approvalsFetching,
  } = useApprovals(projectId)
  const {
    data: activityPayload,
    isLoading: loadingActivity,
    isError: activityError,
    isFetching: activityFetching,
  } = useActivityLogs(projectId, 1, activityFetchSize)
  const activityItems = useMemo(() => activityPayload?.results ?? [], [activityPayload])
  const activityFiltered = useMemo(
    () => activityItems.filter((item) => resolveProjectId(item) === projectId),
    [activityItems, projectId],
  )
  const activityTotalPages = useMemo(() => {
    if (activityFiltered.length === 0) return 1
    return Math.max(1, Math.ceil(activityFiltered.length / activityPageSize))
  }, [activityFiltered.length, activityPageSize])
  const activityPageItems = useMemo(() => {
    const start = (activityPage - 1) * activityPageSize
    return activityFiltered.slice(start, start + activityPageSize)
  }, [activityFiltered, activityPage, activityPageSize])
  const activityPageWindow = useMemo(() => {
    const windowSize = 5
    let start = Math.max(1, activityPage - 2)
    const end = Math.min(activityTotalPages, start + windowSize - 1)
    start = Math.max(1, end - windowSize + 1)
    return Array.from({ length: end - start + 1 }, (_, index) => start + index)
  }, [activityPage, activityTotalPages])
  const approvalActionBusyRefetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['approvals', projectId ?? 'all'] }),
      queryClient.invalidateQueries({
        queryKey: ['activity', projectId ?? 'all', 1, activityFetchSize],
      }),
    ])
  }
  const approveMutation = useMutation({
    mutationFn: (approvalId: string) => approveApproval(approvalId),
    onMutate: (approvalId) => setApprovalAction({ id: approvalId, type: 'approve' }),
    onSuccess: async () => {
      await approvalActionBusyRefetch()
      setApprovalAction(null)
    },
    onError: () => setApprovalAction(null),
  })
  const rejectMutation = useMutation({
    mutationFn: (approvalId: string) => rejectApproval(approvalId),
    onMutate: (approvalId) => setApprovalAction({ id: approvalId, type: 'reject' }),
    onSuccess: async () => {
      await approvalActionBusyRefetch()
      setApprovalAction(null)
    },
    onError: () => setApprovalAction(null),
  })
  const submitMutation = useMutation({
    mutationFn: (approvalId: string) => submitApproval(approvalId),
    onMutate: (approvalId) => setApprovalAction({ id: approvalId, type: 'reopen' }),
    onSuccess: async () => {
      await approvalActionBusyRefetch()
      setApprovalAction(null)
    },
    onError: () => setApprovalAction(null),
  })
  const approvalsUpdating =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    submitMutation.isPending ||
    approvalsFetching ||
    activityFetching

  const invalidateBudgets = async () => {
    await queryClient.invalidateQueries({ queryKey: ['budgets', projectId ?? 'all'] })
  }
  const invalidateRisks = async () => {
    await queryClient.invalidateQueries({ queryKey: ['risks', projectId ?? 'all'] })
  }
  const invalidateRfis = async () => {
    await queryClient.invalidateQueries({ queryKey: ['rfis', projectId ?? 'all'] })
  }

  const createBudgetMutation = useMutation({
    mutationFn: (payload: BudgetItemInput) => createBudget(payload),
    onSuccess: async () => {
      await invalidateBudgets()
      setDrawerState(null)
    },
  })
  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BudgetItemInput }) => updateBudget(id, payload),
    onSuccess: async () => {
      await invalidateBudgets()
      setDrawerState(null)
    },
  })
  const deleteBudgetMutation = useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: invalidateBudgets,
  })

  const createRiskMutation = useMutation({
    mutationFn: (payload: RiskInput) => createRisk(payload),
    onSuccess: async () => {
      await invalidateRisks()
      setDrawerState(null)
    },
  })
  const updateRiskMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RiskInput }) => updateRisk(id, payload),
    onSuccess: async () => {
      await invalidateRisks()
      setDrawerState(null)
    },
  })
  const deleteRiskMutation = useMutation({
    mutationFn: (id: string) => deleteRisk(id),
    onSuccess: invalidateRisks,
  })

  const createRfiMutation = useMutation({
    mutationFn: (payload: RfiInput) => createRfi(payload),
    onSuccess: async () => {
      await invalidateRfis()
      setDrawerState(null)
    },
  })
  const updateRfiMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RfiInput }) => updateRfi(id, payload),
    onSuccess: async () => {
      await invalidateRfis()
      setDrawerState(null)
    },
  })
  const deleteRfiMutation = useMutation({
    mutationFn: (id: string) => deleteRfi(id),
    onSuccess: invalidateRfis,
  })

  const budgetsUpdating =
    budgetsFetching || createBudgetMutation.isPending || updateBudgetMutation.isPending || deleteBudgetMutation.isPending
  const risksUpdating =
    risksFetching || createRiskMutation.isPending || updateRiskMutation.isPending || deleteRiskMutation.isPending
  const rfisUpdating =
    rfisFetching || createRfiMutation.isPending || updateRfiMutation.isPending || deleteRfiMutation.isPending

  const drawerBusy =
    createBudgetMutation.isPending ||
    updateBudgetMutation.isPending ||
    createRiskMutation.isPending ||
    updateRiskMutation.isPending ||
    createRfiMutation.isPending ||
    updateRfiMutation.isPending

  const projectBudgets = useMemo(
    () => budgets.filter((item) => resolveProjectId(item) === projectId),
    [budgets, projectId],
  )
  const projectMilestones = useMemo(
    () => milestoneItems.filter((item) => resolveProjectId(item) === projectId),
    [milestoneItems, projectId],
  )
  const projectRisks = useMemo(
    () => riskItems.filter((item) => resolveProjectId(item) === projectId),
    [riskItems, projectId],
  )
  const projectRfis = useMemo(
    () => rfiItems.filter((item) => resolveProjectId(item) === projectId),
    [rfiItems, projectId],
  )
  const projectDocuments = useMemo(
    () => documentItems.filter((item) => resolveProjectId(item) === projectId),
    [documentItems, projectId],
  )
  const projectMedia = useMemo(
    () => mediaItems.filter((item) => resolveProjectId(item) === projectId),
    [mediaItems, projectId],
  )
  const projectApprovals = useMemo(
    () => approvalItems.filter((item) => resolveProjectId(item) === projectId),
    [approvalItems, projectId],
  )
  const projectActivity = activityPageItems

  const project = projects.find((item) => item.id === projectId)
  const projectKey = projectId ?? ''

  const defaultBudget = useMemo<BudgetItemInput>(
    () => ({
      project_id: projectKey,
      category: '',
      description: '',
      original_budget: 0,
      approved_variations: 0,
      forecast_cost: 0,
      actual_spent: 0,
      currency: 'AUD',
      cost_code: '',
      status: 'on_track',
    }),
    [projectKey],
  )

  const defaultRisk = useMemo<RiskInput>(
    () => ({
      project_id: projectKey,
      title: '',
      description: '',
      category: '',
      likelihood: 3,
      impact: 3,
      rating: 9,
      status: 'open',
      owner: '',
      due_date: '',
      mitigation_plan: '',
    }),
    [projectKey],
  )

  const defaultRfi = useMemo<RfiInput>(
    () => ({
      project_id: projectKey,
      rfi_number: '',
      title: '',
      question: '',
      status: 'open',
      raised_by: '',
      raised_at: '',
      due_date: '',
      responded_at: null,
      response_summary: '',
    }),
    [projectKey],
  )

  if (!project && projectsError) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Workspace unavailable</h1>
            <p className="page__subtitle">Project data could not be loaded.</p>
          </div>
        </div>
        <div className="notice">Please refresh or try again later.</div>
      </section>
    )
  }

  if (!project && !loadingProjects) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Project not found</h1>
            <p className="page__subtitle">Select a emergency services infrastructure workspace to continue.</p>
          </div>
        </div>
      </section>
    )
  }

  const budgetTotals = projectBudgets.reduce(
    (acc, item) => {
      acc.original += Number(item.original_budget)
      acc.variations += Number(item.approved_variations)
      acc.forecast += Number(item.forecast_cost)
      acc.actual += Number(item.actual_spent)
      return acc
    },
    { original: 0, variations: 0, forecast: 0, actual: 0 },
  )

  const milestoneDone = projectMilestones.filter((item) => item.status === 'done').length
  const openRisks = projectRisks.filter((item) => item.status !== 'closed').length
  const openRfis = projectRfis.filter((item) => item.status === 'open').length
  const pendingApprovals = projectApprovals.filter((item) => item.status === 'pending').length

  const openDrawer = (type: 'budget' | 'risk' | 'rfi', mode: 'create' | 'edit', item?: BudgetItem | Risk | Rfi) => {
    setDrawerState({ type, mode, item })
  }

  const closeDrawer = () => setDrawerState(null)

  const drawerTitle = (() => {
    if (!drawerState) return ''
    const actionLabel = drawerState.mode === 'create' ? 'Add' : 'Edit'
    if (drawerState.type === 'budget') return `${actionLabel} budget`
    if (drawerState.type === 'risk') return `${actionLabel} risk`
    return `${actionLabel} RFI`
  })()


  const drawerContent = (() => {
    if (!drawerState) return null
    if (drawerState.type === 'budget') {
      const item = drawerState.item as BudgetItem | undefined
      const initial: BudgetItemInput = item
        ? {
            project_id: item.project_id,
            category: item.category,
            description: item.description,
            original_budget: Number(item.original_budget),
            approved_variations: Number(item.approved_variations),
            forecast_cost: Number(item.forecast_cost),
            actual_spent: Number(item.actual_spent),
            currency: item.currency,
            cost_code: item.cost_code,
            status: item.status,
          }
        : defaultBudget
      const submitting = createBudgetMutation.isPending || updateBudgetMutation.isPending
      return (
        <BudgetForm
          key={`budget-${drawerState.mode}-${drawerState.item?.id ?? 'new'}`}
          initial={initial}
          submitting={submitting}
          onCancel={closeDrawer}
          onSubmit={(payload) => {
            if (drawerState.mode === 'create') {
              createBudgetMutation.mutate(payload)
            } else if (drawerState.item) {
              updateBudgetMutation.mutate({ id: drawerState.item.id, payload })
            }
          }}
        />
      )
    }
    if (drawerState.type === 'risk') {
      const item = drawerState.item as Risk | undefined
      const initial: RiskInput = item
        ? {
            project_id: item.project_id,
            title: item.title,
            description: item.description,
            category: item.category,
            likelihood: item.likelihood,
            impact: item.impact,
            rating: item.rating,
            status: item.status,
            owner: item.owner,
            due_date: toDateInput(item.due_date),
            mitigation_plan: item.mitigation_plan,
          }
        : defaultRisk
      const submitting = createRiskMutation.isPending || updateRiskMutation.isPending
      return (
        <RiskForm
          key={`risk-${drawerState.mode}-${drawerState.item?.id ?? 'new'}`}
          initial={initial}
          submitting={submitting}
          onCancel={closeDrawer}
          onSubmit={(payload) => {
            if (drawerState.mode === 'create') {
              createRiskMutation.mutate(payload)
            } else if (drawerState.item) {
              updateRiskMutation.mutate({ id: drawerState.item.id, payload })
            }
          }}
        />
      )
    }
    const item = drawerState.item as Rfi | undefined
    const initial: RfiInput = item
      ? {
          project_id: item.project_id,
          rfi_number: item.rfi_number,
          title: item.title,
          question: item.question,
          status: item.status,
          raised_by: item.raised_by,
          raised_at: toDateTimeInput(item.raised_at),
          due_date: toDateInput(item.due_date),
          responded_at: toDateTimeInput(item.responded_at),
          response_summary: item.response_summary,
        }
      : defaultRfi
    const submitting = createRfiMutation.isPending || updateRfiMutation.isPending
    return (
      <RfiForm
        key={`rfi-${drawerState.mode}-${drawerState.item?.id ?? 'new'}`}
        initial={initial}
        submitting={submitting}
        onCancel={closeDrawer}
        onSubmit={(payload) => {
          if (drawerState.mode === 'create') {
            createRfiMutation.mutate(payload)
          } else if (drawerState.item) {
            updateRfiMutation.mutate({ id: drawerState.item.id, payload })
          }
        }}
      />
    )
  })()

  return (
    <section className="page">
      <div className="workspace__header">
        <div>
          <div className="workspace__eyebrow">Workspace</div>
          {project ? (
            <>
              <h1>{project.name}</h1>
              <p className="page__subtitle">{project.location}</p>
            </>
          ) : (
            <>
              <div className="skeleton skeleton-line skeleton-title" />
              <div className="skeleton skeleton-line skeleton-subtitle" />
            </>
          )}
        </div>
        {project ? (
          <div className="workspace__meta">
            <Badge label={project.status.replace('_', ' ')} tone="info" />
            <span>{project.phase ?? 'Phase TBD'}</span>
            <span>Target: {project.end_date}</span>
          </div>
        ) : (
          <div className="workspace__meta">
            <div className="skeleton skeleton-pill" />
            <div className="skeleton skeleton-line skeleton-meta" />
            <div className="skeleton skeleton-line skeleton-meta" />
          </div>
        )}
      </div>

      {(loadingBudgets ||
        loadingMilestones ||
        loadingRisks ||
        loadingRfis ||
        loadingApprovals ||
        !project) ? (
        <div className="grid grid--stats">
          {Array.from({ length: 7 }).map((_, index) => (
            <SkeletonCard key={`workspace-stat-${index}`} />
          ))}
        </div>
      ) : (
        <div className="grid grid--stats">
          <StatCard label="Original Budget" value={formatCurrency(budgetTotals.original, 'AUD')} helper="Baseline" />
          <StatCard label="Variations" value={formatCurrency(budgetTotals.variations, 'AUD')} helper="Approved" />
          <StatCard label="Forecast" value={formatCurrency(budgetTotals.forecast, 'AUD')} helper="Current" />
          <StatCard label="Actuals" value={formatCurrency(budgetTotals.actual, 'AUD')} helper="To date" />
          <StatCard label="Milestones" value={`${milestoneDone}/${projectMilestones.length}`} helper="Completed" />
          <StatCard label="Open Items" value={`${openRisks + openRfis}`} helper="Risks + RFIs" />
          <StatCard label="Pending Approvals" value={`${pendingApprovals}`} helper="Awaiting review" />
        </div>
      )}

      <div className="workspace__nav">
        <a className="workspace__link" href="#budgets">
          Budgets
        </a>
        <a className="workspace__link" href="#milestones">
          Milestones
        </a>
        <a className="workspace__link" href="#risks">
          Risks
        </a>
        <a className="workspace__link" href="#rfis">
          RFIs
        </a>
        <a className="workspace__link" href="#documents">
          Documents
        </a>
        <a className="workspace__link" href="#media">
          Media Library
        </a>
        <a className="workspace__link" href="#approvals">
          Approvals
        </a>
        <a className="workspace__link" href="#activity">
          Activity
        </a>
      </div>

      <div className="workspace__section" id="budgets">
        <div className="section__header">
          <div>
            <h2>Budget tracking</h2>
            <span className="section__meta">{projectBudgets.length} categories</span>
          </div>
          <button className="link-button" type="button" onClick={() => openDrawer('budget', 'create')} disabled={drawerBusy}>
            Add budget
          </button>
        </div>
        {loadingBudgets ? (
          <SkeletonTable
            headers={['Category', 'Original', 'Variations', 'Forecast', 'Actual', 'Status', 'Actions']}
            rows={3}
            className="table--seven"
          />
        ) : budgetsError ? (
          <div className="notice">Budget data is unavailable.</div>
        ) : (
          <div className="table table--seven">
            <div className="table__header">
              <span>Category</span>
              <span>Original</span>
              <span>Variations</span>
              <span>Forecast</span>
              <span>Actual</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {projectBudgets.map((item) => (
              <div key={item.id}>
                <div
                  className="table__row is-clickable"
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedBudgetId === item.id}
                  onClick={() => setExpandedBudgetId((current) => (current === item.id ? null : item.id))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setExpandedBudgetId((current) => (current === item.id ? null : item.id))
                    }
                  }}
                >
                <div>
                  <strong>{item.category}</strong>
                  <div className="subtle">{item.description}</div>
                </div>
                <span>{formatCurrency(item.original_budget, item.currency)}</span>
                <span>{formatCurrency(item.approved_variations, item.currency)}</span>
                <span>{formatCurrency(item.forecast_cost, item.currency)}</span>
                <span>{formatCurrency(item.actual_spent, item.currency)}</span>
                <Badge label={item.status.replace('_', ' ')} tone={budgetStatusTone(item.status)} />
                <div className="table__actions">
                  <button
                    className="link-button"
                    type="button"
                    disabled={drawerBusy}
                    onClick={(event) => {
                      event.stopPropagation()
                      openDrawer('budget', 'edit', item)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="link-button"
                    type="button"
                    disabled={deleteBudgetMutation.isPending || drawerBusy}
                    onClick={(event) => {
                      event.stopPropagation()
                      if (window.confirm('Delete this budget item?')) {
                        deleteBudgetMutation.mutate(item.id)
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
                </div>
                <div
                  className={`table__detail${expandedBudgetId === item.id ? ' is-open' : ''}`}
                  aria-hidden={expandedBudgetId !== item.id}
                >
                  <div className="detail-grid">
                    <div>
                      <span className="detail-label">Description</span>
                      <span>{item.description || '—'}</span>
                    </div>
                    <div>
                      <span className="detail-label">Cost code</span>
                      <span>{item.cost_code || '—'}</span>
                    </div>
                    <div>
                      <span className="detail-label">Currency</span>
                      <span>{item.currency}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <TableOverlay active={budgetsUpdating} message="Updating budgets…" />
          </div>
        )}
      </div>

      <div className="workspace__section" id="milestones">
        <div className="section__header">
          <h2>Timeline & milestones</h2>
          <span className="section__meta">Planned vs actual</span>
        </div>
        {loadingMilestones ? (
          <SkeletonTable
            headers={['Milestone', 'Planned', 'Actual', 'Complete', 'Status']}
            rows={3}
            className="table--five"
          />
        ) : milestonesError ? (
          <div className="notice">Milestone data is unavailable.</div>
        ) : (
          <div className="table table--five">
          <div className="table__header">
            <span>Milestone</span>
            <span>Planned</span>
            <span>Actual</span>
            <span>Complete</span>
            <span>Status</span>
          </div>
          {projectMilestones.map((item) => (
            <div className="table__row" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <div className="subtle">{item.description}</div>
              </div>
              <span>{item.planned_date}</span>
              <span>{item.actual_date ?? '—'}</span>
              <span>{item.percent_complete}%</span>
              <Badge label={item.status.replace('_', ' ')} tone={milestoneTone(item.status)} />
            </div>
          ))}
          <TableOverlay active={milestonesFetching && !loadingMilestones} message="Refreshing milestones…" />
          </div>
        )}
      </div>

      <div className="workspace__section" id="risks">
        <div className="section__header">
          <div>
            <h2>Risk register</h2>
            <span className="section__meta">{openRisks} open</span>
          </div>
          <button className="link-button" type="button" onClick={() => openDrawer('risk', 'create')} disabled={drawerBusy}>
            Add risk
          </button>
        </div>
        {loadingRisks ? (
          <SkeletonTable
            headers={['Risk', 'Category', 'Rating', 'Owner', 'Status', 'Actions']}
            rows={3}
            className="table--six"
          />
        ) : risksError ? (
          <div className="notice">Risk data is unavailable.</div>
        ) : (
          <div className="table table--six">
            <div className="table__header">
              <span>Risk</span>
              <span>Category</span>
              <span>Rating</span>
              <span>Owner</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {projectRisks.map((item) => (
              <div key={item.id}>
                <div
                  className="table__row is-clickable"
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedRiskId === item.id}
                  onClick={() => setExpandedRiskId((current) => (current === item.id ? null : item.id))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setExpandedRiskId((current) => (current === item.id ? null : item.id))
                    }
                  }}
                >
                <div>
                  <strong>{item.title}</strong>
                  <div className="subtle">{item.description}</div>
                </div>
                <span>{item.category}</span>
                <span>{item.rating}</span>
                <span>{item.owner}</span>
                <Badge label={item.status.replace('_', ' ')} tone={item.status === 'closed' ? 'success' : 'warning'} />
                <div className="table__actions">
                  <button
                    className="link-button"
                    type="button"
                    disabled={drawerBusy}
                    onClick={(event) => {
                      event.stopPropagation()
                      openDrawer('risk', 'edit', item)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="link-button"
                    type="button"
                    disabled={deleteRiskMutation.isPending || drawerBusy}
                    onClick={(event) => {
                      event.stopPropagation()
                      if (window.confirm('Delete this risk?')) {
                        deleteRiskMutation.mutate(item.id)
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
                </div>
                <div
                  className={`table__detail${expandedRiskId === item.id ? ' is-open' : ''}`}
                  aria-hidden={expandedRiskId !== item.id}
                >
                  <div className="detail-grid">
                    <div>
                      <span className="detail-label">Description</span>
                      <span>{item.description || '—'}</span>
                    </div>
                    <div>
                      <span className="detail-label">Mitigation plan</span>
                      <span>{item.mitigation_plan || '—'}</span>
                    </div>
                    <div>
                      <span className="detail-label">Likelihood / Impact</span>
                      <span>
                        {item.likelihood} / {item.impact}
                      </span>
                    </div>
                    <div>
                      <span className="detail-label">Due date</span>
                      <span>{formatDate(item.due_date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <TableOverlay active={risksUpdating} message="Updating risks…" />
          </div>
        )}
      </div>

      <div className="workspace__section" id="rfis">
        <div className="section__header">
          <div>
            <h2>RFIs</h2>
            <span className="section__meta">{openRfis} open</span>
          </div>
          <button className="link-button" type="button" onClick={() => openDrawer('rfi', 'create')} disabled={drawerBusy}>
            Add RFI
          </button>
        </div>
        {loadingRfis ? (
          <SkeletonTable
            headers={['RFI', 'Status', 'Raised by', 'Due', 'Response', 'Actions']}
            rows={3}
            className="table--six"
            badgeIndex={1}
          />
        ) : rfisError ? (
          <div className="notice">RFI data is unavailable.</div>
        ) : (
          <div className="table table--six">
            <div className="table__header">
              <span>RFI</span>
              <span>Status</span>
              <span>Raised by</span>
              <span>Due</span>
              <span>Response</span>
              <span>Actions</span>
            </div>
            {projectRfis.map((item) => (
              <div key={item.id}>
                <div
                  className="table__row is-clickable"
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedRfiId === item.id}
                  onClick={() => setExpandedRfiId((current) => (current === item.id ? null : item.id))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setExpandedRfiId((current) => (current === item.id ? null : item.id))
                    }
                  }}
                >
                <div>
                  <strong>{item.rfi_number}</strong>
                  <div className="subtle">{item.title}</div>
                </div>
                <Badge label={item.status} tone={rfiTone(item.status)} />
                <span>{item.raised_by}</span>
                <span>{item.due_date}</span>
                <span>{item.response_summary}</span>
                <div className="table__actions">
                  <button
                    className="link-button"
                    type="button"
                    disabled={drawerBusy}
                    onClick={(event) => {
                      event.stopPropagation()
                      openDrawer('rfi', 'edit', item)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="link-button"
                    type="button"
                    disabled={deleteRfiMutation.isPending || drawerBusy}
                    onClick={(event) => {
                      event.stopPropagation()
                      if (window.confirm('Delete this RFI?')) {
                        deleteRfiMutation.mutate(item.id)
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
                </div>
                <div
                  className={`table__detail${expandedRfiId === item.id ? ' is-open' : ''}`}
                  aria-hidden={expandedRfiId !== item.id}
                >
                  <div className="detail-grid">
                    <div>
                      <span className="detail-label">Question</span>
                      <span>{item.question || '—'}</span>
                    </div>
                    <div>
                      <span className="detail-label">Response summary</span>
                      <span>{item.response_summary || '—'}</span>
                    </div>
                    <div>
                      <span className="detail-label">Raised at</span>
                      <span>{formatDateTime(item.raised_at)}</span>
                    </div>
                    <div>
                      <span className="detail-label">Responded at</span>
                      <span>{formatDateTime(item.responded_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <TableOverlay active={rfisUpdating} message="Updating RFIs…" />
          </div>
        )}
      </div>

      <div className="workspace__section" id="documents">
        <div className="section__header">
          <h2>Documents</h2>
          <span className="section__meta">{projectDocuments.length} files</span>
        </div>
        {loadingDocuments ? (
          <SkeletonTable
            headers={['Document', 'Type', 'Version', 'Status', 'Owner']}
            rows={3}
            className="table--five"
          />
        ) : documentsError ? (
          <div className="notice">Document data is unavailable.</div>
        ) : (
          <div className="table table--five">
          <div className="table__header">
            <span>Document</span>
            <span>Type</span>
            <span>Version</span>
            <span>Status</span>
            <span>Owner</span>
          </div>
          {projectDocuments.map((item) => (
            <div className="table__row" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <div className="subtle">{item.description}</div>
              </div>
              <span>{item.doc_type}</span>
              <span>{item.version}</span>
              <Badge label={item.status} tone={item.status === 'approved' ? 'success' : 'neutral'} />
              <span>{item.uploaded_by}</span>
            </div>
          ))}
          <TableOverlay active={documentsFetching && !loadingDocuments} message="Refreshing documents…" />
          </div>
        )}
      </div>

      <div className="workspace__section" id="media">
        <div className="section__header">
        <h2>Media Library</h2>
        <span className="section__meta">{projectMedia.length} items</span>
        </div>
        {loadingMedia ? (
          <div className="grid grid--media">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard className="media-card" key={`media-skeleton-${index}`} />
            ))}
          </div>
        ) : mediaError ? (
          <div className="notice">Media library items are unavailable.</div>
        ) : (
          <div className="grid grid--media">
          {projectMedia.map((item) => (
            <div className="media-card" key={item.id}>
              <div className="media-card__image">
                <img
                  src={item.media_url}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </div>
              <div className="media-card__body">
                <div className="media-card__header">
                  <h3>{item.title}</h3>
                  <Badge
                    label={(item.media_type ?? 'update').replace('_', ' ')}
                    tone={mediaTone(item.media_type ?? 'update')}
                  />
                </div>
                <p className="subtle">{item.description}</p>
                <div className="media-card__meta">
                  <span>{formatDate(item.captured_at)}</span>
                  <span>Uploaded by {item.uploaded_by}</span>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      <div className="workspace__section" id="approvals">
        <div className="section__header">
          <h2>Approvals workflow</h2>
          <span className="section__meta">{pendingApprovals} pending</span>
        </div>
        {loadingApprovals ? (
          <SkeletonTable
            headers={['Item', 'Status', 'Requested by', 'Reviewed by', 'Decision', 'Actions']}
            rows={3}
            className="table--approvals"
            badgeIndex={1}
          />
        ) : approvalsError ? (
          <div className="notice">Approval data is unavailable.</div>
        ) : (
          <div className="table table--approvals">
          <div className="table__header">
            <span>Item</span>
            <span>Status</span>
            <span>Requested by</span>
            <span>Reviewed by</span>
            <span>Decision</span>
            <span>Actions</span>
          </div>
          {projectApprovals.map((item) => {
            const rowBusy = approvalAction?.id === item.id
            return (
            <div className="table__row" key={item.id}>
              <div>
                <strong>{item.entity_type}</strong>
                <div className="subtle">{item.entity_id}</div>
              </div>
              <div className="table__badge">
                <Badge label={item.status} tone={approvalTone(item.status)} />
              </div>
              <span>{item.requested_by}</span>
              <span>{item.reviewed_by ?? '—'}</span>
              <span>{item.decision_note || '—'}</span>
              <div className="table__actions">
                {rowBusy ? (
                  <>
                    <span className="inline-spinner" aria-hidden="true" />
                    <span className="subtle">Processing</span>
                  </>
                ) : item.status === 'pending' ? (
                  <>
                    <button
                      className="link-button"
                      type="button"
                      disabled={approvalsUpdating}
                      onClick={() => approveMutation.mutate(item.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="link-button"
                      type="button"
                      disabled={approvalsUpdating}
                      onClick={() => rejectMutation.mutate(item.id)}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button
                    className="link-button"
                    type="button"
                    disabled={approvalsUpdating}
                    onClick={() => submitMutation.mutate(item.id)}
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
            )
          })}
          <TableOverlay active={approvalsUpdating} message="Updating approvals…" />
          </div>
        )}
      </div>

      <div className="workspace__section" id="activity">
        <div className="section__header">
          <h2>Activity log</h2>
          <span className="section__meta">Latest updates</span>
        </div>
        {activityError ? (
          <div className="notice">Activity log is unavailable.</div>
        ) : loadingActivity ? (
          <SkeletonTable
            headers={['Actor', 'Action', 'Entity', 'Reference', 'Date']}
            rows={3}
            className="table--five"
          />
        ) : (
          <div className="table table--five">
          <div className="table__header">
            <span>Actor</span>
            <span>Action</span>
            <span>Entity</span>
            <span>Reference</span>
            <span>Date</span>
          </div>
          {projectActivity.map((item) => (
            <div className="table__row" key={item.id}>
              <div>
                <strong>{item.actor}</strong>
                <div className="subtle">
                  {(item.metadata ?? {}).note ??
                    (item.metadata ?? {}).title ??
                    'Update recorded'}
                </div>
              </div>
              <span>{item.action}</span>
              <span>{item.entity_type}</span>
              <span>{item.entity_id}</span>
              <span>{formatDate(item.created_at)}</span>
            </div>
          ))}
          <TableOverlay active={activityFetching} message="Refreshing activity…" />
          </div>
        )}
        {!activityError && activityPayload ? (
          <div className="pagination">
            <div className="pagination__meta">
              <span>
                Page {activityPage} of {activityTotalPages}
              </span>
              <label className="pagination__page-size">
                Show
                <select
                  value={activityPageSize}
                  onChange={(event) => {
                    setActivityPageSize(Number(event.target.value))
                    setActivityPage(1)
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                per page
              </label>
            </div>
            <div className="pagination__controls">
              <button
                className="link-button"
                type="button"
                disabled={activityPage === 1}
                onClick={() => setActivityPage(1)}
              >
                First
              </button>
              <button
                className="link-button"
                type="button"
                disabled={activityPage === 1}
                onClick={() => setActivityPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </button>
              {activityPageWindow.map((page) => (
                <button
                  key={page}
                  className={`link-button pagination__page${page === activityPage ? ' is-active' : ''}`}
                  type="button"
                  disabled={false}
                  onClick={() => setActivityPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="link-button"
                type="button"
                disabled={activityPage === activityTotalPages}
                onClick={() => setActivityPage((prev) => Math.min(activityTotalPages, prev + 1))}
              >
                Next
              </button>
              <button
                className="link-button"
                type="button"
                disabled={activityPage === activityTotalPages}
                onClick={() => setActivityPage(activityTotalPages)}
              >
                Last
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <Drawer open={Boolean(drawerState)} title={drawerTitle} onClose={closeDrawer} busy={drawerBusy}>
        {drawerContent}
      </Drawer>
    </section>
  )
}

export default ProjectWorkspace

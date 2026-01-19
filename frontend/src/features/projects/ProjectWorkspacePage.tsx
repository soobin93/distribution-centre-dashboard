import { useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import Badge from '@/components/Badge'
import StatCard from '@/components/StatCard'
import Spinner from '@/components/Spinner'
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
import { approveApproval, rejectApproval, submitApproval } from '@/api/program'

const formatCurrency = (value: number | string, currency: string) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value))

const budgetStatusTone = (status: string) => {
  if (status === 'on_track') return 'success'
  if (status === 'at_risk') return 'warning'
  return 'danger'
}

const milestoneTone = (status: string) => {
  if (status === 'done') return 'success'
  if (status === 'in_progress') return 'info'
  return 'warning'
}

const rfiTone = (status: string) => {
  if (status === 'answered') return 'success'
  if (status === 'open') return 'warning'
  return 'neutral'
}

const approvalTone = (status: string) => {
  if (status === 'approved') return 'success'
  if (status === 'pending') return 'warning'
  return 'danger'
}

const mediaTone = (type: string) => {
  if (type === 'camera_feed') return 'info'
  if (type === 'photo') return 'success'
  return 'neutral'
}

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  const [date] = value.split('T')
  return date ?? '—'
}

const resolveProjectId = (item: { project_id?: string; project?: string }) =>
  item.project_id ?? item.project ?? ''

const ProjectWorkspacePage = () => {
  const { projectId } = useParams()
  const queryClient = useQueryClient()
  const { data: projects = [], isLoading: loadingProjects, isError: projectsError } = useProjects()
  const { data: budgets = [], isLoading: loadingBudgets, isError: budgetsError } = useBudgets(projectId)
  const { data: milestoneItems = [], isLoading: loadingMilestones, isError: milestonesError } = useMilestones(projectId)
  const { data: riskItems = [], isLoading: loadingRisks, isError: risksError } = useRisks(projectId)
  const { data: rfiItems = [], isLoading: loadingRfis, isError: rfisError } = useRfis(projectId)
  const { data: documentItems = [], isLoading: loadingDocuments, isError: documentsError } = useDocuments(projectId)
  const { data: mediaItems = [], isLoading: loadingMedia, isError: mediaError } = useMediaItems(projectId)
  const {
    data: approvalItems = [],
    isLoading: loadingApprovals,
    isError: approvalsError,
    isFetching: approvalsFetching,
  } = useApprovals(projectId)
  const {
    data: activityItems = [],
    isLoading: loadingActivity,
    isError: activityError,
    isFetching: activityFetching,
  } = useActivityLogs(projectId)
  const approvalActionBusyRefetch = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['approvals', projectId ?? 'all'] }),
      queryClient.invalidateQueries({ queryKey: ['activity', projectId ?? 'all'] }),
    ])
  }
  const approveMutation = useMutation({
    mutationFn: (approvalId: string) => approveApproval(approvalId),
    onSuccess: approvalActionBusyRefetch,
  })
  const rejectMutation = useMutation({
    mutationFn: (approvalId: string) => rejectApproval(approvalId),
    onSuccess: approvalActionBusyRefetch,
  })
  const submitMutation = useMutation({
    mutationFn: (approvalId: string) => submitApproval(approvalId),
    onSuccess: approvalActionBusyRefetch,
  })
  const approvalsUpdating =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    submitMutation.isPending ||
    approvalsFetching ||
    activityFetching
  const loading =
    loadingProjects ||
    loadingBudgets ||
    loadingMilestones ||
    loadingRisks ||
    loadingRfis ||
    loadingDocuments ||
    loadingMedia ||
    loadingApprovals ||
    loadingActivity

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
  const projectActivity = useMemo(
    () => activityItems.filter((item) => resolveProjectId(item) === projectId),
    [activityItems, projectId],
  )

  const project = projects.find((item) => item.id === projectId)

  if (loading) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Loading workspace</h1>
            <p className="page__subtitle">Fetching project data.</p>
          </div>
        </div>
        <Spinner label="Loading workspace" />
      </section>
    )
  }

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

  if (!project) {
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

  return (
    <section className="page">
      <div className="workspace__header">
        <div>
          <div className="workspace__eyebrow">Workspace</div>
          <h1>{project.name}</h1>
          <p className="page__subtitle">{project.location}</p>
        </div>
        <div className="workspace__meta">
          <Badge label={project.status.replace('_', ' ')} tone="info" />
          <span>{project.phase ?? 'Phase TBD'}</span>
          <span>Target: {project.end_date}</span>
        </div>
      </div>

      <div className="grid grid--stats">
        <StatCard label="Original Budget" value={formatCurrency(budgetTotals.original, 'AUD')} helper="Baseline" />
        <StatCard label="Variations" value={formatCurrency(budgetTotals.variations, 'AUD')} helper="Approved" />
        <StatCard label="Forecast" value={formatCurrency(budgetTotals.forecast, 'AUD')} helper="Current" />
        <StatCard label="Actuals" value={formatCurrency(budgetTotals.actual, 'AUD')} helper="To date" />
        <StatCard label="Milestones" value={`${milestoneDone}/${projectMilestones.length}`} helper="Completed" />
        <StatCard label="Open Items" value={`${openRisks + openRfis}`} helper="Risks + RFIs" />
        <StatCard label="Pending Approvals" value={`${pendingApprovals}`} helper="Awaiting review" />
      </div>

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
          <h2>Budget tracking</h2>
          <span className="section__meta">{projectBudgets.length} categories</span>
        </div>
        {budgetsError ? (
          <div className="notice">Budget data is unavailable.</div>
        ) : (
          <div className="table">
          <div className="table__header">
            <span>Category</span>
            <span>Original</span>
            <span>Variations</span>
            <span>Forecast</span>
            <span>Actual</span>
            <span>Status</span>
          </div>
          {projectBudgets.map((item) => (
            <div className="table__row" key={item.id}>
              <div>
                <strong>{item.category}</strong>
                <div className="subtle">{item.description}</div>
              </div>
              <span>{formatCurrency(item.original_budget, item.currency)}</span>
              <span>{formatCurrency(item.approved_variations, item.currency)}</span>
              <span>{formatCurrency(item.forecast_cost, item.currency)}</span>
              <span>{formatCurrency(item.actual_spent, item.currency)}</span>
              <Badge label={item.status.replace('_', ' ')} tone={budgetStatusTone(item.status)} />
            </div>
          ))}
          </div>
        )}
      </div>

      <div className="workspace__section" id="milestones">
        <div className="section__header">
          <h2>Timeline & milestones</h2>
          <span className="section__meta">Planned vs actual</span>
        </div>
        {milestonesError ? (
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
          </div>
        )}
      </div>

      <div className="workspace__section" id="risks">
        <div className="section__header">
          <h2>Risk register</h2>
          <span className="section__meta">{openRisks} open</span>
        </div>
        {risksError ? (
          <div className="notice">Risk data is unavailable.</div>
        ) : (
          <div className="table table--five">
          <div className="table__header">
            <span>Risk</span>
            <span>Category</span>
            <span>Rating</span>
            <span>Owner</span>
            <span>Status</span>
          </div>
          {projectRisks.map((item) => (
            <div className="table__row" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <div className="subtle">{item.description}</div>
              </div>
              <span>{item.category}</span>
              <span>{item.rating}</span>
              <span>{item.owner}</span>
              <Badge label={item.status.replace('_', ' ')} tone={item.status === 'closed' ? 'success' : 'warning'} />
            </div>
          ))}
          </div>
        )}
      </div>

      <div className="workspace__section" id="rfis">
        <div className="section__header">
          <h2>RFIs</h2>
          <span className="section__meta">{openRfis} open</span>
        </div>
        {rfisError ? (
          <div className="notice">RFI data is unavailable.</div>
        ) : (
          <div className="table table--five">
          <div className="table__header">
            <span>RFI</span>
            <span>Status</span>
            <span>Raised by</span>
            <span>Due</span>
            <span>Response</span>
          </div>
          {projectRfis.map((item) => (
            <div className="table__row" key={item.id}>
              <div>
                <strong>{item.rfi_number}</strong>
                <div className="subtle">{item.title}</div>
              </div>
              <Badge label={item.status} tone={rfiTone(item.status)} />
              <span>{item.raised_by}</span>
              <span>{item.due_date}</span>
              <span>{item.response_summary}</span>
            </div>
          ))}
          </div>
        )}
      </div>

      <div className="workspace__section" id="documents">
        <div className="section__header">
          <h2>Documents</h2>
          <span className="section__meta">{projectDocuments.length} files</span>
        </div>
        {documentsError ? (
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
          </div>
        )}
      </div>

      <div className="workspace__section" id="media">
        <div className="section__header">
        <h2>Media Library</h2>
        <span className="section__meta">{projectMedia.length} items</span>
        </div>
        {mediaError ? (
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
        {approvalsError ? (
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
            const approving = approveMutation.isPending && approveMutation.variables === item.id
            const rejecting = rejectMutation.isPending && rejectMutation.variables === item.id
            const reopening = submitMutation.isPending && submitMutation.variables === item.id
            const rowBusy = approving || rejecting || reopening
            return (
            <div className="table__row" key={item.id}>
              <div>
                <strong>{item.entity_type}</strong>
                <div className="subtle">{item.entity_id}</div>
              </div>
              <Badge label={item.status} tone={approvalTone(item.status)} />
              <span>{item.requested_by}</span>
              <span>{item.reviewed_by ?? '—'}</span>
              <span>{item.decision_note || '—'}</span>
              <div className="table__actions">
                {item.status === 'pending' ? (
                  <>
                    <button
                      className="link-button"
                      type="button"
                      disabled={approvalsUpdating}
                      aria-busy={approving}
                      onClick={() => approveMutation.mutate(item.id)}
                    >
                      {approving ? (
                        <>
                          <span className="inline-spinner" aria-hidden="true" />
                          Approving
                        </>
                      ) : (
                        'Approve'
                      )}
                    </button>
                    <button
                      className="link-button"
                      type="button"
                      disabled={approvalsUpdating}
                      aria-busy={rejecting}
                      onClick={() => rejectMutation.mutate(item.id)}
                    >
                      {rejecting ? (
                        <>
                          <span className="inline-spinner" aria-hidden="true" />
                          Rejecting
                        </>
                      ) : (
                        'Reject'
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    className="link-button"
                    type="button"
                    disabled={approvalsUpdating}
                    aria-busy={reopening}
                    onClick={() => submitMutation.mutate(item.id)}
                  >
                    {reopening ? (
                      <>
                        <span className="inline-spinner" aria-hidden="true" />
                        Reopening
                      </>
                    ) : (
                      'Reopen'
                    )}
                  </button>
                )}
              </div>
            </div>
            )
          })}
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
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectWorkspacePage

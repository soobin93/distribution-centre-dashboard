import { NavLink } from 'react-router-dom'
import StatCard from '../../components/StatCard'
import Badge from '../../components/Badge'
import { BarChart, DonutChart } from '../../components/Charts'
import Spinner from '../../components/Spinner'
import { useProgramSummary, useProjects } from '../../api/queries'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value)

const ProgramSummaryPage = () => {
  const {
    data: summary,
    isLoading: loadingSummary,
    isError: summaryError,
  } = useProgramSummary()
  const {
    data: projectList = [],
    isLoading: loadingProjects,
    isError: projectsError,
  } = useProjects()

  if ((loadingSummary && loadingProjects) || (!summary && loadingSummary)) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Program Summary</h1>
            <p className="page__subtitle">Loading program insights.</p>
          </div>
        </div>
        <Spinner label="Loading summary" />
      </section>
    )
  }

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Program Summary</h1>
          <p className="page__subtitle">
            Executive overview of the Distribution Centres capital infrastructure program.
          </p>
        </div>
        <div className="header__chips">
          <span className="chip">Reporting period: Jan 2026</span>
          <Badge label="On track" tone="success" />
        </div>
      </div>

      {summary ? (
        <div className="grid grid--stats">
          <StatCard
            label="Total Budget"
            value={formatCurrency(summary.total_original_budget)}
            helper="Approved baseline"
          />
          <StatCard
            label="Forecast"
            value={formatCurrency(summary.total_forecast_cost)}
            helper="Incl. variations"
          />
          <StatCard
            label="Actuals"
            value={formatCurrency(summary.total_actual_spend)}
            helper="To date"
          />
          <StatCard
            label="Milestones"
            value={`${summary.milestones_completed.completed}/${summary.milestones_completed.total}`}
            helper="Completed"
          />
          <StatCard label="Open Risks" value={`${summary.open_risks}`} helper="High + medium" />
          <StatCard label="Pending Approvals" value={`${summary.pending_approvals}`} helper="Awaiting sign-off" />
        </div>
      ) : (
        <div className="notice">Program totals are temporarily unavailable.</div>
      )}

      <div className="section">
        <div className="section__header">
          <h2>Project Health Snapshot</h2>
          <span className="section__meta">2 workspaces</span>
        </div>
        {projectsError ? (
          <div className="notice">Project list is unavailable. Please retry.</div>
        ) : (
          <div className="grid grid--cards">
            {projectList.map((project) => (
            <NavLink className="card-link" to={`/projects/${project.id}`} key={project.id}>
              <div className="card card--light">
                <div className="card__header">
                  <div>
                    <h3>{project.name}</h3>
                    <p className="card__subtle">{project.location}</p>
                  </div>
                  <Badge label={project.status.replace('_', ' ')} tone="info" />
                </div>
                <p className="card__body">{project.description}</p>
                <div className="card__footer">
                  <div>
                    <span className="label">Start</span>
                    <span>{project.start_date}</span>
                  </div>
                  <div>
                    <span className="label">Target</span>
                    <span>{project.end_date}</span>
                  </div>
                  <div>
                    <span className="label">Stage</span>
                    <span>{project.phase}</span>
                  </div>
                </div>
              </div>
            </NavLink>
            ))}
          </div>
        )}
      </div>

      <div className="section">
        <div className="section__header">
          <h2>Program Insights</h2>
          <span className="section__meta">Executive view</span>
        </div>
        {summary ? (
          <div className="grid grid--split">
            <div className="card card--light">
              <h3>Budget mix</h3>
              <p className="card__body">Approved baseline vs variations across the program.</p>
              <BarChart
                items={[
                  { label: 'Baseline', value: summary.total_original_budget, color: '#5672ff' },
                  { label: 'Variations', value: summary.total_variations, color: '#9d7bff' },
                ]}
              />
            </div>
            <div className="card card--light">
              <h3>Spend vs forecast</h3>
              <p className="card__body">Actuals tracked against current forecast.</p>
              <DonutChart
                value={summary.total_actual_spend}
                total={summary.total_forecast_cost}
                label="Actuals"
              />
            </div>
            <div className="card card--light">
              <h3>Milestones completed</h3>
              <p className="card__body">Overall completion across both distribution centres.</p>
              <DonutChart
                value={summary.milestones_completed.completed}
                total={summary.milestones_completed.total}
                label="Complete"
              />
            </div>
          </div>
        ) : (
          <div className="empty">Charts will appear once summary data loads.</div>
        )}
      </div>

      <div className="section">
        <div className="section__header">
          <h2>Governance Focus</h2>
          <span className="section__meta">Next 30 days</span>
        </div>
        <div className="grid grid--split">
          <div className="card card--gradient">
            <h3>Executive review pack</h3>
            <p className="card__body">
              Consolidated budget movement, risk posture, and approvals pipeline ready for steering committee.
            </p>
          </div>
          <div className="card card--light">
            <h3>Upcoming milestones</h3>
            <ul className="list">
              <li>North Brisbane — Structural completion sign-off</li>
              <li>South Brisbane — Services commissioning readiness</li>
              <li>Program — Safety audit and compliance review</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProgramSummaryPage

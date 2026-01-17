import { NavLink } from 'react-router-dom'
import StatCard from '../../components/StatCard'
import Badge from '../../components/Badge'
import { programSummary, projects } from './mock'

const ProgramSummaryPage = () => {
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

      <div className="grid grid--stats">
        <StatCard label="Total Budget" value={programSummary.total_original_budget} helper="Approved baseline" />
        <StatCard label="Forecast" value={programSummary.total_forecast_cost} helper="Incl. variations" />
        <StatCard label="Actuals" value={programSummary.total_actual_spend} helper="To date" />
        <StatCard label="Milestones" value={programSummary.milestones_completed} helper="Completed" />
        <StatCard label="Open Risks" value={programSummary.open_risks} helper="High + medium" />
        <StatCard label="Pending Approvals" value={programSummary.pending_approvals} helper="Awaiting sign-off" />
      </div>

      <div className="section">
        <div className="section__header">
          <h2>Project Health Snapshot</h2>
          <span className="section__meta">2 workspaces</span>
        </div>
        <div className="grid grid--cards">
          {projects.map((project) => (
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

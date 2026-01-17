import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import StatCard from '../../components/StatCard'
import Badge from '../../components/Badge'
import { getProgramSummary, getProjects } from '../../api/program'
import { programSummary as fallbackSummary, projects as fallbackProjects } from './mock'
import type { ProgramSummary, Project } from './types'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value)

const ProgramSummaryPage = () => {
  const [summary, setSummary] = useState<ProgramSummary>(fallbackSummary)
  const [projectList, setProjectList] = useState<Project[]>(fallbackProjects)

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryData, projectsData] = await Promise.all([
          getProgramSummary(),
          getProjects(),
        ])
        setSummary(summaryData)
        setProjectList(projectsData)
      } catch (error) {
        console.warn('Falling back to mock data', error)
      }
    }
    load()
  }, [])

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

      <div className="section">
        <div className="section__header">
          <h2>Project Health Snapshot</h2>
          <span className="section__meta">2 workspaces</span>
        </div>
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

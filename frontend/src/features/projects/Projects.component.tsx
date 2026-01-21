import { NavLink } from 'react-router-dom'
import Badge from '@/features/ui/badge/Badge.component'
import Spinner from '@/features/ui/spinner/Spinner.component'
import { useProjects } from '@/api/queries'

const Projects = () => {
  const { data: projectList = [], isLoading: loading, isError } = useProjects()

  if (loading) {
    return (
      <section className="page">
        <div className="page__header">
          <div>
            <h1>Project Workspaces</h1>
            <p className="page__subtitle">Loading workspace details.</p>
          </div>
        </div>
        <Spinner label="Loading workspaces" />
      </section>
    )
  }

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Project Workspaces</h1>
          <p className="page__subtitle">
            Dedicated workspaces for each emergency services infrastructure project, with live reporting context.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h2>Active workspaces</h2>
          <span className="section__meta">2 active projects</span>
        </div>
        {isError ? (
          <div className="notice">Workspaces could not be loaded. Please retry.</div>
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
                      <span className="label">Program</span>
                      <span>{project.program_name}</span>
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Projects

import Badge from '../../components/Badge'
import { projects } from './mock'

const ProjectsPage = () => {
  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Project Workspaces</h1>
          <p className="page__subtitle">
            Dedicated workspaces for each distribution centre project, with live reporting context.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <h2>Active workspaces</h2>
          <span className="section__meta">2 active projects</span>
        </div>
        <div className="grid grid--cards">
          {projects.map((project) => (
            <div className="card card--light" key={project.id}>
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
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsPage

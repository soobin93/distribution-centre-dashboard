import { NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import ProgramSummaryPage from "./features/projects/ProgramSummaryPage";
import ProjectWorkspacePage from "./features/projects/ProjectWorkspacePage";
import ProjectsPage from "./features/projects/ProjectsPage";
import { projects } from "./features/projects/mock";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-pill${isActive ? " is-active" : ""}`;

const AppLayout = () => {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="brand__title">Distribution Centres</div>
          <div className="brand__subtitle">Capital Infrastructure Program</div>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__label">Program</div>
          <nav className="sidebar__nav">
            <NavLink to="/" className={navLinkClass} end>
              Program summary
            </NavLink>
            <NavLink to="/projects" className={navLinkClass}>
              Project workspaces
            </NavLink>
          </nav>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__label">Workspaces</div>
          <nav className="sidebar__nav">
            {projects.map((project) => (
              <NavLink key={project.id} to={`/projects/${project.id}`} className={navLinkClass}>
                {project.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar__footer">
          <div className="sidebar__status">
            <span className="status__dot" />
            <span>Governance cycle: Q1 2026</span>
          </div>
        </div>
      </aside>

      <div className="content">
        <header className="content__topbar">
          <span className="topbar__eyebrow">Portfolio command centre</span>
          <h1 className="topbar__title">Distribution Centres Program</h1>
          <p className="topbar__subtitle">
            Purpose-built for executive visibility, assurance, and decision readiness.
          </p>
        </header>

        <main className="main">
          <Routes>
            <Route index element={<ProgramSummaryPage />} />
            <Route path="summary" element={<ProgramSummaryPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:projectId" element={<ProjectWorkspacePage />} />
            <Route
              path="*"
              element={
                <section className="page">
                  <div className="page__header">
                    <div>
                      <h1>Page not found</h1>
                      <p className="page__subtitle">
                        That route does not exist. Try returning to the program summary.
                      </p>
                    </div>
                  </div>
                </section>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  return <AppLayout />;
}

export default App;

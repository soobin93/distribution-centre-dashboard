import { NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import ActivityPage from "./features/activity/ActivityPage";
import ApprovalsPage from "./features/approvals/ApprovalsPage";
import BudgetsPage from "./features/budgets/BudgetsPage";
import DocumentsPage from "./features/documents/DocumentsPage";
import MediaUpdatesPage from "./features/media_updates/MediaUpdatesPage";
import MilestonesPage from "./features/milestones/MilestonesPage";
import ProgramSummaryPage from "./features/projects/ProgramSummaryPage";
import ProjectsPage from "./features/projects/ProjectsPage";
import RfisPage from "./features/rfis/RfisPage";
import RisksPage from "./features/risks/RisksPage";

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
            <NavLink to="/budgets" className={navLinkClass}>
              Budgets
            </NavLink>
            <NavLink to="/milestones" className={navLinkClass}>
              Milestones
            </NavLink>
            <NavLink to="/risks" className={navLinkClass}>
              Risks
            </NavLink>
            <NavLink to="/rfis" className={navLinkClass}>
              RFIs
            </NavLink>
          </nav>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__label">Records</div>
          <nav className="sidebar__nav">
            <NavLink to="/documents" className={navLinkClass}>
              Documents
            </NavLink>
            <NavLink to="/media" className={navLinkClass}>
              Media updates
            </NavLink>
            <NavLink to="/approvals" className={navLinkClass}>
              Approvals
            </NavLink>
            <NavLink to="/activity" className={navLinkClass}>
              Activity log
            </NavLink>
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
          <div className="topbar__meta">
            <span className="topbar__eyebrow">Portfolio command centre</span>
            <h1 className="topbar__title">Distribution Centres Program</h1>
            <p className="topbar__subtitle">
              Purpose-built for executive visibility, assurance, and decision readiness.
            </p>
          </div>
          <div className="topbar__actions">
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route index element={<ProgramSummaryPage />} />
            <Route path="summary" element={<ProgramSummaryPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="budgets" element={<BudgetsPage />} />
            <Route path="milestones" element={<MilestonesPage />} />
            <Route path="risks" element={<RisksPage />} />
            <Route path="rfis" element={<RfisPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="media" element={<MediaUpdatesPage />} />
            <Route path="approvals" element={<ApprovalsPage />} />
            <Route path="activity" element={<ActivityPage />} />
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

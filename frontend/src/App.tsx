import { useState } from "react";
import { NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import "@/App.css";
import ProgramSummaryPage from "@/features/projects/ProgramSummaryPage";
import ProjectWorkspacePage from "@/features/projects/ProjectWorkspacePage";
import ProjectsPage from "@/features/projects/ProjectsPage";
import MediaLibraryPage from "@/features/media_items/MediaLibraryPage";
import LoginPage from "@/pages/LoginPage";
import { useProjects } from "@/api/queries";
import { useAuth } from "@/auth/AuthContext";
import Spinner from "@/components/Spinner";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-pill${isActive ? " is-active" : ""}`;

const AuthedAppLayout = () => {
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    data: workspaceProjects = [],
    isLoading: loadingWorkspaces,
    isError: workspacesError,
  } = useProjects();

  const handleNavClick = () => {
    if (window.innerWidth <= 1100) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="app-shell">
      {sidebarOpen ? (
        <button
          className="sidebar__overlay"
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
      <aside className={`sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="sidebar__brand">
          <div className="brand__title">Emergency Services Infrastructure</div>
          <div className="brand__subtitle">Capital Infrastructure Program</div>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__label">Program</div>
          <nav className="sidebar__nav">
            <NavLink to="/" className={navLinkClass} end onClick={handleNavClick}>
              Program summary
            </NavLink>
            <NavLink to="/projects" className={navLinkClass} onClick={handleNavClick}>
              Project workspaces
            </NavLink>
            <NavLink to="/media" className={navLinkClass} onClick={handleNavClick}>
              Media Library
            </NavLink>
          </nav>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__label">Workspaces</div>
          <nav className="sidebar__nav">
            {loadingWorkspaces ? (
              <div className="sidebar__loading">
                <Spinner label="Loading workspaces" />
              </div>
            ) : workspacesError ? (
              <div className="sidebar__loading">Unable to load workspaces.</div>
            ) : (
              workspaceProjects.map((project) => (
                <NavLink
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className={navLinkClass}
                  onClick={handleNavClick}
                >
                  {project.name}
                </NavLink>
              ))
            )}
          </nav>
        </div>

        <div className="sidebar__footer">
          <div className="sidebar__status">
            <span className="status__dot" />
            <span>{user ? `Signed in as ${user.username}` : "Signed in"}</span>
          </div>
          <button className="sidebar__button" type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="content">
        <header className="content__topbar">
          <button
            className="sidebar-toggle"
            type="button"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <span className="topbar__eyebrow">Portfolio command centre</span>
          <h1 className="topbar__title">Emergency Services Infrastructure Program</h1>
          <p className="topbar__subtitle">
            Purpose-built for executive visibility, assurance, and decision readiness.
          </p>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<ProgramSummaryPage />} />
            <Route
              path="/summary"
              element={<ProgramSummaryPage />}
            />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectWorkspacePage />} />
            <Route path="/media" element={<MediaLibraryPage />} />
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

const AppLayout = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-shell">
        <Spinner label="Checking session…" />
      </div>
    );
  }

  if (!user) {
    if (location.pathname === "/login") {
      return <LoginPage />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }

  return <AuthedAppLayout />;
};

function App() {
  return <AppLayout />;
}

export default App;

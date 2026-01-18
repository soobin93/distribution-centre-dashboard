import { Navigate, useLocation } from 'react-router-dom'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/auth/AuthContext'

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="auth-shell">
        <Spinner label="Checking session…" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default RequireAuth

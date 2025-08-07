import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, fallback, requireAuth = true }) {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-osmo-purple border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return fallback || (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-osmo-purple rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-white">🔒</span>
          </div>
          <h2 className="text-2xl font-black text-osmo-dark mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access this feature and continue using Poligap.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-osmo-purple text-white px-6 py-3 rounded-osmo font-bold hover:bg-purple-700 transition-all shadow-osmo"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // If user should not be authenticated (login page) but is logged in
  if (!requireAuth && user) {
    return fallback || children;
  }

  // Render children if authentication requirements are met
  return children;
}

export default ProtectedRoute;

// components/AdminRoute.jsx
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (!loading && isAuthenticated && !user?.isAdmin) {
      window.location.href = '/';
      return;
    }
  }, [isAuthenticated, user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!user?.isAdmin) {
    return null;
  }

  return children;
};

export default AdminRoute;
// components/AdminRoute.jsx
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        console.log('🔒 AdminRoute: User not authenticated, redirecting to login');
        window.location.href = '/login';
        return;
      }
      
      if (!user?.isAdmin) {
        console.log('🚫 AdminRoute: User not admin, redirecting to home');
        console.log('👤 User details:', { 
          id: user?.id, 
          name: user?.name, 
          isAdmin: user?.isAdmin 
        });
        window.location.href = '/';
        return;
      }
      
      console.log('✅ AdminRoute: User is admin, allowing access');
    }
  }, [isAuthenticated, user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Checking permissions...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
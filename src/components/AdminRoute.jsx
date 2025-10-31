// components/AdminRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  console.log('AdminRoute - User:', user); // Debug log
  console.log('AdminRoute - isAdmin:', user?.isAdmin); // Debug log

  // Check if user is authenticated and is admin
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Fix: Use isAdmin (capital A) and check for boolean true
  if (user.isAdmin !== true) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
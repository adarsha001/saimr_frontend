import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleAddPropertyClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
  };

  return (
    <nav className="flex items-center justify-between bg-blue-600 text-white p-4">
      <Link to="/" className="text-lg font-bold flex items-center space-x-2">
        <span>🏡</span>
        <span>RealEstate</span>
      </Link>
      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:text-blue-200 transition-colors">Properties</Link>
        
        {/* Add Property with Tooltip */}
        <div className="relative">
          <Link 
            to={user ? "/add-property" : "#"}
            onClick={handleAddPropertyClick}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              user 
                ? "bg-white text-blue-600 hover:bg-blue-50" 
                : "bg-gray-400 text-white cursor-not-allowed hover:bg-gray-500"
            }`}
          >
            Add Property
          </Link>
          
          {/* Tooltip for non-logged in users */}
          {showTooltip && !user && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap z-50">
              Please login to add property
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          )}
        </div>
        
        {user ? (
          <>
            <Link to="/profile" className="hover:text-blue-200 transition-colors">
              Welcome, {user.username}
            </Link>
            <button 
              onClick={logout} 
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="hover:text-blue-200 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleAddPropertyClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
    // Close mobile menu when clicking on a link
    setIsMobileMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white text-gray-900 shadow-lg border-b border-gray-200    z-40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-lg font-bold hover:text-gray-700 transition-colors"
            onClick={handleNavLinkClick}
          >
            <div> 
              <img className='w-[20%]' src="/logo.png" alt="Logo" />
            </div> 
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="hover:text-gray-700 transition-colors px-3 py-2 rounded-md text-sm font-medium border border-transparent hover:border-gray-300"
            >
              Properties
            </Link>
            
            {/* Add Property with Tooltip */}
            <div className="relative">
              <Link 
                to={user ? "/add-property" : "#"}
                onClick={handleAddPropertyClick}
                className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                  user 
                    ? "bg-black text-white hover:bg-gray-800 border-black" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-400 border-gray-400"
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
                <Link 
                  to="/profile" 
                  className="hover:text-gray-700 transition-colors px-3 py-2 rounded-md text-sm font-medium border border-transparent hover:border-gray-300"
                >
                  Welcome, {user.username}
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded transition-colors text-sm font-medium border border-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="hover:text-gray-700 transition-colors px-3 py-2 rounded-md text-sm font-medium border border-transparent hover:border-gray-300"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm border border-black"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 border border-gray-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-50 border-t border-gray-200`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-700 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
            onClick={handleNavLinkClick}
          >
            Properties
          </Link>

          {/* Add Property for Mobile */}
          <div className="relative">
            <Link
              to={user ? "/add-property" : "#"}
              onClick={handleAddPropertyClick}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors border ${
                user 
                  ? "bg-black text-white hover:bg-gray-800 border-black" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400"
              }`}
            >
              Add Property
            </Link>
            
            {/* Mobile Tooltip */}
            {showTooltip && !user && (
              <div className="absolute left-0 right-0 mt-2 mx-2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg z-50">
                Please login to add property
                <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            )}
          </div>

          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-700 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                onClick={handleNavLinkClick}
              >
                Welcome, {user.username}
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-gray-800 hover:bg-gray-900 text-white transition-colors border border-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:text-gray-700 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-300"
                onClick={handleNavLinkClick}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium bg-black text-white hover:bg-gray-800 transition-colors border border-black"
                onClick={handleNavLinkClick}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
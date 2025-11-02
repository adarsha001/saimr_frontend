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
    setIsMobileMenuOpen(false);
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  // Check for admin in multiple possible fields
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true || user?.admin === true;

  return (
    <nav className="bg-white text-gray-900 shadow-lg border-b border-gray-200 z-40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:text-gray-700 transition-colors flex-shrink-0"
            onClick={handleNavLinkClick}
          >
            <img className='w-10 h-10 sm:w-12 sm:h-12' src="/logo.png" alt="Logo" />

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            <Link 
              to="/" 
              className="hover:text-gray-700 transition-colors px-3 py-2 rounded-md text-sm font-medium border border-transparent hover:border-gray-300 whitespace-nowrap"
            >
              Properties
            </Link>
            
            <Link 
              to="/featured" 
              className="hover:text-gray-700 transition-colors px-3 py-2 rounded-md text-sm font-medium border border-transparent hover:border-gray-300 whitespace-nowrap"
            >
              Featured
            </Link>
            
            {/* Admin Dashboard Button - Only for Admin Users */}
            {isAdmin && (
              <Link 
                to="/admin"
                className="bg-purple-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm border border-purple-600 flex items-center space-x-1 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Admin</span>
              </Link>
            )}
            
            {/* Add Property Button */}
            <div className="relative">
              <Link 
                to={user ? "/add-property" : "#"}
                onClick={handleAddPropertyClick}
                className={`px-3 py-2 rounded-lg font-medium transition-colors border text-sm whitespace-nowrap ${
                  user 
                    ? "bg-black text-white hover:bg-gray-800 border-black" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-400 border-gray-400"
                }`}
              >
                Add Property
              </Link>
              
              {showTooltip && !user && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap z-50">
                  Please login to add property
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                </div>
              )}
            </div>
            
            {user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/profile" 
                  className="hover:text-gray-700 transition-colors px-3 py-2 rounded-md text-sm font-medium border border-transparent hover:border-gray-300 whitespace-nowrap"
                >
                  <span className="hidden xl:inline">Welcome, </span>{user.username}
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded transition-colors text-sm font-medium border border-gray-800 whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="hover:text-gray-700 transition-colors px-3 py-2 rounded-md text-sm font-medium border border-transparent hover:border-gray-300 whitespace-nowrap"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-black text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm border border-black whitespace-nowrap"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Tablet Navigation (hidden on mobile, shown on md) */}
          <div className="hidden md:flex lg:hidden items-center space-x-2">
            {isAdmin && (
              <Link 
                to="/admin"
                className="bg-purple-600 text-white p-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm border border-purple-600"
                title="Admin Dashboard"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </Link>
            )}
            
            <div className="relative">
              <Link 
                to={user ? "/add-property" : "#"}
                onClick={handleAddPropertyClick}
                className={`p-2 rounded-lg font-medium transition-colors border text-sm ${
                  user 
                    ? "bg-black text-white hover:bg-gray-800 border-black" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-400 border-gray-400"
                }`}
                title="Add Property"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/profile" 
                  className="p-2 hover:text-gray-700 transition-colors rounded-md text-sm font-medium border border-transparent hover:border-gray-300"
                  title="Profile"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-gray-800 hover:bg-gray-900 text-white p-2 rounded transition-colors text-sm font-medium border border-gray-800"
                  title="Logout"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className="p-2 hover:text-gray-700 transition-colors rounded-md text-sm font-medium border border-transparent hover:border-gray-300"
                  title="Login"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Link>
                <Link 
                  to="/register" 
                  className="bg-black text-white p-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm border border-black"
                  title="Register"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 border border-gray-300 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-5 w-5`}
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
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-5 w-5`}
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
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden bg-white border-t border-gray-200 shadow-lg`}>
        <div className="px-2 pt-2 pb-4 space-y-1">
          {/* Main Navigation Links */}
          <Link
            to="/"
            className="block px-3 py-3 rounded-lg text-base font-medium hover:text-gray-700 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
            onClick={handleNavLinkClick}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Properties</span>
            </div>
          </Link>

          <Link
            to="/featured"
            className="block px-3 py-3 rounded-lg text-base font-medium hover:text-gray-700 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
            onClick={handleNavLinkClick}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>Featured Properties</span>
            </div>
          </Link>

          {/* Admin Dashboard */}
          {isAdmin && (
            <Link
              to="/admin"
              className="block px-3 py-3 rounded-lg text-base font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors border border-purple-600"
              onClick={handleNavLinkClick}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Admin Dashboard</span>
              </div>
            </Link>
          )}

          {/* Add Property */}
          <div className="relative">
            <Link
              to={user ? "/add-property" : "#"}
              onClick={handleAddPropertyClick}
              className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors border ${
                user 
                  ? "bg-black text-white hover:bg-gray-800 border-black" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-400"
              }`}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Property</span>
              </div>
            </Link>
            
            {showTooltip && !user && (
              <div className="absolute left-0 right-0 mt-2 mx-2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg z-50">
                Please login to add property
                <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            )}
          </div>

          {/* User Section */}
          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-3 rounded-lg text-base font-medium hover:text-gray-700 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                onClick={handleNavLinkClick}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile ({user.username})</span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium bg-gray-800 hover:bg-gray-900 text-white transition-colors border border-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </div>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-3 rounded-lg text-base font-medium hover:text-gray-700 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                onClick={handleNavLinkClick}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Login</span>
                </div>
              </Link>
              <Link
                to="/register"
                className="block px-3 py-3 rounded-lg text-base font-medium bg-black text-white hover:bg-gray-800 transition-colors border border-black"
                onClick={handleNavLinkClick}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Register</span>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
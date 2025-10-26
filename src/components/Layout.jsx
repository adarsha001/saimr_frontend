// components/Layout.js
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-primary-600">
              RealEstate
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link href="/properties" className="text-gray-700 hover:text-primary-600">
                Properties
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="text-gray-700 hover:text-primary-600">
                    Profile
                  </Link>
                  <Link href="/my-properties" className="text-gray-700 hover:text-primary-600">
                    My Properties
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login" className="text-gray-700 hover:text-primary-600">
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <main>{children}</main>
    </div>
  );
};

export default Layout;
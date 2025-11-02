// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

// Create context with default values
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: async () => { 
    console.error('AuthProvider not found');
    throw new Error('AuthProvider not found');
  },
  register: async () => { 
    console.error('AuthProvider not found');
    throw new Error('AuthProvider not found');
  },
  logout: () => {
    console.error('AuthProvider not found');
  },
  updateUser: () => {
    console.error('AuthProvider not found');
  },
  loading: true,
  userInfo: null
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('🔐 AuthProvider initialized - Setting up context');

  // Initialize user from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        console.log('🔄 Initializing auth from localStorage:', { 
          hasStoredUser: !!storedUser, 
          hasToken: !!token 
        });

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log('✅ User restored from localStorage:', {
            id: parsedUser.id,
            name: parsedUser.name,
            username: parsedUser.username,
            isAdmin: parsedUser.isAdmin
          });
        } else {
          console.log('ℹ️ No stored user found');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        setUser(null);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Initialize session ID
  useEffect(() => {
    const initializeSession = () => {
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('sessionId', sessionId);
      }
      console.log('🔑 Session initialized:', sessionId);
    };
    
    initializeSession();
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      console.log('🔐 Attempting login...');
      const { data } = await API.post('/auth/login', { emailOrUsername, password });
      
      if (data.success && data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        
        console.log('✅ User logged in successfully:', {
          id: data.user.id,
          name: data.user.name,
          username: data.user.username,
          isAdmin: data.user.isAdmin
        });
        
        return { success: true, user: data.user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      console.log('👤 Attempting registration...');
      const { data } = await API.post('/auth/register', formData);
      
      if (data.success && data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        
        console.log('✅ User registered successfully:', {
          id: data.user.id,
          name: data.user.name,
          username: data.user.username,
          isAdmin: data.user.isAdmin
        });
        
        return { success: true, user: data.user };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    const userInfo = user ? {
      id: user.id,
      name: user.name,
      username: user.username
    } : null;
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Keep sessionId for anonymous tracking after logout
    setUser(null);
    
    console.log('🚪 User logged out:', userInfo);
  };

  const updateUser = (updatedUser) => {
    console.log('🔄 Updating user:', updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    userInfo: user ? {
      id: user.id,
      name: user.name,
      username: user.username,
      gmail: user.gmail,
      userType: user.userType,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin
    } : null
  };

  console.log('🔐 Current auth state:', { 
    user: user ? { id: user.id, name: user.name, isAdmin: user.isAdmin } : null, 
    loading,
    isAuthenticated: !!user 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // This will help identify where the issue is
  if (context === undefined) {
    console.error('❌ useAuth must be used within an AuthProvider');
    console.trace('Stack trace for useAuth error');
    
    // Return safe fallback to prevent crashes
    return {
      user: null,
      isAuthenticated: false,
      login: async () => { 
        console.error('AuthProvider not available');
        throw new Error('Authentication not available');
      },
      register: async () => { 
        console.error('AuthProvider not available');
        throw new Error('Authentication not available');
      },
      logout: () => {
        console.error('AuthProvider not available');
      },
      updateUser: () => {
        console.error('AuthProvider not available');
      },
      loading: false,
      userInfo: null
    };
  }
  
  return context;
};
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      console.log('🔄 Reading user from localStorage:', storedUser);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('❌ Error parsing stored user:', error);
      return null;
    }
  });

  console.log('🔐 Current auth state:', { user, hasUser: !!user });

  // Initialize session ID on app start
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
          gmail: data.user.gmail
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
          gmail: data.user.gmail
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
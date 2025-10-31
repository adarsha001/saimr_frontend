// src/contexts/AdminContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { adminAPI } from '../api/axios';

const AdminContext = createContext();

const initialState = {
  // Properties
  properties: [],
  propertiesLoading: false,
  propertiesError: null,
  
  // Users
  users: [],
  usersLoading: false,
  usersError: null,
  
  // Stats
  stats: null,
  statsLoading: false,
  statsError: null,
  
  // Filters
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    status: 'all',
    category: 'all',
    city: 'all',
    isVerified: 'all',
    isFeatured: 'all',
    forSale: 'all',
    userType: 'all',
    search: ''
  }
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        [`${action.payload.type}Loading`]: action.payload.loading
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        [`${action.payload.type}Error`]: action.payload.error
      };
    
    case 'SET_PROPERTIES':
      return {
        ...state,
        properties: action.payload.properties,
        propertiesError: null
      };
    
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload.users,
        usersError: null
      };
    
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload.stats,
        statsError: null
      };
    
    case 'UPDATE_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload.filters,
          page: 1 // Reset to first page when filters change
        }
      };
    
    case 'UPDATE_PROPERTY':
      const updatedProperties = state.properties.map(property =>
        property._id === action.payload.propertyId
          ? { ...property, ...action.payload.updates }
          : property
      );
      return { ...state, properties: updatedProperties };
    
    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter(property => property._id !== action.payload.propertyId)
      };
    
    default:
      return state;
  }
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);

  // Action creators
  const actions = {
    // Properties
    fetchProperties: async (filters = {}) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: { type: 'properties', loading: true } });
        
        const allFilters = { ...state.filters, ...filters };
        const response = await adminAPI.getProperties(allFilters);
        
        dispatch({ type: 'SET_PROPERTIES', payload: { properties: response.data.data } });
        dispatch({ type: 'UPDATE_FILTERS', payload: { filters } });
        
        return response.data;
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: { 
            type: 'properties', 
            error: error.response?.data?.message || 'Failed to fetch properties' 
          } 
        });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { type: 'properties', loading: false } });
      }
    },

    verifyProperty: async (propertyId) => {
      try {
        await adminAPI.verifyProperty(propertyId);
        dispatch({ 
          type: 'UPDATE_PROPERTY', 
          payload: { propertyId, updates: { isVerified: true } } 
        });
      } catch (error) {
        throw error;
      }
    },

    unverifyProperty: async (propertyId) => {
      try {
        await adminAPI.unverifyProperty(propertyId);
        dispatch({ 
          type: 'UPDATE_PROPERTY', 
          payload: { propertyId, updates: { isVerified: false } } 
        });
      } catch (error) {
        throw error;
      }
    },

    featureProperty: async (propertyId) => {
      try {
        await adminAPI.featureProperty(propertyId);
        dispatch({ 
          type: 'UPDATE_PROPERTY', 
          payload: { propertyId, updates: { isFeatured: true } } 
        });
      } catch (error) {
        throw error;
      }
    },

    unfeatureProperty: async (propertyId) => {
      try {
        await adminAPI.unfeatureProperty(propertyId);
        dispatch({ 
          type: 'UPDATE_PROPERTY', 
          payload: { propertyId, updates: { isFeatured: false } } 
        });
      } catch (error) {
        throw error;
      }
    },

    deleteProperty: async (propertyId) => {
      try {
        await adminAPI.deleteProperty(propertyId);
        dispatch({ type: 'DELETE_PROPERTY', payload: { propertyId } });
      } catch (error) {
        throw error;
      }
    },

    // Users
    fetchUsers: async (filters = {}) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: { type: 'users', loading: true } });
        
        const response = await adminAPI.getUsers(filters);
        dispatch({ type: 'SET_USERS', payload: { users: response.data.data } });
        
        return response.data;
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: { 
            type: 'users', 
            error: error.response?.data?.message || 'Failed to fetch users' 
          } 
        });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { type: 'users', loading: false } });
      }
    },

    // Stats
    fetchStats: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: { type: 'stats', loading: true } });
        
        const response = await adminAPI.getStats();
        dispatch({ type: 'SET_STATS', payload: { stats: response.data.data } });
        
        return response.data;
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: { 
            type: 'stats', 
            error: error.response?.data?.message || 'Failed to fetch stats' 
          } 
        });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: { type: 'stats', loading: false } });
      }
    },

    updateFilters: (filters) => {
      dispatch({ type: 'UPDATE_FILTERS', payload: { filters } });
    }
  };

  // Load initial data
  useEffect(() => {
    actions.fetchStats();
  }, []);

  return (
    <AdminContext.Provider value={{ state, actions }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
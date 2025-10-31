// contexts/LikesContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API from '../api/axios';

const LikesContext = createContext();

// Action types
const LIKES_ACTIONS = {
  SET_LIKES: 'SET_LIKES',
  ADD_LIKE: 'ADD_LIKE',
  REMOVE_LIKE: 'REMOVE_LIKE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Reducer
const likesReducer = (state, action) => {
  switch (action.type) {
    case LIKES_ACTIONS.SET_LIKES:
      return {
        ...state,
        likedProperties: action.payload,
        loading: false,
        error: null
      };
    
    case LIKES_ACTIONS.ADD_LIKE:
      return {
        ...state,
        likedProperties: [...state.likedProperties, action.payload],
        loading: false
      };
    
    case LIKES_ACTIONS.REMOVE_LIKE:
      return {
        ...state,
        likedProperties: state.likedProperties.filter(
          item => item?.property?._id !== action.payload
        ),
        loading: false
      };
    
    case LIKES_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case LIKES_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    default:
      return state;
  }
};

const initialState = {
  likedProperties: [],
  loading: false,
  error: null
};

export const LikesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(likesReducer, initialState);
  const { user } = useAuth();

  // Fetch user's liked properties when user logs in
  useEffect(() => {
    if (user) {
      fetchLikedProperties();
    } else {
      // Clear likes when user logs out
      dispatch({ type: LIKES_ACTIONS.SET_LIKES, payload: [] });
    }
  }, [user]);

  const fetchLikedProperties = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: LIKES_ACTIONS.SET_LOADING, payload: true });
      const response = await API.get('/users/profile');
      
      // Add comprehensive null checks for the API response
      const likedProperties = response.data?.user?.likedProperties || [];
      
      console.log('Raw liked properties from API:', likedProperties);
      
      // Filter out any invalid items that might have null properties
      const validLikedProperties = likedProperties.filter(
        item => item && item.property && item.property._id
      );
      
      console.log('Valid liked properties after filtering:', validLikedProperties);
      
      dispatch({ type: LIKES_ACTIONS.SET_LIKES, payload: validLikedProperties });
    } catch (error) {
      console.error('Error fetching liked properties:', error);
      dispatch({ 
        type: LIKES_ACTIONS.SET_ERROR, 
        payload: 'Failed to fetch liked properties' 
      });
    }
  };

  const likeProperty = async (propertyId) => {
    if (!user) {
      dispatch({ 
        type: LIKES_ACTIONS.SET_ERROR, 
        payload: 'Please login to like properties' 
      });
      return false;
    }

    try {
      dispatch({ type: LIKES_ACTIONS.SET_LOADING, payload: true });
      await API.post(`/users/like/${propertyId}`);
      
      // Optimistically update the UI
      const newLike = {
        property: { _id: propertyId }, // Minimal property data
        likedAt: new Date().toISOString()
      };
      dispatch({ type: LIKES_ACTIONS.ADD_LIKE, payload: newLike });
      return true;
    } catch (error) {
      console.error('Error liking property:', error);
      dispatch({ 
        type: LIKES_ACTIONS.SET_ERROR, 
        payload: 'Failed to like property' 
      });
      return false;
    }
  };

  const unlikeProperty = async (propertyId) => {
    if (!user) return false;

    try {
      dispatch({ type: LIKES_ACTIONS.SET_LOADING, payload: true });
      await API.delete(`/users/like/${propertyId}`);
      
      // Optimistically update the UI
      dispatch({ type: LIKES_ACTIONS.REMOVE_LIKE, payload: propertyId });
      return true;
    } catch (error) {
      console.error('Error unliking property:', error);
      dispatch({ 
        type: LIKES_ACTIONS.SET_ERROR, 
        payload: 'Failed to unlike property' 
      });
      return false;
    }
  };

  const toggleLike = async (propertyId) => {
    if (!user) {
      dispatch({ 
        type: LIKES_ACTIONS.SET_ERROR, 
        payload: 'Please login to like properties' 
      });
      return false;
    }

    const isCurrentlyLiked = isPropertyLiked(propertyId);

    if (isCurrentlyLiked) {
      return await unlikeProperty(propertyId);
    } else {
      return await likeProperty(propertyId);
    }
  };

  // Fixed isPropertyLiked function with comprehensive null checks
  const isPropertyLiked = (propertyId) => {
    // Check if propertyId is valid
    if (!propertyId) {
      console.warn('isPropertyLiked called with invalid propertyId:', propertyId);
      return false;
    }

    // Check if likedProperties array exists and has items
    if (!state.likedProperties || !Array.isArray(state.likedProperties)) {
      return false;
    }

    // Use safe array iteration with null checks
    return state.likedProperties.some(item => {
      // Check if item exists and has the expected structure
      if (!item || !item.property) {
        return false;
      }
      
      // Check if property has _id and compare
      return item.property._id === propertyId;
    });
  };

  const value = {
    ...state,
    likeProperty,
    unlikeProperty,
    toggleLike,
    isPropertyLiked,
    refetchLikes: fetchLikedProperties
  };

  return (
    <LikesContext.Provider value={value}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (!context) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
};
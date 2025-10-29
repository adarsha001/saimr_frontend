// contexts/ViewModeContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Action types
export const VIEW_MODE_ACTIONS = {
  SET_VIEW_MODE: 'SET_VIEW_MODE',
  TOGGLE_VIEW_MODE: 'TOGGLE_VIEW_MODE',
  SET_PERSIST: 'SET_PERSIST'
};

// Initial state
const initialState = {
  viewMode: 'grid', // 'grid' or 'list'
  persist: true // whether to save to localStorage
};

// Reducer function
const viewModeReducer = (state, action) => {
  switch (action.type) {
    case VIEW_MODE_ACTIONS.SET_VIEW_MODE:
      return {
        ...state,
        viewMode: action.payload
      };
    
    case VIEW_MODE_ACTIONS.TOGGLE_VIEW_MODE:
      const newViewMode = state.viewMode === 'grid' ? 'list' : 'grid';
      return {
        ...state,
        viewMode: newViewMode
      };
    
    case VIEW_MODE_ACTIONS.SET_PERSIST:
      return {
        ...state,
        persist: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const ViewModeContext = createContext();

// Provider component
export function ViewModeProvider({ children }) {
  const [state, dispatch] = useReducer(viewModeReducer, initialState);

  // Load view mode from localStorage on mount
  useEffect(() => {
    if (state.persist) {
      const savedViewMode = localStorage.getItem('propertyViewMode');
      if (savedViewMode && (savedViewMode === 'grid' || savedViewMode === 'list')) {
        dispatch({
          type: VIEW_MODE_ACTIONS.SET_VIEW_MODE,
          payload: savedViewMode
        });
      }
    }
  }, [state.persist]);

  // Save view mode to localStorage when it changes
  useEffect(() => {
    if (state.persist) {
      localStorage.setItem('propertyViewMode', state.viewMode);
    }
  }, [state.viewMode, state.persist]);

  // Actions
  const setViewMode = (viewMode) => {
    if (viewMode !== 'grid' && viewMode !== 'list') {
      console.warn('Invalid view mode. Use "grid" or "list"');
      return;
    }
    dispatch({
      type: VIEW_MODE_ACTIONS.SET_VIEW_MODE,
      payload: viewMode
    });
  };

  const toggleViewMode = () => {
    dispatch({ type: VIEW_MODE_ACTIONS.TOGGLE_VIEW_MODE });
  };

  const setPersist = (persist) => {
    dispatch({
      type: VIEW_MODE_ACTIONS.SET_PERSIST,
      payload: persist
    });
  };

  const value = {
    viewMode: state.viewMode,
    persist: state.persist,
    setViewMode,
    toggleViewMode,
    setPersist
  };

  return (
    <ViewModeContext.Provider value={value}>
      {children}
    </ViewModeContext.Provider>
  );
}

// Custom hook to use view mode context
export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}

import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface AppState {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  performanceMode: 'standard' | 'optimized';
  accessibility: {
    screenReader: boolean;
    keyboardNavigation: boolean;
    highContrast: boolean;
  };
}

type AppAction = 
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'SET_PERFORMANCE_MODE'; payload: 'standard' | 'optimized' }
  | { type: 'UPDATE_ACCESSIBILITY'; payload: Partial<AppState['accessibility']> };

const initialState: AppState = {
  theme: 'light',
  language: 'en',
  notifications: true,
  performanceMode: 'standard',
  accessibility: {
    screenReader: false,
    keyboardNavigation: true,
    highContrast: false,
  },
};

/**
 * Reducer for managing global application state
 */
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notifications: !state.notifications };
    case 'SET_PERFORMANCE_MODE':
      return { ...state, performanceMode: action.payload };
    case 'UPDATE_ACCESSIBILITY':
      return { 
        ...state, 
        accessibility: { ...state.accessibility, ...action.payload } 
      };
    default:
      return state;
  }
};

const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

/**
 * Provider for global application state management
 */
export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

/**
 * Hook to access global application state
 */
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

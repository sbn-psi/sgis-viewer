import React, { createContext, useContext, useReducer } from 'react';
import { AppState } from './AppState';
import { stateReducer } from './AppStateReducer';
import data from './data.json';

export const StateContext = createContext()
export const useAppState = () => useContext(StateContext)

export const StateDispatchContext = createContext()
export const useAppStateDispatch = () => useContext(StateDispatchContext);

export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, new AppState(data));

  return (
    <StateContext.Provider value={state}>
      <StateDispatchContext.Provider value={dispatch}>
        {children}
      </StateDispatchContext.Provider>
    </StateContext.Provider>
  );
};

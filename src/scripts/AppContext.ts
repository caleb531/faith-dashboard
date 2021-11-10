import { createContext } from 'react';
import { AppState } from './App.d';

export interface AppContextValue {

  app: AppState,
  dispatchApp: Function

}

export const AppContext = createContext(<AppContextValue>{});

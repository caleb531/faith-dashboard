'use client';
import { createContext, Dispatch } from 'react';
import { AppState } from './app.types';
import { AppAction } from './AppReducer';

export type AppContextType = {
  app: AppState;
  dispatchToApp: Dispatch<AppAction>;
};

// @ts-ignore (the AppContext will be initiailized with a non-null value in my
// top-level App component)
const AppContext = createContext<AppContextType>({});
export default AppContext;

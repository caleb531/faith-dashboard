'use client';
import { createContext } from 'react';
import { AppState } from './app.types';

export type SyncContextType = {
  pullLatestAppFromServer: (app: AppState) => Promise<void>;
};

// @ts-ignore (the SyncContext will be initiailized with a non-null value in
// my top-level App component)
const SyncContext = createContext<SyncContextType>({});
export default SyncContext;

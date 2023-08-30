'use client';
import { createContext } from 'react';
import { AppState, SyncResponse } from './app.types';

export type SyncContextType = {
  pullLatestAppFromServer: (app: AppState) => Promise<SyncResponse>;
  pushLocalAppToServer: (app: AppState) => Promise<SyncResponse>;
};

// @ts-ignore (the SyncContext will be initiailized with a non-null value in
// my top-level App component)
const SyncContext = createContext<SyncContextType>({});
export default SyncContext;

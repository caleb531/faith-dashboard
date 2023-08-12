'use client';
import { createContext, Dispatch } from 'react';
import { AppAction } from './AppReducer';

// @ts-ignore (the AppContext will be initiailized with a non-null value in my
// top-level App component)
const AppContext = createContext<Dispatch<AppAction>>({});
export default AppContext;

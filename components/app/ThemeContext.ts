'use client';
import { createContext } from 'react';
import { AppThemeId } from './app.types';

export type ThemeContextType = AppThemeId;

// @ts-ignore (the ThemeContext will be initiailized with a non-null value in
// my top-level App component)
const ThemeContext = createContext<ThemeContextType>();
export default ThemeContext;

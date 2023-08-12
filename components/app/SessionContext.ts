'use client';
import { Session } from '@supabase/supabase-js';
import { createContext } from 'react';

const SessionContext = createContext<Session | null>(null);
export default SessionContext;

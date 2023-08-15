'use client';
import { Session, User } from '@supabase/supabase-js';
import { createContext } from 'react';

export type SessionContextType = {
  session: Session | null;
  user: User | null;
};

// @ts-ignore (the SessionContext will be initiailized with a non-null value in
// my top-level App component)
const SessionContext = createContext<SessionContextType>({});
export default SessionContext;

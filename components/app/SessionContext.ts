'use client';
import { Session, User } from '@supabase/supabase-js';
import { createContext } from 'react';
import type { AuthResult } from '../authUtils.shared';

export type SessionContextType = {
  session: Session | null;
  user: User | null;
  isSignedIn?: boolean;
  // Unknown authentication must not be presented as a confirmed logout
  authStatus?: AuthResult['status'];
  // Recovery stays active until verification succeeds or the retry budget ends
  isConnecting?: boolean;
};

// @ts-ignore (the SessionContext will be initiailized with a non-null value in
// my top-level App component)
const SessionContext = createContext<SessionContextType>({});
export default SessionContext;

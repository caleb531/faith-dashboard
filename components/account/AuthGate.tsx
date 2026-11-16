'use client';
import { useContext, useEffect, type ReactNode } from 'react';
import { assignLocation } from '../navigationUtils';
import SessionContext from '../app/SessionContext';

// The same landing-page rules apply after background verification succeeds
type Props = {
  isProtected?: boolean;
  signInUrl: string;
  redirectSignedInUsersTo?: string;
  children: ReactNode;
};

// Keep account content inaccessible until authentication has been verified
export default function AuthGate({
  isProtected,
  signInUrl,
  redirectSignedInUsersTo,
  children
}: Props) {
  // Recovery updates this context without requiring another server render
  const { authStatus } = useContext(SessionContext);
  // Restore the existing redirects once an unknown auth state is resolved
  const redirectTo =
    isProtected && authStatus === 'anonymous'
      ? signInUrl
      : authStatus === 'authenticated'
        ? redirectSignedInUsersTo
        : undefined;

  useEffect(() => {
    if (redirectTo) {
      assignLocation(redirectTo);
    }
  }, [redirectTo]);

  if (redirectTo || (isProtected && authStatus !== 'authenticated')) {
    return null;
  }
  return children;
}

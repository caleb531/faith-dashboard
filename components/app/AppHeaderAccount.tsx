import { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AccountAuthFlow from '../account/AccountAuthFlow';
import { isSessionActive, refreshSession, shouldRefreshSession } from '../accountUtils';
import { supabase } from '../supabaseClient';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';

function AppHeaderAccount() {
  const [isShowingMenu, setIsShowingMenu] = useState(false);
  const [isExpiryMessageHidden, setIsExpiryMessageHidden] = useState(false);
  // The number of milliseconds the "Session expired" message should show
  // before it is automatically hidden
  const expiryMessageDuration = 2000;
  // The session will be loaded asynchronously and isomorphically, via a
  // useEffect() call later in this function; this is done to avoid SSR
  // mismatches (please see the hook below)
  const [session, setSession] = useState<Session | null>(null);
  const [authModalIsOpen, setSignInModalIsOpen] = useState(false);

  async function signOut() {
    const confirmation = confirm('Are you sure you want to sign out? This means syncing will stop working until you sign back in again.');
    if (!confirmation) {
      return;
    }
    const { error } = await supabase.auth.signOut();
    console.log('error', error);
    if (!error) {
      // Revert to the default dashboard state when signing out
      localStorage.clear();
      window.location.reload();
    }
  }

  function onCloseSignInModal() {
    setSignInModalIsOpen(false);
  }

  // Update session asynchronously and isomorphically (so as to avoid any SSR
  // mismatch with the rendered page HTML); we use useIsomorphicLayoutEffect()
  // instead of useEffect() directly to minimize any possible page flicker
  useIsomorphicLayoutEffect(() => {
    setSession(supabase.auth.session());
  }, []);

  // Refresh the session (using the refresh token) if the session is more than
  // halfway elapsed
  useEffect(() => {
    if (isSessionActive(session) && shouldRefreshSession(session)) {
      refreshSession(session);
    }
  }, [session]);

  // If the user's session has expired, a "Session expired" message should
  // show, but in order to avoid frustrating the UX, hide this message after a
  // few seconds
  useEffect(() => {
    setTimeout(() => {
      setIsExpiryMessageHidden(true);
    }, expiryMessageDuration);
  });

  return session?.user && isSessionActive(session) ? (
    <div className="app-header-account">
      <label className="app-header-account-label accessibility-only" htmlFor="app-header-account-button">
         Your Account
      </label>
      <button
        type="button"
        className="app-header-account-button"
        onClick={() => setIsShowingMenu(!isShowingMenu)}>
        <img
        className="app-header-account-button-icon"
        src="icons/account-light.svg"
        alt="Your Account"
        draggable="false" />
      </button>
      {isShowingMenu ? (
        <div className="app-header-account-menu">
          <div
            className="app-header-account-menu-overlay"
            onClick={() => setIsShowingMenu(false)}>
          </div>
          <menu className="app-header-account-menu-list">
            <li
              className="app-header-account-menu-list-item app-header-account-menu-list-item-user-info">
                <a data-disabled>
                  <div className="app-header-account-menu-user-name">
                    {session.user.user_metadata.first_name} {session.user.user_metadata.last_name}
                  </div>
                  <div className="app-header-account-menu-user-email">
                    {session.user.email}
                  </div>
                </a>
              </li>
            <li
              className="app-header-account-menu-list-item app-header-account-menu-list-item-account-settings">
              <Link href="/account">Account Settings</Link>
            </li>
            <li
              className="app-header-account-menu-list-item app-header-account-menu-list-item-sign-out"
              onClick={signOut}>
              <a>Sign Out</a>
            </li>
          </menu>
        </div>
      ) : null}
    </div>
  ) : (
    <div className="app-header-account">
      <button
        type="button"
        className="app-header-account-button app-header-control-button"
        onClick={() => setSignInModalIsOpen(true)}>
        Sign Up/In
      </button>
      {session && !isSessionActive(session) && window.location.pathname === '/' && !isExpiryMessageHidden ? (
        <div className="app-header-account-menu">
          <menu className="app-header-account-menu-list">
            <li className="app-header-account-menu-list-item app-header-account-menu-list-expiry-message" data-disabled>
              Session expired. Please <Link href="/sign-in">sign in</Link> again.
            </li>
          </menu>
        </div>
      ) : null}
      {authModalIsOpen ? (
        <AccountAuthFlow onCloseModal={onCloseSignInModal} />
      ) : null}
    </div>
  );
}

export default AppHeaderAccount;

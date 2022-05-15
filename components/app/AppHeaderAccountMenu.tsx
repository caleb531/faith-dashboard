import React, { useEffect } from 'react';
import { supabase } from '../supabaseClient';

async function signIn() {
  const { user, session, error } = await supabase.auth.signIn({
    email: 'caleb@calebevans.me'
  });
  console.log('user', user);
  console.log('session', session);
  console.log('error', error);
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  console.log('error', error);
}

function AppHeaderAccountMenu() {
  useEffect(() => {
    console.log('user', supabase.auth.user());
  }, []);
  return (
    <div className="app-header-account-menu">
      <label className="app-header-account-menu-label accessibility-only" htmlFor="app-header-account-menu-button">
        Sign In
      </label>
      <button
        type="button"
        className="app-header-account-menu-button"
        onClick={signIn}>
        <img
        className="app-header-account-menu-button-icon"
        src="icons/account-light.svg"
        alt=""
        draggable="false" />
      </button>
    </div>
  );
}

export default AppHeaderAccountMenu;

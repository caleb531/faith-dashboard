'use client';
import { Session, User } from '@supabase/supabase-js';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import LoadingIndicator from '../reusable/LoadingIndicator';
import { getAppStorageKey } from '../storageUtils';
import TutorialFlow from '../tutorial/TutorialFlow';
import useAuthenticationDetection from '../useAuthDetection';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';
import useLocalStorage from '../useLocalStorage';
import useMountListener from '../useMountListener';
import useMultipleDashboardsMigration from '../useMultipleDashboardsMigration';
import useTouchDeviceDetection from '../useTouchDeviceDetection';
import AppContext from './AppContext';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import AppNotification from './AppNotification';
import reducer from './AppReducer';
import SessionContext from './SessionContext';
import ThemeContext from './ThemeContext';
import ThemeMetadata from './ThemeMetadata';
import UpdateNotification from './UpdateNotification';
import defaultApp from './appStateDefault';
import getAppNotificationMessage from './getAppNotificationMessage';
import useAppSync from './useAppSync';
import useThemeForEntirePage from './useThemeForEntirePage';

// Return a truthy value if the app's service worker should be loaded; the
// service worker always loads in a Production environment; however, by
// default, the service workr is *not* loaded in a local environment because
// other projects use localhost; this can be overridden via a single
// sessionStorage entry
function shouldLoadServiceWorker() {
  return (
    typeof navigator !== 'undefined' &&
    navigator.serviceWorker &&
    (!window.location.hostname.includes('localhost') ||
      sessionStorage.getItem('sw'))
  );
}

type Props = {
  enableTutorial?: boolean;
  canAddWidgets?: boolean;
  isClientOnly?: boolean;
  session: Session | null;
  user: User | null;
  children: React.ReactNode;
};

function App({
  enableTutorial = false,
  canAddWidgets = false,
  isClientOnly = false,
  session,
  user,
  children
}: Props) {
  const [restoreApp, saveApp] = useLocalStorage(getAppStorageKey(), defaultApp);
  const [app, dispatchToApp] = useReducer(reducer, defaultApp);
  const [isTurorialStarted, setIsTutorialStarted] = useState(false);

  useMultipleDashboardsMigration(app);

  // Update app state asynchronously and isomorphically (so as to avoid any SSR
  // mismatch with the rendered page HTML); we use useIsomorphicLayoutEffect()
  // instead of useEffect() directly to minimize any possible page flicker
  useIsomorphicLayoutEffect(() => {
    const newApp = restoreApp();
    // The below conditional is necessary to prevent a 'flash of default app
    // state' due to React 18's Strict Mode mounting the component twice; in
    // our case here, we require the user to have completed/skipped the
    // tutorial before restoring any persisted state of the app (see:
    // https://dev.to/ag-grid/react-18-avoiding-use-effect-getting-called-twice-4i9e)
    if (!newApp.shouldShowTutorial) {
      dispatchToApp({ type: 'replaceApp', payload: newApp });
    }
  }, [restoreApp]);

  // Serialize the app to localStorage whenever the app's state changes
  useEffect(() => {
    saveApp(app);
  }, [app, saveApp]);

  useAppSync(app, dispatchToApp);
  useThemeForEntirePage(app.theme);
  useAuthenticationDetection();

  // Defer the starting of the tutorial so the app's loading state isn't blurry
  useEffect(() => {
    if (!getAppNotificationMessage()) {
      setIsTutorialStarted(true);
    }
  }, [setIsTutorialStarted]);

  useTouchDeviceDetection();

  const isMounted = useMountListener();

  const appContext = useMemo(() => {
    return { app, dispatchToApp };
  }, [app, dispatchToApp]);

  const sessionContext = useMemo(() => {
    return { session, user };
  }, [session, user]);

  return (
    <AppContext.Provider value={appContext}>
      <SessionContext.Provider value={sessionContext}>
        <ThemeContext.Provider value={app.theme}>
          <div className="app">
            <ThemeMetadata />
            {shouldLoadServiceWorker() ? <UpdateNotification /> : null}
            <TutorialFlow
              inProgress={Boolean(
                app.shouldShowTutorial && enableTutorial && isTurorialStarted
              )}
            >
              <AppHeader canAddWidgets={canAddWidgets} />
              <AppNotification />
              {!isClientOnly || isMounted ? (
                <div className="app-contents">{children}</div>
              ) : (
                <LoadingIndicator />
              )}
              <AppFooter />
            </TutorialFlow>
          </div>
        </ThemeContext.Provider>
      </SessionContext.Provider>
    </AppContext.Provider>
  );
}

export default App;

'use client';
import { isSessionActive } from '@components/authUtils.client';
import useMemoizedContextValue from '@components/useMemoizedContextValue';
import { Session, User } from '@supabase/supabase-js';
import React, { useEffect, useReducer, useState } from 'react';
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
import SyncContext from './SyncContext';
import ThemeContext from './ThemeContext';
import ThemeMetadata from './ThemeMetadata';
import UpdateNotification from './UpdateNotification';
import { getDefaultAppState } from './appUtils';
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

const defaultAppState = getDefaultAppState();

function App({
  enableTutorial = false,
  canAddWidgets = false,
  isClientOnly = false,
  session,
  user,
  children
}: Props) {
  const [restoreApp, saveApp] = useLocalStorage(
    getAppStorageKey(),
    defaultAppState
  );
  const [app, dispatchToApp] = useReducer(reducer, defaultAppState);
  const [isTurorialStarted, setIsTutorialStarted] = useState(false);

  useMultipleDashboardsMigration(app);

  // Update app state asynchronously and isomorphically (so as to avoid any SSR
  // mismatch with the rendered page HTML); we use useIsomorphicLayoutEffect()
  // instead of useEffect() directly to minimize any possible page flicker
  useIsomorphicLayoutEffect(() => {
    const newApp = restoreApp();
    // The below conditional is necessary to prevent a 'flash of default app
    // state' due to React 18's Strict Mode mounting the component twice; in our
    // case here, we require the user to either be signed in OR have
    // completed/skipped the tutorial before restoring any persisted state of
    // the app (see:
    // https://dev.to/ag-grid/react-18-avoiding-use-effect-getting-called-twice-4i9e)
    if (!newApp.isDefaultApp || (session && user)) {
      dispatchToApp({ type: 'replaceApp', payload: newApp });
    }
  }, [restoreApp]);

  // Serialize the app to localStorage whenever the app's state changes
  useEffect(() => {
    if (!app.isDefaultApp) {
      saveApp(app);
    }
  }, [app, saveApp]);

  const appSyncUtils = useAppSync(app, dispatchToApp);
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
  const isSignedIn = Boolean(user) && isSessionActive(session);

  const appContext = useMemoizedContextValue({ app, dispatchToApp });
  const sessionContext = useMemoizedContextValue({ session, user, isSignedIn });
  const syncContext = useMemoizedContextValue(appSyncUtils);

  return (
    <SessionContext.Provider value={sessionContext}>
      <AppContext.Provider value={appContext}>
        <SyncContext.Provider value={syncContext}>
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
        </SyncContext.Provider>
      </AppContext.Provider>
    </SessionContext.Provider>
  );
}

export default App;

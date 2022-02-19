import classNames from 'classnames';
import React, { Suspense, useEffect, useReducer } from 'react';
import LoadingIndicator from '../generic/LoadingIndicator';
import TutorialFlow from '../tutorial/TutorialFlow';
import useLocalStorage from '../useLocalStorage';
import useMountListener from '../useMountListener';
import AppCompletedTutorial from './AppCompletedTutorial';
import AppContext from './AppContext';
import AppFooter from './AppFooter';
import AppHead from './AppHead';
import AppHeader from './AppHeader';
import reducer from './AppReducer';
import defaultApp from './appStateDefault';
import AppWelcome from './AppWelcome';
import UpdateNotification from './UpdateNotification';
import useThemeForEntirePage from './useThemeForEntirePage';

const WidgetBoard = React.lazy(() => import('../widgets/WidgetBoard'));

// Return a truthy value if the app's service worker should be loaded; the
// service worker always loads in a Production environment; however, by
// default, the service workr is *not* loaded in a local environment because
// other projects use localhost; this can be overridden via a single
// sessionStorage entry
function shouldLoadServiceWorker() {
  return typeof navigator !== 'undefined' && navigator.serviceWorker && (!window.location.hostname.includes('localhost') || sessionStorage.getItem('sw'));
}

// Return true if the user agent is a touch device; otherwise, return false
function isTouchDevice(): boolean {
  return typeof window !== 'undefined' && window.ontouchstart !== undefined;
}

function App() {

  const [restoreApp, saveApp] = useLocalStorage('faith-dashboard-app', defaultApp);
  const [app, dispatchToApp] = useReducer(reducer, null, () => restoreApp());

  // Serialize the app to localStorage whenever the app's state changes
  useEffect(() => {
    saveApp(app);
  }, [app, saveApp]);

  useThemeForEntirePage(app.theme);

  const isMounted = useMountListener();
  return (
    <AppContext.Provider value={dispatchToApp}>
        <AppHead />
        {isMounted ? <div className={classNames(
          'app',
          `theme-${app.theme}`,
          { 'is-touch-device': isTouchDevice() },
          { 'is-not-touch-device': !isTouchDevice() }
        )}>
          <TutorialFlow shouldShow={app.shouldShowTutorial}>
            {shouldLoadServiceWorker() ? (
              <UpdateNotification />
            ) : null}
            <AppHeader currentTheme={app.theme} />
            <AppWelcome />
            <AppCompletedTutorial />
            <Suspense fallback={<LoadingIndicator />}>
              <WidgetBoard widgets={app.widgets} />
            </Suspense>
            <AppFooter />
          </TutorialFlow>
        </div> : null}
    </AppContext.Provider>
  );

}

export default App;

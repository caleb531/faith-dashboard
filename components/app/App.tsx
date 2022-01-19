import React, { Suspense, useEffect, useReducer } from 'react';
import LoadingIndicator from '../generic/LoadingIndicator';
import useLocalStorage from '../useLocalStorage';
import AppContext from './AppContext';
import AppFooter from './AppFooter';
import AppHead from './AppHead';
import AppHeader from './AppHeader';
import reducer from './AppReducer';
import defaultApp from './appStateDefault';
import UpdateNotification from './UpdateNotification';
import useThemeForEntirePage from './useThemeForEntirePage';

const WidgetBoard = React.lazy(() => import('../widgets/WidgetBoard'));

// Return a truthy value if the app's service worker should be loaded; the
// service worker always loads in a Production environment; however, by
// default, the service workr is *not* loaded in a local environment because
// other projects use localhost; this can be overridden via a single
// sessionStorage entry
function shouldLoadServiceWorker() {
  // TODO: re-enable service worker once file is properly generated using
  // NextJS
  return false;
  // return typeof navigator !== 'undefined' && navigator.serviceWorker && (window.location.port !== '8080' || sessionStorage.getItem('forceServiceWorkerInLocalhost'));
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

  return (
    <AppContext.Provider value={dispatchToApp}>
      <AppHead />
      <div className={`app theme-${app.theme} ${isTouchDevice() ? 'is-touch-device' : 'is-not-touch-device'}`}>
          {shouldLoadServiceWorker() ? (
            <UpdateNotification />
          ) : null}
          <AppHeader theme={app.theme} />
            {typeof window !== 'undefined' ?
              <Suspense fallback={<LoadingIndicator />}>
                <WidgetBoard widgets={app.widgets} />
              </Suspense>
            : null}
          <AppFooter />
      </div>
    </AppContext.Provider>
  );

}

export default App;

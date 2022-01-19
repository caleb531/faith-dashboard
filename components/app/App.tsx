import React, { useEffect, useReducer } from 'react';
import useLocalStorage from '../useLocalStorage';
import WidgetBoard from '../widgets/WidgetBoard';
import AppContext from './AppContext';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import reducer from './AppReducer';
import defaultApp from './appStateDefault';
import UpdateNotification from './UpdateNotification';
import useThemeForEntirePage from './useThemeForEntirePage';

// Return a truthy value if the app's service worker should be loaded; the
// service worker always loads in a Production environment; however, by
// default, the service workr is *not* loaded in a local environment because
// other projects use localhost; this can be overridden via a single
// sessionStorage entry
function shouldLoadServiceWorker() {
  return typeof navigator !== 'undefined' && navigator.serviceWorker && (window.location.port !== '8080' || sessionStorage.getItem('forceServiceWorkerInLocalhost'));
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
      <div className={`app theme-${app.theme} ${isTouchDevice() ? 'is-touch-device' : 'is-not-touch-device'}`}>
          {shouldLoadServiceWorker() ? (
            <UpdateNotification />
          ) : null}
          <AppHeader theme={app.theme} />
            {typeof window !== 'undefined' ?
              <WidgetBoard widgets={app.widgets} />
            : null}
          <AppFooter />
      </div>
    </AppContext.Provider>
  );

}

export default App;

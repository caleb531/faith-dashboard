import React, { useEffect, useReducer } from 'react';
import LoadingIndicator from '../generic/LoadingIndicator';
import useLocalStorage from '../useLocalStorage';
import AppContext from './AppContext';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import reducer from './AppReducer';
import defaultApp from './appStateDefault';
import UpdateNotification from './UpdateNotification';
import useThemeForEntirePage from './useThemeForEntirePage';

// Lazy-load the widget board since react-beautiful-dnd is a large dependency
const WidgetBoard = React.lazy(() => import('../widgets/WidgetBoard'));

// Return a truthy value if the app's service worker should be loaded; the
// service worker always loads in a Production environment; however, by
// default, the service workr is *not* loaded in a local environment because
// other projects use localhost; this can be overridden via a single
// sessionStorage entry
function shouldLoadServiceWorker() {
  return navigator.serviceWorker && (window.location.port !== '8080' || sessionStorage.getItem('forceServiceWorkerInLocalhost'));
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
      <div className={`app theme-${app.theme}`}>
          {shouldLoadServiceWorker() ? (
            <UpdateNotification />
          ) : null}
          <AppHeader theme={app.theme} />
          <React.Suspense fallback={<LoadingIndicator />}>
            <WidgetBoard widgets={app.widgets} />
          </React.Suspense>
          <AppFooter />
      </div>
    </AppContext.Provider>
  );

}

export default App;

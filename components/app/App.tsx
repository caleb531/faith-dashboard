import { useEffect, useReducer, useState } from 'react';
import TutorialFlow from '../tutorial/TutorialFlow';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';
import useLocalStorage from '../useLocalStorage';
import usePasswordRecoveryRedirect from '../usePasswordRecoveryRedirect';
import useTouchDeviceDetection from '../useTouchDeviceDetection';
import { AppState } from './app.d';
import AppContext from './AppContext';
import AppFooter from './AppFooter';
import AppHeader from './AppHeader';
import AppNotification from './AppNotification';
import reducer from './AppReducer';
import defaultApp from './appStateDefault';
import UpdateNotification from './UpdateNotification';
import useAppSync from './useAppSync';
import useThemeForEntirePage from './useThemeForEntirePage';

// Return a truthy value if the app's service worker should be loaded; the
// service worker always loads in a Production environment; however, by
// default, the service workr is *not* loaded in a local environment because
// other projects use localhost; this can be overridden via a single
// sessionStorage entry
function shouldLoadServiceWorker() {
  return typeof navigator !== 'undefined' && navigator.serviceWorker && (!window.location.hostname.includes('localhost') || sessionStorage.getItem('sw'));
}

type Props = {
  enableTutorial?: boolean,
  canAddWidgets?: boolean,
  children: (app: AppState) => JSX.Element | (JSX.Element | null)[] | null,
}

function App({
  enableTutorial = false,
  canAddWidgets = false,
  children
}: Props) {

  const [restoreApp, saveApp] = useLocalStorage('faith-dashboard-app', defaultApp);
  const [app, dispatchToApp] = useReducer(reducer, defaultApp);
  const [isTurorialStarted, setIsTutorialStarted] = useState(false);

  // Update app state asynchronously and isomorphically (so as to avoid any SSR
  // mismatch with the rendered page HTML); we use useIsomorphicLayoutEffect()
  // instead of useEffect() directly to minimize any possible page flicker
  useIsomorphicLayoutEffect(() => {
    dispatchToApp({ type: 'replaceApp', payload: restoreApp() });
  }, [restoreApp]);

  // Serialize the app to localStorage whenever the app's state changes
  useEffect(() => {
    saveApp(app);
  }, [app, saveApp]);

  useAppSync(app, dispatchToApp);
  useThemeForEntirePage(app.theme);
  usePasswordRecoveryRedirect();

  // Defer the starting of the tutorial so the app's loading state isn't blurry
  useEffect(() => {
    const urlParams = new URLSearchParams(`?${window.location.hash.slice(1)}`);
    const notificationMessage = urlParams.get('message') || urlParams.get('error_description');
    if (!notificationMessage) {
      setIsTutorialStarted(true);
    }
  }, [setIsTutorialStarted]);

  useTouchDeviceDetection();

  return (
    <AppContext.Provider value={dispatchToApp}>
      <div className="app">
        {shouldLoadServiceWorker() ? (
          <UpdateNotification />
        ) : null}
        <TutorialFlow inProgress={Boolean(app.shouldShowTutorial && enableTutorial && isTurorialStarted)}>
          <AppHeader currentTheme={app.theme} canAddWidgets={canAddWidgets} />
          <AppNotification />
          <div className="app-contents">
            {children(app)}
          </div>
          <AppFooter />
        </TutorialFlow>
      </div>
    </AppContext.Provider>
  );

}

export default App;

import { Dispatch, useEffect, useReducer } from 'react';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';
import useLocalStorage from '../useLocalStorage';
import usePasswordRecoveryRedirect from '../usePasswordRecoveryRedirect';
import { AppState } from './app.d';
import reducer, { AppAction } from './AppReducer';
import defaultApp from './appStateDefault';
import useAppSync from './useAppSync';
import useThemeForEntirePage from './useThemeForEntirePage';

// The useApp() hook manages the state of the entire application in one place
function useApp(): [AppState, Dispatch<AppAction>] {

  const [restoreApp, saveApp] = useLocalStorage('faith-dashboard-app', defaultApp);
  const [app, dispatchToApp] = useReducer(reducer, defaultApp);

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

  return [app, dispatchToApp];

}
export default useApp;

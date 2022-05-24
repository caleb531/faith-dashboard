import { Dispatch, useEffect, useReducer } from 'react';
import useIsomorphicLayoutEffect from '../useIsomorphicLayoutEffect';
import useLocalStorage from '../useLocalStorage';
import { AppState } from './app.d';
import reducer, { AppAction } from './AppReducer';
import defaultApp from './appStateDefault';
import useThemeForEntirePage from './useThemeForEntirePage';

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

  useThemeForEntirePage(app.theme);

  return [app, dispatchToApp];

}
export default useApp;

import { useState } from 'react';
import defaultApp from './app/appStateDefault';
import useThemeForEntirePage from './app/useThemeForEntirePage';
import useLocalStorage from './useLocalStorage';

function useLandingPage() {

  const [restoreApp] = useLocalStorage('faith-dashboard-app', defaultApp);
  const [app] = useState(() => restoreApp())
  useThemeForEntirePage(app.theme);

}
export default useLandingPage;

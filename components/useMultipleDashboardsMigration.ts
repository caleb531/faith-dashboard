// The useMultipleDashboardsMigration() hook migrates the app's local data store

import { AppState } from './app/app.d';
import { getSelectedAppIdStorageKey } from './storageUtils';
import useLocalStorage from './useLocalStorage';

// to a version that supports the multiple dashboard functionality
function useMultipleDashboardsMigration(app: AppState): void {
  const [getSelectedAppId, setSelectedAppId] = useLocalStorage<string | null>(
    getSelectedAppIdStorageKey(),
    null
  );
  if (getSelectedAppId() !== app.id && app.id) {
    setSelectedAppId(app.id);
  }
}
export default useMultipleDashboardsMigration;

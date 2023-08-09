import { AppState } from './app/app.d';
import { getSelectedAppIdStorageKey } from './storageUtils';
import useLocalStorage from './useLocalStorage';

// The useMultipleDashboardsMigration() hook migrates the app's local data store
// to a version that supports the multiple dashboard functionality
function useMultipleDashboardsMigration(app: AppState): void {
  const [getSelectedAppId, setSelectedAppId] = useLocalStorage<string | null>(
    getSelectedAppIdStorageKey(),
    null
  );
  // Always ensure that the selected app ID in the local store is always in sync
  // with the ID of the locally-persisted app/dashboard
  if (getSelectedAppId() !== app.id && app.id) {
    setSelectedAppId(app.id);
  }
}
export default useMultipleDashboardsMigration;

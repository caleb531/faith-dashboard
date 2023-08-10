import { v4 as uuidv4 } from 'uuid';
import { AppState } from './app/app.types';
import appStateDefault from './app/appStateDefault';
import { getAppStorageKey, getWidgetStorageKey } from './storageUtils';

// Randomize the UUIDs of the app and widgets when importing (in case this file
// has been imported by multiple users)
export function randomizeUUIDs(app: AppState): AppState {
  return {
    ...app,
    id: uuidv4(),
    widgets: app.widgets.map((widget) => {
      return {
        ...widget,
        id: uuidv4()
      };
    })
  };
}

// Import a dashboard into the application from the given File object (which is
// probably the result of an <input type=file /> prompt)
export async function readDashboardFileToJSON(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const app = JSON.parse(String(loadEvent.target?.result || null));
      if (app && app.widgets) {
        resolve(randomizeUUIDs(app));
      } else {
        reject(
          new Error(
            'Dashboard file is not in the correct format. Please try another file.'
          )
        );
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// Export the dashboard to a file and immediately trigger a download for that
// file
export function exportDashboard() {
  const app: AppState =
    JSON.parse(String(localStorage.getItem(getAppStorageKey()))) ||
    appStateDefault;
  const appJson = {
    ...app,
    id: undefined,
    widgets: app.widgets.map((widgetHead) => {
      return {
        ...JSON.parse(
          String(localStorage.getItem(getWidgetStorageKey(widgetHead)))
        ),
        ...widgetHead,
        id: undefined,
        isSettingsOpen: undefined
      };
    })
  };
  const blob = new Blob([JSON.stringify(appJson, null, 2) + '\n']);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${app.id}.faithdashboard.json`;
  a.click();
}

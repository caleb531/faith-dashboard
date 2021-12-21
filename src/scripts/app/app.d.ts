import { Dispatch } from 'react';
import { AppAction } from '../app/App';
import { WidgetHead } from '../widgets/widget.d';

// An available color theme that can be set by the user to personalize their
// app dashboard
export type AppTheme = 'brown' | 'green' | 'teal' | 'blue' | 'rose';

// The state of the application; an instance of
export interface AppState {
  theme: AppTheme;
  widgets: WidgetHead[];
}

// All user dashboard data is persisted into the above state object, but to
// accomplish this, we expose a React context which provides read-only access
// to the current global state of the application, as well as providing any
// component with the ability to dispatch actions to the top-level App
// component
export type AppContextValue = Dispatch<AppAction>;

// A dropdown entry for an available app color theme
interface AppThemeListItem {
  label: string;
  value: AppTheme;
}

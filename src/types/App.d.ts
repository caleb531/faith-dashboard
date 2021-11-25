import { WidgetState } from './Widget.d';

// An available color theme that can be set by the user to personalize their
// app dashboard
export enum AppTheme {
  brown = 'brown',
  green = 'green',
  teal = 'teal',
  blue = 'blue'
}

// The state of the application; an instance of
export interface AppState {
  theme: AppTheme;
  widgets: WidgetState[];
}

// All user dashboard data is persisted into the above state object, but to
// accomplish this, we expose a React context which provides read-only access
// to the current global state of the application, as well as providing any
// component with the ability to dispatch actions to the top-level App
// component
export interface AppContextValue {
  readonly app: AppState;
  dispatchApp: Function;
}

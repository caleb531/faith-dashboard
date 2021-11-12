import { WidgetState } from './Widget.d';

export enum AppTheme {
  green = 'green',
  teal = 'teal',
  blue = 'blue'
}

export interface AppState {
  theme: AppTheme;
  widgets: Array<WidgetState>;
}

export interface AppContextValue {
  app: AppState;
  dispatchApp: Function;
}

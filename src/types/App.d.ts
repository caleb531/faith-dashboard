import { WidgetState } from '../types/Widget.d';

export enum AppTheme {
  green = 'green',
  teal = 'teal',
  blue = 'blue'
}

export interface AppState {
  theme: AppTheme;
  widgets: WidgetState[];
}

export interface AppContextValue {
  app: AppState;
  dispatchApp: Function;
}

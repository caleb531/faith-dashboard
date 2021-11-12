export enum AppTheme {
  green = 'green',
  teal = 'teal',
  blue = 'blue'
}

export interface AppState {
  theme: AppTheme;
  widgets: Array<any>;
}

export interface AppContextValue {
  app: AppState;
  dispatchApp: Function;
}

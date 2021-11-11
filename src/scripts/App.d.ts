export interface AppState {
  theme: string,
  widgets: Array<any>
}

export interface AppContextValue {
  app: AppState,
  dispatchApp: Function
}

export enum WidgetType {
  BibleVerse = 'BibleVerse'
}

export interface WidgetDataState {
  [key: string]: any
}

export interface WidgetState {
  id: number;
  type: WidgetType;
  width: number;
  height: number;
  isSettingsOpen: boolean;
  data?: WidgetDataState;
}

export interface WidgetContentsParameters {
  widget: WidgetState;
  widgetData: WidgetDataState;
  dispatchWidget: Function;
  dispatchApp: Function;
}

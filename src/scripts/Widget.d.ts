export enum WidgetType {
  BibleVerse = 'BibleVerse',
  Note = 'Note'
}

export interface WidgetDataState {
  [key: string]: any
}

export interface WidgetState {
  id: string;
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
}

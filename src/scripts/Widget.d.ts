export enum WidgetType {
  BibleVerse = 'BibleVerse',
  Note = 'Note'
}

export interface WidgetDataState {
  [key: string]: string | number | Array | object
}

export interface WidgetState {
  id: string;
  type: WidgetType;
  isSettingsOpen: boolean;
  column: number;
  data?: WidgetDataState;
}

export interface WidgetContentsParameters {
  widget: WidgetState;
  widgetData: WidgetDataState;
  dispatchWidget: Function;
}

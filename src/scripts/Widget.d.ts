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
  isSettingsOpen: boolean;
  column: number;
  data?: WidgetDataState;
}

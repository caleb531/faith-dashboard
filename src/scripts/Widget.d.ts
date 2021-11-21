export enum WidgetType {
  BibleVerse = 'BibleVerse',
  Note = 'Note'
}

type WidgetDataMember = string | number | boolean | WidgetDataMember[] | object;

export interface WidgetDataState {
  [key: string]: WidgetDataMember
}

export interface WidgetState {
  id: string;
  type: WidgetType;
  isSettingsOpen: boolean;
  column: number;
  data?: WidgetDataState;
}

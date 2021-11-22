export enum WidgetTypeId {
  BibleVerse = 'BibleVerse',
  Note = 'Note'
}

interface WidgetType {
  type: WidgetTypeId;
  name: string;
  description: string;
}

type WidgetDataMember = string | number | boolean | WidgetDataMember[] | object;

export interface WidgetDataState {
  [key: string]: WidgetDataMember
}

export interface WidgetState {
  id: string;
  type: WidgetTypeId;
  isSettingsOpen: boolean;
  column: number;
  height?: number;
  data?: WidgetDataState;
}

export interface WidgetContentsParameters {
  widget: WidgetState;
  widgetData: WidgetDataState;
  dispatchWidget: Function;
}

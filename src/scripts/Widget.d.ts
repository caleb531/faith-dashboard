export enum WidgetType {
  BibleVerse = 'BibleVerse'
}

export interface WidgetData {
  [key: string]: any
}

export interface WidgetState {
  id: number;
  type: WidgetType;
  width: number;
  height: number;
  data?: WidgetData;
}

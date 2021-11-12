export enum WidgetType {
  BibleVerse = 'BibleVerse'
}

export interface WidgetState {
  id: number;
  type: WidgetType;
  width: number;
  height: number;
  data?: object;
}

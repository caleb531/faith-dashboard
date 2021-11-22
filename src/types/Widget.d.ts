// The string identifier of an implemented widget type
export enum WidgetTypeId {
  BibleVerse = 'BibleVerse',
  Note = 'Note'
}

// The metadata for a widget type, much of which is displayed in the "Add
// Widget" Picker, where the user can add a new widget instance to their board
export interface WidgetType {
  type: WidgetTypeId;
  name: string;
  description: string;
}

// Every widget can store arbitrary instance-specific data into a `data`
// object; this `data` object is empty by default, but must contain only
// JSON-serializable properties (e.g. no functions)
export type WidgetDataMember = string | number | boolean | WidgetDataMember[] | object;
//
export interface WidgetDataState {
  [key: string]: WidgetDataMember
}

// The schema for a widget object
export interface WidgetState {
  // A UUID v4 string that uniquely identifies the widget instance
  id: string;
  // An string-based enum identifier representing the type of widget
  type: WidgetTypeId;
  isSettingsOpen: boolean;
  // The base-1 number of the column into which the widget will be placed in
  // the UI
  column: number;
  height?: number;
  // The `data` object is a required field so that new widget types can safely
  // use it without worry
  data: WidgetDataState;
}

// The function parameters to a WidgetContents component, useful when creating
// a new widget type
export interface WidgetContentsParameters {
  // Every widget implementation receives the widget object as a parameter, so
  // that the author can implement a settings view for their widget type, etc.;
  // however, this field is read-only, as any attempts to write to it will be
  // overwritten by the base Widget component higher up in the component tree
  readonly widget: WidgetState;
  // The free-use data store for the implemented widget; the author can
  // freely write to this object, although per React convention, it is
  // recommended to do so with a reducer
  widgetData: WidgetDataState;
  // A widget implementation can dispatch to the higher-up Widget component to
  // close settings and such
  dispatchWidget: Function;
}

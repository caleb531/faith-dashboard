import { DraggableProvided } from 'react-beautiful-dnd';

// A type that represents any JSON-serializable value or structure
export type JSONSerializable = string | number | boolean | Array<JSONSerializable> | object;

// An available color theme that can be set by the user to personalize their
// app dashboard
export enum AppTheme {
  brown = 'brown',
  green = 'green',
  teal = 'teal',
  blue = 'blue',
  rose = 'rose'
}

// The state of the application; an instance of
export interface AppState {
  theme: AppTheme;
  widgets: WidgetState[];
}

// The action object for the App's reducer
export interface StateAction {
  type: string;
  payload?: JSONSerializable;
}

// All user dashboard data is persisted into the above state object, but to
// accomplish this, we expose a React context which provides read-only access
// to the current global state of the application, as well as providing any
// component with the ability to dispatch actions to the top-level App
// component
export interface AppContextValue {
  readonly app: AppState;
  dispatchToApp: Function;
}

// A dropdown entry for an available app color theme
interface AppThemeListItem {
  label: string;
  value: AppTheme;
}

// The string identifier of an implemented widget type
export enum WidgetTypeId {
  BibleVerse = 'BibleVerse',
  Note = 'Note',
  Podcast = 'Podcast'
}

// The metadata for a widget type, much of which is displayed in the "Add
// Widget" Picker, where the user can add a new widget instance to their board
export interface WidgetType {
  type: WidgetTypeId;
  name: string;
  description: string;
  icon: string;
  // If true, indicates that this widget must be configured before use, and
  // signals the Settings panel to open automatically when creating a new
  // instance of this widget type
  requiresConfiguration: boolean;
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
  // Whether the widget is currently in a loading state
  isLoading?: boolean;
  // Any error the widget experienced while fetching data
  fetchError?: string;
}

// The function parameters to a WidgetContents component, useful when creating
// a new widget type
export interface WidgetContentsParameters {
  // Every widget implementation receives the widget object as a parameter, so
  // that the author can implement a settings view for their widget type, etc.
  widget: WidgetState;
  provided: DraggableProvided;
}

// Parameters that define where a widget should be moved to/from on the
// dashboard
export interface WidgetMoveParameters {
  widgetToMove: WidgetState;
  sourceIndex: number;
  sourceColumn: number;
  destinationIndex: number;
  destinationColumn: number;
}

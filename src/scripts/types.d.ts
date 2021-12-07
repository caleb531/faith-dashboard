import { Dispatch } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';

// A type that represents any JSON-serializable value or structure
export type JSONSerializable = string | number | boolean | Array<JSONSerializable> | object;

// An available color theme that can be set by the user to personalize their
// app dashboard
export type AppTheme = 'brown' | 'green' | 'teal' | 'blue' | 'rose';

// The state of the application; an instance of
export interface AppState {
  theme: AppTheme;
  widgets: WidgetState[];
}

// The action object for any reducer within the application
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
  app: AppState;
  dispatchToApp: Dispatch<StateAction>;
}

// A dropdown entry for an available app color theme
interface AppThemeListItem {
  label: string;
  value: AppTheme;
}

// The unique identifier of an implemented widget type
export type WidgetTypeId = 'BibleVerse' | 'Note' | 'Podcast';

// The metadata for a widget type, much of which is displayed in the "Add
// Widget" Picker, where the user can add a new widget instance to their board
export interface WidgetType {
  // The ID of this specific widget type
  type: WidgetTypeId;
  // The human-readable name of the widget type
  name: string;
  // A user-facing description of the widget type, to be displayed when the
  // user is browsing for a new widget to add to their dashboard
  description: string;
  // A file path to an SVG icon used to represent this widget type
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
  // An string-based identifier representing the type of widget
  type: WidgetTypeId;
  // A boolean representing whether or not the widget's Settings screen is
  // currently visible
  isSettingsOpen: boolean;
  // The base-1 index of the dashboard column where the widget will display in
  // the UI
  column: number;
  // The pixel height of the widget; this is not necessarily the widget's
  // current height at any point in time, and it may be adjustable by the user
  // via the widget's resize handle (which is only available for certain widget
  // types)
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
  // The Draggable props provided by react-beautiful-dnd; in order to enable
  // the drag-and-drop functionality, these props must be spread onto the
  // top-level JSX element representing the widget,
  provided: DraggableProvided;
}

// Parameters that define where a widget should be moved to/from on the
// dashboard
export interface WidgetMoveParameters {
  // The widget instance to move to a different column and/or position
  widgetToMove: WidgetState;
  // The base-0 index of the widget in the application's widgets array before
  // the move
  sourceIndex: number;
  // The base-1 index of the dashboard column where the widget resides *before*
  // the move
  sourceColumn: number;
  // The base-0 index of the widget in the application's widgets array after
  // the move
  destinationIndex: number;
  // The base-1 index of the dashboard column where the widget will reside
  // after the move
  destinationColumn: number;
}

export interface Result {
  id: string;
  title: string;
  subtitle: string;
  data?: {
    [key: string]: JSONSerializable
  };
}

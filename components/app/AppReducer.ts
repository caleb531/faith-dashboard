import { sortBy } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import {
  WidgetHead,
  WidgetMoveParameters,
  WidgetState
} from '../widgets/widget.types';
import { AppState, AppThemeId } from './app.types';

export type AppAction =
  | { type: 'changeTheme'; payload: AppThemeId }
  | { type: 'endTutorial' }
  | { type: 'addWidget'; payload: WidgetState }
  | { type: 'removeWidget'; payload: Omit<WidgetHead, 'type' | 'column'> }
  | { type: 'moveWidget'; payload: WidgetMoveParameters }
  | { type: 'replaceApp'; payload: AppState };

export default function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'changeTheme':
      const newTheme = action.payload;
      return { ...state, isDefaultApp: undefined, theme: newTheme };
    case 'endTutorial':
      return { ...state, isDefaultApp: undefined, shouldShowTutorial: false };
    case 'addWidget':
      const newWidget = action.payload;
      return {
        ...state,
        isDefaultApp: undefined,
        widgets: [newWidget, ...state.widgets]
      };
    case 'removeWidget':
      const widgetToRemove = action.payload;
      return {
        ...state,
        isDefaultApp: undefined,
        widgets: state.widgets.filter(
          (widget) => widget.id !== widgetToRemove.id
        )
      };
    case 'moveWidget':
      const {
        widgetToMove,
        sourceIndex,
        sourceColumn,
        destinationIndex,
        destinationColumn
      } = action.payload;
      // The destination index from @hello-pangea/dnd assumes that the
      // widget-to-move is still at the source index; however, because the
      // widget is about to be removed from its original position (via the
      // filter), we must adjust the destination index for when we reinsert the
      // widget
      const newDestinationIndex =
        destinationColumn !== sourceColumn && destinationIndex > sourceIndex
          ? destinationIndex - 1
          : destinationIndex;
      // Remove the widget from its original position (the source index) in the
      // widgets array
      const newWidgets = state.widgets.filter(
        (widget) => widget.id !== widgetToMove.id
      );
      // Insert the widget at its new position; also update the column field on
      // the widget itself
      newWidgets.splice(newDestinationIndex, 0, {
        // Eliminate extraneous widget data from the old architecture (since
        // that is now stored separately, on a per-widget basis; only include
        // the widget head information like ID and Type); this reduces
        // duplication of widget data in localStorage when moving widgets
        id: widgetToMove.id,
        type: widgetToMove.type,
        column: destinationColumn
      });
      // There are edge cases (when dragging-and-dropping and adding new
      // widgets) where the widgets in a particular column are no longer
      // contiguous in the widgets array; this scenario violates a stipulation
      // from @hello-pangea/dnd that the indices of all elements in the same
      // column be contiguous; to fix this, we simply sort the array at the end
      // of every drag (sidenote: Lodash's sortBy is a stable sort, so this
      // will not alter the user order of widgets within the same column)
      return {
        ...state,
        isDefaultApp: undefined,
        widgets: sortBy(newWidgets, 'column')
      };
    case 'replaceApp':
      return {
        isDefaultApp: undefined,
        // To manage the identity of the user's dashboard on the
        // server-side, a unique ID must be generated for the dashboard if
        // has not already been assigned one
        id: action.payload.id || uuidv4(),
        ...action.payload
      };
    default:
      return state;
  }
}

import { Dispatch, useReducer } from 'react';
import { StateAction, WidgetHead, WidgetState } from '../types';
import useLocalStorage from '../useLocalStorage';
import widgetTypes from '../widgets/widgetTypes';
import useWidgetUpdater from './useWidgetUpdater';

// Instantiates a new widget object using the given header information about
// the widget (namely, id and type)
export function createNewWidget(widgetHead: WidgetHead): WidgetState {
  const widgetType = widgetTypes.find((widgetType) => widgetType.type === widgetHead.type);
  const isSettingsOpen = widgetType ? widgetType.requiresConfiguration : false;
  // In order to preserve backwards-compatibility, assume the widget head may
  // contain any and all other widget properties from the previous architecture
  // (where *all* widget data was stored in the AppState); therefore, it's
  // crucial that we spread in the widget head *after* all defaults
  return { isSettingsOpen, ...widgetHead };
}

// The useWidgetShell() hook which must be called in any component which
// implements a particular widget type; it manages several important
// operations, like exposing global actions available to all widgets, and
// attaching listeners that automatically persist the widget whenever its state
// changes
export default function useWidgetShell(subReducer: (state: WidgetState, action: StateAction) => WidgetState, widgetHead: WidgetHead): [WidgetState, Dispatch<StateAction>] {

  // The reducer below contains general widget actions, and the widget
  // type-specific "sub-reducer" supplied above is merged into this larger
  // reducer; this allows the compoment for each widget type implementation to
  // reference the same widget state and dispatcher
  function reducer(state: WidgetState, action: StateAction): WidgetState {
    switch (action.type) {
      case 'toggleSettings':
        return { ...state, isSettingsOpen: !state.isSettingsOpen };
      case 'openSettings':
        return { ...state, isSettingsOpen: true };
      case 'closeSettings':
        return { ...state, isSettingsOpen: false };
      case 'resizeWidget':
        return { ...state, height: action.payload as number };
      case 'showLoading':
        return { ...state, isLoading: true };
      case 'showContent':
        return {
          ...state,
          isLoading: false,
          isSettingsOpen: false,
          fetchError: null,
          lastFetchDateTime: Date.now()
        };
      case 'setFetchError':
        return { ...state, isLoading: false, fetchError: action.payload as string };
      case 'markWidgetForRemoval':
          return { ...state, isMarkedForRemoval: true };
      default:
        // As mentioned above, the sub-reducer is optional, and if you wish to
        // omit it, simply pass `null` as the first argument to
        // useWidgetShell()
        if (subReducer) {
          return subReducer(state, action);
        } else {
          throw new ReferenceError(`action ${action.type} does not exist on reducer`);
        }
    }
  }

  const [restoreWidget, saveWidget, removeWidget] = useLocalStorage<WidgetState>(
    `faith-dashboard-widget-${widgetHead.type}:${widgetHead.id}`,
    createNewWidget(widgetHead)
  );
  const [state, dispatch] = useReducer(reducer, null, () => restoreWidget());

  // Save updates to the widget as its state changes
  useWidgetUpdater(state, saveWidget, removeWidget);

  return [state, dispatch];

}

import React, { Dispatch, useReducer } from 'react';
import { WidgetState, StateAction } from '../types';
import useWidgetUpdater from './useWidgetUpdater';

// The useWidgetShell() hook which must be called in any component which
// implements a particular widget type; it manages several important
// operations, like exposing global actions available to all widgets, and
// attaching listeners that automatically persist the widget whenever its state
// changes
export default function useWidgetShell(subReducer: Function, widget: WidgetState): [WidgetState, Dispatch<StateAction>] {

  // The sub-reducer is an optional reducer belonging to the implementation
  // component for a particular widget type; it is combined into a larger
  // reducer containing general widget actions (this allows the compoment for
  // each widget type implementation to reference the same widget state and
  // dispatcher)
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
        return { ...state, isLoading: false, isSettingsOpen: false, fetchError: null };
      case 'setFetchError':
        return { ...state, isLoading: false, fetchError: action.payload as string };
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

  const [state, dispatch] = useReducer(reducer, widget);

  // Save updates to the widget as its state changes
  useWidgetUpdater(state);

  return [state, dispatch];

}

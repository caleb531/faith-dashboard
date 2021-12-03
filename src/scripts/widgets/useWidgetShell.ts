import React, { useReducer } from 'react';
import { WidgetState, StateAction } from '../types';
import useWidgetUpdater from './useWidgetUpdater';

export default function useWidgetShell(subReducer: Function, widget: WidgetState): [WidgetState, Function] {

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
        if (subReducer) {
          return subReducer(state, action);
        } else {
          throw new ReferenceError(`action ${action.type} does not exist on reducer`);
        }
    }
  }

  const [state, dispatch] = useReducer(reducer, widget);

  // Save updates to widget as changes are made
  useWidgetUpdater(state);

  return [state, dispatch];

}

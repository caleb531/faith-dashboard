import React, { useReducer } from 'react';
import { WidgetDataState, StateAction, WidgetContentsParameters } from '../types.d';
import { useWidgetUpdater } from '../hooks';

export function reducer(state: WidgetDataState, action: StateAction): WidgetDataState {
  switch (action.type) {
    default:
      return state;
  }
}

function Podcast({ widget, widgetData }: WidgetContentsParameters) {

  const [state, dispatch] = useReducer(reducer, widgetData);

    // Save updates to widget as changes are made
  useWidgetUpdater(widget, state);

  return (
    <section className="podcast">
    </section>
  );

}

export default Podcast;

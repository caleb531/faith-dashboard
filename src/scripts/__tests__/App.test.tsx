import React from 'react';
import { render } from '@testing-library/react';
import { AppTheme } from '../types';
import { WidgetState } from '../types.d';
import '@testing-library/jest-dom';
import App, { reducer } from '../App';

describe('App Component', function () {

  it('should render', function () {
    const { getByText } = render(<App />);
    expect(getByText('Faith Dashboard')).toBeInTheDocument();
  });

  it('should change theme', function () {
    const app = { widgets: [] as WidgetState[], theme: AppTheme.teal };
    expect(reducer(
      app,
      { type: 'changeTheme', payload: 'periwinkle' }
    )).toEqual({ widgets: [], theme: 'periwinkle' });
  });

  it('should add widget as only widget', function () {
    const app = { theme: AppTheme.teal, widgets: [] as WidgetState[] };
    const newWidget = { id: 'c7b6170c', column: 1 };
    expect(reducer(
      app,
      { type: 'addWidget', payload: newWidget }
    )).toEqual({ theme: AppTheme.teal, widgets: [newWidget] });
  });

  it('should add widget to front of array', function () {
    const widgets = [{ id: 'ff131e14', column: 2 }] as WidgetState[];
    const app = { theme: AppTheme.teal, widgets: widgets };
    const newWidget = { id: 'b78ced6e', column: 1 };
    expect(reducer(
      app,
      { type: 'addWidget', payload: newWidget }
    )).toEqual({ theme: AppTheme.teal, widgets: [newWidget].concat(widgets) });
  });

  it('should remove widget', function () {
    const widgets = [
      { id: '302e0f5f', column: 2 },
      { id: '4ea64c56', column: 1 },
      { id: '6d659201', column: 3 }
    ] as WidgetState[];
    const app = { theme: AppTheme.teal, widgets };
    expect(reducer(
      app,
      { type: 'removeWidget', payload: { id: widgets[1].id } }
    )).toEqual({ theme: AppTheme.teal, widgets: [widgets[0], widgets[2]] });
  });

  it('should move widget from column 1 to column 2', function () {
    const widgets = [
      { id: 'd727c02c', column: 1 },
      { id: 'd2e61962', column: 1 },
      { id: 'b15c6d16', column: 2 },
      { id: '2d0cd20c', column: 3 }
    ] as WidgetState[];
    const app = { theme: AppTheme.teal, widgets };
    expect(reducer(
      app,
      {
        type: 'moveWidget',
        payload: {
          widgetToMove: widgets[0],
          sourceIndex: 0,
          sourceColumn: 1,
          destinationIndex: 2,
          destinationColumn: 2
        }
      }
    )).toEqual({ theme: AppTheme.teal, widgets: [widgets[0], widgets[2], widgets[0], widgets[2]] });
  });

});

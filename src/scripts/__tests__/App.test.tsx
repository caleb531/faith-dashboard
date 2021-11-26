import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { render } from '@testing-library/react';
import { AppTheme, WidgetState } from '../types.d';
import '@testing-library/jest-dom';
import App, { reducer } from '../App';
import { createWidget } from './__utils__/test-utils';

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
    const newWidget = createWidget({ column: 1 });
    expect(reducer(
      app,
      { type: 'addWidget', payload: newWidget }
    )).toEqual({ theme: AppTheme.teal, widgets: [newWidget] });
  });

  it('should add widget to front of array', function () {
    const widgets = [createWidget({ column: 2 })] as WidgetState[];
    const app = { theme: AppTheme.teal, widgets: widgets };
    const newWidget = createWidget({ column: 1 });
    expect(reducer(
      app,
      { type: 'addWidget', payload: newWidget }
    )).toEqual({ theme: AppTheme.teal, widgets: [newWidget].concat(widgets) });
  });

  it('should remove widget', function () {
    const widgets = [
      createWidget({ column: 2 }),
      createWidget({ column: 1 }),
      createWidget({ column: 3 })
    ] as WidgetState[];
    const app = { theme: AppTheme.teal, widgets };
    expect(reducer(
      app,
      { type: 'removeWidget', payload: { id: widgets[1].id } }
    )).toEqual({ theme: AppTheme.teal, widgets: [widgets[0], widgets[2]] });
  });

  it('should move widget from column 1 to column 2', function () {
    const widgets = [
      createWidget({ column: 1 }),
      createWidget({ column: 1 }),
      createWidget({ column: 2 }),
      createWidget({ column: 3 })
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
    )).toEqual({ theme: AppTheme.teal, widgets: [widgets[1], { ...widgets[0], column: 2 }, widgets[2], widgets[3]] });
  });

  it('should move widget from column 2 to column 1', function () {
    const widgets = [
      createWidget({ column: 1 }),
      createWidget({ column: 1 }),
      createWidget({ column: 2 }),
      createWidget({ column: 3 })
    ] as WidgetState[];
    const app = { theme: AppTheme.teal, widgets };
    expect(reducer(
      app,
      {
        type: 'moveWidget',
        payload: {
          widgetToMove: widgets[2],
          sourceIndex: 2,
          sourceColumn: 2,
          destinationIndex: 1,
          destinationColumn: 1
        }
      }
    )).toEqual({ theme: AppTheme.teal, widgets: [widgets[0], { ...widgets[2], column: 1 }, widgets[1], widgets[3]] });
  });

  it('should keep widgets array in column order after move', function () {
    const widgets = [
      createWidget({ column: 1 }),
      createWidget({ column: 1 }),
      createWidget({ column: 1 }),
      createWidget({ column: 3 })
    ] as WidgetState[];
    const app = { theme: AppTheme.teal, widgets };
    expect(reducer(
      app,
      {
        type: 'moveWidget',
        payload: {
          widgetToMove: widgets[3],
          sourceIndex: 3,
          sourceColumn: 3,
          destinationIndex: 0,
          destinationColumn: 2
        }
      }
    )).toEqual({ theme: AppTheme.teal, widgets: [widgets[0], widgets[1], widgets[2], { ...widgets[3], column: 2 }] });
  });

});
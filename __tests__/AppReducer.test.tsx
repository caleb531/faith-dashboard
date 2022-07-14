import '@testing-library/jest-dom';
import { AppState } from '../components/app/app.d';
import reducer from '../components/app/AppReducer';
import { createWidget } from './__utils__/testUtils';

describe('app reducer', () => {
  it('should change theme', () => {
    const app: AppState = { widgets: [], theme: 'teal' };
    expect(reducer(app, { type: 'changeTheme', payload: 'rose' })).toEqual({
      widgets: [],
      theme: 'rose'
    });
  });

  it('should add widget as only widget', () => {
    const app: AppState = { theme: 'teal', widgets: [] };
    const newWidget = createWidget({ column: 1 });
    expect(reducer(app, { type: 'addWidget', payload: newWidget })).toEqual({
      theme: 'teal',
      widgets: [newWidget]
    });
  });

  it('should add widget to front of array', () => {
    const widgets = [createWidget({ column: 2 })];
    const app: AppState = { theme: 'teal', widgets: widgets };
    const newWidget = createWidget({ column: 1 });
    expect(reducer(app, { type: 'addWidget', payload: newWidget })).toEqual({
      theme: 'teal',
      widgets: [newWidget].concat(widgets)
    });
  });

  it('should remove widget', () => {
    const widgets = [
      createWidget({ column: 2 }),
      createWidget({ column: 1 }),
      createWidget({ column: 3 })
    ];
    const app: AppState = { theme: 'teal', widgets };
    expect(
      reducer(app, {
        type: 'removeWidget',
        payload: {
          id: widgets[1].id
        }
      })
    ).toEqual({ theme: 'teal', widgets: [widgets[0], widgets[2]] });
  });

  it('should move widget from column 1 to column 2', () => {
    const widgets = [
      createWidget({ column: 1 }),
      createWidget({ column: 1 }),
      createWidget({ column: 2 }),
      createWidget({ column: 3 })
    ];
    const app: AppState = { theme: 'teal', widgets };
    expect(
      reducer(app, {
        type: 'moveWidget',
        payload: {
          widgetToMove: widgets[0],
          sourceIndex: 0,
          sourceColumn: 1,
          destinationIndex: 2,
          destinationColumn: 2
        }
      })
    ).toEqual({
      theme: 'teal',
      widgets: [
        widgets[1],
        { ...widgets[0], column: 2 },
        widgets[2],
        widgets[3]
      ]
    });
  });

  it('should move widget from column 2 to column 1', () => {
    const widgets = [
      createWidget({ column: 1 }),
      createWidget({ column: 1 }),
      createWidget({ column: 2 }),
      createWidget({ column: 3 })
    ];
    const app: AppState = { theme: 'teal', widgets };
    expect(
      reducer(app, {
        type: 'moveWidget',
        payload: {
          widgetToMove: widgets[2],
          sourceIndex: 2,
          sourceColumn: 2,
          destinationIndex: 1,
          destinationColumn: 1
        }
      })
    ).toEqual({
      theme: 'teal',
      widgets: [
        widgets[0],
        { ...widgets[2], column: 1 },
        widgets[1],
        widgets[3]
      ]
    });
  });

  it('should keep widgets array in column order after move', () => {
    const widgets = [
      createWidget({ column: 1 }),
      createWidget({ column: 1 }),
      createWidget({ column: 1 }),
      createWidget({ column: 3 })
    ];
    const app: AppState = { theme: 'teal', widgets };
    expect(
      reducer(app, {
        type: 'moveWidget',
        payload: {
          widgetToMove: widgets[3],
          sourceIndex: 3,
          sourceColumn: 3,
          destinationIndex: 0,
          destinationColumn: 2
        }
      })
    ).toEqual({
      theme: 'teal',
      widgets: [
        widgets[0],
        widgets[1],
        widgets[2],
        { ...widgets[3], column: 2 }
      ]
    });
  });
});

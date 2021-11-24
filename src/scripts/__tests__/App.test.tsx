import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App, { reducer } from '../App';

describe('App Component', function () {

  it('should render', function () {
    const { getByText } = render(<App />);
    expect(getByText('Faith Dashboard')).toBeInTheDocument();
  });

  it('should change theme', function () {
    const app = { foo: 'bar', theme: 'teal' };
    expect(reducer(
      app,
      { type: 'changeTheme', payload: 'periwinkle' }
    )).toEqual({ foo: 'bar', theme: 'periwinkle' });
  });

  it('should add widget as only widget', function () {
    const app = { theme: 'teal', widgets: [] };
    const newWidget = { id: 'a1b2c3d4', column: 1 };
    expect(reducer(
      app,
      { type: 'addWidget', payload: newWidget }
    )).toEqual({ theme: 'teal', widgets: [newWidget] });
  });

  it('should add widget to front of array', function () {
    const widgets = [{ id: 'd4c3b2a1', column: 2 }];
    const app = { theme: 'teal', widgets: widgets };
    const newWidget = { id: 'a1b2c3d4', column: 1 };
    expect(reducer(
      app,
      { type: 'addWidget', payload: newWidget }
    )).toEqual({ theme: 'teal', widgets: [newWidget].concat(widgets) });
  });

  it('should remove widget to front of array', function () {
    const widgetA = { id: 'd4c3b2a1', column: 2 };
    const widgetB = { id: 'a1b2c3d4', column: 1 };
    const widgetC = { id: 'f1d2c3b4', column: 3 };
    const app = { theme: 'teal', widgets: [widgetA, widgetB, widgetC] };
    expect(reducer(
      app,
      { type: 'removeWidget', payload: widgetB }
    )).toEqual({ theme: 'teal', widgets: [widgetA, widgetC] });
  });

});

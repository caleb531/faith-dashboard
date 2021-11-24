import React from 'react';
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
    const newWidget = { id: 'c7b6170c', column: 1 };
    expect(reducer(
      app,
      { type: 'addWidget', payload: newWidget }
    )).toEqual({ theme: 'teal', widgets: [newWidget] });
  });

  it('should add widget to front of array', function () {
    const widgets = [{ id: 'ff131e14', column: 2 }];
    const app = { theme: 'teal', widgets: widgets };
    const newWidget = { id: 'b78ced6e', column: 1 };
    expect(reducer(
      app,
      { type: 'addWidget', payload: newWidget }
    )).toEqual({ theme: 'teal', widgets: [newWidget].concat(widgets) });
  });

  it('should remove widget', function () {
    const widgets = [
      { id: '302e0f5f', column: 2 },
      { id: '4ea64c56', column: 1 },
      { id: '6d659201', column: 3 }
    ];
    const app = { theme: 'teal', widgets };
    expect(reducer(
      app,
      { type: 'removeWidget', payload: { id: widgets[1].id } }
    )).toEqual({ theme: 'teal', widgets: [widgets[0], widgets[2]] });
  });

});

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';

describe('Note widget', () => {
  it('should persist note text', async () => {
    render(<Home />);
    await waitFor(async () => {
      expect(screen.getAllByRole('article')[1].dataset).toHaveProperty(
        'widgetType',
        'Note'
      );
    });
    await userEvent.type(
      screen.getAllByRole('textbox', { name: 'Note Text' })[0],
      'God is good'
    );
    const widgetId = screen.getAllByRole('article')[1].dataset.widgetId;
    const persistedWidget = JSON.parse(
      localStorage.getItem(`faith-dashboard-widget-Note:${widgetId}`) || '{}'
    );
    expect(persistedWidget).toHaveProperty('text', 'God is good');
  });
  it('should change text font size', async () => {
    render(<Home />);
    await waitFor(async () => {
      expect(screen.getAllByRole('article')[1].dataset).toHaveProperty(
        'widgetType',
        'Note'
      );
    });
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Toggle Settings' })[1]
    );
    const input = screen.getAllByRole('slider', {
      name: 'Font Size'
    })[0] as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '30' } });
    await fireEvent.change(input, { target: { value: '30' } });
    const widgetId = screen.getAllByRole('article')[1].dataset.widgetId;
    const persistedWidget = JSON.parse(
      localStorage.getItem(`faith-dashboard-widget-Note:${widgetId}`) || '{}'
    );
    expect(persistedWidget).toHaveProperty('fontSize', 30);
  });
});

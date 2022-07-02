import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';
import { getWidgetData } from './__utils__/test-utils';

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
    const widgetId = screen.getAllByRole('article')[1].dataset
      .widgetId as string;
    expect(getWidgetData('Note', widgetId)).toHaveProperty(
      'text',
      'God is good'
    );
  });
  it('should persist text font size', async () => {
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
    const widgetId = screen.getAllByRole('article')[1].dataset
      .widgetId as string;
    expect(getWidgetData('Note', widgetId)).toHaveProperty('fontSize', 30);
  });
});

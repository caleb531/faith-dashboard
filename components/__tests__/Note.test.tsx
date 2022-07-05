import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';
import { getWidgetData } from './__utils__/test-utils';

describe('Note widget', () => {
  it('should change note text', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByRole('article')[1]).toHaveProperty(
        'dataset.widgetType',
        'Note'
      );
    });
    const textBox = screen.getAllByRole('textbox', { name: 'Note Text' })[0];
    await userEvent.type(textBox, 'God is good');
    expect(textBox).toHaveProperty('value', 'God is good');
    expect(
      getWidgetData({
        widgetTypeId: 'Note',
        widgetIndex: 1
      })
    ).toHaveProperty('text', 'God is good');
  });
  it('should change text font size', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByRole('article')[1]).toHaveProperty(
        'dataset.widgetType',
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
    expect(input).toHaveProperty('value', '30');
    expect(screen.getByText('Example Text')).toHaveProperty(
      'style.fontSize',
      '30px'
    );
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Toggle Settings' })[1]
    );
    expect(screen.getByRole('textbox', { name: 'Note Text' })).toHaveProperty(
      'style.fontSize',
      '30px'
    );
    expect(
      getWidgetData({
        widgetTypeId: 'Note',
        widgetIndex: 1
      })
    ).toHaveProperty('fontSize', 30);
  });
  it('should truncate preview text to no fewer than 2 words', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByRole('article')[1]).toHaveProperty(
        'dataset.widgetType',
        'Note'
      );
    });
    const textBox = screen.getAllByRole('textbox', { name: 'Note Text' })[0];
    await userEvent.type(
      textBox,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt in purus venenatis facilisis.'
    );
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Toggle Settings' })[1]
    );
    const input = screen.getAllByRole('slider', {
      name: 'Font Size'
    })[0] as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '12' } });
    await fireEvent.change(input, { target: { value: '12' } });
    expect(input).toHaveProperty('value', '12');
    expect(
      screen.getByText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt...'
      )
    ).toBeInTheDocument();
  });
  it('should truncate preview text to no more than 10 words', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByRole('article')[1]).toHaveProperty(
        'dataset.widgetType',
        'Note'
      );
    });
    const textBox = screen.getAllByRole('textbox', { name: 'Note Text' })[0];
    await userEvent.type(
      textBox,
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt in purus venenatis facilisis.'
    );
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Toggle Settings' })[1]
    );
    const input = screen.getAllByRole('slider', {
      name: 'Font Size'
    })[0] as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '50' } });
    await fireEvent.change(input, { target: { value: '50' } });
    expect(input).toHaveProperty('value', '50');
    expect(screen.getByText('Lorem ipsum...')).toBeInTheDocument();
  });
});

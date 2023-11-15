import Home from '@app/page';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderServerComponent } from '@tests/__utils__/renderServerComponent';
import { getWidgetData, waitForWidget } from '@tests/__utils__/testUtils';

describe('Note widget', () => {
  it('should change note text', async () => {
    await renderServerComponent(<Home />);
    await waitForWidget({ type: 'Note', index: 1 });
    const textBox = screen.getAllByRole('textbox', { name: 'Note Text' })[0];
    await userEvent.type(textBox, 'God is good');
    expect(textBox).toHaveProperty('value', 'God is good');
    expect(getWidgetData({ type: 'Note', index: 1 })).toHaveProperty(
      'text',
      'God is good'
    );
  });
  it('should change text font size', async () => {
    await renderServerComponent(<Home />);
    await waitForWidget({ type: 'Note', index: 1 });
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Toggle Settings' })[1]
    );
    const input = screen.getAllByRole('slider', {
      name: 'Font Size'
    })[0] as HTMLInputElement;
    fireEvent.input(input, { target: { value: '30' } });
    fireEvent.change(input, { target: { value: '30' } });
    expect(input).toHaveProperty('value', '30');
    expect(await screen.findByText('Example Text')).toHaveProperty(
      'style.fontSize',
      '30px'
    );
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Toggle Settings' })[1]
    );
    expect(
      await screen.findByRole('textbox', { name: 'Note Text' })
    ).toHaveProperty('style.fontSize', '30px');
    expect(getWidgetData({ type: 'Note', index: 1 })).toHaveProperty(
      'fontSize',
      30
    );
  });
  it('should truncate preview text to no fewer than 2 words', async () => {
    await renderServerComponent(<Home />);
    await waitForWidget({ type: 'Note', index: 1 });
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
    fireEvent.input(input, { target: { value: '12' } });
    fireEvent.change(input, { target: { value: '12' } });
    expect(input).toHaveProperty('value', '12');
    expect(
      await screen.findByText(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tincidunt...'
      )
    ).toBeInTheDocument();
  });
  it('should truncate preview text to no more than 10 words', async () => {
    await renderServerComponent(<Home />);
    await waitForWidget({ type: 'Note', index: 1 });
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
    fireEvent.input(input, { target: { value: '50' } });
    fireEvent.change(input, { target: { value: '50' } });
    expect(input).toHaveProperty('value', '50');
    expect(await screen.findByText('Lorem ipsum...')).toBeInTheDocument();
  });
});

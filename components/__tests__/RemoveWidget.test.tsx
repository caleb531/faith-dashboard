import '@testing-library/jest-dom';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';
import { WidgetTypeId } from '../widgets/widget';

function mockConfirm(mockImpl: (message?: string) => boolean) {
  return jest.spyOn(window, 'confirm').mockImplementation(mockImpl);
}

async function removeWidgetElem({
  type,
  index,
  confirmRemove
}: {
  type: WidgetTypeId;
  index: number;
  confirmRemove: boolean;
}) {
  const confirm = mockConfirm(() => confirmRemove);
  const widgetElem = screen.getAllByRole('article')[index];
  expect(widgetElem).toHaveProperty('dataset.widgetType', type);
  await userEvent.click(
    screen.getAllByRole('button', { name: 'Remove Widget' })[index]
  );
  expect(confirm).toHaveBeenCalled();
  confirm.mockReset();
  return widgetElem;
}

describe('Remove Widget UI', () => {
  it('should remove BibleVerse widget', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    const widgetElem = await removeWidgetElem({
      type: 'BibleVerse',
      index: 0,
      confirmRemove: true
    });
    await waitForElementToBeRemoved(widgetElem);
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('should remove Note widget', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    const widgetElem = await removeWidgetElem({
      type: 'Note',
      index: 1,
      confirmRemove: true
    });
    await waitForElementToBeRemoved(widgetElem);
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('should remove Podcast widget', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    const widgetElem = await removeWidgetElem({
      type: 'Podcast',
      index: 3,
      confirmRemove: true
    });
    await waitForElementToBeRemoved(widgetElem);
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });

  it('should cancel removing widget', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    await removeWidgetElem({
      type: 'Note',
      index: 1,
      confirmRemove: false
    });
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
  });
});

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';
import { WidgetTypeId } from '../widgets/widget';

function mockConfirm(mockImpl: (message?: string) => boolean) {
  return jest.spyOn(window, 'confirm').mockImplementation(mockImpl);
}

async function removeWidgetElem({
  widgetTypeId,
  widgetIndex,
  confirmRemove
}: {
  widgetTypeId: WidgetTypeId;
  widgetIndex: number;
  confirmRemove: boolean;
}) {
  const confirm = mockConfirm(() => confirmRemove);
  expect(screen.getAllByRole('article')[widgetIndex]).toHaveProperty(
    'dataset.widgetType',
    widgetTypeId
  );
  await userEvent.click(
    screen.getAllByRole('button', { name: 'Remove Widget' })[widgetIndex]
  );
  expect(confirm).toHaveBeenCalled();
  confirm.mockReset();
}

describe('Remove Widget UI', () => {
  it('should remove BibleVerse widget', async () => {
    render(<Home />);
    await waitFor(async () => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    await removeWidgetElem({
      widgetTypeId: 'BibleVerse',
      widgetIndex: 0,
      confirmRemove: true
    });
    await waitFor(async () => {
      expect(screen.getAllByRole('article')).toHaveLength(3);
    });
  });

  it('should remove Note widget', async () => {
    render(<Home />);
    await waitFor(async () => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    await removeWidgetElem({
      widgetTypeId: 'Note',
      widgetIndex: 1,
      confirmRemove: true
    });
    await waitFor(async () => {
      expect(screen.getAllByRole('article')).toHaveLength(3);
    });
  });

  it('should remove Podcast widget', async () => {
    render(<Home />);
    await waitFor(async () => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    await removeWidgetElem({
      widgetTypeId: 'Podcast',
      widgetIndex: 3,
      confirmRemove: true
    });
    await waitFor(async () => {
      expect(screen.getAllByRole('article')).toHaveLength(3);
    });
  });

  it('should cancel removing widget', async () => {
    render(<Home />);
    await waitFor(async () => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    await removeWidgetElem({
      widgetTypeId: 'Note',
      widgetIndex: 1,
      confirmRemove: false
    });
    await waitFor(async () => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
  });
});

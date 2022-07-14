import '@testing-library/jest-dom';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import Home from '../pages/index';
import { removeWidget } from './__utils__/testUtils';

describe('Remove Widget UI', () => {
  it('should remove BibleVerse widget', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    const widgetElem = await removeWidget({
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
    const widgetElem = await removeWidget({
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
    const widgetElem = await removeWidget({
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
    await removeWidget({
      type: 'Note',
      index: 1,
      confirmRemove: false
    });
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
  });
});

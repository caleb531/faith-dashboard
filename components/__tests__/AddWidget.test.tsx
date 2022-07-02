import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';

describe('Add Widget UI', () => {
  it('should add BibleVerse widget', async () => {
    render(<Home />);
    await waitFor(async () => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    await userEvent.click(screen.getByRole('button', { name: 'Add Widget' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Add Bible Verse Widget' })
    );
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getAllByRole('article')[0]).toHaveProperty(
      'dataset.widgetType',
      'BibleVerse'
    );
  });

  it('should add Note widget', async () => {
    render(<Home />);
    await waitFor(async () => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    await userEvent.click(screen.getByRole('button', { name: 'Add Widget' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Add Note Widget' })
    );
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getAllByRole('article')[0]).toHaveProperty(
      'dataset.widgetType',
      'Note'
    );
  });

  it('should add Podcast widget', async () => {
    render(<Home />);
    await waitFor(async () => {
      expect(screen.getAllByRole('article')).toHaveLength(4);
    });
    await userEvent.click(screen.getByRole('button', { name: 'Add Widget' }));
    await userEvent.click(
      screen.getByRole('button', { name: 'Add Podcast Widget' })
    );
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getAllByRole('article')[0]).toHaveProperty(
      'dataset.widgetType',
      'Podcast'
    );
  });
});

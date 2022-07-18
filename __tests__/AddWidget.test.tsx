import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WidgetTypeId } from '../components/widgets/widget';
import widgetTypes from '../components/widgets/widgetTypes';
import Home from '../pages/index';

async function addWidget(widgetTypeId: WidgetTypeId) {
  const widgetType = widgetTypes.find((widgetType) => {
    return widgetType.type === widgetTypeId;
  });
  if (!widgetType) {
    throw new Error(`Invalid widget type: ${widgetTypeId}`);
  }
  render(<Home />);
  await waitFor(() => {
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });
  await userEvent.click(screen.getByRole('button', { name: 'Add Widget' }));
  await userEvent.click(
    screen.getByRole('button', { name: `Add ${widgetType.name} Widget` })
  );
}

async function validateAddedWidget(widgetTypeId: WidgetTypeId) {
  expect(screen.getAllByRole('article')).toHaveLength(5);
  const widgetElement = screen.getAllByRole('article')[0];
  expect(widgetElement).toHaveProperty('dataset.widgetType', widgetTypeId);
  // Should transition widget
  expect(widgetElement).toHaveClass('adding-widget');
  await waitFor(() => {
    expect(widgetElement).not.toHaveClass('adding-widget');
  });
}

describe('Add Widget UI', () => {
  it('should add BibleVerse widget', async () => {
    await addWidget('BibleVerse');
    await validateAddedWidget('BibleVerse');
  });

  it('should add Note widget', async () => {
    await addWidget('Note');
    await validateAddedWidget('Note');
  });

  it('should add Podcast widget', async () => {
    await addWidget('Podcast');
    await validateAddedWidget('Podcast');
  });
});

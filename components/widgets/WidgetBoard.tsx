'use client';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { fromPairs, times } from 'lodash-es';
import { useContext } from 'react';
import AppContext from '../app/AppContext';
import TutorialStepTooltip from '../tutorial/TutorialStepTooltip';
import useTutorialStep from '../tutorial/useTutorialStep';
import WidgetBoardColumn from './WidgetBoardColumn';
import { WidgetHead } from './widget.types';

/* istanbul ignore next */
// Convert the ID of a dropzone to a base-1 column index (e.g. "column-3" => 3)
function getColumnFromDroppableId(droppableId: string): number {
  const matches = droppableId.match(/\d$/);
  return Number(matches && matches[0]);
}

type Props = {
  widgets: WidgetHead[];
};

function WidgetBoard({ widgets }: Props) {
  const dispatchToApp = useContext(AppContext);
  const columnCount = 3;

  const { isCurrentStep, stepProps } = useTutorialStep('dashboard');

  // Because the widgets are stored in a one-dimensional array, yet we are
  // iterating over the widgets column-wise, we need to pre-compute the
  // absolute indices of every widget; these absolute indices will be used
  // later to handle drag-and-drop (pre-computing these values will allow us to
  // perform an O(1) lookup when rendering each widget, rather than an O(n)
  // indexOf at the time each widget is rendered)
  const widgetIdsToIndices = fromPairs(
    widgets.map((widget, w) => {
      return [widget.id, w];
    })
  );

  /* istanbul ignore next */
  function onDragEnd({ source, destination }: DropResult): void {
    // Do nothing if the destination is invalid (this happens if the user drags
    // a widget outside of one of the columns)
    if (!destination) {
      return;
    }

    // Do nothing if the item is dragged to the same place
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = getColumnFromDroppableId(source.droppableId);
    const destinationColumn = getColumnFromDroppableId(destination.droppableId);

    dispatchToApp({
      type: 'moveWidget',
      payload: {
        widgetToMove: widgets[source.index],
        sourceIndex: source.index,
        sourceColumn,
        destinationIndex: destination.index,
        destinationColumn
      }
    });
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {isCurrentStep ? <TutorialStepTooltip /> : null}
      <div className="widget-board" {...stepProps}>
        {times(columnCount, (columnIndex) => {
          return (
            <WidgetBoardColumn
              widgets={widgets}
              widgetIdsToIndices={widgetIdsToIndices}
              columnIndex={columnIndex}
              key={columnIndex}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default WidgetBoard;

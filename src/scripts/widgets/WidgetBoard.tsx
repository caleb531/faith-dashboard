import React, { useContext } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { fromPairs, times } from 'lodash-es';
import { AppContext } from '../app/AppContext';
import WidgetBoardColumn from './WidgetBoardColumn';

// Convert the ID of a dropzone to a base-1 column index (e.g. "column-3" => 3)
function getColumnFromDroppableId(droppableId: string): number {
  return Number(droppableId.match(/\d$/)[0]);
}

function WidgetBoard() {

  const { app, dispatchToApp } = useContext(AppContext);
  const columnCount = 3;

  // Because the widgets are stored in a one-dimensional array, yet we are
  // iterating over the widgets column-wise, we need to pre-compute the
  // absolute indices of every widget; these absolute indices will be used
  // later to handle drag-and-drop (pre-computing these values will allow us to
  // perform an O(1) lookup when rendering each widget, rather than an O(n)
  // indexOf at the time each widget is rendered)
  const widgetIdsToIndices = fromPairs(app.widgets.map((widget, w) => {
    return [widget.id, w];
  }));

  function onDragEnd({ source, destination }: DropResult): void {

    // Do nothing if the destination is invalid (this happens if the user drags
    // a widget outside of one of the columns)
    if (!destination) {
      return null;
    }

    // Do nothing if the item is dragged to the same place
    if (source.droppableId === destination.droppableId && destination.index === source.index) {
      return null;
    }

    const sourceColumn = getColumnFromDroppableId(source.droppableId);
    const destinationColumn = getColumnFromDroppableId(destination.droppableId);

    dispatchToApp({
      type: 'moveWidget',
      payload: {
        widgetToMove: app.widgets[source.index],
        sourceIndex: source.index,
        sourceColumn,
        destinationIndex: destination.index,
        destinationColumn
      }
    });

  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="widget-board">
        {times(columnCount, (columnIndex) => {
          return (
            <WidgetBoardColumn
              widgets={app.widgets}
              widgetIdsToIndices={widgetIdsToIndices}
              columnIndex={columnIndex}
              key={columnIndex} />
          );
        })}
      </div>
    </DragDropContext>
  );

}

export default WidgetBoard;

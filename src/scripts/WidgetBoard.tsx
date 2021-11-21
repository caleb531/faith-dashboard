import React, { useContext } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { fromPairs, times } from 'lodash';
import { AppContext } from './AppContext';
import WidgetBoardColumn from './WidgetBoardColumn';

function WidgetBoard() {

  const { app, dispatchApp } = useContext(AppContext);
  const columnCount = 3;

  const widgetIdsToIndices = fromPairs(app.widgets.map((widget, w) => {
    return [widget.id, w];
  }));

  function onDragEnd({ source, destination }: DropResult) {

    // Make sure we have a valid destination
    if (!destination) {
      return null;
    }

    // Don't do anything if the item is moved to the same place
    if (source.droppableId === destination.droppableId && destination.index === source.index) {
      return null;
    }

    const sourceColumn = Number(source.droppableId.match(/\d$/)[0]);
    const destinationColumn = Number(destination.droppableId.match(/\d$/)[0]);
    const widgetToMove = app.widgets[source.index];

    dispatchApp({
      type: 'moveWidget',
      payload: {
        widgetToMove,
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

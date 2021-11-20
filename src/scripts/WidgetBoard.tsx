import React, { useContext, useReducer, useEffect } from 'react';
import { fromPairs, times } from 'lodash';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { AppContext } from './AppContext';
import Widget from './Widget';

function WidgetBoard() {

  const { app, dispatchApp } = useContext(AppContext);
  const columnCount = 3;

  const widgetIdsToIndices = fromPairs(app.widgets.map((widget, w) => {
    return [widget.id, w];
  }));

  function onDragEnd({ source, destination }: DropResult) {
    console.log('source', source);
    console.log('destination', destination);

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
        destinationIndex: destination.index,
        destinationColumn
      }
    });

  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="widget-board">
        {times(columnCount, (c) => {
          return (
            <Droppable droppableId={`column-${c + 1}`} key={c}>
              {(provided) => (
                <div
                  className="widget-board-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}>
                  {app.widgets
                    .filter((widget) => widget.column === (c + 1))
                    .map((widget, w) => {
                      return (
                        <Draggable draggableId={widget.id} key={widget.id} index={widgetIdsToIndices[widget.id]}>
                          {(provided) => {
                            return <Widget
                              widget={widget}
                              provided={provided} />;
                          }}
                        </Draggable>
                      );
                    })
                  }
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );

}

export default WidgetBoard;

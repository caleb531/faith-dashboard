import React, { useContext, useReducer, useEffect } from 'react';
import { times } from 'lodash';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { AppContext } from './AppContext';
import Widget from './Widget';

function WidgetBoard() {

  const { app, dispatchApp } = useContext(AppContext);
  const columnCount = 3;

  function onDragEnd({ source, destination }: DropResult) {
    console.log('source', source);
    console.log('destination', destination);

    // Make sure we have a valid destination
    if (destination === undefined || destination === null) {
      return null;
    }

    // Make sure we're actually moving the item
    if (destination.index === source.index) {
      return null;
    }

    const sourceColumn = Number(source.droppableId.match(/\d$/)[0]);
    const destinationColumn = Number(destination.droppableId.match(/\d$/)[0]);

    console.log('sourceColumn', sourceColumn);
    console.log('destinationColumn', destinationColumn);

    dispatchApp({
      type: 'moveWidget',
      payload: {
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
            <Droppable droppableId={`column-${columnIndex + 1}`} key={columnIndex}>
              {(provided) => (
                <div
                  className="widget-board-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}>
                  {app.widgets
                    .filter((widget) => widget.column === (columnIndex + 1))
                    .map((widget, widgetIndex) => {
                      return (
                        <Draggable draggableId={widget.id} key={widget.id} index={widgetIndex}>
                          {(provided) => {
                            return <Widget
                              widget={widget}
                              index={widgetIndex}
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

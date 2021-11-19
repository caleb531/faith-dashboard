import React, { useContext, useReducer, useEffect } from 'react';
import { times } from 'lodash';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { AppContext } from './AppContext';
import Widget from './Widget';

function groupWidgetsByColumn(widgets, columnCount) {
  const widgetsByColumn = {};
  let currentColumn = 1;
  times(columnCount, (columnIndex) => {
    widgetsByColumn[columnIndex + 1] = [];
  });
  widgets.forEach((widget) => {
    let column;
    if (!widget.column) {
      widget.column = currentColumn;
      currentColumn = (currentColumn + 1) % (columnCount + 1);
    } else {
      column = Math.min(widget.column, columnCount);
    }
    if (widgetsByColumn[column]) {
      widgetsByColumn[column].push(widget);
    }
  });
  return widgetsByColumn;
}

function WidgetBoard() {

  const { app, dispatchApp } = useContext(AppContext);
  const columnCount = 3;

  const widgetsByColumn = groupWidgetsByColumn(app.widgets, columnCount);

  console.log('widgetsByColumn', widgetsByColumn);

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

    const sourceColumn = source.droppableId.split('-')[1];
    const destinationColumn = destination.droppableId.split('-')[1];

  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="widget-board">
        {times(columnCount, (columnIndex) => {
          return (
            <Droppable droppableId={`column-${columnIndex}`} key={columnIndex}>
              {(provided) => (
                <div
                  className="widget-board-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}>
                  {widgetsByColumn[columnIndex + 1].map((widget, widgetIndex) => {
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
                  })}
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

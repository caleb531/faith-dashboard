import React, { useContext, useReducer, useEffect } from 'react';
import { times } from 'lodash';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { AppContext } from './AppContext';
import Widget from './Widget';

function groupWidgetsByColumn(widgets, columnCount) {
  const widgetsByColumn = {};
  times(columnCount, (columnIndex) => {
    widgetsByColumn[columnIndex + 1] = [];
  });
  widgets.forEach((widget) => {
    const column = Math.min(widget.column || 1, columnCount);
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

  const onDragEnd = () => null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="widget-board">
        {times(columnCount, (columnIndex) => {
          return (
            <Droppable droppableId={`column-${columnIndex}`} key={columnIndex}>
              {provided => (
                <div
                  className="widget-board-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}>
                  {widgetsByColumn[columnIndex + 1].map((widget, widgetIndex) => {
                    return <Widget
                      widget={widget}
                      key={widget.id}
                      index={widgetIndex} />;
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

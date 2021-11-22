import React, { useContext } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { WidgetState } from '../types/Widget.d';
import Widget from './Widget';

function WidgetBoardColumn({ widgets, widgetIdsToIndices, columnIndex }: { widgets: WidgetState[], widgetIdsToIndices: {[key: string]: number}, columnIndex: number }) {

  return (
    <Droppable droppableId={`column-${columnIndex + 1}`}>
      {(provided) => (
        <div
          className="widget-board-column"
          {...provided.droppableProps}
          ref={provided.innerRef}>
          {widgets
            .filter((widget) => (widget.column || 1) === (columnIndex + 1))
            .map((widget) => {
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

}

export default WidgetBoardColumn;

import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { WidgetState } from '../types.d';
import widgetTypeMap from './widgetTypeMap';

type Props = { widgets: WidgetState[], widgetIdsToIndices: {[key: string]: number}, columnIndex: number };

function WidgetBoardColumn({ widgets, widgetIdsToIndices, columnIndex }: Props) {

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
                    const Widget = widgetTypeMap[widget.type];
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

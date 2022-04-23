import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { WidgetHead } from './widget.d';
import widgetTypeMap from './widgetTypeMap';

type Props = {
  widgets: WidgetHead[],
  widgetIdsToIndices: {[key: string]: number},
  columnIndex: number
};

function WidgetBoardColumn({
  widgets,
  widgetIdsToIndices,
  columnIndex
}: Props) {

  return (
    <Droppable droppableId={`column-${columnIndex + 1}`}>
      {(provided) => (
        <div
          className="widget-board-column"
          {...provided.droppableProps}
          ref={provided.innerRef}>
          {widgets
            .filter((widgetHead) => (widgetHead.column || 1) === (columnIndex + 1))
            .map((widgetHead) => {
              return (
                <Draggable draggableId={widgetHead.id} key={widgetHead.id} index={widgetIdsToIndices[widgetHead.id]}>
                  {(provided) => {
                    const Widget = widgetTypeMap[widgetHead.type];
                    return <Widget
                      widgetHead={widgetHead}
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

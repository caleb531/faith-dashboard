import React from 'react';
import { WidgetState } from './Widget.d';
import WidgetTypes from './WidgetTypes';

function Widget({ widget }: { widget: WidgetState }) {

  const widgetStyles = {
    width: widget.width
  };

  const WidgetContents = WidgetTypes[widget.type];

  return (
    <article className="widget" style={widgetStyles}>
      <WidgetContents widget={widget} widgetData={widget.data} />
    </article>
  );

}

export default Widget;

import React from 'react';
import { WidgetState } from './Widget.d';
import WidgetTypes from './WidgetTypes';

function Widget({ widget }: { widget: WidgetState }) {

  const widgetStyles = {
    width: widget.width,
    height: widget.height
  };

  const WidgetContents = WidgetTypes[widget.type];

  return (
    <article className="widget" style={widgetStyles}>
      <WidgetContents widget={widget} />
    </article>
  );

}

export default Widget;

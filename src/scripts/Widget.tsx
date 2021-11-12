import React from 'react';
import { WidgetState } from './Widget.d';

function Widget({ widget }: { widget: WidgetState }) {

  const widgetStyles = {
    width: widget.width,
    height: widget.height
  };

  return (
    <article className="widget" style={widgetStyles}></article>
  );

}

export default Widget;

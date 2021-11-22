import React from 'react';

function AddWidget({ onPressButton }: { onPressButton: Function }) {

  return (
    <button className="add-widget-button" onClick={() => onPressButton()}>Add Widget</button>
  );

}

export default AddWidget;

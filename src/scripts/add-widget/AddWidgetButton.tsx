import React from 'react';

function AddWidget({ onPressButton }: { onPressButton: Function }) {

  return (
    <button className="add-widget-button" aria-label="Add Widget" onClick={() => onPressButton()}>
      <img
        className="add-widget-button-icon"
        src="icons/add-light.svg"
        alt=""
        draggable="false" />
      <span className="add-widget-button-label">Add Widget</span>
    </button>
  );

}

export default AddWidget;

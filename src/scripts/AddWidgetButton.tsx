import React from 'react';

function AddWidget({ onPressButton }: { onPressButton: Function }) {

  return (
    <button className="add-widget-button" onClick={() => onPressButton()}>
      <img className="add-widget-button-icon" src="icons/add-light.svg" alt="" />
      <span className="add-widget-button-label">Add Widget</span>
    </button>
  );

}

export default AddWidget;

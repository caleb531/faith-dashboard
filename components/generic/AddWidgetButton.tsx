import React from 'react';

type Props = {
  onPressButton: () => void,
  buttonProps?: object
};

function AddWidget({
  onPressButton,
  buttonProps = {}
}: Props) {

  return (
    <button type="button" className="add-widget-button" aria-label="Add Widget" onClick={onPressButton} {...buttonProps}>
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

import React from 'react';

type Props = {
  onPressButton: () => void,
  buttonProps?: object,
  buttonClassNames?: string;
};

function AddWidget({
  onPressButton,
  buttonProps = {},
  buttonClassNames = ''
}: Props) {

  return (
    <button
      type="button"
      className={`add-widget-button ${buttonClassNames}`}
      aria-label="Add Widget"
      onClick={onPressButton}
      {...buttonProps}>
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

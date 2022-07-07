type Props = {
  onPressButton: () => void;
  [key: string]: any;
};

function AddWidget({ onPressButton, ...buttonProps }: Props) {
  return (
    <button
      type="button"
      onClick={onPressButton}
      {...buttonProps}
      className={`add-widget-button ${
        buttonProps.className ? buttonProps.className : ''
      }`}
    >
      <img
        className="add-widget-button-icon"
        src="/icons/add-light.svg"
        alt=""
        draggable="false"
      />
      <span className="add-widget-button-label">Add Widget</span>
    </button>
  );
}

export default AddWidget;

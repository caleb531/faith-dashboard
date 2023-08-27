import Button from './Button';

type Props = {
  onPressButton: () => void;
  [key: string]: any;
};

function AddWidget({ onPressButton, ...buttonProps }: Props) {
  return (
    <Button
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
    </Button>
  );
}

export default AddWidget;

import Button from './Button';
import Icon from './Icon';

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
      <Icon name="add-light" />
      <span className="add-widget-button-label">Add Widget</span>
    </Button>
  );
}

export default AddWidget;

import Button, { Props } from './Button';

const InstructionalButton = (props: Props) => {
  return (
    <Button {...props} className="instructional-button" disabled>
      {props.children}
    </Button>
  );
};

export default InstructionalButton;

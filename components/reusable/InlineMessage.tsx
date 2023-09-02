type Props = {
  type: 'success' | 'warning' | 'error';
  message: string;
};

const InlineMessage = ({ type, message }: Props) => {
  return message ? (
    <div className="inline-message-container">
      <div className="inline-message" data-type={type}>
        {message}
      </div>
    </div>
  ) : null;
};

export default InlineMessage;

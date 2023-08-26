type Props = {
  message: string;
};

const InlineErrorMessage = ({ message }: Props) => {
  return message ? (
    <div className="inline-error-message-container">
      <div className="inline-error-message">{message}</div>
    </div>
  ) : null;
};

export default InlineErrorMessage;

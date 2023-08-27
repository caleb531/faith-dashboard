import clsx from 'clsx';

type Props = {
  className?: string;
  id?: string;
  autoCenter?: boolean;
};

// A generic, reusable loading indicator that can be used in any context
function LoadingIndicator({
  className = '',
  autoCenter = false,
  ...props
}: Props) {
  return (
    <div
      className={clsx(
        'loading-indicator',
        { 'loading-indicator-auto-centered': autoCenter },
        ...className.split(' ')
      )}
      {...props}
    >
      <svg viewBox="0 0 32 32" className="loading-indicator-icon">
        <title>Loading...</title>
        <path d="M 16,2 A 8,8 0,0,1 16,30" />
      </svg>
    </div>
  );
}

export default LoadingIndicator;

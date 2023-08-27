import clsx from 'clsx';

type Props = {
  isVisible: boolean;
};

function TutorialOverlay({ isVisible }: Props) {
  return (
    <div className={clsx('tutorial-overlay', { 'is-visible': isVisible })} />
  );
}

export default TutorialOverlay;

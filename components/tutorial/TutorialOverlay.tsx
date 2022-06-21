import classNames from 'classnames';
import React from 'react';

type Props = {
  isVisible: boolean;
};

function TutorialOverlay({ isVisible }: Props) {
  return (
    <div
      className={classNames('tutorial-overlay', { 'is-visible': isVisible })}
    />
  );
}

export default TutorialOverlay;

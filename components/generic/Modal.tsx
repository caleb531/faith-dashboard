import React from 'react';

type Props = {
  children: JSX.Element | (JSX.Element | null)[] | null,
  onCloseModal: () => void,
  onBackButton?: (() => void) | null
};

function Modal({
  children,
  onCloseModal,
  onBackButton
}: Props) {

  return (
    <div className="modal-scroll-container">
      <div className="modal-overlay" onClick={onCloseModal}></div>
      <aside className="modal" role="dialog">
        {onBackButton ? (
          <button type="button" className="modal-control modal-back-control" onClick={onBackButton}>
          <img
            className="modal-control-icon modal-back-control-icon"
            src="icons/back-dark.svg"
            alt="Go Back"
            draggable="false" />
          </button>
        ) : null}
        <button type="button" className="modal-control modal-close-control" onClick={onCloseModal}>
          <img
            className="modal-control-icon modal-close-control-icon"
            src="icons/close-dark.svg"
            alt="Close Modal"
            draggable="false" />
        </button>
        <div className="modal-contents">
          {children}
        </div>
      </aside>
    </div>
  );

}

export default Modal;

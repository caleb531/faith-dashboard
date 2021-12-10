import React from 'react';

type Props = { children: JSX.Element | JSX.Element[], onCloseModal: () => void };

function Modal({ children, onCloseModal }: Props) {

  return (
    <div className="modal-scroll-container">
      <div className="modal-overlay" onClick={onCloseModal}></div>
      <aside className="modal" role="dialog">
        <button type="button" className="modal-close-control" onClick={() => onCloseModal()}>
          <img
            className="modal-close-control-icon"
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

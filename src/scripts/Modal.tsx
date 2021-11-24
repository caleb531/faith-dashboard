import React from 'react';

function Modal({ children, onCloseModal }: { children: JSX.Element | JSX.Element[], onCloseModal: Function }) {

  return (
    <div className="modal-scroll-container">
      <div className="modal-overlay" onClick={(event) => onCloseModal()}></div>
      <div className="modal">
        <button className="modal-close-control" onClick={() => onCloseModal()}>
          <img
            className="modal-close-control-icon"
            src="icons/close-dark.svg"
            alt="Close Modal"
            draggable="false" />
        </button>
        <div className="modal-contents">
          {children}
        </div>
      </div>
    </div>
  );

}

export default Modal;

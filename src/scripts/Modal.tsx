import React from 'react';

function Modal({ children, onCloseModal }: { children: JSX.Element | JSX.Element[], onCloseModal: Function }) {

  return (
    <div className="modal-scroll-container">
      <div className="modal-overlay" onClick={(event) => onCloseModal()}></div>
      <div className="modal">
        {children}
      </div>
    </div>
  );

}

export default Modal;

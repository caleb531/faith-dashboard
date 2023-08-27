import React from 'react';
import Button from './Button';

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

function Modal({ children, onClose }: Props) {
  return (
    <div className="modal-scroll-container">
      <div className="modal-overlay" onClick={onClose}></div>
      <aside className="modal sheet" role="dialog">
        <Button
          className="sheet-control sheet-control-right modal-control modal-close-control"
          unstyled
          onClick={onClose}
        >
          <img
            className="sheet-control-icon modal-control-icon modal-close-control-icon"
            src="/icons/close-dark.svg"
            alt="Close Modal"
            draggable="false"
          />
        </Button>
        <div className="modal-contents">{children}</div>
      </aside>
    </div>
  );
}

export default Modal;

import React from 'react';

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

function Modal({ children, onClose }: Props) {
  return (
    <div className="modal-scroll-container">
      <div className="modal-overlay" onClick={onClose}></div>
      <aside className="modal sheet" role="dialog">
        <button
          type="button"
          className="sheet-control sheet-control-right modal-control modal-close-control"
          data-unstyled
          onClick={onClose}
        >
          <img
            className="sheet-control-icon modal-control-icon modal-close-control-icon"
            src="/icons/close-dark.svg"
            alt="Close Modal"
            draggable="false"
          />
        </button>
        <div className="modal-contents">{children}</div>
      </aside>
    </div>
  );
}

export default Modal;

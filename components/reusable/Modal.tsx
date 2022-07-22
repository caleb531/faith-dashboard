import { JSXChildren } from '../global';

type Props = {
  children: JSXChildren;
  onCloseModal: () => void;
};

function Modal({ children, onCloseModal }: Props) {
  return (
    <div className="modal-scroll-container">
      <div className="modal-overlay" onClick={onCloseModal}></div>
      <aside className="modal sheet" role="dialog">
        <button
          type="button"
          className="sheet-control sheet-control-right modal-control modal-close-control"
          onClick={onCloseModal}
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

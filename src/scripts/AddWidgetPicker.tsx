import React, { useContext, useState } from 'react';
import Modal from './Modal';

function AddWidget({ setWidgetPickerIsOpen }: { setWidgetPickerIsOpen: Function }) {

  function closeWidgetPicker() {
    setWidgetPickerIsOpen(false);
  }

  return (
    <Modal onCloseModal={closeWidgetPicker}>
        <h2>Add Widget</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum debitis dolorum dignissimos? Tempore dicta inventore iusto cumque, nemo eveniet. Temporibus reiciendis quae dolor accusamus nesciunt consectetur? Eveniet explicabo incidunt voluptates.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam minima, unde suscipit vel accusamus deleniti consectetur recusandae earum? Accusamus aspernatur ducimus iure autem porro velit cupiditate mollitia. Explicabo, recusandae adipisci.</p>
    </Modal>
  );

}

export default AddWidget;

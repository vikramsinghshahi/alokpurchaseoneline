import React from 'react';
import Modal from 'react-modal';
import { func, string, bool, any } from 'prop-types';
import Clear from '../Icons/Clear';
import './ReactModal.scss';

Modal.setAppElement('#root');

function ReactModal({ children, onRequestClose, ...rest }) {
  return (
    <Modal onRequestClose={onRequestClose} {...rest}>
      {!rest.hideCloseButton && (
        <button className="closeModal" onClick={onRequestClose}>
          <Clear width={18} height={18} />
        </button>
      )}
      {children}
    </Modal>
  );
}

ReactModal.propTypes = {
  children: any,
  onRequestClose: func,
  overlayClassName: string,
  hideCloseButton: bool,
};

ReactModal.defaultProps = {
  overlayClassName: 'commonOverlay',
  hideCloseButton: false,
};

export default ReactModal;

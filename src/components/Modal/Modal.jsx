import css from './Modal.module.css'
import { useEffect } from 'react';
import PropTypes from 'prop-types';


function Modal({ onClose, image }) {

  useEffect (() => {
    window.addEventListener('keydown', handleKeyDown);
    window.removeEventListener('keydown', handleKeyDown);

  },)

  const handleKeyDown = event => {
    if (event.code === 'Escape') {
      onClose();
    }
  };

  const handleClick = event => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={css.Overlay} onClick={handleClick}>
      <div className={css.Modal}>
        <img src={image.largeImageURL} alt={image.tags} />
      </div>
    </div>
  );
}

Modal.propTypes = {
  image: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};


export default Modal 
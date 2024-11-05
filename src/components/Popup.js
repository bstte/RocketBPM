// src/components/Popup.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Popup = ({
  showPopup,
  popupPosition,
  popupTitle,
  setShowPopup,
  handleCreateNewNode,
  deleteNode,
  popupRef,
  startDrag,
}) => (
  showPopup && (
    <div
      className="popup"
      style={{
        ...styles.popup,
        left: `${popupPosition.x}px`,
        top: `${popupPosition.y}px`,
      }}
      ref={popupRef}
      onMouseDown={startDrag} // Start dragging on mouse down
    >
      <span onClick={() => setShowPopup(false)} style={styles.closeIcon}>
        <FaTimes />
      </span>
      <h3 style={styles.popupTitle}>{popupTitle}</h3>
      <button onClick={handleCreateNewNode} style={styles.popupButton}>
        {`Create ${popupTitle}`}
      </button>
      <button onClick={deleteNode} style={styles.popupButton}>
        {`Delete ${popupTitle}`}
      </button>
    </div>
  )
);

const styles = {
  popup: {
    position: 'absolute',
    background: '#fff',
    border: '1px solid #007bff',
    borderRadius: '4px',
    padding: '1rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    minWidth: '200px', // Set a minimum width for better appearance
  },
  closeIcon: {
    position: 'absolute',
    top: '5px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#007bff', // Icon color
  },
  popupTitle: {
    margin: '0 0 1rem 0',
    fontSize: '16px', // Adjust font size for better readability
  },
  popupButton: {
    display: 'block',
    width: '100%',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem',
    cursor: 'pointer',
    marginBottom: '0.5rem',
    transition: 'background 0.2s',
  },
};

export default Popup;

// components/SharePopup.js
import React from 'react';
import { copyLinkToClipboard, copyNameAndLinkToClipboard } from '../utils/shareHelper';
import { useTranslation } from '../hooks/useTranslation';

const SharePopup = ({ processId, processName, onClose }) => {
  const t = useTranslation();
  const styles = {
    popup: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    backdrop: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    content: {
      position: 'relative',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      minWidth: '250px',
    },
    button: {
      padding: '10px',
      fontSize: '14px',
      cursor: 'pointer',
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
      transition: 'background-color 0.3s',
    }
  };

  return (
    <div style={styles.popup}>
      <div style={styles.backdrop} onClick={onClose}></div>
      <div style={styles.content}>
        <button
          style={styles.button}
          onClick={() => {
            copyLinkToClipboard(processId);
            onClose();
          }}
        >
        {t("copy_link_to_clipboard")}
        </button>
        <button
          style={styles.button}
          onClick={() => {
            copyNameAndLinkToClipboard(processName, processId);
            onClose();
          }}
        >
          {t("copy_process_name_and_link")}
        </button>
      </div>
    </div>
  );
};

export default SharePopup;

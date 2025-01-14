import React from 'react';
import { FaTimes } from 'react-icons/fa';

const CustomContextPopup = ({
  isVisible,
  position,
  menuItems = [],
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        zIndex: 10,
        minWidth: '150px', 
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        borderBottom: '1px solid #ccc',
        backgroundColor: '#f8f8f8',
      }}>
        <span style={{
          fontWeight: 'bold',
          fontSize: '16px',
        }}>
          
        </span>
        <span 
          onClick={onClose} 
          style={{
            cursor: 'pointer',
            fontSize: '20px',
            color: '#007bff',
          }}
          title="Close"
        >
          <FaTimes />
        </span>
      </div>

      {menuItems.map((item, index) => (
        <div
          key={index}
          style={{
            padding: '8px 12px',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            borderBottom: item.borderBottom ? '1px solid #f0f0f0' : 'none',
          }}
          onClick={() => {
            item.action();
            onClose();
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f1f1'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default CustomContextPopup;

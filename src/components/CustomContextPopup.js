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
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 10,
        minWidth: '150px', 
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 12px',
        borderBottom: '1px solid #fff',
        backgroundColor: '#e7e7e7',
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
            color: '#011f60',
            display:'flex'
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
            backgroundColor: '#e7e7e7',
            color:'#011f60',
            fontWeight:'500',
            borderBottom: item.borderBottom ? '1px solid #fff' : 'none',
          }}
          onClick={() => {
            item.action();
            onClose();
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#002060';
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#e7e7e7';
            e.currentTarget.style.color = '#011f60'

          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default CustomContextPopup;

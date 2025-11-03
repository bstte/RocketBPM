import React from "react";
// import { FaTimes } from 'react-icons/fa';

const CustomContextPopup = ({
  isVisible,
  position,
  menuItems = [],
  onClose,
}) => {
  if (!isVisible) return null;
  // Menu dimensions (adjust to your style)
  const menuWidth = 300;
  const menuHeight = 100;

  // Prevent menu overflow
  let x = position.x;
  let y = position.y;
  const { innerWidth, innerHeight } = window;

  if (x + menuWidth > innerWidth) x = innerWidth - menuWidth - 20;
  if (y + menuHeight > innerHeight) y = innerHeight - menuHeight - 40;

  return (
    <div
      style={{
        position: "fixed",
        top: `${y}px`,
        left: `${x}px`,
        backgroundColor: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: 10,
        minWidth: "150px",
      }}
    >
      {/* <div className='swimlanemenuclose' style={{
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
      </div> */}

      {menuItems.map((item, index) => (
        <div
          className="menuitems"
          key={index}
          onClick={() => {
            item.action();
            onClose();
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#ff364a";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#e7e7e7";
            e.currentTarget.style.color = "#011f60";
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default CustomContextPopup;

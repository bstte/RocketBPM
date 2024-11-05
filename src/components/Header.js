// Inside Header component
import React, { useState } from 'react';

const Header = ({ title, onSave }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="app-header" style={styles.header}>
      <h1 style={styles.headerTitle}>{title}</h1>
      <button
        onClick={onSave}
        style={{
          ...styles.saveButton,
          backgroundColor: isHovered ? '#218838' : 'rgb(161 165 169)', // Darker green on hover
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Save
      </button>
    </header>
  );
};


const styles = {
  header: {
    padding: '15px',
    border: '1px solid rgb(166 160 160)',
    color: '#343a40',
    display: 'flex',
    justifyContent: 'space-between', // Ensures space between title and button
    alignItems: 'center',
    backgroundColor: '#ffffff', // Optional: Set a background color
  },
  headerTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745', // Green color for visibility
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
};

export default Header;

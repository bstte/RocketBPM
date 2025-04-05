// Sidebar.js
import React, { useState } from 'react';
import { ProgressArrow, Pentagon, Diamond, Box, Label} from './Icon'; // Adjust the path as necessary

const Sidebar = ({  addNode }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const iconNames = {
    progressArrow: 'Arrow Node',
    pentagon: 'Pentagon Node',
    diamond: 'Diamond Node',
    box: 'Box Node',
    label: 'Label Node',
   
  
  };

  const iconComponents = {
    progressArrow: <ProgressArrow />,
    pentagon: <Pentagon />,
    diamond: <Diamond />,
    box: <Box />,
    label: <Label />,
   
    
  };

  return (
    <aside className="sidebar" onClick={(e) => e.stopPropagation()} style={styles.sidebar}>
   
        <div style={styles.shapeContainer}>
          {Object.keys(iconNames).map((iconKey) => (
            <div key={iconKey} style={styles.iconWrapper}>
              <button
                onMouseEnter={() => setHoveredIcon(iconKey)}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={() => addNode(iconKey)}
                style={styles.iconButton}
                aria-label={`Add ${iconNames[iconKey]}`}
              >
                <div
                  style={{
                    ...styles.iconStyle,
                    transform: hoveredIcon === iconKey ? 'scale(1.5)' : 'scale(.9)',
                  }}
                >
                  {iconComponents[iconKey]}
                </div>
              </button>
            </div>
          ))}
        </div>
    
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '178px',
    padding: '10px',
    backgroundColor: '#f1f3f5',
    borderRight: '1px solid #dee2e6',
    boxSizing: 'border-box',
  },

  shapeContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    justifyItems: 'flex-start',
  },
  iconButton: {
    width: '40px',
    height: '40px',
    backgroundColor: 'transparent',
    border: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    padding: '0',
  },
  iconWrapper: {
    position: 'relative',
  },
  iconStyle: {
    width: '32px',
    height: '32px',
    color: '#002060',
    transition: 'transform 0.3s ease',
  },
};

export default Sidebar;

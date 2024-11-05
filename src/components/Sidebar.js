// Sidebar.js
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ProgressArrow, Pentagon, Diamond, Box, Label, Ellipse, HeadingWithText,Parallelogram, Hexagon, Note, Callout, ConnectorWithSymbol, Line } from './Icon'; // Adjust the path as necessary

const Sidebar = ({ showShapes, setShowShapes, addNode }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const iconNames = {
    progressArrow: 'Arrow Node',
    pentagon: 'Pentagon Node',
    diamond: 'Diamond Node',
    box: 'Box Node',
    label: 'Label Node',
    Ellipse:"Ellipse Node",
    HeadingWithText:"Heading_With_Text",
    Parallelogram:"Parallelogram",
    Hexagon:"Hexagon",
    Note:"Note",
    Callout:"Callout",
    ConnectorWithSymbol:"ConnectorWithSymbol",
    Line:"Line"
  };

  const iconComponents = {
    progressArrow: <ProgressArrow />,
    pentagon: <Pentagon />,
    diamond: <Diamond />,
    box: <Box />,
    label: <Label />,
    Ellipse:<Ellipse/>,
    HeadingWithText:<HeadingWithText/>,
    Parallelogram:<Parallelogram/>,
    Hexagon:<Hexagon/>,
    Note:<Note/>,
    Callout:<Callout/>,
    ConnectorWithSymbol:<ConnectorWithSymbol/>,
    Line:<Line/>
  };

  return (
    <aside className="sidebar" onClick={(e) => e.stopPropagation()} style={styles.sidebar}>
      <button onClick={() => setShowShapes(!showShapes)} style={styles.generalButton}>
        <span style={styles.generalText}>General</span>
        {showShapes ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {showShapes && (
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
      )}
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
  generalButton: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    margin: '0 auto 15px auto',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    width: '100%',
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
    color: '#000',
    transition: 'transform 0.3s ease',
  },
};

export default Sidebar;

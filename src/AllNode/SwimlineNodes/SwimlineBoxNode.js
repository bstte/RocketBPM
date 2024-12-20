import { memo, useEffect, useState, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import ReactDOM from 'react-dom';
import ContentEditable from 'react-contenteditable';

const BoxNode = ({ data, id, isNew }) => {
  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 }); // Popup position
  const [title, setTitle] = useState(data.details.title);
  const boxRef = useRef(null); // Ref for the box node

 useEffect(() => {
  if (data.autoFocus && boxRef.current) {
    setTimeout(() => {
      boxRef.current.focus();
      data.autoFocus = false; 
    }, 0);
  }
}, [data.autoFocus]);


  const handleMouseEnter = () => {
    if (!isEditing && boxRef.current) {
      const { top, left } = boxRef.current.getBoundingClientRect();
      setPopupPosition({ x: left, y: top });
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isEditing) {
      setIsHovered(false);
    }
  };

  const handleFocus = () => {
    setIsEditing(true); // Start editing
    setIsHovered(false); // Hide popup while editing
  };

  const handleBlur = () => {
    setIsEditing(false); // Stop editing
  };

  const handleChange = (e) => {
    setTitle(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };

  const renderPopup = () => (
    <div
      style={{
        ...styles.popup,
        left: popupPosition.x,
        top: popupPosition.y,
        zIndex: 1001,
      }}
    >
      <h3 style={styles.popupTitle}>{data.details.title}</h3>
      <div
        style={styles.popupContent}
        dangerouslySetInnerHTML={{ __html: data.details.content }}
      />
    </div>
  );

  return (
    <div
      style={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="borderBox" style={styles.box}>
        <ContentEditable
          innerRef={boxRef}
          html={title}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => handleChange({ target: { value: e.target.value } })}
          placeholder="Type title here..."
          style={styles.label}
        />
      </div>

      <Handle type="target" position={Position.Bottom} id="bottom-target" style={styles.handle} />
      <Handle type="source" position={Position.Bottom} id="bottom-source" style={styles.handle} />
      <Handle type="target" position={Position.Top} id="top-target" style={styles.handle} />
      <Handle type="source" position={Position.Top} id="top-source" style={styles.handle} />
      <Handle type="target" position={Position.Left} id="left-target" style={styles.handle} />
      <Handle type="source" position={Position.Left} id="left-source" style={styles.handle} />
      <Handle type="target" position={Position.Right} id="right-target" style={styles.handle} />
      <Handle type="source" position={Position.Right} id="right-source" style={styles.handle} />
      <div style={styles.borderOverlay}></div>

      {/* Render popup */}
      {isHovered && data.details.title &&
        ReactDOM.createPortal(renderPopup(), document.body)
      }
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '90%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '2px solid #000',
    width: '100%',
    height: '100%',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  borderOverlay: {
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    zIndex: -1,
    backgroundColor: 'transparent',
    borderRadius: '5px',
    pointerEvents: 'none',
  },
  label: {
    fontSize: '12px',
    fontFamily: "'Poppins', sans-serif",
    background: 'transparent',
    border: 'none',
    outline: 'none',
    textAlign: 'center',
    width: '100%',
  },
  handle: {
    backgroundColor: 'red',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  popup: {
    position: 'fixed',
    transform: 'translate(-50%, -100%)',
    width: 'auto',
    maxWidth: '500px',
    padding: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid #000',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
  },
  popupTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 10px 0',
  },
  popupContent: {
    fontSize: '14px',
    color: '#333',
    whiteSpace: 'normal',
    maxHeight: '200px',
    overflowY: 'auto',
    paddingRight: '10px',
  },
};

export default memo(BoxNode);

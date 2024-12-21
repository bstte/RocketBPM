import { memo, useRef, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import ContentEditable from 'react-contenteditable';

const ArrowBoxNode = ({ data, onTitleChange }) => {
  const [title, setTitle] = useState(data.details.title );
  const contentEditableRef = useRef(null);
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);
  const handleChange = (e) => {
    setTitle(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };

  useEffect(() => {
    if (autoFocus && contentEditableRef.current) {
      setTimeout(() => {
        contentEditableRef.current.focus();
        setAutoFocus(false); 
      }, 0);
    }
  }, [autoFocus]);
  const handleBlur = () => {
    if (onTitleChange) {
      onTitleChange(title); 
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Arrow Box */}
      <div className="borderBox" style={styles.arrowBox}>
        <ContentEditable
          innerRef={contentEditableRef}
          html={title} 
          onChange={(e) => handleChange({ target: { value: e.target.value } })}
          onBlur={handleBlur}
          placeholder="Type title here..."
          
          style={styles.label}
        />
      </div>

      {/* Border overlay as a separate div */}
      <div style={styles.borderOverlay}></div>

      {/* Handles */}
      <Handle type="target" position={Position.Bottom} id="bottom-target" style={styles.handle} />
      <Handle type="source" position={Position.Bottom} id="bottom-source" style={styles.handle} />
      <Handle type="target" position={Position.Top} id="top-target" style={styles.handle} />
      <Handle type="source" position={Position.Top} id="top-source" style={styles.handle} />
      <Handle type="target" position={Position.Left} id="left-target" style={styles.handle} />
      <Handle type="source" position={Position.Left} id="left-source" style={styles.handle} />
      <Handle type="target" position={Position.Right} id="right-target" style={styles.handle} />
      <Handle type="source" position={Position.Right} id="right-source" style={styles.handle} />
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
  arrowBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    textAlign: 'center',
    backgroundColor: 'red',
    color: '#000000',
    width: '100%',
    height: '100%',
    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  label: {
    fontSize: '12px',
    fontFamily: "'Poppins', sans-serif",
    color: 'white',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    textAlign: 'center',
    width: '100%',
  },
  borderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)',
    border: '1px solid black',
    pointerEvents: 'none',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    padding: '2px',
  },
  handle: {
    backgroundColor: 'red',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
};

export default memo(ArrowBoxNode);

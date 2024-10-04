


// PentagonNode.js
import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const PentagonNode = ({ data, isNew, onLabelChange }) => {
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isClickable, setIsClickable] = useState(false); // Track whether the node is clickable

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  useEffect(() => {
    if (isNew && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isNew]);

  const handleChange = (e) => {
    setLabel(e.target.value);
    if (onLabelChange) {
      onLabelChange(e.target.value);
    }
  };

  const handleBlur = () => {
    if (onLabelChange) {
      onLabelChange(label);
    }
  };

  const handleClick = () => {
    // Toggle clickable state
    setIsClickable((prev) => !prev);
  };

  const handleResizeStart = () => {
    if (!isClickable) return; // Ignore resizing if not clickable
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  return (
    <>
      {/* Render NodeResizer conditionally based on isClickable */}
      {isClickable && (
        <NodeResizer
          minWidth={100}
          minHeight={50}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
        />
      )}

      {/* Source and Target Handles */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />

      {/* Pentagon Box Style */}
      <div 
        onClick={handleClick} // Enable click to toggle resizable
        style={{
          ...styles.pentagonBox,
          minWidth: isResizing ? 'auto' : '200px', // Apply minWidth only when not resizing
          minHeight: isResizing ? 'auto' : '150px', // Apply minHeight only when not resizing
        }}
      >
        <input
          ref={inputRef}
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          style={styles.input}
        />
      </div>
    </>
  );
};

const styles = {
  pentagonBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#ff4747', // Pentagon color
    color: '#fff',
    borderRadius: '5px',
    width: '100%',
    height: '100%',
    clipPath: 'polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)', // Pentagon shape
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)', // Box shadow for better visibility
  },
  input: {
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    fontSize: 'inherit',
    fontWeight: 'inherit',
    width: '100%',
    outline: 'none',
    textAlign: 'center',
  },
};

export default memo(PentagonNode);

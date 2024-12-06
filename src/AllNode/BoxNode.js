// src/AllNode/BoxNode.jsx
import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const BoxNode = ({ data, id, isNew }) => {
  const [label, setLabel] = useState(data.label || ''); // Fallback to empty string if undefined
  const textareaRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    setLabel(data.label || ''); // Update label if data.label changes
  }, [data.label]);

  useEffect(() => {
    if (isNew && textareaRef.current) {
      textareaRef.current.focus(); // Focus on the textarea if the node is new
    }
  }, [isNew]);

  const handleChange = (e) => {
    const newValue = e.target.value || ''; // Prevent undefined
    setLabel(newValue);
    if (data.onLabelChange) {
      data.onLabelChange(newValue);
    }
  };

  const handleBlur = () => {
    if (data.onLabelChange) {
      data.onLabelChange(label);
    }
  };

  const handleClick = () => {
    setIsClickable((prev) => !prev); // Toggle clickable state
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  return (
    <div style={styles.wrapper} onClick={handleClick}>
      {/* Box Shape */}
      <div
        style={{
          ...styles.box,
          minWidth: isResizing ? 'auto' : data.width_height ? data.width_height.width : '150px',
          minHeight: isResizing ? 'auto' : data.width_height ? data.width_height.height : '150px',
        }}
      >
        <textarea
          ref={textareaRef}
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Type ...."
          style={styles.textarea}
          rows={1}
          maxLength={200} // Optional: limit characters
        />
      </div>

      {isClickable && (
        <NodeResizer
          minWidth={100}
          minHeight={50}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
        />
      )}

      {/* Handles for connecting nodes */}
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
    width: '100%',
    height: '100%',
  },
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    textAlign: 'center',
    backgroundColor: 'red',
    color: '#fff',
    // border: '2px solid #000',
    width: '100%',
    height: '100%',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  textarea: {
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    fontSize: '22px',
    width: '100%',
    resize: 'none',
    outline: 'none',
    textAlign: 'center',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.4',
    fontFamily: "'Poppins', sans-serif",
  },
  handle: {
    width: '12px',
    height: '12px',
    backgroundColor: 'red',
    borderRadius: '50%',
    border: '2px solid #fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  },
};

export default memo(BoxNode);

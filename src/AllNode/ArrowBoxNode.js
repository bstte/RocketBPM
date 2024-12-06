import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const ArrowBoxNode = ({ data, id, isNew }) => {
  const [label, setLabel] = useState(data.label || ''); 
  const textareaRef = useRef(null);

  const [isResizing, setIsResizing] = useState(false);
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    setLabel(data.label || ''); 
  }, [data.label]);

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

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  const handleClick = () => {
    setIsClickable(!isClickable);
  };

  return (
    <div
      style={{
        ...styles.wrapper,
      }}
      onClick={handleClick}
    >
      {/* Arrow Box */}
      <div
        className="borderBox"
        style={{
          ...styles.arrowBox,
          minWidth: isResizing ? 'auto' : data.width_height ? data.width_height.width : '520px',
          minHeight: isResizing ? 'auto' : data.width_height ? data.width_height.height : '150px',
        }}
      >
        <textarea
          ref={textareaRef}
          value={label} // The value to display
          onChange={handleChange} // Handle text change
          onBlur={handleBlur}
          placeholder="Type ...."
          style={styles.textarea}
          rows={1}
          maxLength={200} // Optional: limit characters

        />
      </div>

      {isClickable && (
        <NodeResizer
          minWidth={120}
          minHeight={80}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
        />
      )}

      <Handle type="target" position={Position.Bottom} id="bottom-target" style={styles.handle} />
      <Handle type="source" position={Position.Bottom} id="bottom-source" style={styles.handle} />

      <Handle type="target" position={Position.Top} id="top-target" style={styles.handle} />
      <Handle type="source" position={Position.Top} id="top-source" style={styles.handle} />

      <Handle type="target" position={Position.Left} id="left-target" style={styles.handle} />
      <Handle type="source" position={Position.Left} id="left-source" style={styles.handle} />

      <Handle type="target" position={Position.Right} id="right-target" style={styles.handle} />
      <Handle type="source" position={Position.Right} id="right-source" style={styles.handle} />

      {/* Overlay for border effect */}
      <div style={styles.borderOverlay}></div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
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
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    border: 'none',
  },
  borderOverlay: {
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    zIndex: -1,
    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
  },
  textarea: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    width: '100%',
    resize: 'none', // Prevent resizing
    outline: 'none',
    textAlign: 'center',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontFamily: "'Poppins', sans-serif",
    minHeight: '20px',
  },
  handle: {
    backgroundColor: 'red',
    width: '15px',
    height: '15px',
    borderRadius: '50%',
  },
};

export default memo(ArrowBoxNode);

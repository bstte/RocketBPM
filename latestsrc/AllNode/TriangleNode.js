// src/AllNode/TriangleNode.jsx
import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { FaSyncAlt } from 'react-icons/fa';

const TriangleNode = ({ data, isNew }) => {
  const [label, setLabel] = useState(data.label);
  const textareaRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  useEffect(() => {
    if (isNew && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isNew]);

  const handleChange = (e) => {
    setLabel(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };

  const handleBlur = () => {
    if (data.onLabelChange) {
      data.onLabelChange(label);
    }
  };

  const handleClick = () => {
    setIsClickable((prev) => !prev);
  };

  const handleResizeStart = () => {
    if (!isClickable) return;
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  const handleRotationStart = () => {
    setIsRotating(true);
  };

  const handleRotationEnd = useCallback(() => {
    setIsRotating(false);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isRotating && textareaRef.current) {
        const rect = textareaRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const radians = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const angle = (radians * 180) / Math.PI;
        setRotation(angle);
      }
    },
    [isRotating]
  );

  useEffect(() => {
    if (isRotating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleRotationEnd);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleRotationEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleRotationEnd);
    };
  }, [isRotating, handleMouseMove, handleRotationEnd]);

  return (
    <div
      style={{
        ...styles.wrapper,
        transform: `rotate(${rotation}deg)`,
      }}
      onClick={handleClick}
    >
      {isClickable && (
        <>
          <NodeResizer
            minWidth={100}
            minHeight={100}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
          />
          <div style={styles.rotationIcon} onMouseDown={handleRotationStart}>
            <FaSyncAlt />
          </div>
        </>
      )}

      <Handle type="target" position={Position.Bottom} id="bottom-target" />
      <Handle type="source" position={Position.Bottom} id="bottom-source" />
      <Handle type="target" position={Position.Top} id="top-target" />
      <Handle type="source" position={Position.Top} id="top-source" />
      <Handle type="target" position={Position.Left} id="left-target" />
      <Handle type="source" position={Position.Left} id="left-source" />
      <Handle type="target" position={Position.Right} id="right-target" />
      <Handle type="source" position={Position.Right} id="right-source" />

      <div style={styles.triangleBox}>
        <textarea
          ref={textareaRef}
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Type ...."
          style={styles.textarea}
          rows={3}
          maxLength={200}
        />
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '150px',
    height: '150px',
  },
  triangleBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: '#e74c3c',
    color: '#fff',
    clipPath: 'polygon(100% 50%, 0 100%, 0 0)',
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
    fontSize: '16px',
    fontWeight: 'bold',
    width: '100%',
    height: '100%',
    resize: 'none',
    outline: 'none',
    textAlign: 'center',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.4',
  },
  rotationIcon: {
    position: 'absolute',
    top: '-15px',
    right: '-15px',
    cursor: 'pointer',
    backgroundColor: '#fff',
    padding: '5px',
    borderRadius: '50%',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  },
    handle: {
    width: '16px',
    height: '16px',
    backgroundColor: '#99CCFF',
    borderRadius: '50%',
    border: '2px solid #fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  },
};

// Wrap TriangleNode with PlaceholderStyles
const TriangleNodeWithPlaceholder = (props) => (
  <>
    <TriangleNode {...props} />
  </>
);

export default memo(TriangleNodeWithPlaceholder);

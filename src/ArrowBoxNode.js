import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const ArrowBoxNode = ({ data, isNew, onLabelChange }) => {
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
 

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
    setIsClickable((prev) => !prev);
  };

  const handleResizeStart = () => {
    if (!isClickable) return;
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  // Start rotation on mousedown
  // const handleRotationStart = () => {
  //   setIsRotating(true);
  // };

  // // End rotation on mouseup
  // const handleRotationEnd = () => {
  //   setIsRotating(false);
  // };

  // // Handle rotation by mouse movement
  // const handleMouseMove = (e) => {
  //   if (isRotating) {
  //     const rect = inputRef.current.getBoundingClientRect();
  //     const centerX = rect.left + rect.width / 2;
  //     const centerY = rect.top + rect.height / 2;
  //     const radians = Math.atan2(e.clientY - centerY, e.clientX - centerX);
  //     const angle = (radians * 180) / Math.PI;
  //     setRotation(angle);
  //   }
  // };

  // useEffect(() => {
  //   if (isRotating) {
  //     document.addEventListener('mousemove', handleMouseMove);
  //     document.addEventListener('mouseup', handleRotationEnd);
  //   } else {
  //     document.removeEventListener('mousemove', handleMouseMove);
  //     document.removeEventListener('mouseup', handleRotationEnd);
  //   }

  //   return () => {
  //     document.removeEventListener('mousemove', handleMouseMove);
  //     document.removeEventListener('mouseup', handleRotationEnd);
  //   };
  // }, [isRotating]);

  return (
    <div
      style={{
        ...styles.wrapper, // Rotate the entire wrapper, including node and resizer
       
      }}
      onClick={handleClick}
    >
      {isClickable && (
        <>
          {/* Node Resizer */}
          <NodeResizer
            minWidth={100}
            minHeight={50}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
          />
          {/* Rotation Icon */}
        
        </>
      )}

      {/* Source and Target Handles */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />

      {/* Arrow Box */}
      <div
        style={{
          ...styles.arrowBox,
          minWidth: isResizing ? 'auto' : '400px',
          minHeight: isResizing ? 'auto' : '100px',
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
    backgroundColor: '#ff4747',
    color: '#fff',
    borderRadius: '5px',
    width: '100%',
    height: '100%',
    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)', // Forward arrow shape
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
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
  rotationIcon: {
    position: 'absolute',
    top: '-15px', // Position slightly above the node
    right: '-15px', // Align it to the right
    cursor: 'pointer',
    backgroundColor: '#fff',
    padding: '5px',
    borderRadius: '50%',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  },
};

export default memo(ArrowBoxNode);

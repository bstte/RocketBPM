// src/AllNode/BoxNode.jsx
import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { FaSyncAlt } from 'react-icons/fa'; // Rotation icon

const BoxNode = ({ data, id,isNew }) => {
  const [label, setLabel] = useState(data.label);
  const textareaRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  const [rotation, setRotation] = useState(0); // Rotation angle
  const [isRotating, setIsRotating] = useState(false); // Rotation state
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    setIsEditing(true)
  };

  const handleResizeStart = () => {
    if (!isClickable) return;
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  // Start rotation on mousedown
  const handleRotationStart = () => {
    setIsRotating(true);
  };

  // End rotation on mouseup
  const handleRotationEnd = useCallback(() => {
    setIsRotating(false);
  }, []);

  // Handle rotation by mouse movement
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

  const handleLabelClick = () => {
  
    if (data && data.handleCreateNewNode) {
      data.handleCreateNewNode(id); // Call the function with the node's ID
    }
  };

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
          {/* Node Resizer */}
          <NodeResizer
            minWidth={100}
            minHeight={50}
            onResizeStart={handleResizeStart}
            onResizeStop={handleResizeStop}
          />
          {/* Rotation Icon */}
          <div
            style={styles.rotationIcon}
            onMouseDown={handleRotationStart}
          >
            <FaSyncAlt />
          </div>
        </>
      )}

<Handle type="target" position={Position.Bottom} id="bottom-target" style={styles.handle} />
      <Handle type="source" position={Position.Bottom} id="bottom-source" style={styles.handle} />

      <Handle type="target" position={Position.Top} id="top-target" style={styles.handle} />
      <Handle type="source" position={Position.Top} id="top-source" style={styles.handle} />

      <Handle type="target" position={Position.Left} id="left-target" style={styles.handle} />
      <Handle type="source" position={Position.Left} id="left-source" style={styles.handle} />
      
      <Handle type="target" position={Position.Right} id="right-target" style={styles.handle} />
      <Handle type="source" position={Position.Right} id="right-source" style={styles.handle} />

      {/* Box Shape */}
      <div
        style={{
          ...styles.box,
          minWidth: isResizing ? 'auto' : data.width_height ? data.width_height.width : "200px",
          minHeight: isResizing ? 'auto' : data.width_height ? data.width_height.height : '100px',
        }}
      >
      
{isEditing && data.Editable? (
          <textarea
          ref={textareaRef}
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder='Type ....'
          className="textarea-class" // For placeholder styling
          style={styles.textarea}
          rows={3}
          maxLength={200}
        />

        ) : (
          <div onClick={handleLabelClick}
          onMouseEnter={() => setIsHovered(true)}  // Set hover state to true
          onMouseLeave={() => setIsHovered(false)} // Set hover state to false

           style={{ cursor: 'pointer' }}>
            <span style={{fontSize:"20px",fontWeight:"bold",color: isHovered ? '#0c0cd6' : 'inherit',}}> {data.label || 'Click to add label'}</span>
        </div>
        )}
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
  box: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    textAlign: 'center',
    backgroundColor: '#ff4747', // Blue color
    color: '#fff',
    width: '100%',
    height: '100%',
    borderRadius: '5px', // Rounded corners
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
    width: '12px',
    height: '16px',
    backgroundColor: '#99CCFF',
    borderRadius: '50%',
    border: '2px solid #fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  },
};

// Placeholder styling component
const PlaceholderStyles = () => (
  <style>
    {`
      .textarea-class::placeholder {
        color: #ccc; /* Placeholder text color */
      }
    `}
  </style>
);

// Wrap BoxNode with PlaceholderStyles
const BoxNodeWithPlaceholder = (props) => (
  <>
    <PlaceholderStyles />
    <BoxNode {...props} />
  </>
);

export default memo(BoxNodeWithPlaceholder);

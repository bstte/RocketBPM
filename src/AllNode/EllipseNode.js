
// src/AllNode/ArrowBoxNode.jsx
import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { FaSyncAlt } from 'react-icons/fa'; // Import a rotation icon

const EllipseNode = ({ data,id, isNew }) => {
  const [label, setLabel] = useState(data.label);
  const textareaRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isResizing, setIsResizing] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  const [rotation, setRotation] = useState(0); // Track the rotation angle
  const [isRotating, setIsRotating] = useState(false); // Track rotation state
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

    if (data.onLabelChange) { // Use data.onLabelChange
      data.onLabelChange(e.target.value);
    }
  };

  const handleBlur = () => {
    if (data.onLabelChange) { // Use data.onLabelChange
      data.onLabelChange(label);
    }
  };

  const handleClick = () => {
    console.log("hit funcaiton ")
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

  const handleLabelClick = () => {
  
    if (data && data.handleCreateNewNode) {
      data.handleCreateNewNode(id); // Call the function with the node's ID
    }
  };

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
        ...styles.wrapper, // Rotate the entire wrapper, including node and resizer
        transform: `rotate(${rotation}deg)`,
      }}
      onClick={handleClick}
    >
      {isClickable || data.nodeResize&& (
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

      {/* Source Handles */}


      <Handle type="target" position={Position.Bottom} id="bottom-target" style={styles.handle} />
      <Handle type="source" position={Position.Bottom} id="bottom-source" style={styles.handle} />

      <Handle type="target" position={Position.Top} id="top-target" style={styles.handle} />
      <Handle type="source" position={Position.Top} id="top-source" style={styles.handle} />

      <Handle type="target" position={Position.Left} id="left-target" style={styles.handle} />
      <Handle type="source" position={Position.Left} id="left-source" style={styles.handle} />

      <Handle type="target" position={Position.Right} id="right-target" style={styles.handle} />
      <Handle type="source" position={Position.Right} id="right-source" style={styles.handle} />

      {/* Arrow Box */}
      <div
        style={{
          ...styles.Ellipse,
          minWidth: isResizing ? 'auto' : data.width_height ? data.width_height.width :data.defaultwidt,
          minHeight: isResizing ? 'auto' : data.width_height ? data.width_height.height : data.defaultheight,
        }}
      >

{isEditing && data.Editable || !data.label ? (
          <textarea
            ref={textareaRef}
            value={label}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder='Type ....'

            style={styles.textarea}
            rows={2} // Initial number of rows; adjust as needed
            maxLength={200} // Optional: limit characters
          />
        ) : (
          <div onClick={handleLabelClick}
          onMouseEnter={() => setIsHovered(true)}  // Set hover state to true
          onMouseLeave={() => setIsHovered(false)} // Set hover state to false

           style={{ cursor: 'pointer' }}>
            <span style={{fontSize:"18px",   textTransform: 'uppercase',    fontFamily: "'Poppins', sans-serif",color: isHovered ? '#0c0cd6' : 'inherit',}}> {data.label || 'Click to add label'}</span>
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
  Ellipse: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    textAlign: 'center',
    backgroundColor: '#ffffff', // Ellipse background color
    color: '#002060',
    borderRadius: '50%', // Make it a full ellipse by using 50% border radius
    width: '100%',
    height: '100%',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    padding: '10px', // Add some padding to the content
    boxSizing: 'border-box',
    overflow: 'hidden', // Prevent content overflow
  },
  textarea: {
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    fontSize: '18px',
    // fontWeight: 'bold',
    width: '100%',
    // height: '100%',
    resize: 'none',
    outline: 'none',
    textAlign: 'center',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.4', // Adjust line height for better readability
    fontFamily: "'Poppins', sans-serif", // Apply Poppins font

    textTransform: 'uppercase',          // Capitalize text
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
  handle: {
    width: '16px',
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
const EllipseNodeWithPlaceholder = (props) => (
  <>
    <PlaceholderStyles />
    <EllipseNode {...props} />
  </>
);
export default memo(EllipseNodeWithPlaceholder);





// PentagonNode.js
import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const PentagonNode = ({ data, id,isNew }) => {
  const [label, setLabel] = useState(data.label);
  const textareaRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isClickable, setIsClickable] = useState(false); // Track whether the node is clickable
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


  const handleLabelClick = () => {
  
    if (data && data.handleCreateNewNode) {
      data.handleCreateNewNode(id); // Call the function with the node's ID
    }
  };

  const handleChange = (e) => {
    setLabel(e.target.value);
    console.log(e.target.value);
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
    // Toggle clickable state
    setIsClickable((prev) => !prev);
    setIsEditing(true)
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

  {/* Source and Target Handles on All Four Sides */}
  {/* <Handle type="target" position={Position.Top} id="top-target" style={styles.handle} />
      <Handle type="source" position={Position.Top} id="top-source" style={styles.handle} />
      
      <Handle type="target" position={Position.Bottom} id="bottom-target" style={styles.handle} />
      <Handle type="source" position={Position.Bottom} id="bottom-source" style={styles.handle} />
       */}
 <Handle type="target" position={Position.Bottom} id="bottom-target" style={styles.handle} />
      <Handle type="source" position={Position.Bottom} id="bottom-source" style={styles.handle} />

      <Handle type="target" position={Position.Top} id="top-target" style={styles.handle} />
      <Handle type="source" position={Position.Top} id="top-source" style={styles.handle} />

      <Handle type="target" position={Position.Left} id="left-target" style={styles.handle} />
      <Handle type="source" position={Position.Left} id="left-source" style={styles.handle} />
      
      <Handle type="target" position={Position.Right} id="right-target" style={styles.handle} />
      <Handle type="source" position={Position.Right} id="right-source" style={styles.handle} />

      {/* Pentagon Box Style */}
      <div 
        onClick={handleClick} // Enable click to toggle resizable
        style={{
          ...styles.pentagonBox,
          minWidth: isResizing ? 'auto' : data.width_height?data.width_height.width:"200px",
          minHeight: isResizing ? 'auto' :data.width_height?data.width_height.height: '150px',
        }}
      >
        

{isEditing && data.Editable? (
           <textarea
           ref={textareaRef}
           value={label}
           onChange={handleChange}
           onBlur={handleBlur}
           className="textarea-class"
           placeholder='Type ....'
           style={styles.textarea}
           rows={3} // Initial number of rows; adjust as needed
           maxLength={200} // Optional: limit characters
       
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
    lineHeight: '1.4', // Adjust line height for better readability
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
const PentagonNodeWithPlaceholder = (props) => (
  <>
    <PlaceholderStyles />
    <PentagonNode {...props} />
  </>
);


export default memo(PentagonNodeWithPlaceholder);

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const BoxNode = ({ data, id, isNew }) => {
  return (
    <div style={styles.wrapper}>
    
      <div className='borderBox' style={styles.box}>
        <span
          style={{
            fontSize: "10px",
            fontFamily: "'Poppins', sans-serif",
            textAlign: "center", // Justify the text

          }}
        >
          {data.details.title || 'No Details'}
        </span>
      </div>

      {/* Connection Handles */}
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
    backgroundColor: '#ffffff', // White background
    color: '#000000', // Black text
    border: '2px solid #000', // Solid black border
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
    // border: '2px dashed #ff0000', // Dashed red border for the overlay
    borderRadius: '5px', // Match border radius with the box
    pointerEvents: 'none', // Ignore pointer events
  },
  handle: {
    backgroundColor: 'red',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
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

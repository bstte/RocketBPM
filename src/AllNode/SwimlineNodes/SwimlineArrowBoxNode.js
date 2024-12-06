import { memo, } from 'react';
import { Handle, Position } from '@xyflow/react';

const ArrowBoxNode = ({ data }) => {


  const handleClick = () => {
  };

  return (
    <div
      style={styles.wrapper}
      onClick={handleClick}
    >
      {/* Arrow Box */}
      <div
        className='borderBox'
        style={styles.arrowBox}
    
      >
        <span style={styles.label}>
          {data.details.title || 'No Details'}
        </span>
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
    fontSize: "15px",
    textTransform: 'uppercase',
    fontFamily: "'Poppins', sans-serif",
    color: 'white',
  },
  borderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)',
    border: '1px solid black', // Set black border
    pointerEvents: 'none', // Prevent interaction with the overlay
    boxSizing: 'border-box',
    backgroundColor: 'transparent', // Ensure background is transparent
    // Using padding to create space for the border
    padding: '2px', // This can be adjusted to your design
  },
  handle: {
    backgroundColor: 'red',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
};

export default memo(ArrowBoxNode);

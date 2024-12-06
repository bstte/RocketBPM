import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const PentagonNode = ({ data }) => {
  return (
    <div style={styles.wrapper}>
      {/* Pentagon Shape */}
      <div style={styles.pentagon}>
        <span style={styles.title}>{data.details.title || 'No Details'}</span>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={{ ...styles.handle, top: '-5px', left: '50%', transform: 'translateX(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{ ...styles.handle, bottom: '-5px', left: '50%', transform: 'translateX(-50%)' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{ ...styles.handle, left: '-5px', top: '50%', transform: 'translateY(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{ ...styles.handle, right: '-5px', top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '100px', // Ensures enough space for the pentagon
    height: '100px', // Same as width for perfect centering
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Ensures the pentagon doesn't overflow the container
  },
  pentagon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#ffffff',
    clipPath: 'polygon(50% 0%, 100% 38%, 81% 100%, 19% 100%, 0% 38%)', // Pentagon shape
    border: '2px solid #000', // Visible border
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)', // Subtle shadow
    transform: 'translateY(-5px)', // Adjusts vertical centering to prevent overflow
  },
  title: {
    fontSize: '12px',
    fontWeight: 'bold',
    fontFamily: "'Poppins', sans-serif",
    textAlign: 'center',
    color: '#000',
  },
  handle: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    backgroundColor: 'red',
    borderRadius: '50%',
  },
};

export default memo(PentagonNode);

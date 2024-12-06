import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const SwimlineDiamondNode = ({ data }) => {
  return (
    <div style={styles.wrapper}>
      {/* Diamond Shape */}
      <div style={styles.diamondWrapper}>
        <div style={styles.diamond}>
          <span style={styles.title}>{data.details.title || 'No Details'}</span>
        </div>
      </div>

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
        style={{ ...styles.handle, left: '18px', top: '50%', transform: 'translateY(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{ ...styles.handle, right: '18px', top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '120px', // Adjust the size of the node container
    height: '75px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamond: {
    position: 'relative',
    width: '45px', // Reduced diamond width
    height: '45px', // Reduced diamond height
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '2px solid #000',
    transform: 'rotate(45deg)', // Creates the diamond shape
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  },
  title: {
    transform: 'rotate(-45deg)', // Rotates the text back to normal
    fontSize: '9px', // Reduced font size
    fontFamily: "'Poppins', sans-serif",
    textAlign: 'center',
  },
  handle: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    backgroundColor: 'red',
    borderRadius: '50%',
  },
};

export default memo(SwimlineDiamondNode);

import { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import ContentEditable from 'react-contenteditable';

const SwimlineDiamondNode = ({ data }) => {
  const [title, setTitle] = useState(data.details.title);

  const titleRef = useRef(null); 
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);


  useEffect(() => {
    if (autoFocus && titleRef.current) {
      setTimeout(() => {
        titleRef.current.focus();
        setAutoFocus(false); 
      }, 0);
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    setTitle(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);

    }
  };


  useEffect(() => {
    if (autoFocus && titleRef.current) {
      setTimeout(() => {
        titleRef.current.focus();
        setAutoFocus(false); 
      }, 0);
    }
  }, [autoFocus]);

  return (
    <div style={styles.wrapper}>
      {/* Diamond Shape */}
      <div style={styles.diamondWrapper}>
        <div style={styles.diamond}>
          <ContentEditable
            innerRef={titleRef}
            html={title}
            onChange={(e) => handleChange({ target: { value: e.target.value } })}
            placeholder="Type title here..."
            style={styles.title}
          />
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={{ ...styles.handle, top: '0px', left: '50%', transform: 'translateX(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={{ ...styles.handle, bottom: '0px', left: '50%', transform: 'translateX(-50%)' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={{ ...styles.handle, left: '12px', top: '50%', transform: 'translateY(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={{ ...styles.handle, right: '12px', top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    width: '90%',
    height: '90%',
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
    width: '45px',
    height: '45px',
    backgroundColor: '#ffffff',
    color: '#000000',
    border: '2px solid #000',
    transform: 'rotate(45deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
  },
  title: {
    transform: 'rotate(-45deg)',
    fontSize: '9px',
    fontFamily: "'Poppins', sans-serif",
    textAlign: 'center',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    width: '100%',
    padding: '0',
    margin: '0',
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

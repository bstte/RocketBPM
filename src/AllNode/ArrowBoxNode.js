import { memo, useState, useEffect, useRef } from 'react';
import { NodeResizer } from '@xyflow/react';

const ArrowBoxNode = ({ data }) => {
  const [label, setLabel] = useState(data.label || ''); 

  const [isResizing, setIsResizing] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  const arrowref = useRef(null); 
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);

  useEffect(() => {
    setLabel(data.label || ''); 
  }, [data]);

  useEffect(() => {
    if (autoFocus && arrowref.current) {
      setTimeout(() => {
        arrowref.current.focus();
        setAutoFocus(false); 
      }, 0);
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    const newValue = e.target.value || ''; 
    setLabel(newValue);
    if (data.onLabelChange) {
      data.onLabelChange(newValue);
    }
  };


  const handleBlur = () => {
    if (data.onLabelChange) {
      data.onLabelChange(label);
    }
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  const handleClick = () => {
    setIsClickable(!isClickable);
  };



  return (
    <div
      style={styles.wrapper}
      onClick={handleClick}
    >
      <div
        className="borderBox"
        style={{
          ...styles.arrowBox,
          minWidth: isResizing ? 'auto' : data.width_height ? data.width_height.width : '520px',
          minHeight: isResizing ? 'auto' : data.width_height ? data.width_height.height : '150px',
        }}
      >
        <textarea
        ref={arrowref}
          value={label} 
          onChange={handleChange} 
          onBlur={handleBlur}
          placeholder="Type ...."
          style={styles.textarea}
          rows={1}
          maxLength={200} 
    
        />
      </div>

      {isClickable && (
        <NodeResizer
          minWidth={120}
          minHeight={80}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
        />
      )}

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
    backgroundColor: 'red',
    color: '#000000',
    width: '100%',
    height: '100%',
    clipPath: 'polygon(40px 50%, 0 0, calc(100% - 40px) 0, 100% 50%, calc(100% - 40px) 100%, 0 100%)',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    border: 'none',
  },

  textarea: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    width: '100%',
    resize: 'none', 
    outline: 'none',
    textAlign: 'center',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontFamily: "'Poppins', sans-serif",
    minHeight: '20px',
  },
};

export default memo(ArrowBoxNode);

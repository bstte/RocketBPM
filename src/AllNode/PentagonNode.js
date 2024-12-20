import { memo, useState, useEffect, useRef } from 'react';
import { NodeResizer } from '@xyflow/react';

const PentagonNode = ({ data, id, isNew }) => {
  const [label, setLabel] = useState(data.label || ''); 
  const textareaRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    setLabel(data.label || ''); 
  }, [data.label]);

  useEffect(() => {
    if (isNew && textareaRef.current) {
      textareaRef.current.focus(); // Focus on the textarea if the node is new
    }
  }, [isNew]);

  const handleChange = (e) => {
    const newValue = e.target.value || ''; // Prevent undefined
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
    setIsClickable(!isClickable); // Toggle clickable state
  };

  return (
    <div style={styles.wrapper} onClick={handleClick}>
      {/* Pentagon Box */}
      <div
        style={{
          ...styles.pentagonBox,
          minWidth: isResizing ? 'auto' : data.width_height ? data.width_height.width : '150px',
          minHeight: isResizing ? 'auto' : data.width_height ? data.width_height.height : '150px',
        }}
      >
        <textarea
          ref={textareaRef}
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Type ...."
          style={styles.textarea}
          rows={1}
          maxLength={200} // Optional: limit characters

        />
      </div>

      {isClickable && (
        <NodeResizer
          minWidth={100}
          minHeight={50}
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
  pentagonBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'red',
    color: '#000000',
    width: '100%',
    height: '100%',
    clipPath: 'polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    border: 'none',
  },
  textarea: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '22px',
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

export default memo(PentagonNode);

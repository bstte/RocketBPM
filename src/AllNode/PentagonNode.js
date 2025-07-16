import { memo, useState, useEffect, useRef } from 'react';
import { NodeResizer } from '@xyflow/react';

const PentagonNode = ({ data, id, selectedNodeId }) => {
  const [label, setLabel] = useState(data.label || '');
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);
  const [width, setWidth] = useState(data.width_height?.width || 150);
  const [height, setHeight] = useState(data.width_height?.height || 150);
  const textareaRef = useRef(null);

  const isClickable = selectedNodeId === id;

  // Sync label from data
  useEffect(() => {
    setLabel(data.label || '');
  }, [data.label]);

  // Sync width/height when data.width_height changes (publish -> edit)
  useEffect(() => {
    if (data.width_height?.width && data.width_height?.height) {
      setWidth(data.width_height.width);
      setHeight(data.width_height.height);
    }
  }, [data.width_height]);

  // Focus textarea if autoFocus is true
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus();
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

  const handleResize = (e, size) => {
    if (!size || typeof size.width === 'undefined' || typeof size.height === 'undefined') {
      console.warn('Invalid resize size', size);
      return;
    }
    setWidth(size.width);
    setHeight(size.height);

    if (data.updateWidthHeight) {
      data.updateWidthHeight(id, { width: size.width, height: size.height });
    }
  };

  return (
    <div   style={{
      ...styles.wrapper,
      filter: data.LinkToStatus ? 'drop-shadow(0px 0px 10px #0000004f)' : 'none',
    }}>
      {/* Pentagon Box */}
      <div
        style={{
          ...styles.pentagonBox,
          width: `${width}px`,
          height: `${height}px`,
          clipPath: 'polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)',
        }}
      >
        <textarea
          ref={textareaRef}
          value={label}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Type..."
          style={styles.textarea}
          rows={1}
          maxLength={200}
        />
      </div>

      {isClickable && (
        <NodeResizer
          minWidth={100}
          minHeight={50}
          onResize={handleResize}
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
    color: '#002060',
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    border: 'none',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    transition: 'width 0.2s ease, height 0.2s ease',
  },
  textarea: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '1rem',
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

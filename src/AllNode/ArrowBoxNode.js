import { memo, useState, useEffect, useRef } from 'react';
import { NodeResizer } from '@xyflow/react';

const ArrowBoxNode = ({ data, id, selectedNodeId }) => {
  const [label, setLabel] = useState(data.label || '');
  // const [isResizing, setIsResizing] = useState(false);
  const isClickable = selectedNodeId === id;
  const arrowRef = useRef(null);
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);

  const [width, setWidth] = useState(data.width_height?.width || 326);
  const [height, setHeight] = useState(data.width_height?.height || 90);
  const [clipPath, setClipPath] = useState("");

  useEffect(() => {
    setLabel(data.label || '');
  }, [data]);

  useEffect(() => {
    if (autoFocus && arrowRef.current) {
      setTimeout(() => {
        arrowRef.current.focus();
        setAutoFocus(false);
      }, 0);
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    setLabel(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };

  const handleBlur = () => {
    if (data.onLabelChange) {
      data.onLabelChange(label);
    }
  };

  const calculateClipPath = (w, h) => {
    return `polygon(20px 50%, 0 0, calc(${w}px - 24px) 0, ${w}px 50%, calc(${w}px - 24px) 100%, 0 100%)`;
  };

  useEffect(() => {
    setClipPath(calculateClipPath(width, height));
  }, [width, height]);

  const handleResizeStart = () => {
    // setIsResizing(true);
  };

  const handleResize = (event, size) => {
    if (!size || typeof size.width === "undefined" || typeof size.height === "undefined") {
      console.warn("Size is undefined", size);
      return;
    }
    setWidth(size.width);
    setHeight(size.height);
  };

  const handleResizeStop = () => {
    // setIsResizing(false);
  };

  const adjustHeight = (e) => {
    const element = e.target;
    element.style.height = "auto"; // Reset height
    element.style.height = element.scrollHeight + "px"; // Adjust to content

    const wrapper = element.parentElement;
    if (wrapper) {
      wrapper.style.height = element.scrollHeight + "px";
    }
  };

  return (
    <div style={styles.wrapper}>
      <div
        className="borderBox"
        style={{
          ...styles.arrowBox,
          width: `${width}px`,
          height: `${height}px`,
          clipPath: clipPath,
        }}
      >
        <div style={styles.textareaWrapper}>
          <textarea
            ref={arrowRef}
            value={label}
            onChange={handleChange}
            onInput={adjustHeight}
            onBlur={handleBlur}
            placeholder="Type ...."
            style={styles.textarea}
            rows={1}
            maxLength={200}
            className="mapleveltextarea"
          />
        </div>
      </div>

      {isClickable && (
        <NodeResizer
          minWidth={120}
          minHeight={80}
          onResizeStart={handleResizeStart}
          onResize={handleResize}
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
    padding: '10px',
    boxSizing: 'border-box',
    overflow: 'hidden',
    border: 'none',
    transition: "width 0.2s ease, height 0.2s ease",
  },
  
  textareaWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },

  textarea: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1rem',
    width: '100%',
    minHeight: '20px',
    resize: 'none',
    outline: 'none',
    textAlign: 'center',
    overflowWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    fontFamily: "'Poppins', sans-serif",
  },
};

export default memo(ArrowBoxNode);

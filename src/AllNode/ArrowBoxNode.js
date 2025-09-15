import { memo, useState, useEffect, useRef, useMemo } from "react";
import { NodeResizer } from "@xyflow/react";

const ArrowBoxNode = ({ data, id, selectedNodeId }) => {
  const [label, setLabel] = useState(data.label || "");
  const isClickable = selectedNodeId === id;
  const arrowRef = useRef(null);
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);

  const [width, setWidth] = useState(data.width_height?.width || 326);
  const [height, setHeight] = useState(data.width_height?.height || 90);

  // NEW IMPORTANT: Sync width/height when data.width_height changes
  useEffect(() => {
    if (data.width_height?.width && data.width_height?.height) {
      setWidth(data.width_height.width);
      setHeight(data.width_height.height);
    }
  }, [data.width_height]);


  useEffect(() => {
    setLabel(data.label || "");
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

  const clipPath = useMemo(() => {
    const arrowWidth = 24;
    return `polygon(
      20px ${height / 2}px,
      0 0,
      ${width - arrowWidth}px 0,
      ${width}px ${height / 2}px,
      ${width - arrowWidth}px ${height}px,
      0 ${height}px
    )`;
  }, [width, height]);

  const handleResize = (event, size) => {
    if (!size || typeof size.width === "undefined" || typeof size.height === "undefined") {
      console.warn("Size is undefined", size);
      return;
    }
    setWidth(size.width);
    setHeight(size.height);

    if (data.updateWidthHeight) {
      data.updateWidthHeight(id, { width: size.width, height: size.height });
    }
  };

  const adjustHeight = (e) => {
    const element = e.target;
    if (!element) return;

    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";

    const wrapper = element.parentElement;
    if (wrapper) {
      wrapper.style.height = element.scrollHeight + "px";
    }
  };

  // Adjust textarea height dynamically
  useEffect(() => {
    if (arrowRef.current) {
      arrowRef.current.style.height = "auto";
      arrowRef.current.style.height = arrowRef.current.scrollHeight + "px";
    }
  }, [label, width, height, selectedNodeId]);

  return (
    <div
      style={{
        ...styles.wrapper,
        filter:
          data.LinkToStatus || data.hasNextLevel
            ? 'drop-shadow(0px 0px 10px #0000004f)'
            : 'none',
      }}
    >

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
            placeholder="Type ...."
            style={styles.textarea}
            rows={1}
            maxLength={200}
            className="mapleveltextarea"
          />
        </div>
      </div>

      {isClickable && (
        <NodeResizer minWidth={120} minHeight={80} onResize={handleResize} />
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  arrowBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    textAlign: "center",
    backgroundColor: "red",
    color: "#002060",
    padding: "10px",
    boxSizing: "border-box",
    overflow: "hidden",
    border: "none",
    transition: "width 0.2s ease, height 0.2s ease",
  },
  textareaWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  textarea: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "1rem",
    width: "100%",
    minHeight: "20px",
    resize: "none",
    outline: "none",
    textAlign: "center",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
    fontFamily: "'Poppins', sans-serif",
  },
};

export default memo(ArrowBoxNode);
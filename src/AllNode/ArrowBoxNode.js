import { memo, useState, useEffect, useRef, useMemo } from "react";
import { NodeResizer } from "@xyflow/react";

const ArrowBoxNode = ({ data, id, selectedNodeId }) => {
  const [label, setLabel] = useState(data.label || "");
  const isClickable = selectedNodeId === id;
  const arrowRef = useRef(null);
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);

  const [width, setWidth] = useState(data.width_height?.width || 326);
  const [height, setHeight] = useState(data.width_height?.height || 90);
  // const [clipPath, setClipPath] = useState("");

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

  // const calculateClipPath = (w, h) => {
  //   return `polygon(20px 50%, 0 0, calc(${w}px - 24px) 0, ${w}px 50%, calc(${w}px - 24px) 100%, 0 100%)`;
  // };

  // useEffect(() => {
  //   const newClipPath = calculateClipPath(width, height);
  //   if (newClipPath !== clipPath) {
  //     setClipPath(newClipPath);
  //   }
  // }, [width, height]);
  
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

  // Fix: Ensure textarea maintains height after selecting another object
  useEffect(() => {
    if (arrowRef.current) {
      arrowRef.current.style.height = "auto"; // Reset before recalculating
      arrowRef.current.style.height = arrowRef.current.scrollHeight + "px"; // Set dynamically
    }
  }, [label, width, height, selectedNodeId]); // Depend on selectedNodeId

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

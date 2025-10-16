import { memo, useState, useEffect, useRef } from "react";
import { NodeResizer } from "@xyflow/react";
import ContentEditable from "react-contenteditable";

const PentagonNode = ({ data, id, selectedNodeId }) => {
  const [label, setLabel] = useState(data.label || "");
  const [autoFocus, setAutoFocus] = useState(data.autoFocus || false);
  const [width, setWidth] = useState(data.width_height?.width || 150);
  const [height, setHeight] = useState(data.width_height?.height || 150);
  const contentRef = useRef(null);

  const isClickable = selectedNodeId === id;

  useEffect(() => {
    setLabel(data.label || "");
  }, [data.label]);

  useEffect(() => {
    if (data.width_height?.width && data.width_height?.height) {
      setWidth(data.width_height.width);
      setHeight(data.width_height.height);
    }
  }, [data.width_height]);

  // Auto focus once

  useEffect(() => {
    if (autoFocus && contentRef.current) {
      setTimeout(() => {
        contentRef.current.focus();
        setAutoFocus(false);
      }, 0);
    }
  }, [autoFocus]);

  // Handle input changes
  const handleChange = (e) => {
    const newValue = e.target.value || "";
    setLabel(newValue);

    if (data.onLabelChange) {
      data.onLabelChange(newValue);
    }
  };

  // Ensure caret works when clicking
  const handleFocus = () => {
    // Move caret at the end of content
    const el = contentRef.current;
    if (!el) return;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false); // move cursor at end
    selection.removeAllRanges();
    selection.addRange(range);
  };

  // Resize handler
  const handleResize = (e, size) => {
    if (!size?.width || !size?.height) return;

    setWidth(size.width);
    setHeight(size.height);

    if (data.updateWidthHeight) {
      data.updateWidthHeight(id, { width: size.width, height: size.height });
    }
  };

  return (
    <div
      style={{
        ...styles.wrapper,
        filter: data.hasNextLevel
          ? "drop-shadow(0px 0px 10px #0000004f)"
          : "none",
      }}
    >
      <div
        style={{
          ...styles.pentagonBox,
          width: `${width}px`,
          height: `${height}px`,
          clipPath: "polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)",
        }}
      >
        <ContentEditable
          innerRef={contentRef}
          html={label}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Type title here..."
          style={styles.label}
        />
      </div>

      {isClickable && (
        <NodeResizer minWidth={100} minHeight={50} onResize={handleResize} />
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
  pentagonBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "red",
    color: "#002060",
    padding: "10px",
    boxSizing: "border-box",
    overflow: "hidden",
    border: "none",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
    transition: "width 0.2s ease, height 0.2s ease",
    wordBreak: "break-word",
  },
  label: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "1rem",
    width: "100%",
    outline: "none",
    textAlign: "center",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
    fontFamily: "'Poppins', sans-serif",
    minHeight: "20px",
    cursor: "text",
  },
};

export default memo(PentagonNode);

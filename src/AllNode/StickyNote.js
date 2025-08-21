import React, { memo, useState, useEffect, useRef } from "react";
import { NodeResizer } from "@xyflow/react";

const StickyNote = ({ data, id, selectedNodeId ,editable}) => {
  const [label, setLabel] = useState(data.label || "");
  const [width, setWidth] = useState(data.width_height?.width || 240);
  const [height, setHeight] = useState(data.width_height?.height || 180);
  const textareaRef = useRef();
  const isClickable = selectedNodeId === id;

  // Sync width/height from parent data
  useEffect(() => {
    if (data.width_height?.width && data.width_height?.height) {
      setWidth(data.width_height.width);
      setHeight(data.width_height.height);
    }
  }, [data.width_height]);

  // Autofocus on mount if needed
  useEffect(() => {
    if (data.autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [data.autoFocus]);

  // Update label when prop changes
  useEffect(() => {
    setLabel(data.label || "");
  }, [data.label]);

  // Notify parent when label changes
  const handleChange = (e) => {
    setLabel(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };

  // Dynamically adjust textarea height
  const adjustHeight = (e) => {
    const element = e.target;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [label, width, height]);

  // Handle resize
  const handleResize = (event, size) => {
    if (!size) return;
    setWidth(size.width);
    setHeight(size.height);

    if (data.updateWidthHeight) {
      data.updateWidthHeight(id, { width: size.width, height: size.height });
    }
  };

  return (
    <div style={styles.wrapper}>
      <div
        style={{
          ...styles.note,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <textarea
          ref={textareaRef}
          value={label}
          onChange={handleChange}
          onInput={adjustHeight}
          placeholder="Write something..."
          style={styles.textarea}
          rows={1}
          readOnly={!editable} // 👈 disables editing if not editable
        />
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
    filter: 'drop-shadow(2px 2px 10px rgba(0, 32, 96, 0.1))',
  },
  note: {
    background: "#FFFF88", // sticky yellow
    padding: "8px",
    boxSizing: "border-box",
    overflow: "hidden",
    clipPath: 'polygon(0 0, 85% 0%, 100% 18%, 100% 100%, 0 100%, 0 100%)',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  textarea: {
    background: "transparent",
    border: "none",
    width: "100%",
    height: "100%",
    color: "#002060",
    fontSize: "16px",
    resize: "none",
    outline: "none",
    overflow: "hidden",
    whiteSpace: "pre-wrap",
  },
};

export default memo(StickyNote);

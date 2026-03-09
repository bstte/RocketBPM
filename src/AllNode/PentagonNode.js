import { memo, useState, useEffect, useRef } from "react";
import { NodeResizer } from "@xyflow/react";

const PentagonNode = ({ data, id, selected }) => {
  const [label, setLabel] = useState(data.label || "");
  const [width, setWidth] = useState(data.width_height?.width || 150);
  const [height, setHeight] = useState(data.width_height?.height || 150);

  const textareaRef = useRef(null);
  const cursorPosRef = useRef(null);

  const isSelected = selected;

  useEffect(() => {
    setLabel(data.label || "");
  }, [data.label]);

  useEffect(() => {
    if (data.width_height?.width && data.width_height?.height) {
      setWidth(data.width_height.width);
      setHeight(data.width_height.height);
    }
  }, [data.width_height]);

  useEffect(() => {
    if (isSelected && textareaRef.current) {
      const timeout = setTimeout(() => {
        textareaRef.current?.focus();

        if (cursorPosRef.current !== null) {
          textareaRef.current.setSelectionRange(
            cursorPosRef.current,
            cursorPosRef.current
          );
        }
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [isSelected]);

  const handleChange = (e) => {
    const newValue = e.target.value || "";
    setLabel(newValue);

    if (data.onLabelChange) {
      data.onLabelChange(newValue);
    }
  };

  const storeCursor = (e) => {
    cursorPosRef.current = e.target.selectionStart;
  };

  const handleResize = (e, size) => {
    if (!size?.width || !size?.height) return;

    setWidth(size.width);
    setHeight(size.height);

    if (data.updateWidthHeight) {
      data.updateWidthHeight(id, { width: size.width, height: size.height });
    }
  };

  const autoResize = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [label, width, height]);

  return (
    <div
      style={{
        position: "relative",
        filter: data.hasNextLevel
          ? "drop-shadow(0px 0px 10px #0000004f)"
          : "none",
      }}
    >
      <div
        style={{
          ...styles.pentagonBox,
          width,
          height,
          clipPath: "polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)",
        }}
      >
        <textarea
          ref={textareaRef}
          value={label}
          onChange={handleChange}
          onInput={autoResize}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => {
            e.stopPropagation();
            storeCursor(e);
          }}
          onKeyUp={storeCursor}
          onSelect={storeCursor}
          placeholder=""
          style={styles.label}
          rows={1}
        />
      </div>

      {isSelected && (
        <NodeResizer minWidth={120} minHeight={80} onResize={handleResize} handleClassName="customHandle"
          lineClassName="customLine" />
      )}
    </div>
  );
};

const styles = {
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
    wordBreak: "break-word",
  },
  label: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "12px",
    lineHeight: "1.1",
    width: "100%",
    outline: "none",
    textAlign: "center",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
    fontFamily: "'Poppins', sans-serif",
    minHeight: "20px",
    cursor: "text",
    resize: "none",
    overflow: "hidden",
  },
};

export default memo(PentagonNode);

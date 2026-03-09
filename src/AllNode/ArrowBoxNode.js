import { memo, useState, useEffect, useRef, useMemo } from "react";
import { NodeResizer } from "@xyflow/react";

const ArrowBoxNode = ({ data, id, selected, isRTL }) => {
  const [label, setLabel] = useState(data.label || "");
  const isSelected = selected;

  const textareaRef = useRef(null);
  const cursorPosRef = useRef(null);

  const [width, setWidth] = useState(data.width_height?.width || 326);
  const [height, setHeight] = useState(data.width_height?.height || 90);

  // 🔹 sync label from parent
  useEffect(() => {
    setLabel(data.label || "");
  }, [data.label]);

  // 🔹 sync size from parent
  useEffect(() => {
    if (data.width_height) {
      setWidth(data.width_height.width);
      setHeight(data.width_height.height);
    }
  }, [data.width_height]);

  // 🔹 focus WITHOUT overriding cursor
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
    setLabel(e.target.value);
    data.onLabelChange?.(e.target.value);
  };

  // 🔹 store cursor position
  const storeCursor = (e) => {
    cursorPosRef.current = e.target.selectionStart;
  };

  // 🔹 clip path
  const clipPath = useMemo(() => {
    const arrowWidth = 24;

    if (isRTL) {
      return `polygon(
        ${width - 20}px ${height / 2}px,
        ${width}px 0,
        ${arrowWidth}px 0,
        0 ${height / 2}px,
        ${arrowWidth}px ${height}px,
        ${width}px ${height}px
      )`;
    }

    return `polygon(
      20px ${height / 2}px,
      0 0,
      ${width - arrowWidth}px 0,
      ${width}px ${height / 2}px,
      ${width - arrowWidth}px ${height}px,
      0 ${height}px
    )`;
  }, [width, height, isRTL]);

  // 🔹 resize
  const GRID = 20;
  const snap = (v) => Math.round(v / GRID) * GRID;

  const handleResize = (_, size) => {
    if (!size) return;

    const w = snap(size.width);
    const h = snap(size.height);

    setWidth(w);
    setHeight(h);

    data.updateWidthHeight?.(id, { width: w, height: h });
  };

  // 🔹 auto height textarea
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width,
          height,
          clipPath,
          background: "red",
          padding: "10px",
          boxSizing: "border-box",
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
          rows={1}
          maxLength={200}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            color: "white",
            textAlign: "center",
            fontSize: "12px",
            lineHeight: "1.1",
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            fontFamily: "Poppins, sans-serif",
          }}
        />
      </div>

      {isSelected && (
        <NodeResizer minWidth={120} minHeight={80} onResize={handleResize} handleClassName="customHandle"
          lineClassName="customLine" />
      )}
    </div>
  );
};

export default memo(ArrowBoxNode);
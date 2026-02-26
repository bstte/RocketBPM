import React, { memo, useState, useEffect, useRef } from "react";
import { NodeResizer } from "@xyflow/react";

const StickyNote = ({ data, id, selectedNodeId, editable }) => {
  const [label, setLabel] = useState(data.label || "");
  const [width, setWidth] = useState(data.width_height?.width || 240);
  const [height, setHeight] = useState(data.width_height?.height || 180);

  const textareaRef = useRef(null);
  const cursorPosRef = useRef(null);

  const isSelected = selectedNodeId === id;

  // 🔹 sync size
  useEffect(() => {
    if (data.width_height) {
      setWidth(data.width_height.width);
      setHeight(data.width_height.height);
    }
  }, [data.width_height]);

  // 🔹 sync label
  useEffect(() => {
    setLabel(data.label || "");
  }, [data.label]);

  // 🔹 focus without cursor jump
  useEffect(() => {
    if (isSelected && textareaRef.current && editable) {
      textareaRef.current.focus();

      if (cursorPosRef.current !== null) {
        textareaRef.current.setSelectionRange(
          cursorPosRef.current,
          cursorPosRef.current
        );
      }
    }
  }, [isSelected, editable]);

  // 🔹 label change
  const handleChange = (e) => {
    setLabel(e.target.value);
    data.onLabelChange?.(e.target.value);
  };

  // 🔹 store cursor
  const storeCursor = (e) => {
    cursorPosRef.current = e.target.selectionStart;
  };

  // 🔹 auto height
  const adjustHeight = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [label, width, height]);

  // 🔹 resize
  const handleResize = (_, size) => {
    if (!size) return;

    setWidth(size.width);
    setHeight(size.height);

    data.updateWidthHeight?.(id, {
      width: size.width,
      height: size.height,
    });
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        filter: "drop-shadow(2px 2px 10px rgba(0, 32, 96, 0.1))",
      }}
    >
      <div
        style={{
          background: "#FFFF88",
          padding: "8px",
          width,
          height,
          boxSizing: "border-box",
          overflow: "hidden",
          clipPath:
            "polygon(0 0, 85% 0%, 100% 18%, 100% 100%, 0 100%, 0 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <textarea
          ref={textareaRef}
          value={label}
          onChange={handleChange}
          onInput={adjustHeight}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => {
            e.stopPropagation();
            storeCursor(e);
          }}
          onKeyUp={storeCursor}
          onSelect={storeCursor}
          readOnly={!editable}
          rows={1}
          placeholder="Write something..."
          style={{
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

export default memo(StickyNote);
import { memo, useEffect, useState, useRef } from "react";
import { Handle, Position } from "@xyflow/react";

import ContentEditable from "react-contenteditable";

const BoxNode = ({ data }) => {
  const [title, setTitle] = useState(data.details.title);
  const boxRef = useRef(null);
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setTitle(data.details.title);
  }, [data.details.title]);

  useEffect(() => {
    if (autoFocus && boxRef.current) {
      setTimeout(() => {
        const el = boxRef.current;
        el.focus();

        // Move caret to the end of the content
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        setAutoFocus(false);
      }, 0);
    }
  }, [autoFocus]);

  const handleBoxClick = (e) => {
    // If the click is already on the ContentEditable, don't do anything
    if (e.target.classList.contains("nodrag")) {
      return;
    }

    if (boxRef.current && document.activeElement !== boxRef.current) {
      boxRef.current.focus();

      // Only move to end if we are explicitly focusing via click on the BOX (not text)
      const el = boxRef.current;
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handleFocus = (e) => {
    // Prevent focus event from bubbling up and triggering parent handlers unnecessarily
    e.stopPropagation();
  };

  const handleBlur = () => { };

  const handleChange = (e) => {
    setTitle(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.execCommand("insertLineBreak");
    }
  };

  return (
    <div
      className="swimboxnode_1"
      style={styles.wrapper}
      onClick={handleBoxClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="borderBox" style={styles.box}>
        <ContentEditable
          innerRef={boxRef}
          html={title}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => handleChange({ target: { value: e.target.value } })}
          onKeyDown={handleKeyDown}
          placeholder=""
          style={styles.label}
          className="nodrag"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {[20, 50, 80].map((leftOffset, index) => (
        <>
          <Handle
            key={`top-target-${index}`}
            type="target"
            position={Position.Top}
            id={`top-target-${index}`}
            style={
              isHovered
                ? { ...styles.hoverhandle, top: "0px", left: `${leftOffset}%` }
                : { ...styles.handle, top: "0px", left: `${leftOffset}%` }
            }
          />

          <Handle
            key={`top-source-${index}`}
            type="source"
            position={Position.Top}
            id={`top-source-${index}`}
            style={
              isHovered
                ? { ...styles.hoverhandle, top: "0px", left: `${leftOffset}%` }
                : { ...styles.handle, top: "0px", left: `${leftOffset}%` }
            }
          />
        </>
      ))}

      {/* Bottom Handles */}
      {[20, 50, 80].map((leftOffset, index) => (
        <>
          <Handle
            key={`bottom-target-${index}`}
            type="target"
            position={Position.Bottom}
            id={`bottom-target-${index}`}
            style={
              isHovered
                ? {
                  ...styles.hoverhandle,
                  bottom: "0px",
                  left: `${leftOffset}%`,
                }
                : { ...styles.handle, bottom: "0px", left: `${leftOffset}%` }
            }
          />

          <Handle
            key={`bottom-source-${index}`}
            type="source"
            position={Position.Bottom}
            id={`bottom-source-${index}`}
            style={
              isHovered
                ? {
                  ...styles.hoverhandle,
                  bottom: "0px",
                  left: `${leftOffset}%`,
                }
                : { ...styles.handle, bottom: "0px", left: `${leftOffset}%` }
            }
          />
        </>
      ))}

      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={isHovered ? styles.hoverhandle : styles.handle}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={isHovered ? styles.hoverhandle : styles.handle}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={isHovered ? styles.hoverhandle : styles.handle}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={isHovered ? styles.hoverhandle : styles.handle}
      />
      <div style={styles.borderOverlay}></div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    width: "80%",
    height: "72%",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#ffffff",
    color: "#002060",
    border: "1px solid #002060",
    width: "100%",
    height: "100%",
    padding: "0px",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  borderOverlay: {
    position: "absolute",
    top: "-2px",
    left: "-2px",
    right: "-2px",
    bottom: "-2px",
    zIndex: -1,
    backgroundColor: "transparent",
    borderRadius: "5px",
    pointerEvents: "none",
  },
  label: {
    fontSize: "12px",
    fontFamily: "'Poppins', sans-serif",
    lineHeight: "1.1",
    padding: "2px",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    background: "transparent",
    border: "none",
    outline: "none",
    textAlign: "center",
    width: "100%",
  },
  hoverhandle: {
    backgroundColor: "#FF364A",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  handle: {
    backgroundColor: "transparent",
    border: "none",
    width: "0px",
    height: "0px",
    pointerEvents: "none",
  },
  popup: {
    position: "fixed",
    transform: "translate(-50%, -50%)",
    width: "auto",
    maxWidth: "500px",
    padding: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #002060",
    borderRadius: "5px",
    overflow: "hidden",
  },
  popupTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 10px 0",
  },
  popupContent: {
    fontSize: "14px",
    color: "#333",
    whiteSpace: "normal",
    maxHeight: "200px",
    overflowY: "auto",
    paddingRight: "10px",
  },
};

export default memo(BoxNode);

import { memo, useEffect, useState, useRef } from "react";
import { Handle, Position } from "@xyflow/react";

import ContentEditable from "react-contenteditable";

const BoxNode = ({ data }) => {
  const [title, setTitle] = useState(data.details.title);
  const boxRef = useRef(null);
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);

  useEffect(() => {
    if (autoFocus && boxRef.current) {
      setTimeout(() => {
        boxRef.current.focus();
        setAutoFocus(false);
      }, 0);
    }
  }, [autoFocus]);

  const handleFocus = () => {};

  const handleBlur = () => {};

  const handleChange = (e) => {
    setTitle(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div className="borderBox" style={styles.box}>
        <ContentEditable
          innerRef={boxRef}
          html={title}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => handleChange({ target: { value: e.target.value } })}
          placeholder="Type title here..."
          style={styles.label}
        />
      </div>


      {[20, 50, 80].map((leftOffset, index) => (
        <>
          <Handle
            key={`top-target-${index}`}
            type="target"
            position={Position.Top}
            id={`top-target-${index}`}
            style={{ ...styles.handle, top: "0px", left: `${leftOffset}%` }}
          />


          <Handle
            key={`top-source-${index}`}
            type="source"
            position={Position.Top}
            id={`top-source-${index}`}
            style={{ ...styles.handle, top: "0px", left: `${leftOffset}%` }}
          />
        </>
      ))}

    
        {/* Bottom Handles */}
        {[30, 60, 90].map((leftOffset, index) => (
          <>
        <Handle
          key={`bottom-target-${index}`}
          type="target"
          position={Position.Bottom}
          id={`bottom-target-${index}`}
          style={{ ...styles.handle, bottom: '0px', left: `${leftOffset}%` }}
        />

        <Handle
        key={`bottom-source-${index}`}
        type="source"
        position={Position.Bottom}
        id={`bottom-source-${index}`}
        style={{ ...styles.handle, bottom: '0px', left: `${leftOffset}%` }}
      />
      </>
      ))}


      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={styles.handle}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={styles.handle}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={styles.handle}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={styles.handle}
      />
      <div style={styles.borderOverlay}></div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    width: "90%",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#ffffff",
    color: "#000000",
    border: "2px solid #000",
    width: "100%",
    height: "100%",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
    padding: "10px",
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
    background: "transparent",
    border: "none",
    outline: "none",
    textAlign: "center",
    width: "100%",
  },
  handle: {
    backgroundColor: "red",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  popup: {
    position: "fixed",
    transform: "translate(-50%, -100%)",
    width: "auto",
    maxWidth: "500px",
    padding: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #000",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
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

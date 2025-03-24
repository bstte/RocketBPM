import { memo, useState, useRef, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const decodeHtmlEntities = (str) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = str;
  return textArea.value;
};

const BoxNode = ({ data }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupSize, setPopupSize] = useState({ width: 600, height: 450 });

  const title = decodeHtmlEntities(data.details.title);
  const boxRef = useRef(null);

  const handleBoxClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsPopupVisible(false);
      }
    };

    if (isPopupVisible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPopupVisible]);

  const renderPopup = () => (
    <Draggable handle=".popupHeader">
      <ResizableBox
        width={popupSize.width}
        height={popupSize.height}
        minConstraints={[300, 200]}
        maxConstraints={[800, 600]}
        onResizeStop={(e, { size }) => setPopupSize(size)}
        style={{
          position: "absolute",
          top: "20%",
          left: "0",
          right: "0",
          margin:"0 auto",
          transform: "translate(0, -50%)",
          backgroundColor: "#ffffff",
          border: "1px solid #011f60",
          overflow: "hidden",
          zIndex: 1001,
          boxShadow:"0 0 10px #011f6047",
        }}
      >
        <div style={{ ...styles.popup, width: "100%", height: "100%" }}>
          <div className="popupHeader" style={styles.popupHeader}>
            <h3 style={styles.popupTitle}>{title}</h3>
            <button style={styles.closeButton} onClick={handleClosePopup}>
              Close
            </button>
          </div>
          <div
            className="popupContent_content"
            style={styles.popupContent}
            dangerouslySetInnerHTML={{ __html: data.details.content }}
          />
        </div>
      </ResizableBox>
    </Draggable>
  );

  return (
    <>
      <div style={styles.wrapper} onClick={handleBoxClick} ref={boxRef}>
        <div className="borderBox" style={styles.box}>
          <div>
            <button style={styles.withoutlinkButton}>{title}</button>
          </div>
        </div>

        {[20, 50, 80].map((leftOffset, index) => (
          <Handle
            key={`top-target-${index}`}
            type="target"
            position={Position.Top}
            id={`top-target-${index}`}
            style={{ ...styles.handle, top: "0px", left: `${leftOffset}%` }}
          />
        ))}

        {[20, 50, 80].map((leftOffset, index) => (
          <Handle
            key={`bottom-target-${index}`}
            type="target"
            position={Position.Bottom}
            id={`bottom-target-${index}`}
            style={{ ...styles.handle, bottom: "0px", left: `${leftOffset}%` }}
          />
        ))}

        <Handle type="target" position={Position.Left} id="left-target" style={styles.handle} />
        <Handle type="source" position={Position.Left} id="left-source" style={styles.handle} />
        <Handle type="target" position={Position.Right} id="right-target" style={styles.handle} />
        <Handle type="source" position={Position.Right} id="right-source" style={styles.handle} />

        <div style={styles.borderOverlay}></div>
      </div>

      {isPopupVisible && data.details.title && ReactDOM.createPortal(renderPopup(), document.body)}
    </>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    width: "86%",
    height: "84%",
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
    border: "1px solid #000",
    width: "100%",
    height: "100%",
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
  handle: {
    backgroundColor: "transparent",
    border: "none",
    width: "0px",
    height: "0px",
    pointerEvents: "none",
  },
  popup: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    overflowY: "auto",
    zIndex: 1001,
  },
  popupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "white",
    cursor: "move",
  },
  popupTitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#011f60",
    margin: "0",
  },
  popupContent: {
    fontSize: "14px",
    color: "#002060",
    padding: "0 10px 10px",
    overflowY: "auto",
    flexGrow: 1,
  },
  withoutlinkButton: {
    fontSize: "12px",
    color: "#002060",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  closeButton: {
    background: "#011f60",
    borderRadius: "7px",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
    padding: "2px 20px",
    textTransform: "uppercase",
    border:"0"
  },
};

export default memo(BoxNode);

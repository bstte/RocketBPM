import { memo, useState, useRef, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./publishnode.css";

const SwimlineDiamondNode = ({ data }) => {
  // const [isHovered, setIsHovered] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  // const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupSize, setPopupSize] = useState({ width: 600, height: 450 });
  const titleRef = useRef(null);

  const handleBoxClick = () => {
    if (titleRef.current) {
      // const { top, left } = titleRef.current.getBoundingClientRect();
      // setPopupPosition({ x: left, y: top });
      setIsPopupVisible(!isPopupVisible);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsPopupVisible(!isPopupVisible);

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
          margin: "0 auto",
          transform: "translate(0, -50%)",
          backgroundColor: "#ffffff",
          border: "1px solid #011f60",
          overflow: "hidden",
          zIndex: 1001,
          boxShadow: "0 0 10px #011f6047",
        }}
      >
        <div style={{ ...styles.popup, width: "100%", height: "100%" }}>
          <div className="popupHeader" style={styles.popupHeader}>
            <h3 style={styles.popupTitle}>{data.details.title}</h3>
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
      <div className="diamond_Wrapper_custom"
        style={styles.wrapper}
        onClick={handleBoxClick}
      >
        {/* Diamond Shape */}
        <div style={styles.diamondWrapper} className="diamond_Wrapper">
          <div style={styles.diamond} className="diamond_header">
            <div ref={titleRef} style={styles.title}>
              {data.details.title}
            </div>
            <Handle className="topdot" type="target" position={Position.Top} id="top-target" style={styles.handle} />
            <Handle className="topdot" type="source" position={Position.Top} id="top-source" style={styles.handle} />
            <Handle className="bottomdot" type="target" position={Position.Bottom} id="bottom-target" style={styles.handle} />
            <Handle className="bottomdot" type="source" position={Position.Bottom} id="bottom-source" style={styles.handle} />
            <Handle className="leftdot" type="target" position={Position.Left} id="left-target" style={{ ...styles.handle, left: '-5px' }}/>
            <Handle className="leftdot" type="source" position={Position.Left} id="left-source" style={{ ...styles.handle, left: '-5px' }} />
            <Handle className="rightdot" type="target" position={Position.Right} id="right-target" style={{ ...styles.handle, right: '-5px' }} />
            <Handle className="rightdot" type="source" position={Position.Right} id="right-source" style={{ ...styles.handle, right: '-5px' }} />
          </div>
        </div>

        

      </div>

      {isPopupVisible &&
        data.details.title &&
        ReactDOM.createPortal(renderPopup(), document.body)}
    </>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    width: "90%",
    height: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  diamondWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  diamond: {
    position: "relative",
    width: "54px",
    height: "54px",
    backgroundColor: "#ffffff",
    color: "#000000",
    border: "1px solid #002060",
    transform: "rotate(45deg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    transform: "rotate(-45deg)",
    fontSize: "9px",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    background: "transparent",
    padding: "0",
    margin: "0",
  },
  handle: {
    backgroundColor: "transparent",
    border: "none",
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
    border: "0"
  },
};

export default memo(SwimlineDiamondNode);

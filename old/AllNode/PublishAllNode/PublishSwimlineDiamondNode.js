import { memo, useState, useRef, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import ReactDOM from "react-dom";

const SwimlineDiamondNode = ({ data }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const titleRef = useRef(null);

  const handleBoxClick = () => {
    if (titleRef.current) {
      const { top, left } = titleRef.current.getBoundingClientRect();
      setPopupPosition({ x: left, y: top });
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
    <div className="popupPosition_fix"
      style={{
        ...styles.popup,
        left: popupPosition.x,
        top: popupPosition.y,
        zIndex: 1001,
      }}
    >
      <div style={styles.popupHeader} >
        <h3 style={styles.popupTitle}>{data.details.title}</h3>
        <button
          style={styles.closeButton}
          onClick={handleClosePopup}
        >
          <span>x</span>

        </button>
      </div>
      <div className="popupContent_content"
        style={styles.popupContent}
        dangerouslySetInnerHTML={{ __html: data.details.content }}
      />
    </div>
  );
  

  return (
    <>
    <div
      style={styles.wrapper}
      onClick={handleBoxClick} 
    >
      {/* Diamond Shape */}
      <div style={styles.diamondWrapper}>
        <div style={styles.diamond}>
          <div ref={titleRef} style={styles.title}>
            {data.details.title}
          </div>
        </div>
      </div>

       <Handle type="target" position={Position.Top} id="top-target" style={styles.handle} />
              <Handle type="source" position={Position.Top} id="top-source" style={styles.handle} />
              <Handle type="target" position={Position.Bottom} id="bottom-target" style={styles.handle} />
              <Handle type="source" position={Position.Bottom} id="bottom-source" style={styles.handle} />
      
              <Handle type="target" position={Position.Left} id="left-target" style={{...styles.handle,left:'18px'}} />
              <Handle type="source" position={Position.Left} id="left-source" style={{...styles.handle,left:'18px'}} />
              <Handle type="target" position={Position.Right} id="right-target" style={{...styles.handle,right:'20px'}} />
              <Handle type="source" position={Position.Right} id="right-source" style={{...styles.handle,right:'20px'}} />

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
    width: "45px",
    height: "45px",
    backgroundColor: "#ffffff",
    color: "#000000",
    border: "2px solid #002060",
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
    // position: "absolute",
    // width: "10px",
    // height: "10px",
    // backgroundColor: "red",
    // borderRadius: "50%",
    backgroundColor: "transparent",
  
    border: "none",
    width: "0px",
    height: "0px",
    pointerEvents: "auto" ,
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
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
    overflow: "hidden",
  },
  popupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px", // Space below the header
  },
  popupTitle: {
    fontSize: "16px",
    fontWeight: "400",
    color: "#002060",
    margin: "0 0 10px 0",

  },
  popupContent: {
    fontSize: "14px",
    color: "#002060",
    whiteSpace: "normal",
    maxHeight: "200px",
    overflowY: "auto",
    paddingRight: "10px",
  },
  closeButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "transparent",
    color: "#002060",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default memo(SwimlineDiamondNode);

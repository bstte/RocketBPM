import { memo, useState, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import ReactDOM from "react-dom";

const decodeHtmlEntities = (str) => {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = str;
  return textArea.value;
};

const BoxNode = ({ data }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  const title = decodeHtmlEntities(data.details.title);
  const boxRef = useRef(null); // Reference to the node element

  const handleBoxClick = () => {
    if (boxRef.current) {
      const { top, left } = boxRef.current.getBoundingClientRect();
      setPopupPosition({ x: left, y: top });
      setIsPopupVisible(!isPopupVisible);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  
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
        <h3 style={styles.popupTitle}>{title}</h3>
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
      ref={boxRef} 
    >
      <div className="borderBox" style={styles.box}>
        <div>
          <button style={styles.withoutlinkButton}>{title}</button>
        </div>
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
              {[20, 50, 80].map((leftOffset, index) => (
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
      

      
      <Handle type="target" position={Position.Left} id="left-target" style={styles.handle} />
      <Handle type="source" position={Position.Left} id="left-source" style={styles.handle} />
      <Handle type="target" position={Position.Right} id="right-target" style={styles.handle} />
      <Handle type="source" position={Position.Right} id="right-source" style={styles.handle} />

      <div style={styles.borderOverlay}></div>

   
    </div>
       {/* Render the popup when hovered */}
       {isPopupVisible && data.details.title && ReactDOM.createPortal(renderPopup(), document.body)}
    </>
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
    backgroundColor: "transparent",
    border: "none",
    width: "0px",
    height: "0px",
    pointerEvents: "none" ,
  },
  popup: {
    position: "fixed",
    transform: "translate(-50%, -50%)",
    width: "auto",
    maxWidth: "500px",
    padding: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #000",
    borderRadius: "5px",
    boxShadow: "0 2px 5px #002060",
    overflow: "hidden",
    left: '50%',
    top: '50%',
  },
  popupHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px", // Space below the header
  },
  popupTitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#002060",
    margin: "0",
    texttransform: "capitalize", // Remove default margins
  },
  popupContent: {
    fontSize: "14px",
    color: "#002060",
    whiteSpace: "normal",
    maxHeight: "200px",
    overflowY: "auto",
    paddingRight: "10px",
  },
  withoutlinkButton: {
    fontSize: "12px",
    color: "#002060",
    background: "none",
    border: "none",
    cursor: "pointer",
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

export default memo(BoxNode);

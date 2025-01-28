import { memo, useState, useRef, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import ContentEditable from "react-contenteditable";

const SwimlineDiamondNode = ({ data }) => {
  const [title, setTitle] = useState(data.details.title);
  const titleRef = useRef(null);
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);
  // const [isHovered, setIsHovered] = useState(false); 

  useEffect(() => {
    
    if (autoFocus && titleRef.current) {
      setTimeout(() => {
        titleRef.current.focus();
        setAutoFocus(false);
      }, 0);
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    setTitle(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };

  useEffect(() => {
    if (autoFocus && titleRef.current) {
      setTimeout(() => {
        titleRef.current.focus();
        setAutoFocus(false);
      }, 0);
    }
  }, [autoFocus]);

  const handleBoxClick = () => {
    setTimeout(() => {
      titleRef.current?.focus();
    }, 0);
  };


  const handleFocus = (e) => {
    const selection = window.getSelection();
    const range = document.createRange();
  
    if (e.target.firstChild) {
      range.setStart(e.target.firstChild, e.target.selectionStart || 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };
  
  const handleBlur = () => {};

  return (
    <div style={styles.wrapper} onClick={handleBoxClick}
    // onMouseEnter={() => setIsHovered(true)} 
    // onMouseLeave={() => setIsHovered(false)} 
    >
      {/* Diamond Shape */}
      <div style={styles.diamondWrapper}>
        <div style={styles.diamond}>
          <ContentEditable
            innerRef={titleRef}
            html={title}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) =>
              handleChange({ target: { value: e.target.value } })
            }
            placeholder="Type title here..."
            style={styles.title}
          />
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
    border: "2px solid #000",
    transform: "rotate(45deg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  },
  title: {
    transform: "rotate(-45deg)",
    fontSize: "9px",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    background: "transparent",
    border: "none",
    outline: "none",
    width: "100%",
    padding: "0",
    margin: "0",
  },
  handle: {
    position: "absolute",
    width: "8px",
    height: "8px",
    backgroundColor: "red",
    borderRadius: "50%",
  },
};

export default memo(SwimlineDiamondNode);

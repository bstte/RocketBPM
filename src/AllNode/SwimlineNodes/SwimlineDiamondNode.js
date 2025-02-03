import { memo, useState, useRef, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import ContentEditable from "react-contenteditable";
import './SwimlineNodes.css';
const SwimlineDiamondNode = ({ data }) => {
  const [title, setTitle] = useState(data.details.title);
  const titleRef = useRef(null);
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);
  const [isHovered, setIsHovered] = useState(false); 
  useEffect(() => {
    setTitle(data.details.title);
  }, [data.details.title]);

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
    <div className="diamond_Wrapper_custom" style={styles.wrapper} onClick={handleBoxClick}
    onMouseEnter={() => setIsHovered(true)} 
    onMouseLeave={() => setIsHovered(false)} 
    >
      {/* Diamond Shape */}
      <div style={styles.diamondWrapper} className="diamond_Wrapper">
        <div style={styles.diamond} className="diamond_header">
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
      

      <Handle type="target" position={Position.Top} id="top-target" style={isHovered ? styles.hoverhandle:styles.handle} />
        <Handle type="source" position={Position.Top} id="top-source" style={isHovered ? styles.hoverhandle:styles.handle} />
        <Handle type="target" position={Position.Bottom} id="bottom-target" style={isHovered ? styles.hoverhandle:styles.handle} />
        <Handle type="source" position={Position.Bottom} id="bottom-source" style={isHovered ? styles.hoverhandle:styles.handle} />

        <Handle type="target" position={Position.Left} id="left-target"
          style={isHovered ? { ...styles.hoverhandle, left:'-5px' } : { ...styles.handle, left:'-5px'}}
      />
        <Handle type="source" position={Position.Left} id="left-source"   style={isHovered ? { ...styles.hoverhandle, left:'-5px' } : { ...styles.handle, left:'-5px'}} />
        <Handle type="target" position={Position.Right} id="right-target" 
          style={isHovered ? { ...styles.hoverhandle, right:'-5px' } : { ...styles.handle, right:'-5px'}}
      />
        <Handle type="source" position={Position.Right} id="right-source"           style={isHovered ? { ...styles.hoverhandle, right:'-5px' } : { ...styles.handle, right:'-5px'}} />
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
    border: "2px solid #002060",
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


  hoverhandle: {
    backgroundColor: "red",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    position: "absolute",
  },
  handle: {
    backgroundColor: "transparent",
    position: "absolute",
    border: "none",
    width: "0px",
    height: "0px",
    pointerEvents: "none" ,
  },
};

export default memo(SwimlineDiamondNode);

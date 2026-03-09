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

  // useEffect(() => {

  //   if (autoFocus && titleRef.current) {
  //     setTimeout(() => {
  //       titleRef.current.focus();
  //       setAutoFocus(false);
  //     }, 0);
  //   }
  // }, [autoFocus]);

  useEffect(() => {
    if (autoFocus && titleRef.current) {
      setTimeout(() => {
        const el = titleRef.current;
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


  const handleChange = (e) => {
    setTitle(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };



  const handleBoxClick = (e) => {
    // If the click is already on the ContentEditable, don't do anything
    if (e.target.classList.contains("nodrag")) {
      return;
    }

    if (titleRef.current && document.activeElement !== titleRef.current) {
      titleRef.current.focus();

      // Only move to end if we are explicitly focusing via click on the DIAMOND (not text)
      const el = titleRef.current;
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
  const nodebgheight = document.querySelector(".react-flow__node");
  const nodebgheights = nodebgheight ? nodebgheight.getBoundingClientRect().height : 0;

  return (
    <div className="diamond_Wrapper_custom" style={styles.wrapper} onClick={handleBoxClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Diamond Shape */}
      <div style={styles.diamondWrapper} className="diamond_Wrapper">
        <div style={{ ...styles.diamond, width: nodebgheights - 10, height: nodebgheights - 10 }} className="diamond_header">
          <ContentEditable
            innerRef={titleRef}
            html={title}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) =>
              handleChange({ target: { value: e.target.value } })
            }
            placeholder=""
            style={styles.title}
            className="nodrag"
            onClick={(e) => e.stopPropagation()}
          />

        </div>
        <Handle className="topdot_edit" type="target" position={Position.Top} id="top-target" style={isHovered ? styles.hoverhandle : { ...styles.handle }} />
        <Handle className="topdot_edit" type="source" position={Position.Top} id="top-source" style={isHovered ? styles.hoverhandle : { ...styles.handle }} />

        <Handle className="bottomdot_edit" type="target" position={Position.Bottom} id="bottom-target" style={isHovered ? styles.hoverhandle : { ...styles.handle }} />
        <Handle className="bottomdot_edit" type="source" position={Position.Bottom} id="bottom-source" style={isHovered ? styles.hoverhandle : { ...styles.handle }} />

        <Handle className="leftdot_edit" type="target" position={Position.Left} id="left-target"
          style={isHovered ? { ...styles.hoverhandle } : { ...styles.handle }}
        />
        <Handle className="leftdot_edit" type="source" position={Position.Left} id="left-source" style={isHovered ? { ...styles.hoverhandle } : { ...styles.handle }} />

        <Handle className="rightdot_edit" type="target" position={Position.Right} id="right-target"
          style={isHovered ? { ...styles.hoverhandle } : { ...styles.handle }}
        />
        <Handle className="rightdot_edit" type="source" position={Position.Right} id="right-source" style={isHovered ? { ...styles.hoverhandle } : { ...styles.handle }} />
      </div>



    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    width: "80%",
    height: "72%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 100%",
  },
  diamondWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 100%",
  },
  diamond: {
    position: "relative",
    backgroundColor: "#ffffff",
    color: "#002060",
    border: "1.6px solid #002060",
    transform: "rotate(45deg) scale(0.628)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    transform: "rotate(-45deg)",
    fontSize: "12px",
    fontFamily: "'Poppins', sans-serif",
    lineHeight: "1.1",
    wordBreak: "break-word",
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
    border: "none",

  },
  handle: {
    backgroundColor: "transparent",
    position: "absolute",
    border: "none",
    width: "8px",
    height: "8px",
    pointerEvents: "none",
  },
};

export default memo(SwimlineDiamondNode);

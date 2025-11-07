import { memo, useRef, useState, useEffect, useContext } from "react";
import { Handle, Position } from "@xyflow/react";
import ContentEditable from "react-contenteditable";
import api, {
  checkRecordWithGetLinkDraftData,
  getdataByNodeId,
} from "../../API/api";
import { useNavigate } from "react-router-dom";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";

const ArrowBoxNode = ({ data, onTitleChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.details.title);
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);
  const [isHovered, setIsHovered] = useState(false);
  const { addBreadcrumb, removeBreadcrumbsAfter } =
    useContext(BreadcrumbsContext);
  const contentEditableRef = useRef(null);

  const navigate = useNavigate();

  const handleBoxClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      contentEditableRef.current?.focus();
    }, 0);

    if (contentEditableRef.current) {
      setTimeout(() => {
        const el = contentEditableRef.current;
        el.focus();

        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false); // Move caret to end
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }, 0);
    }
  };

  const handleChange = (e) => {
    setTitle(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
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

  const handleBlur = () => {
    setIsEditing(false);
    if (onTitleChange) {
      onTitleChange(title);
    }
  };

  useEffect(() => {
    if (autoFocus && contentEditableRef.current) {
      setTimeout(() => {
        const el = contentEditableRef.current;
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

  useEffect(() => {
    setTitle(data.details.title || "");
  }, [data.details.title]);

  return (
    <div
      style={{
        ...styles.wrapper,
        filter:
          data?.processlink && data?.hasNextLevel
            ? "drop-shadow(rgba(0, 0, 0, 0.31) 0px 0px 10px)"
            : "none",
      }}
      onClick={!isEditing ? handleBoxClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Arrow Box */}
      <div
        className="borderBox"
        style={{
          ...styles.arrowBox,
        }}
      >
        {/* {!isEditing && data.link ? (
          <div style={styles.textView}>
            {data.link && (
              <div>
                <button style={styles.linkButton} onClick={handleLinkClick}>
                  {data.details?.title}
                </button>
              </div>
            )}
          </div>
        ) : (
          <ContentEditable
            innerRef={contentEditableRef}
            html={title}
            onFocus={handleFocus}
            onChange={(e) =>
              handleChange({ target: { value: e.target.value } })
            }
            onBlur={handleBlur}
            placeholder="Type title here..."
            style={styles.label}
          />
        )} */}

        {/* {data.processlink ? (
          <div style={styles.textView}>
            {data.processlink && (
              <div>
                <button style={styles.linkButton} >
                  {data.details?.title}
                </button>
              </div>
            )}
          </div>
        ) : ( */}
        <ContentEditable
          innerRef={contentEditableRef}
          html={title}
          onFocus={handleFocus}
          onChange={(e) => handleChange({ target: { value: e.target.value } })}
          onBlur={handleBlur}
          placeholder="Type title here..."
          style={styles.label}
        />
        {/* )} */}
      </div>

      {/* Border overlay as a separate div */}
      <div style={styles.borderOverlay}></div>

      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={isHovered ? styles.hoverhandle : styles.handle}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={isHovered ? styles.hoverhandle : styles.handle}
      />
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
    cursor: "pointer",
  },
  arrowBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    textAlign: "center",
    backgroundColor: "red",
    color: "#002060",
    width: "100%",
    height: "100%",
    // clipPath:
    //   "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
    clipPath:
      "polygon(10px 50%, 0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",

    padding: "10px",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  label: {
    fontSize: "12px",
    fontFamily: "'Poppins', sans-serif",
    color: "white",
    background: "transparent",
    border: "none",
    outline: "none",
    textAlign: "center",
    width: "100%",
  },
  textView: {
    fontSize: "12px",
    fontFamily: "'Poppins', sans-serif",
    color: "white",
    textAlign: "center",
    wordBreak: "break-word",
  },
  link: {
    color: "white",
    textDecoration: "underline",
    cursor: "pointer",
  },
  borderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    clipPath:
      "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
    // border: "1px solid black",
    pointerEvents: "none",
    boxSizing: "border-box",
    backgroundColor: "transparent",
    padding: "2px",
  },

  linkButton: {
    fontSize: "10px",
    color: "white",
    background: "none",
    border: "none",

    // textDecoration: "underline",
    cursor: "pointer",
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
};

export default memo(ArrowBoxNode);

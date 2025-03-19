import React, { memo, useEffect, useRef, useState } from "react";

const SwimlineRightsideBox = ({ data }) => {

  const title=data.details.title
  const contentEditableRef = useRef(null);

  const [autoFocus, setAutoFocus] = useState(data.autoFocus);


  useEffect(() => {
    if (autoFocus && contentEditableRef.current) {
      setTimeout(() => {
        contentEditableRef.current.focus();
        setAutoFocus(false);
      }, 0);
    }
  }, [autoFocus]);


  return (
    <div style={styles.wrapper}>
      <div className="borderBox" style={styles.box}>
        <div>
          <button style={styles.withoutlinkButton}>{title}</button>
        </div>
      </div>
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
    backgroundColor: "red",
    color: "#000000",
    border: "2px solid #000",
    width: "100%",
    height: "100%",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  contentEditable: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "12px",
    width: "100%",
    outline: "none",
    textAlign: "center",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
    fontFamily: "'Poppins', sans-serif",
    minHeight: "20px",
  },
  withoutlinkButton: {
    fontSize: "12px",
    color: "white",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
};

const BoxNodeWithPlaceholder = (props) => <SwimlineRightsideBox {...props} />;

export default memo(BoxNodeWithPlaceholder);

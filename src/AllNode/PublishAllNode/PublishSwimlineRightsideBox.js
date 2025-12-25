import React, { memo, useEffect, useRef, useState } from "react";
import RoleGroupTooltip from "../../Pages/Map_level/components/RoleGroupTooltip";

const SwimlineRightsideBox = ({ data, processDefaultlanguage_id, langMap }) => {

  const title = data.details.title
  const contentEditableRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
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
    <div style={styles.wrapper}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="borderBox" style={styles.box}>
        <div>
          <button style={styles.withoutlinkButton}>{title}</button>
        </div>
      </div>
      {data.isRoleGroup && isHovered && data.roles && (
        <RoleGroupTooltip
          roles={data.roles}
          langMap={langMap}
          processDefaultlanguage_id={processDefaultlanguage_id}
        />
      )}

    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    width: "80%",
    height: "72%",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "red",
    color: "#002060",
    width: "100%",
    height: "100%",
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

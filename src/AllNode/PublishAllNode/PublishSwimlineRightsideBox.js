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
      <div className="borderBox" style={{
        ...styles.box,
        // Only add shadow if it's a role group
        filter: data.isRoleGroup ? 'drop-shadow(0px 0px 10px #0000004f)' : 'none',
        // border: data.isRoleGroup ? 'none' : '1px solid #002060',
      }}>
        <div style={styles.label} dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      {data.isRoleGroup && (isHovered || data.forceShowTooltip) && data.roles && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ position: 'absolute', left: '100%', top: '50%', transform: 'translateY(-50%)', zIndex: 1000000 }}
        >
          <RoleGroupTooltip
            roles={data.roles}
            langMap={langMap}
            processDefaultlanguage_id={processDefaultlanguage_id}
          />
        </div>
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
  label: {
    fontSize: "12px",
    fontFamily: "'Poppins', sans-serif",
    lineHeight: "1.1",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
    color: "white",
    cursor: "pointer",
    width: "100%",
    textAlign: "center",
    margin: "0",
  },
};

const BoxNodeWithPlaceholder = (props) => <SwimlineRightsideBox {...props} />;

export default memo(BoxNodeWithPlaceholder);

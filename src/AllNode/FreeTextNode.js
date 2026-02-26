import React, { memo } from "react";

const FreeTextNode = ({ data }) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.labelBox}>
        <div style={styles.text}>
          {data.label}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {},
  labelBox: {},
  text: {
    fontSize: "12px",
    fontFamily: "'Poppins', sans-serif", // MUST match
    lineHeight: "1.1",
    whiteSpace: "pre-wrap",
    padding: "2px",          // same as swimlane
    margin: 0,               // prevent default spacing
    display: "inline-block", // tighter line box
  },
};

export default memo(FreeTextNode);
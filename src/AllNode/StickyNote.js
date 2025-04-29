import React, { memo } from "react";

const StickyNote = ({ data }) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.labelBox}>
        <span style={styles.text}>{data.label.split("\n").map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}</span>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {},
  labelBox: {},
  text: {
    fontSize: "16px",
    whiteSpace: "pre-line", 
  },
};

export default memo(StickyNote);

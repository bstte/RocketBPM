import React, { memo } from "react";

const FreeTextNode = ({ data }) => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.labelBox}>
        <span className="freetext" style={styles.text}>{data.label.split("\n").map((line, index) => (
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
    fontSize: "12px",
    whiteSpace: "pre-line", // Ensures line breaks are respected
  },
};

export default memo(FreeTextNode);

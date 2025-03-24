import React, { memo } from "react";

const FreeTextNode = ({ data }) => {
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
    whiteSpace: "pre-line", // Ensures line breaks are respected
  },
};

export default memo(FreeTextNode);

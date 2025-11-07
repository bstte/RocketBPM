import React, { memo } from "react";

const YesNode = ({ data,processDefaultlanguage_id }) => {
  const langId = Number(processDefaultlanguage_id);

  let label = "yes";
  if (langId === 2) {
    label = "ja"; // German
  } else if (langId === 3) {
    label = "sí"; // Spanish
  } else {
    label = "yes"; // English (default)
  }
  return (
    <div
      style={{
        ...styles.wrapper,
      }}
    >
      <div
        style={{
          ...styles.labelBox,
        }}
      >
        <span className="yeslabel" style={styles.text}>  {label}</span>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  labelBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    textAlign: "center",

    color: "#002060",
    borderRadius: "3px",
    width: "100%",
    height: "100%",
    padding: "5px",
    boxSizing: "border-box",
    overflow: "hidden",
  },

  text: {
    cursor: "pointer",
    color:"#002060",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    fontWeight: "medium", // **Added for bold text**
    fontFamily: "'Poppins', sans-serif",
    fontSize: "12px", // Ensure font size matches input
    wordBreak: "break-word", // Allow text to wrap
  },
};

// Placeholder styling component
const PlaceholderStyles = () => (
  <style>
    {`
      .textarea-class::placeholder {
        color: #ccc; /* Placeholder text color */
      }
    `}
  </style>
);

// Wrap LabelNode with PlaceholderStyles
const LabelNodeWithPlaceholder = (props) => (
  <>
    <PlaceholderStyles />
    <YesNode {...props} />
  </>
);

export default memo(LabelNodeWithPlaceholder);

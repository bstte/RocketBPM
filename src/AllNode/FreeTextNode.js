import React, { memo } from "react";

const FreeTextNode = ({ data }) => {
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
        <span style={styles.text}>

        {data.label}
        </span>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {

  },
  labelBox: {
  
  },

  text: {
    // cursor: "pointer",
    // padding: "5px",
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    // width: "100%",
    // height: "100%",
    // fontWeight: "medium", // **Added for bold text**
    // textTransform: "uppercase",
    // fontFamily: "'Poppins', sans-serif",
    fontSize: "16px", // Ensure font size matches input
    // wordBreak: "break-word", // Allow text to wrap
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
    <FreeTextNode {...props} />
  </>
);

export default memo(LabelNodeWithPlaceholder);

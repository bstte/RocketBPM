

import React, { memo } from "react";
import { useTranslation } from "../hooks/useTranslation";
const NO_LABEL_BY_LANG = {
  1: "No",       // English
  2: "Nein",     // German
  3: "No",       // Spanish
  4: "Non",      // French
  5: "No",       // Italian
  6: "Nie",      // Polish
  7: "Nee",      // Dutch
  10: "Não",     // Brazilian Portuguese
  11: "不",       // Chinese
};
const NoNode = ({ data, processDefaultlanguage_id }) => {
  const langId = Number(processDefaultlanguage_id);

  // let label = "no";
  // if (langId === 2) {
  //   label = "nein"; // German
  // } else if (langId === 3) {
  //   label = "no"; // Spanish
  // } else {
  //   label = "no"; // English (default)
  // }

  const label = NO_LABEL_BY_LANG[langId] || "No"; // default English

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
        <span className="nolabel" style={styles.text}> {label}</span>
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
    color: "#002060",
    cursor: "pointer",
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
    <NoNode {...props} />
  </>
);

export default memo(LabelNodeWithPlaceholder);

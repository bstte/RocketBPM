import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "./Modal";
import { versionlist } from "../API/api";
import { useLangMap } from "../hooks/useLangMap";

const PublishPopup = ({
  isOpen,
  onClose,
  onNext,
  revisionresponse,
  selectedLanguage,
}) => {

  const [revisionText, setRevisionText] = useState("");
  const [classificationChange, setClassificationChange] = useState(false);
  const [editorialChange, setEditorialChange] = useState(false);

  const langMap = useLangMap();




  useEffect(() => {
    if (!revisionresponse || !revisionresponse.revision_info) {
      setRevisionText("");
      return;
    }

    let revisionData = revisionresponse.revision_info;

    // 🔥 If revision_info is STRING → convert to JSON
    if (typeof revisionData === "string") {
      try {
        revisionData = JSON.parse(revisionData);
      } catch (e) {
        console.error("Invalid JSON in revision_info:", e);
        setRevisionText(revisionData);
        return;
      }
    }

    // Ab revisionData OBJECT hai 🟢
    const langKey = langMap[selectedLanguage] || "en";
    setRevisionText(revisionData?.[langKey]?.content || "");

  }, [revisionresponse, selectedLanguage]);

  if (!isOpen) return null;

  // 👉 NEXT button disabled logic
  const isNextDisabled = !classificationChange && !editorialChange;

  return (
    <Modal modalStyle={{ width: "500px" }} >

      <h2 style={styles.heading}>Publish Process</h2>

      <hr />

      <h3 style={styles.subheading}>Classify Change</h3>

      <hr />

      <label style={styles.label}>Revision Info:</label>

      {/* ==== ReactQuill Added Here ==== */}
      <ReactQuill
        value={revisionText}
        onChange={(value) => setRevisionText(value)}
        style={{ height: "120px", marginBottom: "20px" }}
      />
      {/* ================================= */}

      <hr />

      <h3 style={styles.subheading}>Classification of Changes:</h3>
      <div style={styles.checkboxGroup}>
        <label>
          <input
            type="checkbox"
            checked={classificationChange}
            onChange={() => {
              setClassificationChange(true);
              setEditorialChange(false);
            }}
          />
          Content Change
        </label>

        <label>
          <input
            type="checkbox"
            checked={editorialChange}
            onChange={() => {
              setEditorialChange(true);
              setClassificationChange(false);
            }}
          />
          Editorial Change
        </label>
      </div>


      <div style={styles.footer}>
        <button className="popup-button cancel" onClick={onClose}>
          Cancel
        </button>

        <button
          className="popup-button save"
          style={{
            background: isNextDisabled ? "#c4c4c4" : "#007bff",
            cursor: isNextDisabled ? "not-allowed" : "pointer"
          }}
          disabled={isNextDisabled}
          onClick={() =>
            onNext({
              revisionText,
              classificationChange,
              editorialChange
            })
          }
        >
          Next →
        </button>
      </div>

    </Modal>
  );
};


const styles = {

  heading: {
    margin: "0 0 10px 0",
    fontSize: "22px",
    fontWeight: "600"
  },
  subheading: {
    margin: "10px 0",
    fontSize: "18px"
  },
  label: { fontWeight: "600" },

  checkboxGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px"
  },

  footer: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between"
  },
};

export default PublishPopup;

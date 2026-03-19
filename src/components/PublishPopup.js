import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "./Modal";
import { versionlist } from "../API/api";
import { useLangMap } from "../hooks/useLangMap";
import { useTranslation } from "../hooks/useTranslation";
import TranslationTextAreaPopup from "../hooks/TranslationTextAreaPopup"; // 👈 new

const PublishPopup = ({
  isOpen,
  onClose,
  onNext,
  revisionresponse,
  selectedLanguage,
  supportedLanguages = [], // 👈 new
}) => {

  const [revisionText, setRevisionText] = useState("");
  const [classificationChange, setClassificationChange] = useState(false);
  const [editorialChange, setEditorialChange] = useState(false);
  const [showTranslationPopup, setShowTranslationPopup] = useState(false); // 👈 new
  const [translations, setTranslations] = useState({}); // 👈 new

  const langMap = useLangMap();

  const t = useTranslation();


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
    const langKey = langMap[selectedLanguage] || "EN";
    setRevisionText(revisionData?.[langKey]?.content || "");
    setTranslations(revisionData || {}); // 👈 new

  }, [revisionresponse, selectedLanguage]);

  if (!isOpen) return null;

  // 👉 NEXT button disabled logic
  const isNextDisabled = !classificationChange && !editorialChange;

  const isQuillEmpty = (value) => {
    if (!value) return true;
    const text = value.replace(/<(.|\n)*?>/g, "").trim();
    return text.length === 0;
  };


  return (
    <Modal modalStyle={{ width: "500px" }} >

      <h2 style={styles.heading}>{t("publish_process")}</h2>

      <hr />

      <h3 style={styles.subheading}>{t("classify_change")}</h3>

      <hr />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
        <label style={styles.label}>{t("revision_info")}:</label>
        <button
          className="popup-button"
          style={{ backgroundColor: "#d9d9d9", color: "#000", padding: "4px 8px", fontSize: "12px" }}
          onClick={() => setShowTranslationPopup(true)}
        >
          {t("translation")}
        </button>
      </div>

      <div style={{ height: "180px", marginBottom: "50px" }}>
        <ReactQuill
          value={revisionText}
          onChange={(value) => {
            setRevisionText(value);
            const langKey = langMap[selectedLanguage] || "EN";
            setTranslations((prev) => ({
              ...prev,
              [langKey]: {
                ...(typeof prev[langKey] === "object" ? prev[langKey] : {}),
                content: value,
              },
            }));
          }}
          style={{ height: "100%" }}
        />
      </div>

      <hr />

      <h3 style={styles.subheading}>{t("classification_of_changes")}:</h3>
      <div style={styles.checkboxGroup}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <input
            type="radio"
            name="changeType"
            checked={classificationChange}
            onChange={() => {
              setClassificationChange(true);
              setEditorialChange(false);
            }}
          />
          {t("content_change")}
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <input
            type="radio"
            name="changeType"
            checked={editorialChange}
            onChange={() => {
              setEditorialChange(true);
              setClassificationChange(false);
            }}
          />
          {t("editorial_change")}
        </label>
      </div>


      <div style={styles.footer}>
        <button className="popup-button cancel" onClick={onClose}>
          {t("Cancel")}
        </button>

        <button
          className="popup-button save"
          style={{
            // background: isNextDisabled ? "#c4c4c4" : "#007bff",
            cursor: isNextDisabled ? "not-allowed" : "pointer"
          }}
          disabled={isNextDisabled}


          onClick={() => {
            if (isQuillEmpty(revisionText)) {
              alert("Revision info is required");
              return;
            }

            onNext({
              revisionText,
              classificationChange,
              editorialChange,
              translations,
              selectedLanguage
            });
          }}
        >
          {t("next")}
        </button>
      </div>

      {showTranslationPopup && (
        <TranslationTextAreaPopup
          isOpen={showTranslationPopup}
          onClose={() => setShowTranslationPopup(false)}
          defaultValues={translations}
          onSubmit={(values) => {
            setTranslations(values);
            const langKey = langMap[selectedLanguage] || "EN";
            setRevisionText(values[langKey]?.content || "");
            setShowTranslationPopup(false);
          }}
          supportedLanguages={supportedLanguages}
        />
      )}

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

import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLangMap } from "./useLangMap"; // same hook as TranslationPopup
import { useTranslation } from "./useTranslation";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const cardStyle = {
  minWidth: 500,
  maxWidth: 700,
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  padding: 16,
  maxHeight: "80vh",
  overflowY: "auto",
};

const rowStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginBottom: 20,
};

export default function TranslationTextAreaPopup({
  isOpen,
  onClose,
  onSubmit,
  defaultValues = {},
  title = "Translate Content",
  supportedLanguages = [], // array of language IDs e.g. [1, 2, 3]
}) {
  const langMap = useLangMap(); // same hook used in first component
  const [values, setValues] = useState({});
  const firstInputRef = useRef(null);
 const t = useTranslation();
  // create default structure dynamically
  useEffect(() => {
    if (isOpen) {
      const dynamicDefaults = supportedLanguages.reduce((acc, langId) => {
        const langKey = langMap[langId] || `lang_${langId}`;
        acc[langKey] = {
          title: defaultValues?.[langKey]?.title || "",
          content: defaultValues?.[langKey]?.content || "",
        };
        return acc;
      }, {});
      setValues(dynamicDefaults);
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [isOpen, defaultValues, supportedLanguages, langMap]);

  if (!isOpen) return null;

  const handleChange = (langKey, field, value) =>
    setValues((s) => ({
      ...s,
      [langKey]: { ...s[langKey], [field]: value },
    }));

  const handleSubmit = () => {
    onSubmit?.(values);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <div style={overlayStyle} onMouseDown={handleOverlayClick} className="translate_popup_swimlane">
      <div className="global_popup_modal" role="dialog" aria-modal="true" aria-label={title}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none",
              background: "transparent",
              fontSize: 20,
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* Dynamic Language Sections */}
        {supportedLanguages.map((langId, idx) => {
          const langKey = langMap[langId] || `lang_${langId}`;
          const label = langKey.toUpperCase();

          return (
            <div key={langKey} style={rowStyle}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>{label}</label>

              <ReactQuill
                value={values[langKey]?.content || ""}
                onChange={(val) => handleChange(langKey, "content", val)}
                modules={quillModules}
                placeholder={`Enter ${label} content`}
              />
            </div>
          );
        })}

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          <button onClick={onClose} className="global-btn">
           {t("Cancel")}
          </button>
          <button onClick={handleSubmit} className="global-btn">
            {t("Save")}
          </button>
        </div>
      </div>
    </div>
  );
}

// inline styles
// const btnPrimary = {
//   padding: "10px 14px",
//   borderRadius: 10,
//   border: "none",
//   background: "#2563eb",
//   color: "#fff",
//   cursor: "pointer",
//   fontWeight: 600,
// };

// const btnSecondary = {
//   padding: "10px 14px",
//   borderRadius: 10,
//   border: "1px solid #d0d5dd",
//   background: "#fff",
//   color: "#111827",
//   cursor: "pointer",
//   fontWeight: 600,
// };

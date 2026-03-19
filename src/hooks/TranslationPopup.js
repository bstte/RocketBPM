import React, { useEffect, useRef, useState } from "react";
import { useLangMap } from "./useLangMap";
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

const cardStyle = (anchor) => ({
  position: anchor ? "absolute" : "relative",
  top: anchor?.y ?? "auto",
  left: anchor?.x ?? "auto",
  transform: anchor ? "translate(0, 0)" : "none",
  minWidth: 400,
  maxWidth: 480,
  maxHeight: "60vh",
  display: "flex",
  flexDirection: "column",
  background: "#fff",
  borderRadius: "4px",
  border: "1px solid #002060",
  boxShadow: "0 4px 15px rgba(0,32,96,0.15)",
  padding: 25,
  fontFamily: "'Poppins', sans-serif",
  fontWeight: "300",
  color: "#002060"
});

const rowStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginBottom: 12,
};

// 🧩 Dynamic Translation Popup
export default function TranslationPopup({
  isOpen,
  onClose,
  onSubmit,
  defaultValues = {},
  anchorPosition = null,
  title = "Translate",
  supportedLanguages = [], // array of language IDs e.g. [1, 2, 3]

}) {
  const [values, setValues] = useState(defaultValues);
  const firstInputRef = useRef(null);
  const langMap = useLangMap();
  // 🔹 Helper to strip HTML tags and convert <br>, <div> to newlines
  const stripHtml = (html) => {
    if (!html) return "";
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.innerText || "";
  };

  const t = useTranslation();
  // 🔹 Helper to convert newlines back to HTML for storage (using <div> and <br> as react-contenteditable does)
  const textToHtml = (text) => {
    if (!text) return "";
    return text.split("\n").map((line, i) => {
      if (i === 0) return line;
      return `<div>${line || "<br>"}</div>`;
    }).join("");
  };

  // Set initial values when popup opens
  useEffect(() => {
    if (isOpen) {
      // Build dynamic default values
      const dynamicDefaults = supportedLanguages.reduce((acc, langId) => {
        const langKey = langMap[langId] || `lang_${langId}`;
        acc[langKey] = stripHtml(defaultValues?.[langKey]);
        return acc;
      }, {});

      setValues((prev) => {
        const same = JSON.stringify(prev) === JSON.stringify(dynamicDefaults);
        return same ? prev : dynamicDefaults;
      });

      // focus first input
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [isOpen, defaultValues, supportedLanguages, langMap]);

  if (!isOpen) return null;

  const handleChange = (key, v) => setValues((s) => ({ ...s, [key]: v }));

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose?.();
  };

  const handleSubmit = () => {
    const formattedValues = Object.keys(values).reduce((acc, key) => {
      acc[key] = textToHtml(values[key]);
      return acc;
    }, {});
    onSubmit?.(formattedValues);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className="translate_popup"
      style={overlayStyle}
      onMouseDown={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div
        style={cardStyle(anchorPosition)}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 15,
            paddingBottom: 10,
            borderBottom: "1px solid #e1e8f5"
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: "bold",
              textTransform: "uppercase",
              display: "flex",
              alignSelf: "center",
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none",
              background: "transparent",
              fontSize: 20,
              lineHeight: 1,
              cursor: "pointer",
              color: "#002060"
            }}
          >
            ×
          </button>
        </div>

        {/* 🔤 Dynamic Language Fields */}
        <div style={{ overflowY: "auto", flex: 1, paddingRight: 5 }}>
          {supportedLanguages.map((langId, index) => {
            const langKey = langMap[langId] || `lang_${langId}`;
            const labelName = langKey.toUpperCase();
            return (
              <div key={langKey} style={rowStyle}>
                <label style={{ fontSize: 11, fontWeight: "bold", marginBottom: 4 }}>
                  {labelName}
                </label>
                <input
                  ref={index === 0 ? firstInputRef : null}
                  type="text"
                  value={values[langKey] || ""}
                  onChange={(e) => handleChange(langKey, e.target.value)}
                  placeholder={`Enter ${labelName} translation`}
                  style={inputStyle}
                />
              </div>
            );
          })}
        </div>

        {/* Footer Buttons */}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 15,
            paddingTop: 12,
            borderTop: "1px solid #e1e8f5"
          }}
        >
          <button onClick={onClose} style={btnSecondary}>
            {t('Cancel')}
          </button>
          <button onClick={handleSubmit} style={btnPrimary}>
            {t('Save')}
          </button>
        </div>
      </div>
    </div>
  );
}

// 🎨 Simple Inline Styles
const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  borderRadius: "4px",
  border: "1px solid #002060",
  outline: "none",
  fontSize: 12,
  fontFamily: "'Poppins', sans-serif",
  fontWeight: "300",
  color: "#002060"
};

const btnPrimary = {
  padding: "8px 24px",
  borderRadius: "4px",
  border: "none",
  background: "#002060",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "12px",
};

const btnSecondary = {
  padding: "8px 24px",
  borderRadius: "4px",
  border: "none",
  background: "#E9EEF5",
  color: "#002060",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "12px",
};

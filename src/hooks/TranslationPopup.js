import React, { useEffect, useRef, useState } from "react";
import { useLangMap } from "./useLangMap";

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
  background: "#fff",
  borderRadius: 0,
  border: "1px solid #011f60",
  boxShadow: "rgba(1, 31, 96, 0.28) 0px 0px 10px",
  padding: 25,
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
  // Set initial values when popup opens
  useEffect(() => {
    if (isOpen) {
      // Build dynamic default values
       
      const dynamicDefaults = supportedLanguages.reduce((acc, langId) => {
        const langKey = langMap[langId] || `lang_${langId}`;
        acc[langKey] = defaultValues?.[langKey] || "";
        return acc;
      }, {});
      setValues(dynamicDefaults);

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
    onSubmit?.(values);
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
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
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
            }}
          >
            ×
          </button>
        </div>

        {/* 🔤 Dynamic Language Fields */}
        {supportedLanguages.map((langId, index) => {
          const langKey = langMap[langId] || `lang_${langId}`;
          const labelName = langKey.toUpperCase();
          return (
            <div key={langKey} style={rowStyle}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>
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

        {/* Footer Buttons */}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 8,
          }}
        >
          <button onClick={onClose} className="global-btn">
            Cancel
          </button>
          <button onClick={handleSubmit} className="global-btn">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// 🎨 Simple Inline Styles
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 0,
  border: "1px solid #002060",
  outline: "none",
  fontSize: 14,
};

// const btnPrimary = {
//   padding: "8px 30px",
//   borderRadius: 0,
//   border: "none",
//   background: "#002060",
//   color: "#fff",
//   cursor: "pointer",
//   fontWeight: 600,
// };

// const btnSecondary = {
//   padding: "8px 30px",
//   borderRadius: 0,
//   border: "none",
//   background: "#002060",
//   color: "#fff",
//   cursor: "pointer",
//   fontWeight: 600,
// };

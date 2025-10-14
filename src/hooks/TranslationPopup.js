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
  minWidth: 360,
  maxWidth: 480,
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  padding: 16,
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
          <button onClick={onClose} style={btnSecondary}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={btnPrimary}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// 🎨 Simple Inline Styles
const inputStyle = {
  width: "90%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d0d5dd",
  outline: "none",
  fontSize: 14,
};

const btnPrimary = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

const btnSecondary = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #d0d5dd",
  background: "#fff",
  color: "#111827",
  cursor: "pointer",
  fontWeight: 600,
};

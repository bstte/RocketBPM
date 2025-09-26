import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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

// ✅ Normalizer (always return title + content)
const normalize = (vals) => ({
  en: { title: vals?.en?.title || "", content: vals?.en?.content || "" },
  de: { title: vals?.de?.title || "", content: vals?.de?.content || "" },
  es: { title: vals?.es?.title || "", content: vals?.es?.content || "" },
});

export default function TranslationTextAreaPopup({
  isOpen,
  onClose,
  onSubmit,
  defaultValues = {},
  title = "Translate Content",
}) {
  const [values, setValues] = useState(() => normalize(defaultValues));
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setValues(normalize(defaultValues));
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [isOpen, defaultValues]);

  if (!isOpen) return null;

  const handleChange = (lang, field, value) =>
    setValues((s) => ({ ...s, [lang]: { ...s[lang], [field]: value } }));

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

  const renderLanguageSection = (langCode, label, ref = null) => (
    <div style={rowStyle} key={langCode}>
      <label style={{ fontSize: 12, fontWeight: 600 }}>{label}</label>

     
      {/* Content editor */}
      <ReactQuill
        value={values[langCode].content}
        onChange={(val) => handleChange(langCode, "content", val)}
        modules={quillModules}
        placeholder={`Enter ${label} content`}
      />
    </div>
  );

  return (
    <div style={overlayStyle} onMouseDown={handleOverlayClick}>
      <div style={cardStyle} role="dialog" aria-modal="true" aria-label={title}>
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

        {/* Language Sections */}
        {renderLanguageSection("en", "English (en)", firstInputRef)}
        {renderLanguageSection("de", "German (de)")}
        {renderLanguageSection("es", "Spanish (es)")}

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 16,
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

// inline styles
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

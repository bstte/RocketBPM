import React, { useEffect, useRef, useState } from "react";

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

const rowStyle = { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 };
const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, ""); // remove all tags
};

const normalize = (vals) => ({
  en: { title: stripHtml(vals?.en?.title), content: stripHtml(vals?.en?.content) },
  de: { title: stripHtml(vals?.de?.title), content: stripHtml(vals?.de?.content) },
  es: { title: stripHtml(vals?.es?.title), content: stripHtml(vals?.es?.content) },
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

  const handleChange = (lang, field, v) =>
    setValues((s) => ({ ...s, [lang]: { ...s[lang], [field]: v } }));

  const handleSubmit = () => {
    onSubmit?.(values);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div style={overlayStyle} onMouseDown={handleOverlayClick}>
      <div style={cardStyle} role="dialog" aria-modal="true" aria-label={title}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
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

        {/* English */}
        <div style={rowStyle}>
          <label style={{ fontSize: 12, fontWeight: 600 }}>English (en)</label>
          {/* <input
            ref={firstInputRef}
            type="text"
            value={values.en.title}
            onChange={(e) => handleChange("en", "title", e.target.value)}
            placeholder="Enter title"
            style={inputStyle}
          /> */}
          <textarea
            value={values.en.content}
            onChange={(e) => handleChange("en", "content", e.target.value)}
            placeholder="Enter content"
            style={textAreaStyle}
          />
        </div>

        {/* German */}
        <div style={rowStyle}>
          <label style={{ fontSize: 12, fontWeight: 600 }}>German (de)</label>
          {/* <input
            type="text"
            value={values.de.title}
            onChange={(e) => handleChange("de", "title", e.target.value)}
            placeholder="Titel eingeben"
            style={inputStyle}
          /> */}
          <textarea
            value={values.de.content}
            onChange={(e) => handleChange("de", "content", e.target.value)}
            placeholder="Inhalt eingeben"
            style={textAreaStyle}
          />
        </div>

        {/* Spanish */}
        <div style={rowStyle}>
          <label style={{ fontSize: 12, fontWeight: 600 }}>Spanish (es)</label>
          {/* <input
            type="text"
            value={values.es.title}
            onChange={(e) => handleChange("es", "title", e.target.value)}
            placeholder="Introduce el título"
            style={inputStyle}
          /> */}
          <textarea
            value={values.es.content}
            onChange={(e) => handleChange("es", "content", e.target.value)}
            placeholder="Introduce el contenido"
            style={textAreaStyle}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={onClose} style={btnSecondary}>Cancel</button>
          <button onClick={handleSubmit} style={btnPrimary}>Save</button>
        </div>
      </div>
    </div>
  );
}

// inline styles
const inputStyle = {
  width: "95%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d0d5dd",
  outline: "none",
  fontSize: 14,
};

const textAreaStyle = {
  width: "95%",
  minHeight: 100,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d0d5dd",
  outline: "none",
  fontSize: 14,
  resize: "vertical",
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

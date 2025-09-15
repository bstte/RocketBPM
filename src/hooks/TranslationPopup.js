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

const rowStyle = { display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 };

export default function TranslationPopup({
  isOpen,
  onClose,
  onSubmit,
  defaultValues = { en: "", de: "", es: "" },
  anchorPosition = null, // {x, y} relative to viewport OR container if you portal it
  title = "Translate",
}) {
  const [values, setValues] = useState(defaultValues);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setValues(defaultValues || { en: "", de: "", es: "" });
      // focus on first field
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [isOpen, defaultValues]);

  if (!isOpen) return null;

  const handleChange = (key, v) => setValues((s) => ({ ...s, [key]: v }));

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose?.();
  };

  const handleSubmit = () => {
    // ensure at least one value present (optional)
    // if (!values.en && !values.de && !values.es) return;
    onSubmit?.(values);
  };

  // close when clicking outside card
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div style={overlayStyle} onMouseDown={handleOverlayClick} onKeyDown={handleKeyDown}>
      <div style={cardStyle(anchorPosition)} role="dialog" aria-modal="true" aria-label={title}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600,display:"flex",alignSelf:"center" }}>{title}</h3>
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

        <div style={rowStyle}>
          <label style={{ fontSize: 12, fontWeight: 600 }}>English (en)</label>
          <input
            ref={firstInputRef}
            type="text"
            value={values.en}
            onChange={(e) => handleChange("en", e.target.value)}
            placeholder="Start Process"
            style={inputStyle}
          />
        </div>

        <div style={rowStyle}>
          <label style={{ fontSize: 12, fontWeight: 600 }}>German (de)</label>
          <input
            type="text"
            value={values.de}
            onChange={(e) => handleChange("de", e.target.value)}
            placeholder="Prozess starten"
            style={inputStyle}
          />
        </div>

        <div style={rowStyle}>
          <label style={{ fontSize: 12, fontWeight: 600 }}>Spanish (es)</label>
          <input
            type="text"
            value={values.es}
            onChange={(e) => handleChange("es", e.target.value)}
            placeholder="Iniciar proceso"
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={onClose} style={btnSecondary}>Cancel</button>
          <button onClick={handleSubmit} style={btnPrimary}>Save</button>
        </div>
      </div>
    </div>
  );
}

// simple inline styles
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

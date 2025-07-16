import React, { useEffect, useState } from "react";

const StickyNoteModel = ({ isOpen, onSubmit,initialValue }) => {
  const [text, setText] = useState(initialValue);
  useEffect(() => {
    if (isOpen) {
      setText(initialValue || "");
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const onOk=(textdata)=>{
    onSubmit(textdata)
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <textarea
          rows="5"
          style={styles.textarea}
          placeholder="Enter your text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button style={styles.button} onClick={() =>onOk(text)}>
          OK
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    width: "550px",
    textAlign: "center",
  },
  textarea: {
    width: "100%",
    height: "100px",
    // padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    resize: "none",
  },
  button: {
    marginTop: "10px",
    padding: "8px 16px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default StickyNoteModel;

import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import Draggable from "react-draggable";
import "react-quill/dist/quill.snow.css";
import "../Css/DetailsPopup.css";

const DetailsPopup = ({ isOpen, onClose, onSave,Details }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isOpen && Details) {
      console.log("popup testing", Details)
      setTitle(Details.data.details.title || ""); // Set title if exists
      setContent(Details.data.details.content || ""); // Set content if exists
    }
  }, [Details, isOpen]);
  
  
  if (!isOpen) return null;


  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ title, content });
    }
    setContent("");
    setTitle("");
    onClose();
  };

  return (
    <>
      <Draggable handle=".popup-header">
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-header">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter title here"
                className="popup-title-input"
              />
              <div className="popup-actions">
                <button className="popup-button cancel" onClick={onClose}>
                  Cancel
                </button>
                <button className="popup-button save" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>

            <div className="popup-body">
              <ReactQuill
                value={content}
                onChange={handleContentChange}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    ["clean"],
                  ],
                }}
                placeholder="Enter your details here. You can include hyperlinks like https://example.com."
                style={{ height: "200px", marginBottom: "20px" }}
              />
            </div>
          </div>
        </div>
      </Draggable>
    </>
  );
};

export default DetailsPopup;

import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import Draggable from "react-draggable";
import "react-quill/dist/quill.snow.css";
import "../Css/DetailsPopup.css";
import { ResizableBox } from "react-resizable";

const DetailsPopup = ({ isOpen, onClose, onSave, Details }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [popupSize, setPopupSize] = useState({ width: 560, height: 420 });

  useEffect(() => {
    if (isOpen && Details) {

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
        <ResizableBox
          width={popupSize.width}
          height={popupSize.height}
          minConstraints={[300, 200]}
          maxConstraints={[800, 600]}
          onResizeStop={(e, { size }) => setPopupSize(size)}
          style={{
            position: "absolute",
            top: "25%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#ffffff",
            border: "1px solid #000",
            boxShadow: "0 2px 5px #002060",
            overflow: "hidden",
            zIndex: 1001,
          }}
        >
          {/* <div className="popup-overlay"> */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            border: "1px solid #000",
            boxShadow: "0 2px 5px #002060",
            overflowY: "auto",
            zIndex: 1001, width: "100%", height: "100%"
          }}>
            <div className="popup-header" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              cursor: "move"
            }}>
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
          {/* </div> */}
        </ResizableBox>
      </Draggable>
    </>
  );
};

export default DetailsPopup;

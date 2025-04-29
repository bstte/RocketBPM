import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import Draggable from "react-draggable";
import "react-quill/dist/quill.snow.css";
import "../Css/DetailsPopup.css";
import { ResizableBox } from "react-resizable";

const DetailsPopup = ({ isOpen, onClose, onSave, Details }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [popupSize, setPopupSize] = useState({ width: 600, height: 450 });
  const [maxConstraints, setMaxConstraints] = useState([800, 600]);
  const [editorHeight, setEditorHeight] = useState(450);

  useEffect(() => {
    const updateMaxConstraints = () => {
      setMaxConstraints([window.innerWidth - 30, window.innerHeight - 30]);
    };

    updateMaxConstraints();
    window.addEventListener("resize", updateMaxConstraints);

    return () => window.removeEventListener("resize", updateMaxConstraints);
  }, []);

  useEffect(() => {
    if (isOpen && Details) {

      setTitle(Details.data.details.title?.replace(/<br\s*\/?>/gi, " ") || ""); 
      setContent(Details.data.details.content || ""); 
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
          minConstraints={[300, 450]}
          maxConstraints={maxConstraints}
          onResizeStop={(e, { size }) => {
            setPopupSize(size);
            setEditorHeight(size.height - 50); // Adjust editor height
          }}
          style={{
            position: "absolute",
            top: "25%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#ffffff",
            border: "1px solid #002060",
            boxShadow: "0 2px 5px #002060",
            overflow: "hidden",
            zIndex: 1001,
            padding:"10px"
          }}
        >
          {/* <div className="popup-overlay"> */}
          <div className="EditContentPopup" style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            border: "0px solid #002060",
            overflow: "hidden",
            zIndex: 1001, 
            width: "100%", 
            height: "100%",
            
          }}>
            <div className="popup-header" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 10px 10px",
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
                style={{ height: `${editorHeight - 50}px`, marginBottom: "20px" }} 
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

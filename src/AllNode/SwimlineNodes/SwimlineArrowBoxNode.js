import { memo, useRef, useState, useEffect, useContext } from "react";
import { Handle, Position } from "@xyflow/react";
import ContentEditable from "react-contenteditable";
import api, { checkRecordWithGetLinkDraftData, getdataByNodeId } from "../../API/api";
import { useNavigate } from "react-router-dom";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";

const ArrowBoxNode = ({ data, onTitleChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.details.title);
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);
  const [isHovered, setIsHovered] = useState(false);
  const { addBreadcrumb, removeBreadcrumbsAfter } =
    useContext(BreadcrumbsContext);
  const contentEditableRef = useRef(null);

  const navigate = useNavigate();

  const handleBoxClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      contentEditableRef.current?.focus();
    }, 0);
  };

  const handleChange = (e) => {
    setTitle(e.target.value);
    if (data.onLabelChange) {
      data.onLabelChange(e.target.value);
    }
  };

  const handleFocus = (e) => {
    const selection = window.getSelection();
    const range = document.createRange();

    if (e.target.firstChild) {
      range.setStart(e.target.firstChild, e.target.selectionStart || 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };


  const handleBlur = () => {
    setIsEditing(false);
    if (onTitleChange) {
      onTitleChange(title);
    }
  };
  useEffect(() => {
    if (autoFocus && contentEditableRef.current) {
      setTimeout(() => {
        contentEditableRef.current.focus();
        setAutoFocus(false);
      }, 0);
    }
  }, [autoFocus]);

  useEffect(() => {
    setTitle(data.details.title || "");
  }, [data.details.title]);
  
  // const handleLinkClick = async () => {
  //   if (data.link) {
  //     try {

  //       const response = await getdataByNodeId(data.link, "draft");
  //       if (response.data && response.data.length > 0) {
  //         const user_id = response.data[0].user_id;
  //         const Process_id = response.data[0].Process_id;
  //         const id = response.data[0].Process_id;

  //         const user = {
  //           id: response.data[0].user_id,
  //         };

  //         let newLevel = 1;
  //         if (data.link !== null) {
  //           const match = data.link.match(/^Level(\d+)/);
  //           if (match && match[1]) {
  //             const currentLevel = parseInt(match[1], 10);
  //             newLevel = currentLevel + 1;
  //           }
  //         }

  //         const levelParam =
  //           data.link !== null
  //             ? `Level${newLevel}_${data.link}`
  //             : `Level${newLevel}`;
  //         console.log("newLevel", levelParam)

  //         const nodeData = await checkRecordWithGetLinkDraftData(
  //           levelParam,
  //           parseInt(user_id),
  //           Process_id,
  //           data.link
  //         );
  //         const nodeDataParsed = JSON.parse(response.data[0].data);
  //         if (nodeData.status === true) {
  //           removeBreadcrumbsAfter(1);

  //           const allNodes = nodeData.allNodes; // 👈 API se mila array
  //           if (Array.isArray(allNodes) && allNodes.length > 0) {
  //             // sabse highest level se start
  //             allNodes.forEach((node) => {
  //               const parsedData = JSON.parse(node.data || '{}');
  //               const label = parsedData.label || '';
  //               const node_id = node.node_id;
  //               const process_id = node.Process_id;
            
  //               // ✅ Level number get karo
  //               let currentLevel = 0;
  //               const match = node_id.match(/^Level(\d+)/);
  //               if (match && match[1]) {
  //                 currentLevel = parseInt(match[1], 10);
  //               }
  //               const newLevel = currentLevel + 1;
            
  //               const user = { id: node.user_id };
            
  //               // ✅ URL banao
  //               const url = `/Draft-Process-View/${newLevel}/${node_id}/${process_id}?title=${encodeURIComponent(label)}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${node.PageGroupId}`;
  //           console.log("addbreadcrums time",node)
  //               // ✅ Breadcrumb add karo
  //               addBreadcrumb(label, url);
  //             });
  //           }
            
            
  //           if (nodeData.Page_Title === "ProcessMap") {
           
  //             navigate(`/Draft-Process-View/${newLevel}/${data.link}/${id}?title=${encodeURIComponent(nodeDataParsed.label || "")}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${response.data[0]?.PageGroupId}`)

  //           }
  //           if (nodeData.Page_Title === "Swimlane") {
         
  //             navigate(`/Draft-Swim-lanes-View/level/${newLevel}/${data.link}/${id}?title=${encodeURIComponent(nodeDataParsed.label || "")}&user=${encodeURIComponent(JSON.stringify(user))}&parentId=${data.link}&level=${newLevel}&ParentPageGroupId=${response.data[0]?.PageGroupId}`)

  //           }
  //         } else {
  //           alert("First create next model of this existing model")
  //         }
  //       } else {
  //         console.error("No data found in response.data");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching link data:", error);
  //     }
  //   }
  // };

  return (
    <div
      style={styles.wrapper}
      onClick={!isEditing ? handleBoxClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Arrow Box */}
      <div className="borderBox"  style={{
    ...styles.arrowBox,
    filter: data.link ? 'drop-shadow(0px 0px 10px #0000004f)' : 'none',
  }}>
        {/* {!isEditing && data.link ? (
          <div style={styles.textView}>
            {data.link && (
              <div>
                <button style={styles.linkButton} onClick={handleLinkClick}>
                  {data.details?.title}
                </button>
              </div>
            )}
          </div>
        ) : (
          <ContentEditable
            innerRef={contentEditableRef}
            html={title}
            onFocus={handleFocus}
            onChange={(e) =>
              handleChange({ target: { value: e.target.value } })
            }
            onBlur={handleBlur}
            placeholder="Type title here..."
            style={styles.label}
          />
        )} */}


        {data.link ? (
          <div style={styles.textView}>
            {data.link && (
              <div>
                <button style={styles.linkButton} >
                  {data.details?.title}
                </button>
              </div>
            )}
          </div>
        ) : (
          <ContentEditable
            innerRef={contentEditableRef}
            html={title}
            onFocus={handleFocus}
            onChange={(e) =>
              handleChange({ target: { value: e.target.value } })
            }
            onBlur={handleBlur}
            placeholder="Type title here..."
            style={styles.label}
          />
        )}
      </div>

      {/* Border overlay as a separate div */}
      <div style={styles.borderOverlay}></div>


      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={isHovered ? styles.hoverhandle : styles.handle}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={isHovered ? styles.hoverhandle : styles.handle}
      />

    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    width: "90%",
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  arrowBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    textAlign: "center",
    backgroundColor: "red",
    color: "#002060",
    width: "100%",
    height: "100%",
    // clipPath:
    //   "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
    clipPath: 'polygon(10px 50%, 0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)',

    padding: "10px",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  label: {
    fontSize: "12px",
    fontFamily: "'Poppins', sans-serif",
    color: "white",
    background: "transparent",
    border: "none",
    outline: "none",
    textAlign: "center",
    width: "100%",
  },
  textView: {
    fontSize: "12px",
    fontFamily: "'Poppins', sans-serif",
    color: "white",
    textAlign: "center",
    wordBreak: "break-word",
  },
  link: {
    color: "white",
    textDecoration: "underline",
    cursor: "pointer",
  },
  borderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    clipPath:
      "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
    // border: "1px solid black",
    pointerEvents: "none",
    boxSizing: "border-box",
    backgroundColor: "transparent",
    padding: "2px",
  },

  linkButton: {
    fontSize: "10px",
    color: "white",
    background: "none",
    border: "none",

    // textDecoration: "underline",
    cursor: "pointer",
  },
  hoverhandle: {
    backgroundColor: "#FF364A",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  handle: {
    backgroundColor: "transparent",
    border: "none",
    width: "0px",
    height: "0px",
    pointerEvents: "none",
  },
};

export default memo(ArrowBoxNode);

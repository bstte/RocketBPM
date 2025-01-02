import { memo, useRef, useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import ContentEditable from "react-contenteditable";
import api,{ getdataByNodeId } from "../../API/api";
import { useNavigate } from "react-router-dom";

const ArrowBoxNode = ({ data, onTitleChange }) => {
  const [isEditing, setIsEditing] = useState(false); 
  const [title, setTitle] = useState(data.details.title);
  const [autoFocus, setAutoFocus] = useState(data.autoFocus);

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


  const handleLinkClick = async () => {
    if (data.link) {
      try {
        const response = await getdataByNodeId(data.link, 'draft');
        console.log(response);
  
        if (response.data && response.data.length > 0) {
          const user_id = response.data[0].user_id;
          const Process_id = response.data[0].Process_id;
          const id=response.data[0].Process_id;
           
          
          const user={
            id:response.data[0].user_id,
          }
  
          const newLevel = 1;
          const levelParam =
            data.link !== null
              ? `Level${newLevel}_${data.link}`
              : `Level${newLevel}`;
  
          const nodeData = await api.getNodes(
            levelParam,
            parseInt(user_id),
            Process_id
          );
  
          const existingNodes = nodeData.nodes || [];
  
          console.log('nodeData',nodeData);

          let hasSwimlane = false;
          let hasProcessMap = false;
  
          existingNodes.forEach((node) => {
            if (node.Page_Title === "Swimlane") {
              hasSwimlane = true;
            }
            if (node.Page_Title === "ProcessMap") {
              hasProcessMap = true;
            }
          });

      const nodeDataParsed = JSON.parse(response.data[0].data);
 
          if(hasProcessMap){
            console.log("inside process map",`/level/${newLevel}/${data.link}`)
            navigate(`/level/${newLevel}/${data.link}`, {
              state: {id, title:  nodeDataParsed.label || "", user, ParentPageGroupId : response.data[0]?.PageGroupId  },
            });
          }
          if(hasSwimlane){
            navigate(`/swimlane/level/${newLevel}/${data.link}`, {
              state: {
                id,
                title:  nodeDataParsed.label || "",
                user,
                parentId: data.link,
                level: newLevel,
                ParentPageGroupId :  response.data[0]?.PageGroupId
              },
            });
          }
  
          console.log("hasSwimlane hasProcessMap", hasSwimlane, hasProcessMap);
        } else {
          console.error("No data found in response.data");
        }
      } catch (error) {
        console.error("Error fetching link data:", error);
      }
    }
  };
  

  return (
    <div style={styles.wrapper} onClick={!isEditing ? handleBoxClick : undefined}>
      {/* Arrow Box */}
      <div className="borderBox" style={styles.arrowBox}>
        {!isEditing && data.link ? (
          <div style={styles.textView}>
             {data.link && (
          <div >
            <button style={styles.linkButton} onClick={handleLinkClick}>
            {title}
            </button>
          </div>
        )}
          </div>
        ) : (
          <ContentEditable
            innerRef={contentEditableRef}
            html={title}
            onChange={(e) => handleChange({ target: { value: e.target.value } })}
            onBlur={handleBlur}
            placeholder="Type title here..."
            style={styles.label}
          />
        )}
      </div>

      {/* Border overlay as a separate div */}
      <div style={styles.borderOverlay}></div>

      {/* Handles */}
      <Handle type="target" position={Position.Bottom} id="bottom-target" style={styles.handle} />
      <Handle type="source" position={Position.Bottom} id="bottom-source" style={styles.handle} />
      <Handle type="target" position={Position.Top} id="top-target" style={styles.handle} />
      <Handle type="source" position={Position.Top} id="top-source" style={styles.handle} />
      <Handle type="target" position={Position.Left} id="left-target" style={styles.handle} />
      <Handle type="source" position={Position.Left} id="left-source" style={styles.handle} />
      <Handle type="target" position={Position.Right} id="right-target" style={styles.handle} />
      <Handle type="source" position={Position.Right} id="right-source" style={styles.handle} />
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
    color: "#000000",
    width: "100%",
    height: "100%",
    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
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
    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
    border: "1px solid black",
    pointerEvents: "none",
    boxSizing: "border-box",
    backgroundColor: "transparent",
    padding: "2px",
  },
  handle: {
    backgroundColor: "red",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  linkButton: {
    fontSize: "10px",
    color: "white",
    background: "none",
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default memo(ArrowBoxNode);

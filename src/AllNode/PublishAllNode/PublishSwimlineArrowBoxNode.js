import { memo, useContext } from "react";
import { Handle, Position } from "@xyflow/react";
import api, { getdataByNodeId } from "../../API/api";
import { useNavigate } from "react-router-dom";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";

const ArrowBoxNode = ({ data }) => {
  const title=data.details.title

 const { addBreadcrumb, removeBreadcrumbsAfter } =
    useContext(BreadcrumbsContext);
  const navigate = useNavigate();

  


  const handleLinkClick = async () => {
    if (data.link) {
      try {
        const response = await getdataByNodeId(data.link, "Published");
       

        if (response.data && response.data.length > 0) {
          const user_id = response.data[0].user_id;
          const Process_id = response.data[0].Process_id;
          const id = response.data[0].Process_id;
       
          const user = {
            id: response.data[0].user_id,
          };

          // const newLevel = 1;
          let newLevel = 1;
          if (data.link !== null) {
            const match = data.link.match(/^Level(\d+)/); 
            if (match && match[1]) {
              const currentLevel = parseInt(match[1], 10);
              newLevel = currentLevel + 1;
            }
          }
          
          const levelParam =
            data.link !== null
              ? `Level${newLevel}_${data.link}`
              : `Level${newLevel}`;

          const nodeData = await api.checkPublishRecord(
            levelParam,
            parseInt(user_id),
            Process_id
          );
         

          const nodeDataParsed = JSON.parse(response.data[0].data);
          if (nodeData.status === true) {
            removeBreadcrumbsAfter(1);
            if (nodeData.Page_Title === "ProcessMap") {
              navigate(`/published-map-level/${newLevel}/${data.link}`, {
                state: {
                  id,
                  title: nodeDataParsed.label || "",
                  user,
                  ParentPageGroupId: response.data[0]?.PageGroupId,
                },
              });
            }
            if (nodeData.Page_Title === "Swimlane") { 
                addBreadcrumb(
                    `${nodeDataParsed.label || ""} `,
                    `/published-swimlane/level/${newLevel}/${data.link}`,
                    {    id,
                        title: nodeDataParsed.label || "",
                        user,
                        parentId: data.link,
                        level: newLevel,
                        ParentPageGroupId: response.data[0]?.PageGroupId, }
                  );

              navigate(`/published-swimlane/level/${newLevel}/${data.link}`, {
                state: {
                  id,
                  title: nodeDataParsed.label || "",
                  user,
                  parentId: data.link,
                  level: newLevel,
                  ParentPageGroupId: response.data[0]?.PageGroupId,
                },
              });
            }
          }else{
            alert("This model is not published")
          }
        } else {
          console.error("No data found in response.data");
        }
      } catch (error) {
        console.error("Error fetching link data:", error);
      }
    }
  };

  return (
    <div
      style={styles.wrapper}
    >
      {/* Arrow Box */}
      <div className="borderBox" style={styles.arrowBox}>
    
          <div style={styles.textView}>
            {data.link ? (
              <div>
                <button style={styles.linkButton} onClick={handleLinkClick}>
                  {title}
                </button>
              </div>
            ):(
              <>
               <div>
                <button style={styles.withoutlinkButton} >
                  {title}
                </button>
              </div>
              </>
            )}

          </div>
    
      </div>

      {/* Border overlay as a separate div */}
      <div style={styles.borderOverlay}></div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        style={styles.handle}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        style={styles.handle}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        style={styles.handle}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        style={styles.handle}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        style={styles.handle}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        style={styles.handle}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        style={styles.handle}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        style={styles.handle}
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
    clipPath: 'polygon(10px 50%, 0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)',
    // border: "1px solid black",
    pointerEvents: "none",
    boxSizing: "border-box",
    backgroundColor: "transparent",
    padding: "2px",
  },
  handle: {
    backgroundColor: "transparent",
    border: "none",
    width: "0px",
    height: "0px",
    pointerEvents: "none" ,
  },
  linkButton: {
    fontSize: "12px",
    color: "white",
    background: "none",
    border: "none",
    textDecoration: "underline",
    cursor: "pointer",
  },
 withoutlinkButton: {
    fontSize: "12px",
    color: "white",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
};

export default memo(ArrowBoxNode);

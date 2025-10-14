import { memo, useContext } from "react";
import { Handle, Position } from "@xyflow/react";
import api, {
  checkRecordWithGetLinkDraftData,
  getdataByNodeId,
} from "../../API/api";
import { useNavigate } from "react-router-dom";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";

const ArrowBoxNode = ({ data }) => {
  const title = data.details.title;

  const { addBreadcrumb, removeBreadcrumbsAfter } =
    useContext(BreadcrumbsContext);
  const navigate = useNavigate();

  const handleLinkClick = async () => {
    console.log(data.link);
    if (data.link) {
      try {
        const response = await getdataByNodeId(data.link, "draft");
        if (response.data && response.data.length > 0) {
          const user_id = response.data[0].user_id;
          const Process_id = response.data[0].Process_id;
          const id = response.data[0].Process_id;

          const user = {
            id: response.data[0].user_id,
          };

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
          console.log("newLevel", levelParam);

          const nodeData = await checkRecordWithGetLinkDraftData(
            levelParam,
            parseInt(user_id),
            Process_id,
            data.link
          );
          const nodeDataParsed = JSON.parse(response.data[0].data);
          if (nodeData.status === true) {
            removeBreadcrumbsAfter(1);

            const allNodes = nodeData.allNodes; // 👈 API se mila array
            if (Array.isArray(allNodes) && allNodes.length > 0) {
              // sabse highest level se start
              allNodes.forEach((node) => {
                const parsedData = JSON.parse(node.data || "{}");
                const label = parsedData.label || "";
                const node_id = node.node_id;
                const process_id = node.Process_id;

                // ✅ Level number get karo
                let currentLevel = 0;
                const match = node_id.match(/^Level(\d+)/);
                if (match && match[1]) {
                  currentLevel = parseInt(match[1], 10);
                }
                const newLevel = currentLevel + 1;

                const user = { id: node.user_id };

                // ✅ URL banao
                const url = `/Draft-Process-View/${newLevel}/${node_id}/${process_id}`;

                // ✅ Breadcrumb add karo
                addBreadcrumb(label, url);
              });
            }

            if (nodeData.Page_Title === "ProcessMap") {
              navigate(`/Draft-Process-View/${newLevel}/${data.link}/${id}`);
            }
            if (nodeData.Page_Title === "Swimlane") {
              navigate(
                `/Draft-Swim-lanes-View/level/${newLevel}/${data.link}/${id}`
              );
            }
          } else {
            alert("First create next model of this existing model");
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
    <div style={styles.wrapper}>
      {/* Arrow Box */}
      <div
        className="borderBox"
        style={{
          ...styles.arrowBox,
          filter: data.link ? "drop-shadow(0px 0px 10px #0000004f)" : "none",
        }}
        onClick={handleLinkClick}
      >
        <div style={styles.textView}>
          {data.link ? (
            <div>
              <button
                style={styles.linkButton}
                onClick={handleLinkClick}
                dangerouslySetInnerHTML={{ __html: title }}
              >
              </button>
            </div>
          ) : (
            <>
              <div>
                <button
                  style={styles.withoutlinkButton}
                  dangerouslySetInnerHTML={{ __html: title }}
                />
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
    // backgroundColor: "red",
    color: "#002060",
    width: "100%",
    height: "100%",
    backgroundColor: "red",
    clipPath:
      "polygon(10px 50%, 0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
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
      "polygon(10px 50%, 0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)",
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
    pointerEvents: "none",
  },
  linkButton: {
    fontSize: "12px",
    color: "white",
    background: "none",
    border: "none",
    // textDecoration: "underline",
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

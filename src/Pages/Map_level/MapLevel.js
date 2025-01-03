import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useContext,
} from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  SmoothStepEdge,
  BezierEdge,
  StraightEdge,
  MarkerType,
  reconnectEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Header from "../../components/Header";
import Popup from "../../components/Popup";
import ArrowBoxNode from "../../AllNode/ArrowBoxNode";
import PentagonNode from "../../AllNode/PentagonNode";
import api, { filter_draft } from "../../API/api";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";
import CustomContextMenu from "../../components/CustomContextMenu";

const nodeTypes = {
  progressArrow: ArrowBoxNode,
  pentagon: PentagonNode,
};

const edgeTypes = {
  smoothstep: SmoothStepEdge,
  bezier: BezierEdge,
  straight: StraightEdge,
};

const MapLevel = () => {
  const navigate = useNavigate();
  const { level, parentId } = useParams();
  const location = useLocation();
  const { id, title, user,ParentPageGroupId } = location.state || {};
  const currentLevel = level ? parseInt(level, 10) : 0;
  const currentParentId = parentId || null;
  const { addBreadcrumb, removeBreadcrumbsAfter } =
    useContext(BreadcrumbsContext);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [popupTitle, setPopupTitle] = useState("");
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [headerTitle, setHeaderTitle] = useState(`${title} `);
  const handleLabelChange = useCallback(
    (nodeId, newLabel) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
    },
    [setNodes]
  );

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const levelParam =
          currentParentId !== null
            ? `Level${currentLevel}_${currentParentId}`
            : `Level${currentLevel}`;
        const user_id = user ? user.id : null;
        const Process_id = id ? id : null;
        const data = await api.getNodes(
          levelParam,
          parseInt(user_id),
          Process_id
        );

        const parsedNodes = data.nodes.map((node) => {
          const parsedData = JSON.parse(node.data);
          const parsedPosition = JSON.parse(node.position);
          const parsedMeasured = JSON.parse(node.measured);

          return {
            ...node,
            data: {
              ...parsedData,
              onLabelChange: (newLabel) =>
                handleLabelChange(node.node_id, newLabel),

              width_height: parsedMeasured,
              autoFocus: true,
              nodeResize: true,
            },
            type: node.type,
            id: node.node_id,

            measured: parsedMeasured,
            position: parsedPosition,
            draggable: Boolean(node.draggable),
            animated: Boolean(node.animated),
          };
        });

        const parsedEdges = data.edges.map((edge) => ({
          ...edge,
          animated: Boolean(edge.animated),
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { stroke: "#000", strokeWidth: 2 },
          type: "step",
        }));

        setNodes(parsedNodes);
        setEdges(parsedEdges);
      } catch (error) {
        console.error("Error fetching nodes:", error);
        alert("Failed to fetch nodes. Please try again.");
      }
    };

    fetchNodes();
  }, [
    currentLevel,
    handleLabelChange,
    setNodes,
    setEdges,
    currentParentId,
    user,
    id,
  ]);

  useEffect(() => {
    const label = currentLevel === 0 ? title : title;
    const path =
      currentLevel === 0
        ? "/Map_level"
        : `/level/${currentLevel}/${currentParentId}`;

    const state = {
      id: id,
      title: title,
      user: user,
    };

    if (currentLevel >= 0) {
      removeBreadcrumbsAfter(currentLevel - 1);
    }
    addBreadcrumb(label, path, state);
  }, [
    currentLevel,
    currentParentId,
    addBreadcrumb,
    removeBreadcrumbsAfter,
    id,
    title,
    user,
  ]);

  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);

  const onConnect = useCallback((connection) => {
  // Your callback logic here
  console.log('Connected:', connection);
}, []);

  useEffect(() => {
    const handleRefresh = (event) => {
      const userConfirmed = window.confirm(
        "You have unsaved changes. Do you really want to leave?"
      );
      console.log("confirm data", userConfirmed);
      if (userConfirmed) {
        navigate("/List-process-title");
      } else {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleRefresh);

    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
    };
  }, [navigate]);

  const addNode = (type, position) => {
    const newNodeId = uuidv4();
  let PageGroupId;

    if (nodes.length === 0) {
       PageGroupId	= uuidv4();
    } else {
      PageGroupId = nodes[0]?.PageGroupId; 
    }

    const newNode = {
      id:
        currentParentId !== null
          ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
          : `Level${currentLevel}_${newNodeId}`,
      data: {
        label: "",
        shape: type,
        onLabelChange: (newLabel) =>
          handleLabelChange(
            currentParentId !== null
              ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
              : `Level${currentLevel}_${newNodeId}`,
            newLabel
          ),

        defaultwidt: "230px",
        defaultheight: "120px",
        nodeResize: true,
        autoFocus: true,
      },
      type: type,
      status: "draft",
      position: position || { x: Math.random() * 250, y: Math.random() * 250 },
      draggable: true,
      isNew: true,
      animated: true,
      Page_Title: "ProcessMap",
      PageGroupId:PageGroupId
    };

    setNodes((nds) => nds.concat(newNode));
    setHasUnsavedChanges(true);
    setTimeout(() => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === newNode.id ? { ...node, isNew: false } : node
        )
      );
    }, 1000);
  };

  const deleteNode = useCallback(() => {
    if (selectedNode) {
      const confirmDeletion = window.confirm(
        "Are you sure you want to delete this nodes?"
      );
      if (!confirmDeletion) return;

      setNodes((nds) => nds.filter((node) => node.id !== selectedNode));
      setEdges((eds) =>
        eds.filter(
          (edge) => edge.source !== selectedNode && edge.target !== selectedNode
        )
      );
      setSelectedNode(null);
      setShowPopup(false);
      setHasUnsavedChanges(true);
      setHeaderTitle(`${title}`);
    }
  }, [selectedNode, setNodes, setEdges, title]);

  const handleNodeRightClick = (event, node) => {
    event.preventDefault();
    setSelectedNode(node.id);
    setPopupTitle(node.data.label || "Node Actions");
    const { clientX, clientY } = event;
    const flowContainer = document.querySelector(".flow-container");
    const containerRect = flowContainer.getBoundingClientRect();

    setPopupPosition({
      x: clientX - containerRect.left,
      y: clientY - containerRect.top,
    });
    setShowPopup(true);
  };

  useEffect(() => {
    const stateTitle = location.state?.title || title;
    setHeaderTitle(`${stateTitle}`);
  }, [location.state, currentLevel, title]);

  const handleCreateNewNode = async (type) => {
    if (selectedNode) {
      const selectedNodeData = nodes.find((node) => node.id === selectedNode);
      const selectedLabel = selectedNodeData?.data?.label || "";

      console.log("selectedNode",selectedNode)

      const newLevel = currentLevel + 1;
      setShowPopup(false);
      const levelParam =
        selectedNode !== null
          ? `Level${newLevel}_${selectedNode}`
          : `Level${currentLevel}`;
      const user_id = user ? user.id : null;
      const Process_id = id ? id : null;
      const data = await api.getNodes(
        levelParam,
        parseInt(user_id),
        Process_id
      );

      const existingNodes = data.nodes || [];

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

      if (type === "ProcessMap") {
        if (hasSwimlane) {
          alert("You have already created a Swimlane.");
        } else {
          await handleBack();
          navigate(`/level/${newLevel}/${selectedNode}`, {
            state: { id, title: selectedLabel, user, ParentPageGroupId : nodes[0]?.PageGroupId  },
          });
        }
      } else if (type === "Swimlane") {
        if (hasProcessMap) {
          alert("You have already created a Process Map.");
        } else {
          await handleBack();
          addBreadcrumb(
            `${selectedLabel} `,
            `/swimlane/level/${newLevel}/${selectedNode}`,
            { id, title, user, parentId: selectedNode, level: newLevel }
          );

          navigate(`/swimlane/level/${newLevel}/${selectedNode}`, {
            state: {
              id,
              title: selectedLabel,
              user,
              parentId: selectedNode,
              level: newLevel,
              ParentPageGroupId : nodes[0]?.PageGroupId
            },
          });
        }
      }
    }
  };

  // Save nodes and edges to backend
  const handleSaveNodes = async (savetype) => {
    if(savetype==="Published" && currentLevel!==0){
    
      try{
        const response = await filter_draft(ParentPageGroupId);
        if(response.data===true){
          alert("First published previous page");
          return false
        }
      }catch(error){
        console.error("filter draft error",error)
      }
    }

    const Level =
      currentParentId !== null
        ? `Level${currentLevel}_${currentParentId}`
        : `Level${currentLevel}`;
    const user_id = user && user.id;
    const Process_id = id && id;
    const datasavetype=savetype;
    try {
      const response = await api.saveNodes({
        Level,
        user_id,
        Process_id,
        datasavetype,
        nodes: nodes.map(
          ({
            id,
            data,
            type,
            position,
            draggable,
            animated,
            measured,
            Page_Title,
            status,
            PageGroupId
          }) => ({
            id,
            data,
            type,
            position,
            draggable,
            animated,
            measured,
            Page_Title,
            status,
            PageGroupId
          })
        ),
        edges: edges.map(
          ({
            id,
            source,
            target,
            markerEnd,
            animated,
            sourceHandle,
            targetHandle,
            Page_Title,
          }) => ({
            id,
            source,
            sourceHandle,
            target,
            targetHandle,
            markerEnd,
            animated,
            Page_Title,
          })
        ),
      });
      // console.log("response",response)
      alert(response.message);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving nodes:", error);
      if (error.response && error.response.data) {
        console.error(
          `Failed to save nodes: ${JSON.stringify(error.response.data)}`
        );
      } else {
        console.error("Failed to save nodes. Please try again.");
      }
    }
  };


  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" && selectedNode) {
        deleteNode();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNode, deleteNode]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const userConfirmed = window.confirm(
        "You have unsaved changes. Do you want to save them before leaving?"
      );
      if (userConfirmed) {
        handleSaveNodes("draft");
      }
    }
  };

  const switchNodeType = (type) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode
            ? {
                ...node,
                type: type,
                data: {
                  ...node.data,
                  shape: type,
                },
              }
            : node
        )
      );
      setHasUnsavedChanges(true);
      setShowPopup(false);
    }
  };

  const handleContextMenuOptionClick = (type) => {
    setShowContextMenu(false);
    addNode(type, { x: contextMenuPosition.x, y: contextMenuPosition.y });
  };


  const handlePageClick = useCallback(() => {
    setShowPopup(false);
    if (showContextMenu) {
      setShowContextMenu(false);
    }
  }, [showContextMenu]);


  const handleGlobalContextMenu = (event) => {
    const targetNode = event.target.closest(".react-flow__node");
    if (targetNode) {
      return;
    }
    event.preventDefault();

    const flowContainer = document.querySelector(".flow-container");
    const containerRect = flowContainer.getBoundingClientRect();

    setShowContextMenu(true);
    setContextMenuPosition({
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top,
    });
  };



  useEffect(() => {
    document.addEventListener("click", handlePageClick);
  
    return () => {
      document.removeEventListener("click", handlePageClick);
    };
  }, [handlePageClick]);
  
 

  const iconNames = {};

  // Called when edge is reconnected
  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      setEdges((prevEdges) => reconnectEdge(oldEdge, newConnection, prevEdges));
    },
    [setEdges]
  );

  return (
    <div>
      <Header
        title={headerTitle}
        onSave={handleSaveNodes}
        onPublish={handleSaveNodes}
        addNode={addNode}
        handleBackdata={handleBack}
        iconNames={iconNames}
        condition={true}
        currentLevel={currentLevel}
      />
      <ReactFlowProvider>
        <div className="app-container" style={styles.appContainer}>
          <div className="content-wrapper" style={styles.contentWrapper}>
            <div
              className="flow-container"
              style={styles.flowContainer}
              onContextMenu={handleGlobalContextMenu}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onReconnect={onReconnect}
                nodeTypes={memoizedNodeTypes}
                edgeTypes={memoizedEdgeTypes}
                minZoom={0.1}
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnDrag={false}
                panOnScroll={false}
                maxZoom={0.6}
                onNodeContextMenu={handleNodeRightClick}
                style={styles.reactFlowStyle}
              ></ReactFlow>

              <CustomContextMenu
                showContextMenu={showContextMenu}
                contextMenuPosition={contextMenuPosition}
                handleContextMenuOptionClick={handleContextMenuOptionClick}
              />
              <Popup
                showPopup={showPopup}
                popupPosition={popupPosition}
                popupTitle={popupTitle}
                selectedNodeType={
                  nodes.find((node) => node.id === selectedNode)?.type
                }
                switchNodeType={switchNodeType}
                handleCreateNewNode={handleCreateNewNode}
                deleteNode={deleteNode}
                condition={true}
              />
            </div>
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    marginTop: "0px",
    backgroundColor: "#f8f9fa",
  },
  contentWrapper: {
    display: "flex",
    flex: 1,
    borderLeft: "1px solid #002060",
    borderRight: "1px solid #002060",
    borderBottom: "1px solid #002060",
  },
  flowContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    position: "relative",
  },
  reactFlowStyle: {
    width: "100%",
    height: "100%",
  },
};

export default MapLevel;

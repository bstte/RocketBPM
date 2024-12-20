import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  SmoothStepEdge,
  BezierEdge,
  StraightEdge,
  Background,
  MarkerType,
  reconnectEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import Header from "../../components/Header";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../API/api";
import CustomContextPopup from "../../components/CustomContextPopup";
import DetailsPopup from "../../components/DetailsPopup";
import NodeTypes from "./NodeTypes";
import generateNodesAndEdges from "../../../src/AllNode/SwimlineNodes/generateNodesAndEdges";
import styles from "./SwimlaneStyles";
import AddObjectRole from "../../AllNode/SwimlineNodes/addobjectrole";

const rfStyle = {
  width: "100%",
  height: "100%",
  backgroundColor: "#fff",
};

const SwimlaneModel = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { id, title, user, parentId, level } = location.state || {};
  const headerTitle = `${title} `;
  const currentParentId = parentId || null;
  const currentLevel = level ? parseInt(level, 10) : 0;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [options, setOptions] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { nodes: initialNodes } = useMemo(
    () => generateNodesAndEdges(windowSize.width, windowSize.height),
    [windowSize]
  );
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [ChildNodes, setChiledNodes] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  const [detailschecking, setdetailschecking] = useState(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const nodeTypes = NodeTypes;
  const edgeTypes = useMemo(
    () => ({
      smoothstep: SmoothStepEdge,
      bezier: BezierEdge,
      straight: StraightEdge,
    }),
    []
  );

  useEffect(() => {
    const handleRefresh = (event) => {
      const userConfirmed = window.confirm(
        "You have unsaved changes. Do you really want to leave?"
      );

      console.log("confirm data", userConfirmed);
      if (userConfirmed) {
        navigate("/List-process-title"); // Redirect to the desired route
      } else {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleRefresh);

    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
    };
  }, [navigate]);

  const handleLabelChange = useCallback(
    (nodeId, newLabel) => {
      setChiledNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            if (node.type === "SwimlineRightsideBox") {
              // Update the label if the node type is SwimlineRightsideBox
              return {
                ...node,
                data: {
                  ...node.data,
                  label: newLabel,
                },
              };
            } else {
              // Otherwise, update the details.title
              return {
                ...node,
                data: {
                  ...node.data,
                  details: {
                    ...node.data.details,
                    title: newLabel,
                  },
                },
              };
            }
          }
          return node; // No changes for other nodes
        })
      );
      console.log("Label changed for node:", nodeId, "New label:", newLabel);
    },
    [setChiledNodes]
  );
  

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        // console.log("check user ,", user);
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
        const totalRows = 8;
        const totalColumns = 11;
        const groupWidth = windowSize.width / totalColumns - 14;
        const groupHeight = windowSize.height / totalRows - 14;

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

              defaultwidt: "40px",
              defaultheight: "40px",
              nodeResize: false,
            },
            type: node.type,
            id: node.node_id,
            parentId: node.parentId,
            extent: "parent",
            measured: parsedMeasured,
            position: parsedPosition,
            draggable: Boolean(node.draggable),
            animated: Boolean(node.animated),
            style: {
              width: groupWidth,
              height: groupHeight,
            },
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

        setChiledNodes(parsedNodes);
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
    windowSize,
  ]);

  const onNodesChange = useCallback(
    (changes) => setChiledNodes((nds) => applyNodeChanges(changes, nds)),
    [setChiledNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
            style: { stroke: "#000", strokeWidth: 2 },
            Level:
              currentParentId !== null
                ? `Level${currentLevel}_${currentParentId}`
                : `Level${currentLevel}`,
            user_id: user && user.id,
            Process_id: id && id,
            type: "step",
            Page: "Swimlane",
          },
          eds
        )
      );
      setHasUnsavedChanges(true)
    },

    [setEdges, currentLevel, currentParentId, user, id]
  );

  const handleNodeClick = useCallback(
    (event, node) => {
      setSelectedEdge(null);
      setOptions([]);
    },
    [setChiledNodes]
  );

  const addNode = (type, position) => {
    if (type === "Yes" || type === "No") {
      if (!position) {
        alert("Position not defind");
        return;
      }

      const newNodeId = uuidv4();
      const newNode = {
        id:
          currentParentId !== null
            ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
            : `Level${currentLevel}_${newNodeId}`,

        data: {
          label: "",
          shape: type,
          onLabelChange: (newLabel) => handleLabelChange(newNodeId, newLabel),

          defaultwidt: "40px",
          defaultheight: "40px",
          nodeResize: false,
        },
        type: type,
        position: position || {
          x: Math.random() * 250,
          y: Math.random() * 250,
        },
        draggable: true,
        isNew: true,
        animated: true,
        Page_Title: "Swimlane",
        Level:
          currentParentId !== null
            ? `Level${currentLevel}_${currentParentId}`
            : `Level${currentLevel}`,
        user_id: user && user.id,
        Process_id: id && id,
      };

      setChiledNodes((nds) => [...nds, newNode]);
      setHasUnsavedChanges(true)
    } else if (selectedGroupId) {
      const selectedGroup = nodes.find((node) => node.id === selectedGroupId);
      const groupWidth = selectedGroup?.style?.width || 100;
      const groupHeight = selectedGroup?.style?.height || 100;
      const childWidth = groupWidth * 0.9;
      const childHeight = groupHeight * 0.9; // 80% of the group height
      const newNodeId = uuidv4();
      const newNode = {
        id:
          currentParentId !== null
            ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
            : `Level${currentLevel}_${newNodeId}`,
        node_id:
          currentParentId !== null
            ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
            : `Level${currentLevel}_${newNodeId}`,

        parentId: selectedGroupId,
        extent: "parent",
        data: {
          label: "",
          details: { title: "", content: "" },
          autoFocus: true, 
          shape: type,
          onLabelChange: (newLabel) =>   handleLabelChange(
            currentParentId !== null
            ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
            : `Level${currentLevel}_${newNodeId}`,
            newLabel
          ),

          defaultwidt: "40px",
          defaultheight: "40px",
          nodeResize: false,
        },
        type: type,
        position: position || {
          x: Math.random() * 250,
          y: Math.random() * 250,
        },
        draggable: false,
        isNew: true,
        animated: true,
        Page_Title: "Swimlane",
        Level:
          currentParentId !== null
            ? `Level${currentLevel}_${currentParentId}`
            : `Level${currentLevel}`,
        user_id: user && user.id,
        Process_id: id && id,
        style: {
          width: childWidth,
          height: childHeight,
        },
      };

      setChiledNodes((nds) => [...nds, newNode]);
      setHasUnsavedChanges(true)
    } else {
      alert("Please select a group node first!");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const memoizedNodeTypes = useMemo(() => nodeTypes, [nodeTypes]);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, [edgeTypes]);

  const handleSaveNodes = async () => {
    try {
      const response = await api.saveNodes({
        nodes: ChildNodes.map(
          ({
            id,
            data,
            type,
            position,
            draggable,
            animated,
            measured,
            Level,
            user_id,
            Process_id,
            Page_Title,
            parentId,
          }) => ({
            id,
            data,
            type,
            position,
            draggable,
            animated,
            measured,
            Level,
            user_id,
            Process_id,
            Page_Title,
            parentId,
          })
        ),
        edges: edges.map(
          ({
            id,
            source,
            target,
            markerEnd,
            animated,
            Level,
            sourceHandle,
            targetHandle,
            user_id,
            Process_id,
            Page_Title,
          }) => ({
            id,
            source,
            sourceHandle,
            target,
            targetHandle,
            markerEnd,
            animated,
            Level,
            user_id,
            Process_id,
            Page_Title,
          })
        ),
      });

      alert(response.message);
      setHasUnsavedChanges(false)
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

  const openPopup = () => {
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedNodeId(null);
  };

  const updateNodeDetails = (nodeId, newDetails) => {
    setChiledNodes((nodes) =>
      nodes.map((node) =>
        node.node_id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                details: {
                  title: newDetails.title,
                  content: newDetails.content,
                },
              },
            }
          : node
      )
    );
  };

  const saveDetails = (details) => {
    if (selectedNodeId) {
      updateNodeDetails(selectedNodeId, details);
      setSelectedNodeId(null);
      setHasUnsavedChanges(true)
    }
    closePopup();
  };

  const handlePopupAction = (action) => {
    const { x, y } = contextMenu;

    if (action === "Yes") {
      addNode("Yes", { x: x - 30, y: y - 125 });
    } else if (action === "No") {
      addNode("No", { x: x - 70, y: y - 125 });

    } else if (action === "addDetails") {
      openPopup();
    }
    setContextMenu(null);
  };

  const handleClosePopup = () => {
    setContextMenu(null);
    setSelectedNode(null);
    setdetailschecking(null);
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      const confirmDeletion = window.confirm(
        "Are you sure you want to delete this nodes?"
      );
      if (!confirmDeletion) return;

      setChiledNodes((nodes) =>
        nodes.filter((node) => node.id !== selectedNode.id)
      );
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      setHasUnsavedChanges(true)
      handleClosePopup();
    }
  };

  const handleNodeRightClick = (event, node) => {
    console.log("node", node);
    if (node.Page_Title === "Swimlane") {
      setOptions([]);
      setSelectedNodeId(node.node_id);
      setdetailschecking(node);
      event.preventDefault();
      setSelectedNode(node);
      setPosition({ x: event.clientX, y: event.clientY });

      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
      });
    } else {
      const [, row, col] = node.row_id.split("_").map(Number);

      let options = [];
      if (row === 6 && col === 0) {
        options = [];
      }
      else if (col === 0 && row < 6) {
        options = ["Add Role"]; 
      }
      else if (row === 6 && col > 0) {
        options = ["Add Process"];
      }
      else {
        options = ["Add Activities", "Add Decision"];
      }
      setPosition({ x: event.clientX, y: event.clientY });
      setOptions(options);
      setSelectedGroupId(node.id);
      setSelectedNode(node);

    }
  };

  const switchNodeType = (type) => {
    if (selectedNodeId) {
      setChiledNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? {
                ...node,
                type:type,
                data: {
                  ...node.data,
                  shape: type,
                },
              }
            : node
        )
      );
      setHasUnsavedChanges(true)

    }
  };


  const menuItems = [
    ...(detailschecking?.type === "diamond"
      ? [
          {
            label: "Add yes label",
            action: () => handlePopupAction("Yes"),
            borderBottom: true,
          },
          {
            label: "Add no label",
            action: () => handlePopupAction("No"),
            borderBottom: true,
          },
        ]
      : []),
    ...(detailschecking?.type !== "SwimlineRightsideBox"
      ? [
          {
            label:
              detailschecking &&
              (!detailschecking?.data?.details?.title ||
                detailschecking?.data?.details?.title === "") &&
              (!detailschecking?.data?.details?.content ||
                detailschecking?.data?.details?.content === "")
                ? "Add details"
                : "Edit details",
            action: () => handlePopupAction("addDetails"),
            borderBottom: true,
          },
        ]
      : []),
    ...(detailschecking?.type === "box"
      ? [
          {
            label: "Switch shape to Decision",
            action: () => switchNodeType("diamond"),
            borderBottom: true,
          },
        ]
      : []),
    {
      label: "Delete",
      action: handleDeleteNode,
      borderBottom: false,
    },
  ];
  
  const iconNames = {

  };

  const deleteEdge = () => {
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
    setSelectedEdge(null);
    setHasUnsavedChanges(true)
  };

  const onReconnect = useCallback((oldEdge, newConnection) => {
    setEdges((prevEdges) => reconnectEdge(oldEdge, newConnection, prevEdges));
    setHasUnsavedChanges(true)
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    const { clientX, clientY } = event;
    setPosition({ x: clientX, y: clientY });
    setSelectedEdge(edge);
  }, []);

  const handleOptionClick = (option) => {
    if(option==="Add Role"){
      addNode("SwimlineRightsideBox");
    }else if(option==="Add Activities"){
      addNode("box");
    }
    else if(option==="Add Decision"){
      addNode("diamond");
    }
    else if(option==="Add Process"){
      addNode("progressArrow");
    }

    setOptions([])
  };

  const handleContextMenu = (event) => {
    event.preventDefault();

  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const userConfirmed = window.confirm(
        "You have unsaved changes. Do you want to save them before leaving?"
      );
      if (userConfirmed) {
        handleSaveNodes();
      }
    }
  };
  return (
    <div>
      <Header
        title={headerTitle}
        onSave={handleSaveNodes}
        addNode={addNode}
        handleBackdata={handleBack}
        iconNames={iconNames}
      />
      <div style={styles.appContainer}>
        <ReactFlowProvider>
          <div style={styles.scrollableWrapper}>
            <ReactFlow
              nodes={[...nodes, ...ChildNodes]}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onNodeContextMenu={handleNodeRightClick}
              onReconnect={onReconnect}
              onContextMenu={handleContextMenu}
              onEdgeContextMenu={onEdgeClick}
              nodeTypes={memoizedNodeTypes}
              edgeTypes={memoizedEdgeTypes}
              minZoom={0}
              zoomOnScroll={false}
              zoomOnPinch={false}
              panOnDrag={false}
              panOnScroll={false}
              maxZoom={1}
              defaultEdgeOptions={{ zIndex: 1 }}
              style={rfStyle}
            >
              <Background color="#fff" gap={16} />
            </ReactFlow>

            <CustomContextPopup
              isVisible={!!contextMenu}
              position={contextMenu || { x: 0, y: 0 }}
              menuItems={menuItems}
              onClose={handleClosePopup}
            />

            <DetailsPopup
              isOpen={isPopupOpen}
              onClose={closePopup}
              onSave={saveDetails}
              Details={
                ChildNodes.find((node) => node.node_id === selectedNodeId) ||
                null
              }
            />
          </div>
          {options.length>0 && (
            <AddObjectRole
              position={position}
              options={options}
              onOptionClick={handleOptionClick}
              onClose={() => setIsPopupOpen(false)}
            />
          )}

          {selectedEdge && (
            <div
              style={{
                position: "absolute",
                top: position.y,
                left: position.x,
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "8px",
                border: "1px solid gray",
                borderRadius: "4px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              }}
            >
              <button
                onClick={deleteEdge}
                style={{
                  padding: "6px 12px",
                  cursor: "pointer",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Delete Arrow
              </button>
            </div>
          )}
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default SwimlaneModel;

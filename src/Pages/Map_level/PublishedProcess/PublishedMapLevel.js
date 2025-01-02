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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import Popup from "../../../components/Popup";
import api from "../../../API/api";
import { BreadcrumbsContext } from "../../../context/BreadcrumbsContext";
import PublishArrowBoxNode from "../../../AllNode/PublishAllNode/PublishArrowBoxNode";
import PublishPentagonNode from "../../../AllNode/PublishAllNode/PublishPentagonNode";

const nodeTypes = {
  progressArrow: PublishArrowBoxNode,
  pentagon: PublishPentagonNode,
};

const edgeTypes = {
  smoothstep: SmoothStepEdge,
  bezier: BezierEdge,
  straight: StraightEdge,
};

const PublishedMapLevel = () => {
  const navigate = useNavigate();
  const { level, parentId } = useParams();
  const location = useLocation();
  const { id, title, user, } = location.state || {};
  const currentLevel = level ? parseInt(level, 10) : 0;
  const currentParentId = parentId || null;
  const { addBreadcrumb, removeBreadcrumbsAfter } =
    useContext(BreadcrumbsContext);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [popupTitle, setPopupTitle] = useState("");
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
        const data = await api.getPublishedNodes(
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
            draggable: false,
            animated: false,
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

      const newLevel = currentLevel + 1;
      setShowPopup(false);
      const levelParam =
        selectedNode !== null
          ? `Level${newLevel}_${selectedNode}`
          : `Level${currentLevel}`;
      const user_id = user ? user.id : null;
      const Process_id = id ? id : null;
      const data = await api.getPublishedNodes(
        levelParam,
        parseInt(user_id),
        Process_id
      );

      const existingNodes = data.nodes || [];

      if (existingNodes.length === 0) {
        alert(`Next page not exist`);
        return false;
      }

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
          alert("Your next page is Swimlane.");
        } else {
          navigate(`/PublishedMapLevel/${newLevel}/${selectedNode}`, {
            state: {
              id,
              title: selectedLabel,
              user,
              ParentPageGroupId: nodes[0]?.PageGroupId,
            },
          });
        }
      } else if (type === "Swimlane") {
        if (hasProcessMap) {
          alert("Your next page is Process Map.");
        } else {
          addBreadcrumb(
            `${selectedLabel} `,
            `/swimlane/level/${newLevel}/${selectedNode}`,
            { id, title, user, parentId: selectedNode, level: newLevel }
          );

          navigate(`/Published_swimlane/level/${newLevel}/${selectedNode}`, {
            state: {
              id,
              title: selectedLabel,
              user,
              parentId: selectedNode,
              level: newLevel,
              ParentPageGroupId: nodes[0]?.PageGroupId,
            },
          });
        }
      }
    }
  };

  const memoizedNodeTypes = useMemo(() => nodeTypes, []);

  const handlePageClick = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    document.addEventListener("click", handlePageClick);

    return () => {
      document.removeEventListener("click", handlePageClick);
    };
  }, []);

  const iconNames = {};

  return (
    <div>
      <Header
        title={headerTitle}
        onSave={() => console.log("save function ")}
        onPublish={() => console.log("save publish")}
        addNode={() => console.log("add node")}
        handleBackdata={() => console.log("handle back")}
        iconNames={iconNames}
        condition={false}
      />
      <ReactFlowProvider>
        <div className="app-container" style={styles.appContainer}>
          <div className="content-wrapper" style={styles.contentWrapper}>
            <div className="flow-container" style={styles.flowContainer}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
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

              <Popup
                showPopup={showPopup}
                popupPosition={popupPosition}
                popupTitle={popupTitle}
                selectedNodeType={
                  nodes.find((node) => node.id === selectedNode)?.type
                }
                switchNodeType={() => console.log("switch shape function")}
                handleCreateNewNode={handleCreateNewNode}
                deleteNode={() => console.log("delete")}
                condition={false}
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

export default PublishedMapLevel;

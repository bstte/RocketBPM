import React, { useMemo, useState, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  SmoothStepEdge,
  BezierEdge,
  StraightEdge,
  Background,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Header from "../../../components/Header";
import { useLocation } from "react-router-dom";
import api from "../../../API/api";
import NodeTypes from "../NodeTypes";
import generateNodesAndEdges from "../../../../src/AllNode/SwimlineNodes/generateNodesAndEdges";
import styles from "../SwimlaneStyles";

const rfStyle = {
  width: "100%",
  height: "100%",
  backgroundColor: "#fff",
};

const PublishedSwimlaneModel = () => {
  const [windowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const location = useLocation();
  const { id, title, user, parentId, level } = location.state || {};
  const headerTitle = `${title} `;
  const currentParentId = parentId || null;
  const currentLevel = level ? parseInt(level, 10) : 0;
  const { nodes: initialNodes } = useMemo(
    () => generateNodesAndEdges(windowSize.width, windowSize.height),
    [windowSize]
  );

  const [ChildNodes, setChiledNodes] = useState([]);
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
    setNodes,
    setEdges,
    currentParentId,
    user,
    id,
    windowSize,
  ]);

  const memoizedNodeTypes = useMemo(() => nodeTypes, [nodeTypes]);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, [edgeTypes]);

  const iconNames = {

  };



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
      <div style={styles.appContainer}>
        <ReactFlowProvider>
          <div style={styles.scrollableWrapper}>
            <ReactFlow
              nodes={[...nodes, ...ChildNodes]}
              edges={edges}

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

          </div>
         
  
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default PublishedSwimlaneModel;
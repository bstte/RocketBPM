// components/MiniMapPreview.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
// import {ReactFlow, Background, Controls } from "@xyflow/react";
import {
    ReactFlow,
    SmoothStepEdge,
    BezierEdge,
    StraightEdge,

  } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import apiExports from "../../API/api";
import PublishArrowBoxNode from "../../AllNode/PublishAllNode/PublishArrowBoxNode";
import PublishPentagonNode from "../../AllNode/PublishAllNode/PublishPentagonNode";

const MiniMapPreview = ({ processId, userId }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

   const memoizedNodeTypes = useMemo(
      () => ({
        progressArrow: PublishArrowBoxNode,
        pentagon: PublishPentagonNode,
      }),
      []
    );
  
    const memoizedEdgeTypes = useMemo(
      () => ({
        smoothstep: SmoothStepEdge,
        bezier: BezierEdge,
        straight: StraightEdge,
      }),
      []
    );
    const fetchNodes = useCallback(async () => {
        try {
          const levelParam = "Level0";
          const publishedStatus = "Published";
      
          const data = await apiExports.getPublishedNodes(
            levelParam,
            parseInt(userId),
            processId,
            publishedStatus
          );
      
          const parsedNodes = data.nodes
            .filter((node) => node.type !== "StickyNote")
            .map((node) => {
              const parsedData = JSON.parse(node.data);
              const parsedPosition = JSON.parse(node.position);
              const parsedMeasured = JSON.parse(node.measured);
      
              return {
                ...node,
                id: node.node_id,
                type: node.type,
                position: parsedPosition,
                data: parsedData,
                style: {
                  width: parsedMeasured.width,
                  height: parsedMeasured.height,
                },
                draggable: false,
              };
            });
      
          setNodes(parsedNodes);
          setEdges([]); // optional
        } catch (err) {
          console.error("Error loading level 0 nodes:", err);
        }
      }, [processId, userId]); // ✅ include necessary dependencies


      useEffect(() => {
        if (processId && userId) {
          fetchNodes();
        }
      }, [fetchNodes,processId,userId]); 
  if (!nodes.length) return <div style={{ height: 200 }}> <img src="../../../img/dashboard-slider-image.jpg" alt="" /> </div>;

  return (
    <div style={{ width: "100%", height: "165px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={memoizedEdgeTypes}
        proOptions={{hideAttribution: true }}

      >
      </ReactFlow>
    </div>
  );
};

export default MiniMapPreview;

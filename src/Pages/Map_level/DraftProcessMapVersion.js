import { useNavigate, useParams } from "react-router-dom";
import React, {
  useState,
  useMemo,
  useEffect,
} from "react";
import {
  ReactFlow,
  ReactFlowProvider,

  SmoothStepEdge,
  BezierEdge,
  StraightEdge,

} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "@xyflow/react/dist/style.css";
import PublishArrowBoxNode from "../../AllNode/PublishAllNode/PublishArrowBoxNode";
import PublishPentagonNode from "../../AllNode/PublishAllNode/PublishPentagonNode";
import StickyNote from "../../AllNode/StickyNote";
import Header from "../../components/Header";
import { getVersionViewData } from "../../API/api";
import { useDynamicHeight } from "../../hooks/useDynamicHeight";

const DraftProcessMapVersion = () => {
  const { processId, level, version, pageTitle } = useParams();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [Title, SetTitle] = useState("")

  const windowHeight = window.innerHeight;
  const totalHeight = 0


  const windowSize = {
    width: window.innerWidth - 300,
    height: window.innerHeight - 300,
  };

  const { remainingHeight } = useDynamicHeight();


  const memoizedNodeTypes = useMemo(
    () => ({
      progressArrow: PublishArrowBoxNode,
      pentagon: PublishPentagonNode,
      StickyNote: StickyNote
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
  useEffect(() => {
    const fetchVersionData = async () => {
      try {
        const response = await getVersionViewData(processId, level, version, pageTitle);
        const { nodes, edges } = response;
        SetTitle(nodes[0]?.version)
        const parsedNodes = nodes.map((node) => ({
          ...node,
          data: {
            ...JSON.parse(node.data),
            width_height: JSON.parse(node.measured),
          },
          id: node.node_id,
          position: JSON.parse(node.position),
          draggable: false,
        }));

        const parsedEdges = edges.map((edge) => ({
          ...edge,
          id: edge.edge_id,
          source: edge.source,
          target: edge.target,
          animated: edge.animated,
          style: { stroke: "#002060", strokeWidth: 2 },
          type: "step",
        }));

        setNodes(parsedNodes);
        setEdges(parsedEdges);
      } catch (error) {
        console.error("Error fetching version data:", error);
        alert("Error fetching versioned data");
      }
    };

    fetchVersionData();
  }, [processId, level, version, pageTitle]);

  const styles = {
    appContainer: {
      display: "flex",
      flexDirection: "column",
      height: totalHeight > 0 ? `${windowHeight - totalHeight}px` : "auto",
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
  const navigate = useNavigate();


  return (
    <div>
      <Header
        title={`Version: ${Title}`}
        Page={"ViewProcessmapVersion"}
        iconNames={{}} // ✅ prevent crash if Header uses Object.keys
        onSave={() => { }} // optional stub functions
        onPublish={() => { }}
        handleBackdata={() => {
          navigate(-1);
        }}
      />
      <ReactFlowProvider>
        <div className="app-container" style={{ ...styles.appContainer, height: remainingHeight }}>
          <div className="content-wrapper" style={styles.contentWrapper}>

            <div className="flow-container" style={styles.flowContainer}>

              <ReactFlow
                nodes={nodes}
                edges={edges}


                nodeTypes={memoizedNodeTypes}
                edgeTypes={memoizedEdgeTypes}
                minZoom={0.1}
                fitView
                translateExtent={[
                  [1240, 410],
                  [windowSize.width, windowSize.height],
                ]}
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnDrag={false}
                panOnScroll={false}
                proOptions={{ hideAttribution: true }}
                maxZoom={0.6}
                style={styles.reactFlowStyle}
              ></ReactFlow>
            </div>
          </div>

        </div>



      </ReactFlowProvider>
    </div>
  );
};

export default DraftProcessMapVersion;

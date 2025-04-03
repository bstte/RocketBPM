import React, { useMemo, useState, useEffect, useContext } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  SmoothStepEdge,
  BezierEdge,
  StraightEdge,
  Background,
  MarkerType,
  ConnectionLineType,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import api, { checkFavProcess } from "../../../API/api";

import generateNodesAndEdges from "../../../AllNode/SwimlineNodes/generateNodesAndEdges";
import styles from "../SwimlaneStyles";
import PublishNodeType from "./PublishNodeType";
import { BreadcrumbsContext } from "../../../context/BreadcrumbsContext";

import '../../../Css/Swimlane.css'
import { useSelector } from "react-redux";


const PublishedSwimlaneModel = () => {

  const [height, setHeight] = useState(0);
  const [appheaderheight, setahHeight] = useState(0);
  const [remainingHeight, setRemainingHeight] = useState(0);

  useEffect(() => {
    const calculateHeights = () => {
      const element = document.querySelector(".ss_new_hed");
      const element2 = document.querySelector(".app-header");

      // Ensure elements are found before accessing height
      const elementHeight = element ? element.getBoundingClientRect().height : 0;
      const appHeaderHeight = element2 ? element2.getBoundingClientRect().height : 0;



      setHeight(elementHeight);
      setahHeight(appHeaderHeight);

      // Correct calculation inside the function
      const newHeight = window.innerHeight - (elementHeight + appHeaderHeight - 14);
      setRemainingHeight(newHeight - 46);
    };

    // Initial setup
    calculateHeights();

    // Handle window resize
    window.addEventListener("resize", calculateHeights);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", calculateHeights);
  }, []);

  // alert(`Window Height: ${window.innerHeight}, App Div Height: ${appheaderheight}, Header Height: ${height}, New Height: ${remainingHeight}`);

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
    () => generateNodesAndEdges(windowSize.width, windowSize.height, 'viewmode', height + 10, appheaderheight, remainingHeight),
    [windowSize, height, appheaderheight, remainingHeight]
  );
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  const [process_img, setprocess_img] = useState("");

  const [getPublishedDate, setgetPublishedDate] = useState("");
  const navigate = useNavigate();
  const [ChildNodes, setChiledNodes] = useState([]);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const LoginUser = useSelector((state) => state.user.user);
  const [isFavorite, setIsFavorite] = useState(false);
  const nodeTypes = PublishNodeType;
  const edgeTypes = useMemo(
    () => ({
      smoothstep: SmoothStepEdge,
      bezier: BezierEdge,
      straight: StraightEdge,
    }),
    []
  );

  const { removeBreadcrumbsAfter, breadcrumbs, setBreadcrumbs } = useContext(BreadcrumbsContext);

  useEffect(() => {
    const checkfav = async () => {
      const user_id = LoginUser ? LoginUser.id : null;
      const process_id = id ? id : null;


      if (!user_id || !process_id) {
        console.error("Missing required fields:", { user_id, process_id });
        return; // Stop execution if any field is missing
      }

      try {
        console.log("Sending data:", { user_id, process_id });
        const response = await checkFavProcess(user_id, process_id);
        console.log("Response:", response);
        setIsFavorite(response.exists)
      } catch (error) {
        console.error("check fav error:", error);
      }
    }
    checkfav()
  }, [LoginUser, id])
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const levelParam =
          currentParentId !== null
            ? `Level${currentLevel}_${currentParentId}`
            : `Level${currentLevel}`;
        const user_id = user ? user.id : null;
        const Process_id = id ? id : null;
        const publishedStatus = "Published";

        const data = await api.getPublishedNodes(
          levelParam,
          parseInt(user_id),
          Process_id
        );
        const getPublishedDate = await api.GetPublishedDate(
          levelParam,
          parseInt(user_id),
          Process_id,
          publishedStatus
        );

        setgetPublishedDate(getPublishedDate.status ? getPublishedDate.created_at : "");
        setprocess_img(data.process_img);

        const nodebgwidth = document.querySelector(".react-flow__node");
        const nodebgwidths = nodebgwidth ? nodebgwidth.getBoundingClientRect().width : 0;

        const nodebgheight = document.querySelector(".react-flow__node");
        const nodebgheights = nodebgheight ? nodebgheight.getBoundingClientRect().height : 0;


        // Centralized dimensions
        // const totalRows = 7;
        // const totalColumns = 11;
        const groupWidth = nodebgwidths;
        const groupHeight = nodebgheights;
        const childWidth = groupWidth * 0.9;
        const childHeight = groupHeight * 0.9;

        const parsedNodes = data.nodes.map((node) => {
          const parsedData = JSON.parse(node.data || "{}");
          const parsedPosition = JSON.parse(node.position || "{\"x\":0,\"y\":0}");
          const parsedMeasured = JSON.parse(node.measured || "{\"width\":40,\"height\":40}");
          
          let centeredPosition = parsedPosition;

          // Parent node positioning
          const nodeStyle =
            node.type === "Yes" || node.type === "No" || node.type === "FreeText"
              ? {} // No styles applied for these node types
              : {
                width: groupWidth,
                height: groupHeight,
                childWidth: childWidth,
                childHeight: childHeight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              };

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
            position: centeredPosition,
            draggable: Boolean(node.draggable),
            animated: Boolean(node.animated),
            style: nodeStyle,
            
          };
          
        });
        
        const parsedEdges = data.edges.map((edge) => ({
                  ...edge,
                  animated: Boolean(edge.animated),
                  markerEnd: { type: MarkerType.ArrowClosed, color: "#002060", width: 12, height: 12 },
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

  const navigateOnDraft = () => {
    const updatedBreadcrumbs = breadcrumbs.map((crumb, index) => {
      if (index === 0) return crumb;

      return {
        ...crumb,
        path: crumb.path.replace("published-map-level", "Draft-Process-View")
      };
    });
    setBreadcrumbs(updatedBreadcrumbs);

    if (id && user) {
      navigate(`/Draft-Swim-lanes-View/level/${currentLevel}/${currentParentId}`, { state: { id: id, title: title, user: user, parentId: currentParentId, level: currentLevel } })
      // removeBreadcrumbsAfter(0);
    } else {
      alert("Currently not navigate on draft mode")
    }

  }

  return (
    <div>
      <Header
        title={headerTitle}
        onSave={navigateOnDraft}
        onPublish={() => console.log("save publish")}
        addNode={() => console.log("add node")}
        handleBackdata={() => console.log("handle back")}
        iconNames={iconNames}
        currentLevel={currentLevel}
        getPublishedDate={getPublishedDate}
        setIsNavigating={() => removeBreadcrumbsAfter(currentLevel - 1)}
        Page={"Published"}
        isFavorite={isFavorite}
        Process_img={process_img}
        Procesuser={user}
      />
      <div style={{ ...styles.appContainer, height: remainingHeight }}>
        <ReactFlowProvider>
          <div className="ss_publish_border" style={styles.scrollableWrapper}>
            <ReactFlow
              nodes={[...nodes, ...ChildNodes]}
              edges={edges}
              connectionLineType={ConnectionLineType.Step} // ✅ Correct Arrow Type
                            connectionLineStyle={{ stroke: "#002060", strokeWidth: 2.5 }} // ✅ Correct Arrow Style
                            connectionRadius={10}
                            connectionMode={ConnectionMode.Loose}
              proOptions={{ hideAttribution: true }}
              nodeTypes={memoizedNodeTypes}
              edgeTypes={memoizedEdgeTypes}
              minZoom={0}
              zoomOnScroll={false}
              zoomOnPinch={false}
              panOnDrag={false}
              panOnScroll={false}
              zoomOnDoubleClick={false}
              maxZoom={1}
              translateExtent={[
                [0, 0],
                [windowSize.width, windowSize.height],
              ]}
              defaultEdgeOptions={{ zIndex: 1 }}
              style={styles.rfStyle}
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
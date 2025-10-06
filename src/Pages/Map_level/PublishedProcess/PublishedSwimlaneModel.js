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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api, { addFavProcess, removeFavProcess } from "../../../API/api";
import generateNodesAndEdges from "../../../AllNode/SwimlineNodes/generateNodesAndEdges";
import styles from "../SwimlaneStyles";
import PublishNodeType from "./PublishNodeType";
import { BreadcrumbsContext } from "../../../context/BreadcrumbsContext";
import '../../../Css/Swimlane.css'
import { useSelector } from "react-redux";
import VersionPopupView from "../../../components/VersionPopupView";
import { useDynamicHeight } from "../../../hooks/useDynamicHeight";
import useCheckFavorite from "../../../hooks/useCheckFavorite";
import { usePageGroupIdViewer } from "../../../hooks/usePageGroupIdViewer";


const PublishedSwimlaneModel = () => {
  const { height, appHeaderHeight, remainingHeight } = useDynamicHeight();
  const [windowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { level, parentId, processId } = useParams();
  // const location = useLocation();
  const [showVersionPopup, setShowVersionPopup] = useState(false);
  const [title, Settitle] = useState("");
  // const [ParentPageGroupId, SetParentPageGroupId] = useState(null);
  const [user, setUser] = useState(null);
  // const user = useMemo(() => {
  //   try {
  //     const queryParams = new URLSearchParams(location.search);
  //     const userParam = queryParams.get("user");
  //     return userParam ? JSON.parse(decodeURIComponent(userParam)) : null;
  //   } catch (e) {
  //     console.error("Failed to parse user from query", e);
  //     return null;
  //   }
  // }, [location.search]);


  const id = processId; // string

  const headerTitle = `${title} `;
  const currentParentId = parentId || null;
  const currentLevel = level ? parseInt(level, 10) : 0;
  const { nodes: initialNodes } = useMemo(
    () => generateNodesAndEdges(windowSize.width, windowSize.height, 'viewmode', height + 10, appHeaderHeight, remainingHeight),
    [windowSize, height, appHeaderHeight, remainingHeight]
  );
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  const [process_img, setprocess_img] = useState("");
  // const [process_udid, setprocess_udid] = useState("");

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

  useCheckFavorite({
    id,
    childNodes: ChildNodes,
    setIsFavorite,
  });
  useEffect(() => {

    const fetchNodes = async () => {
      try {
        const levelParam =
          currentParentId !== null
            ? `Level${currentLevel}_${currentParentId}`
            : `Level${currentLevel}`;
        const user_id = LoginUser ? LoginUser.id : null;
        const Process_id = id ? id : null;
        const publishedStatus = "Published";

        const data = await api.getPublishedNodes(
          levelParam,
          parseInt(user_id),
          Process_id,
          currentParentId
        );
          if (data && data.user_id) {
          // Construct user object based on backend logic
          setUser({
            id: data.actual_user_id,
            type: data.type || "self",
            role: data.role || "self",
             OwnId: data.user_id,
            actual_user_id: data.actual_user_id,
          });
        }
          const PageGroupId = data.nodes?.[0]?.PageGroupId;
        const getPublishedDate = await api.GetPublishedDate(
          Process_id,
          publishedStatus,
          PageGroupId
        );

        setgetPublishedDate(getPublishedDate.status ? getPublishedDate.updated_at : "");
        setprocess_img(data.process_img);
        // setprocess_udid(data.process_uid)
      Settitle(data.title)
// SetParentPageGroupId(data.PageGroupId)
        const nodebgwidth = document.querySelector(".react-flow__node");
        const nodebgwidths = nodebgwidth ? nodebgwidth.getBoundingClientRect().width : 0;

        const nodebgheight = document.querySelector(".react-flow__node");
        const nodebgheights = nodebgheight ? nodebgheight.getBoundingClientRect().height : 0;

        const groupWidth = nodebgwidths;
        const groupHeight = nodebgheights;
        const childWidth = groupWidth * 0.9;
        const childHeight = groupHeight * 0.9;

        const parsedNodes = data.nodes.filter((node) => node.type !== "StickyNote").map((node) => {
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

        const parsedEdges = data.edges.map((edge) => {
          const sourceNode = data.nodes.find((node) => node.node_id === edge.source);
          const targetNode = data.nodes.find((node) => node.node_id === edge.target);

          const sourcePosition = sourceNode ? JSON.parse(sourceNode.position || '{"x":0,"y":0}') : { x: 0, y: 0 };
          const targetPosition = targetNode ? JSON.parse(targetNode.position || '{"x":0,"y":0}') : { x: 0, y: 0 };

          // Check if in same row or same column
          const isSameRow = Math.abs(sourcePosition.y - targetPosition.y) < 10; // 10px tolerance
          const isSameColumn = Math.abs(sourcePosition.x - targetPosition.x) < 10;

          const edgeType = (isSameRow || isSameColumn) ? "default" : "step";

          return {
            ...edge,
            animated: Boolean(edge.animated),
            markerEnd: { type: MarkerType.ArrowClosed, color: "#002060", width: 12, height: 12 },
            style: { stroke: "#002060", strokeWidth: 2 },
            type: edgeType,
          };
        });
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
      // navigate(`/Draft-Swim-lanes-View/level/${currentLevel}/${currentParentId}`, { state: { id: id, title: title, user: user, parentId: currentParentId, level: currentLevel,ParentPageGroupId } })
      navigate(`/Draft-Swim-lanes-View/level/${currentLevel}/${currentParentId}/${id}`)

      // removeBreadcrumbsAfter(0);
    } else {
      alert("Currently not navigate on draft mode")
    }

  }

  const navigateToVersion = (process_id, level, version) => {
    const encodedTitle = encodeURIComponent("swimlane");
    navigate(`/Swimlane-Version/${process_id}/${level}/${version}/${encodedTitle}`);
  };


  const handleVersionClick = () => {
    setShowVersionPopup(true);
  };

  const handleFav = async () => {
    const user_id = LoginUser ? LoginUser.id : null;
    const process_id = id ? id : null;
    const type = user ? user.type : null;

    if (!user_id || !process_id || !type) {
      console.error("Missing required fields:", { user_id, process_id, type });
      return;
    }

    const PageGroupId = ChildNodes[0]?.PageGroupId;


    try {
      if (isFavorite) {

        const response = await removeFavProcess(user_id, process_id, PageGroupId);
        setIsFavorite(false);
        console.log("Removed from favorites:", response);
      } else {
        const response = await addFavProcess(user_id, process_id, type, PageGroupId, currentParentId);
        setIsFavorite(true);
        console.log("Added to favorites:", response);
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
    }
  };


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
        Page={"ViewPublishswimlane"}
        isFavorite={isFavorite}
        Process_img={process_img}
        Procesuser={user}
        onShowVersion={handleVersionClick}

        savefav={handleFav}

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
            {usePageGroupIdViewer(ChildNodes)}

          </div>

          {/* {showSharePopup && (
            <SharePopup
              processId={id}
              processName={`${headerTitle}`}
              onClose={() => setShowSharePopup(false)}
            />
          )} */}


          {showVersionPopup && (
            <VersionPopupView
              processId={id}
              currentLevel={currentLevel}
              onClose={() => setShowVersionPopup(false)}
              currentParentId={currentParentId}
              viewVersion={navigateToVersion}
              LoginUser={LoginUser}
              title={headerTitle}
              status={"Published"}

            />
          )}
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default PublishedSwimlaneModel;
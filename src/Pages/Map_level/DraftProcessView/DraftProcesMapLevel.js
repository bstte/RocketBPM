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
import api, { addFavProcess, removeFavProcess } from "../../../API/api";
import { BreadcrumbsContext } from "../../../context/BreadcrumbsContext";
import PublishArrowBoxNode from "../../../AllNode/PublishAllNode/PublishArrowBoxNode";
import PublishPentagonNode from "../../../AllNode/PublishAllNode/PublishPentagonNode";
import { useSelector } from "react-redux";
import apiExports from "../../../API/api";
import StickyNote from "../../../AllNode/StickyNote";
import VersionPopupView from "../../../components/VersionPopupView";
import { useDynamicHeight } from "../../../hooks/useDynamicHeight";
import useCheckFavorite from "../../../hooks/useCheckFavorite";
import { usePageGroupIdViewer } from "../../../hooks/usePageGroupIdViewer";

const DraftProcesMapLevel = () => {
  const [totalHeight, setTotalHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [process_img, setprocess_img] = useState("");
  const [process_udid, setprocess_udid] = useState("");
  const [showVersionPopup, setShowVersionPopup] = useState(false);

  const [checkpublish, Setcheckpublish] = useState();
  // const [showSharePopup, setShowSharePopup] = useState(false);

  const windowSize = {
    width: window.innerWidth - 300,
    height: window.innerHeight - 300,
  };

  const { remainingHeight } = useDynamicHeight();

  useEffect(() => {
    const calculateHeight = () => {
      const breadcrumbsElement = document.querySelector(
        ".breadcrumbs-container"
      );
      const appHeaderElement = document.querySelector(".app-header");

      if (breadcrumbsElement && appHeaderElement) {
        const combinedHeight =
          breadcrumbsElement.offsetHeight + appHeaderElement.offsetHeight + 100;
        setTotalHeight(combinedHeight);
      }
    };
    calculateHeight();
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      calculateHeight();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigate = useNavigate();
  const { level, parentId, processId } = useParams();
  // const location = useLocation();
  const LoginUser = useSelector((state) => state.user.user);
  const [title, Settitle] = useState("");
  const [user, setUser] = useState(null);

  const id = processId; // string
  const currentLevel = level ? parseInt(level, 10) : 0;
  const currentParentId = parentId || null;
  const { addBreadcrumb, removeBreadcrumbsAfter, breadcrumbs, setBreadcrumbs } =
    useContext(BreadcrumbsContext);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [headerTitle, setHeaderTitle] = useState(`${title} `);
  const [getPublishedDate, setgetPublishedDate] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [processDefaultlanguage_id, setprocessDefaultlanguage_id] =
    useState(null);
  const [supportedLanguages, setSupportedLanguages] = useState([]);

  const [isNavigating, setIsNavigating] = useState(false);
  const memoizedNodeTypes = useMemo(
    () => ({
      progressArrow: PublishArrowBoxNode,
      pentagon: PublishPentagonNode,
      StickyNote: StickyNote,
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

  const checkPublishData = useCallback(
    async (processId) => {
      const levelParam =
        currentParentId !== null
          ? `Level${currentLevel}_${currentParentId}`
          : `Level${currentLevel}`;
      const Process_id = processId ? processId : null;
      const data = await apiExports.checkPublishRecord(levelParam, Process_id);

      return data;
    },
    [user, currentLevel, currentParentId]
  );

  useEffect(() => {
    const checkpublishfunction = async () => {
      const processId = id ? id : null;

      const data = await checkPublishData(processId);

      Setcheckpublish(data?.status);
    };

    checkpublishfunction();
  }, [checkPublishData, id]);

  useEffect(() => {
    fetchNodes();
  }, [
    currentLevel,
    handleLabelChange,
    setNodes,
    setEdges,
    currentParentId,
    id,
  ]);

  const fetchNodes = async (language_id = null) => {
    try {
      const levelParam =
        currentParentId !== null
          ? `Level${currentLevel}_${currentParentId}`
          : `Level${currentLevel}`;
      const user_id = LoginUser ? LoginUser.id : null;

      const Process_id = id ? id : null;
      const draftStatus = "Draft";

      const data = await api.getNodes(
        levelParam,
        parseInt(user_id),
        Process_id,
        currentParentId,
        language_id
      );
console.log("data",data)
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
        draftStatus,
        PageGroupId
      );

      
  
      if (getPublishedDate.status === true) {
        setgetPublishedDate(getPublishedDate.updated_at);
      } else {
        setgetPublishedDate("");
      }
      setprocessDefaultlanguage_id(data.processDefaultlanguage_id);
      setSupportedLanguages(data.ProcessSupportLanguage);
      setprocess_img(data.process_img);
      setprocess_udid(data.process_uid);
      Settitle(data.title);
      const parsedNodes = await Promise.all(
        data.nodes.map(async (node) => {
          const parsedData = JSON.parse(node.data);
          const parsedPosition = JSON.parse(node.position);
          const parsedMeasured = JSON.parse(node.measured);
          const newLevel = currentLevel + 1;
          const levelParam =
            node.node_id !== null
              ? `Level${newLevel}_${node.node_id}`
              : `Level${currentLevel}`;
          const Process_id = id ? id : null;
          let hasNextLevel = false;
          try {
            const check = await api.checkRecord(levelParam, Process_id);

            hasNextLevel = check?.status === true;
          } catch (e) {
            console.error("checkRecord error", e);
          }
          return {
            ...node,
            data: {
              ...parsedData,
              onLabelChange: (newLabel) =>
                handleLabelChange(node.node_id, newLabel),

              width_height: parsedMeasured,
              autoFocus: true,
              node_id: node.node_id,
              nodeResize: true,
              LinkToStatus: node.LinkToStatus,
              hasNextLevel,
            },
            type: node.type,
            id: node.node_id,

            measured: parsedMeasured,
            position: parsedPosition,
            draggable: false,
            animated: false,
          };
        })
      );
      const parsedEdges = data.edges.map((edge) => ({
        ...edge,
        animated: Boolean(edge.animated),
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: "#002060", strokeWidth: 2 },
        type: "step",
      }));
      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } catch (error) {
      console.error("Error fetching nodes:", error);
      alert("Failed to fetch nodes. Please try again.");
    }
  };

  const handleSupportViewlangugeId = (langId) => {
    fetchNodes(langId);
  };
  useCheckFavorite({
    id,
    nodes,
    setIsFavorite,
  });
  useEffect(() => {
    if (!title) return; // Wait until title is available

    const label = currentLevel === 0 ? title : title;
    const path =
      currentLevel === 0
        ? `/Draft-Process-View/${id}`
        : `/Draft-Process-View/${currentLevel}/${currentParentId}/${id}`;

    const state = { id, title };

    // ✅ Prevent duplicate breadcrumb (important)
    const exists = breadcrumbs.some((b) => b.path === path);
    if (!exists) {
      if (currentLevel >= 0 && isNavigating) {
        const safeIndex = Math.max(1, currentLevel - 1);
        removeBreadcrumbsAfter(safeIndex);
      }

      addBreadcrumb(label, path, state);
    }
    setIsNavigating(false);
  }, [
    currentLevel,
    isNavigating,
    currentParentId,
    addBreadcrumb,
    removeBreadcrumbsAfter,
    id,
    title,
    breadcrumbs, // ✅ include breadcrumbs here
  ]);

  useEffect(() => {
    const stateTitle = title;
    setHeaderTitle(`${stateTitle}`);
  }, [currentLevel, title]);

  const handlenodeClick = async (event, node) => {
    if (node?.type === "StickyNote") {
      return;
    }
    event.preventDefault();
    const selectedLabel = node.data.label || "";
    // const PageGroupId = node.PageGroupId;
    const newLevel = currentLevel + 1;
    const levelParam =
      node.id !== null ? `Level${newLevel}_${node.id}` : `Level${currentLevel}`;
    const Process_id = id ? id : null;
    const data = await api.checkRecord(levelParam, Process_id);

    if (data.status === true) {
      if (data.Page_Title === "ProcessMap") {
        navigate(`/Draft-Process-View/${newLevel}/${node.id}/${id}`);
      }

      if (data.Page_Title === "Swimlane") {
        addBreadcrumb(
          `${selectedLabel} `,
          `/Draft-Swim-lanes-View/level/${newLevel}/${node.id}/${id}`
        );
        navigate(`/Draft-Swim-lanes-View/level/${newLevel}/${node.id}/${id}`);
      }
    } else {
      alert("Next level not exist");
    }
  };

  const onConnect = useCallback((connection) => {
    console.log("Connected:", connection);
  }, []);

  const iconNames = {};

  const navigateOnDraft = (page) => {
    const updatedBreadcrumbs = breadcrumbs.map((crumb, index) => {
      if (index === 0) return crumb; // First breadcrumb remains unchanged

      return {
        ...crumb,
        path:
          page === "editdraft"
            ? crumb.path
                .replace("published-map-level", "Draft-Process-View")
                .replace("Map-level", "Draft-Process-View")
            : crumb.path
                .replace("Draft-Process-View", "published-map-level")
                .replace("Draft-Process-View", "Map-level"),
      };
    });

    setBreadcrumbs(updatedBreadcrumbs);
    if (id && user) {
      if (currentLevel === 0) {
        page === "editdraft"
          ? navigate(`/map-level/${id}`)
          : navigate(`/published-map-level/${id}`);
      } else {
        page === "editdraft"
          ? navigate(`/level/${currentLevel}/${currentParentId}/${id}`)
          : navigate(
              `/published-map-level/${currentLevel}/${currentParentId}/${id}`
            );
      }
    } else {
      alert("Currently not navigate on draft mode");
    }
  };

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

    const PageGroupId = nodes[0]?.PageGroupId;

    try {
      if (isFavorite) {
        const response = await removeFavProcess(
          user_id,
          process_id,
          PageGroupId
        );
        setIsFavorite(false);
        console.log("Removed from favorites:", response);
      } else {
        const response = await addFavProcess(
          user_id,
          process_id,
          type,
          PageGroupId,
          currentParentId
        );
        setIsFavorite(true);
        console.log("Added to favorites:", response);
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
    }
  };
  const navigateToVersion = (process_id, level, version) => {
     const user_id = LoginUser ? LoginUser.id : null;
    const encodedTitle = encodeURIComponent("ProcessMap");
    navigate(
      `/Draft-Process-Version/${process_id}/${level}/${version}/${encodedTitle}/${user_id}`
    );
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
        getDraftedDate={getPublishedDate}
        setIsNavigating={setIsNavigating}
        Page={"ViewDraftmodel"}
        isFavorite={isFavorite}
        Process_img={process_img}
        Procesuser={user || { id: null, role: "self", type: "self" }}
        checkpublish={checkpublish}
        onShowVersion={handleVersionClick}
        savefav={handleFav}
        handleSupportViewlangugeId={handleSupportViewlangugeId}
        supportedLanguages={supportedLanguages}
        selectedLanguage={processDefaultlanguage_id}
      />
      <ReactFlowProvider>
        <div
          className="app-container"
          style={{ ...styles.appContainer, height: remainingHeight }}
        >
          <div className="content-wrapper" style={styles.contentWrapper}>
            <div className="flow-container" style={styles.flowContainer}>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-35deg)", // Center + Diagonal tilt
                  fontSize: "144px", // Bigger for watermark effect
                  fontWeight: "bold",
                  color: "#ff364a0f", // 10% opacity for watermark style
                  fontFamily: "'Poppins', sans-serif",
                  zIndex: 0,
                  pointerEvents: "none",
                  whiteSpace: "nowrap",
                  textTransform: "uppercase", // Optional: for all caps
                  letterSpacing: "4px", // Optional: wider spacing
                }}
              >
                Draft
              </div>

              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handlenodeClick}
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
          {usePageGroupIdViewer(nodes)}
        </div>
        {showVersionPopup && (
          <VersionPopupView
            processId={id}
            currentLevel={currentLevel}
            onClose={() => setShowVersionPopup(false)}
            currentParentId={currentParentId}
            viewVersion={navigateToVersion}
            LoginUser={LoginUser}
            title={headerTitle}
            status={"draft"}
            type={"ProcessMaps"}
          />
        )}

      </ReactFlowProvider>
    </div>
  );
};

export default DraftProcesMapLevel;

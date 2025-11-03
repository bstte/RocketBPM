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
import VersionPopupView from "../../../components/VersionPopupView";
import useCheckFavorite from "../../../hooks/useCheckFavorite";
import { usePageGroupIdViewer } from "../../../hooks/usePageGroupIdViewer";
import { useLangMap } from "../../../hooks/useLangMap";

const PublishedMapLevel = () => {
  const [totalHeight, setTotalHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const windowSize = {
    width: window.innerWidth - 300,
    height: window.innerHeight - 300,
  };
 const langMap = useLangMap();
  const [remainingHeight, setRemainingHeight] = useState(0);

  const LoginUser = useSelector((state) => state.user.user);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const calculateHeight = () => {
      const breadcrumbsElement = document.querySelector(
        ".breadcrumbs-container"
      );
      const appHeaderElement = document.querySelector(".app-header");

      const element = document.querySelector(".ss_new_hed");
      const element2 = document.querySelector(".app-header");

      const elementHeight = element
        ? element.getBoundingClientRect().height
        : 0;
      const appHeaderHeight = element2
        ? element2.getBoundingClientRect().height
        : 0;

      const newHeight = window.innerHeight - (elementHeight + appHeaderHeight);
      setRemainingHeight(newHeight - 33);

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
  const [showVersionPopup, setShowVersionPopup] = useState(false);
  const [title, Settitle] = useState("");
  // const [ParentPageGroupId, SetParentPageGroupId] = useState(null);
  const [user, setUser] = useState(null);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const id = processId;
 const [processDefaultlanguage_id, setprocessDefaultlanguage_id] =
    useState(null);
    
  const currentLevel = level ? parseInt(level, 10) : 0;
  const currentParentId = parentId || null;
  const { addBreadcrumb, removeBreadcrumbsAfter, breadcrumbs, setBreadcrumbs } =
    useContext(BreadcrumbsContext);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [headerTitle, setHeaderTitle] = useState(`${title} `);
  const [getPublishedDate, setgetPublishedDate] = useState("");
  const [process_img, setprocess_img] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

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
    

    fetchNodes();
  }, [
    currentLevel,
    handleLabelChange,
    setNodes,
    setEdges,
    currentParentId,
    id,
  ]);

  const fetchNodes = async (language_id =null) => {
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
          currentParentId,
          language_id
        );

        // ✅ Set user from backend response
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
        if (getPublishedDate.status === true) {
          setgetPublishedDate(getPublishedDate.updated_at);
        } else {
          setgetPublishedDate("");
        }
        Settitle(data.title);
  setprocessDefaultlanguage_id(data.processDefaultlanguage_id);
          setSupportedLanguages(data.ProcessSupportLanguage);
        setprocess_img(data.process_img);
        const parsedNodes = await Promise.all(
          data.nodes
            .filter((node) => node.type !== "StickyNote")
            .map(async (node) => {
              const parsedData = JSON.parse(node.data);
              const parsedPosition = JSON.parse(node.position);
              const parsedMeasured = JSON.parse(node.measured);

              // 👇 Next Level check
              const newLevel = currentLevel + 1;
              const levelParam =
                node.node_id !== null
                  ? `Level${newLevel}_${node.node_id}`
                  : `Level${currentLevel}`;
              const Process_id = id ? id : null;
            
              let hasNextLevel = false;
              try {
                const check = await api.checkPublishRecord(
                  levelParam,
                  Process_id
                );
                hasNextLevel = check?.status === true;
              } catch (err) {
                console.error("checkPublishRecord error:", err);
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

    
  const handleSupportViewlangugeId=(langId)=>{
     fetchNodes(langId);
  }
  useCheckFavorite({
    id,
    nodes,
    setIsFavorite,
  });
  const currentPath = window.location.pathname
  useEffect(() => {
  if (!title) return;

  const label = currentLevel === 0 ? title : title;
    const state = { id, title, currentPath };

  const path =
    currentLevel === 0
      ? `/published-map-level/${id}`
      : `/published-map-level/${currentLevel}/${currentParentId}/${id}`;

  const exists = breadcrumbs.some((b) => b.path === path);
  if (!exists) {
    
    if (currentLevel >= 0 && isNavigating) {
      const safeIndex = Math.max(1, currentLevel - 1);
      removeBreadcrumbsAfter(safeIndex);
    }
    addBreadcrumb(label, path,state);
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
  breadcrumbs, // ✅ include this
]);


  const handlenodeClick = async (event, node) => {
    console.log("data",node)
    event.preventDefault();
    const selectedLabel = node.data.label || "";
    const newLevel = currentLevel + 1;
    const levelParam =
      node.id !== null ? `Level${newLevel}_${node.id}` : `Level${currentLevel}`;
    const Process_id = id ? id : null;
    const data = await api.checkPublishRecord(
      levelParam,
      Process_id
    );

    
    if (data.status === true) {
      if (data.Page_Title === "ProcessMap") {
        navigate(
          `/published-map-level/${newLevel}/${
            node.id
          }/${id}`
        );
      }
      const state = { id, selectedLabel, currentPath };
      if (data.Page_Title === "Swimlane") {
        addBreadcrumb(
          `${selectedLabel} `,
          `/published-swimlane/level/${newLevel}/${
            node.id
          }/${id}`,state
        );

        navigate(
          `/published-swimlane/level/${newLevel}/${
            node.id
          }/${id}`
        );
      }
    } else {
      alert("Next level not Published");
    }
  };

  const onConnect = useCallback((connection) => {
    console.log("Connected:", connection);
  }, []);

  useEffect(() => {
    const stateTitle = title;
    setHeaderTitle(`${stateTitle}`);
  }, [currentLevel, title]);

  const iconNames = {};
  const navigateOnDraft = () => {
    const updatedBreadcrumbs = breadcrumbs.map((crumb, index) => {
      if (index === 0) return crumb; // First breadcrumb ko as it is rakhna

      return {
        ...crumb,
        path: crumb.path.replace("published-map-level", "Draft-Process-View"),
      };
    });
    setBreadcrumbs(updatedBreadcrumbs);
    if (id && user) {
      if (currentLevel === 0) {
        navigate(
          `/Draft-Process-View/${id}`
        );
      } else {
        navigate(
          `/Draft-Process-View/${currentLevel}/${currentParentId}/${id}`
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

  // ye commom page h
  const navigateToVersion = (process_id, level, version) => {
     const user_id = LoginUser ? LoginUser.id : null;
    const encodedTitle = encodeURIComponent("ProcessMap");
    navigate(
      `/Draft-Process-Version/${process_id}/${level}/${version}/${encodedTitle}/${user_id}`
    );
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
        // console.log("Removed from favorites:", response);
      } else {
        const response = await addFavProcess(
          user_id,
          process_id,
          type,
          PageGroupId,
          currentParentId
        );
        setIsFavorite(true);
        // console.log("Added to favorites:", response);
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
        setIsNavigating={setIsNavigating}
        Page={"Published"}
        isFavorite={isFavorite}
        Process_img={process_img}
        Procesuser={user}
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
                zoomOnScroll={false}
                zoomOnPinch={false}
                fitView
                translateExtent={[
                  [1240, 410],
                  [windowSize.width, windowSize.height],
                ]}
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
            status={"Published"}
            type={"ProcessMaps"}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default PublishedMapLevel;

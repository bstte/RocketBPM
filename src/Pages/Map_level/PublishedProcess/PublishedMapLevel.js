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
import api, { addFavProcess, checkFavProcess, removeFavProcess } from "../../../API/api";
import { BreadcrumbsContext } from "../../../context/BreadcrumbsContext";
import PublishArrowBoxNode from "../../../AllNode/PublishAllNode/PublishArrowBoxNode";
import PublishPentagonNode from "../../../AllNode/PublishAllNode/PublishPentagonNode";
import { useSelector } from "react-redux";
import SharePopup from "../../../components/SharePopup";
import VersionPopupView from "../../../components/VersionPopupView";
import useCheckFavorite from "../../../hooks/useCheckFavorite";
import { usePageGroupIdViewer } from "../../../hooks/usePageGroupIdViewer";

const PublishedMapLevel = () => {

  const [totalHeight, setTotalHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const windowSize = {
    width: window.innerWidth - 300,
    height: window.innerHeight - 300,
  };

  const [remainingHeight, setRemainingHeight] = useState(0);

  const LoginUser = useSelector((state) => state.user.user);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const calculateHeight = () => {
      const breadcrumbsElement = document.querySelector(".breadcrumbs-container");
      const appHeaderElement = document.querySelector(".app-header");

      const element = document.querySelector(".ss_new_hed");
      const element2 = document.querySelector(".app-header");

      const elementHeight = element ? element.getBoundingClientRect().height : 0;
      const appHeaderHeight = element2 ? element2.getBoundingClientRect().height : 0;

      const newHeight = window.innerHeight - (elementHeight + appHeaderHeight);
      setRemainingHeight(newHeight - 40);

      if (breadcrumbsElement && appHeaderElement) {
        const combinedHeight = breadcrumbsElement.offsetHeight + appHeaderElement.offsetHeight + 100;
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
  const location = useLocation();
  // const {  ParentPageGroupId } = location.state || {};
  const [showVersionPopup, setShowVersionPopup] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title");
  const ParentPageGroupId = queryParams.get("ParentPageGroupId");
  const user = useMemo(() => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const userParam = queryParams.get("user");
      return userParam ? JSON.parse(decodeURIComponent(userParam)) : null;
    } catch (e) {
      console.error("Failed to parse user from query", e);
      return null;
    }
  }, [location.search]);


  const id = processId; // string

  const currentLevel = level ? parseInt(level, 10) : 0;
  const currentParentId = parentId || null;
  const { addBreadcrumb, removeBreadcrumbsAfter, breadcrumbs, setBreadcrumbs } =
    useContext(BreadcrumbsContext);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [headerTitle, setHeaderTitle] = useState(`${title} `);
  const [getPublishedDate, setgetPublishedDate] = useState("");
  const [process_img, setprocess_img] = useState("");
  // const [process_udid, setprocess_udid] = useState("");

  const [isNavigating, setIsNavigating] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

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
        if (getPublishedDate.status === true) {
          setgetPublishedDate(getPublishedDate.created_at);
        } else {
          setgetPublishedDate("");
        }
        console.log("publish data", data)
        setprocess_img(data.process_img)
        // setprocess_udid(data.process_uid)
        const parsedNodes = data.nodes.filter((node) => node.type !== "StickyNote").map((node) => {
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
              node_id: node.node_id,
              nodeResize: true,
              LinkToStatus: node.LinkToStatus,

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
          style: { stroke: "#002060", strokeWidth: 2 },
          type: "step",
        }));
        console.log("published process map ,", parsedNodes)

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

  useCheckFavorite({
    id,
    nodes,
    setIsFavorite,
  });

  useEffect(() => {
    const label = currentLevel === 0 ? title : title;
    const path =
      // currentLevel === 0
      //   ? "/published-map-level"
      //   : `/published-map-level/${currentLevel}/${currentParentId}`;


      currentLevel === 0
        ? `/published-map-level/${id}?title=${encodeURIComponent(title)}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${ParentPageGroupId}`
        : `/published-map-level/${currentLevel}/${currentParentId}/${id}?title=${encodeURIComponent(title)}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${ParentPageGroupId}`;

    const state = {
      id: id,
      title: title,
      user: user,
    };

    if (currentLevel >= 0 && isNavigating) {
      // Ensure the 0th breadcrumb is not removed
      const safeIndex = Math.max(1, currentLevel - 1);
      removeBreadcrumbsAfter(safeIndex);
    }

    addBreadcrumb(label, path, state);

    setIsNavigating(false);
  }, [
    currentLevel,
    isNavigating,
    currentParentId,
    ParentPageGroupId,
    addBreadcrumb,
    removeBreadcrumbsAfter,
    id,
    title,
    user,
  ]);

  const handlenodeClick = async (event, node) => {
    event.preventDefault();
    const selectedLabel = node.data.label || "";
    const PageGroupId = nodes[0]?.PageGroupId;
    const newLevel = currentLevel + 1;
    console.log("newLevel", newLevel)
    const levelParam =
      node.id !== null
        ? `Level${newLevel}_${node.id}`
        : `Level${currentLevel}`;
    const user_id = user ? user.id : null;
    const Process_id = id ? id : null;
    const data = await api.checkPublishRecord(
      levelParam,
      parseInt(user_id),
      Process_id
    );

    if (data.status === true) {
      if (data.Page_Title === "ProcessMap") {
        // navigate(`/published-map-level/${newLevel}/${node.id}`, {
        //   state: {
        //     id: id,
        //     title: selectedLabel,
        //     user,
        //     ParentPageGroupId: PageGroupId,
        //   },
        // });
        navigate(`/published-map-level/${newLevel}/${node.id}/${id}?title=${encodeURIComponent(selectedLabel)}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${PageGroupId}`)

      }

      if (data.Page_Title === "Swimlane") {
        addBreadcrumb(
          `${selectedLabel} `,
          `/published-swimlane/level/${newLevel}/${node.id}/${id}?title=${encodeURIComponent(selectedLabel)}&user=${encodeURIComponent(JSON.stringify(user))}&parentId=${node.id}&level=${newLevel}&ParentPageGroupId=${PageGroupId}`

        );

        navigate(
          `/published-swimlane/level/${newLevel}/${node.id}/${id}?title=${encodeURIComponent(selectedLabel)}&user=${encodeURIComponent(JSON.stringify(user))}&parentId=${node.id}&level=${newLevel}&ParentPageGroupId=${PageGroupId}`
        );
      }
    } else {
      alert("Next level not Published")
    }

  }


  const onConnect = useCallback((connection) => {
    // Your callback logic here
    console.log("Connected:", connection);
  }, []);

  useEffect(() => {
    const stateTitle = location.state?.title || title;
    setHeaderTitle(`${stateTitle}`);
  }, [location.state, currentLevel, title]);


  const iconNames = {};
  const navigateOnDraft = () => {


    const updatedBreadcrumbs = breadcrumbs.map((crumb, index) => {
      if (index === 0) return crumb; // First breadcrumb ko as it is rakhna

      return {
        ...crumb,
        path: crumb.path.replace("published-map-level", "Draft-Process-View")
      };
    });
    setBreadcrumbs(updatedBreadcrumbs);

    if (id && user) {
      if (currentLevel === 0) {
        // navigate('/Draft-Process-View',{ state: { id:id, title:title, user: user,ParentPageGroupId } })
        navigate(
          `/Draft-Process-View/${id}?title=${title}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${ParentPageGroupId}`
        );


      } else {
        //  navigate(`/Draft-Process-View/${currentLevel}/${currentParentId}`,{ state: { id:id, title:title, user: user,ParentPageGroupId } })
        navigate(`/Draft-Process-View/${currentLevel}/${currentParentId}/${id}?title=${encodeURIComponent(title)}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${ParentPageGroupId}`)
      }

    } else {
      alert("Currently not navigate on draft mode")
    }

  }


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
    const encodedTitle = encodeURIComponent("ProcessMap");
    navigate(`/Draft-Process-Version/${process_id}/${level}/${version}/${encodedTitle}`);
  };


  const handleShareClick = () => {
    setShowSharePopup(true);
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
        setIsNavigating={setIsNavigating}
        Page={"Published"}
        isFavorite={isFavorite}
        Process_img={process_img}
        Procesuser={user}
        onShare={() => handleShareClick()}
        onShowVersion={handleVersionClick}
        savefav={handleFav}

      />
      <ReactFlowProvider>
        <div className="app-container" style={{ ...styles.appContainer, height: remainingHeight }}>
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

        {showSharePopup && (
          <SharePopup
            processId={id}
            processName={`${headerTitle}`}
            onClose={() => setShowSharePopup(false)}
          />
        )}


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

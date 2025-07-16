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
import api, { checkFavProcess } from "../../../API/api";
import { BreadcrumbsContext } from "../../../context/BreadcrumbsContext";
import PublishArrowBoxNode from "../../../AllNode/PublishAllNode/PublishArrowBoxNode";
import PublishPentagonNode from "../../../AllNode/PublishAllNode/PublishPentagonNode";
import { useSelector } from "react-redux";
import apiExports from "../../../API/api";
import StickyNote from "../../../AllNode/StickyNote";
import SharePopup from "../../../components/SharePopup";
import VersionPopupView from "../../../components/VersionPopupView";

const DraftProcesMapLevel = () => {

  const [totalHeight, setTotalHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [process_img, setprocess_img] = useState("");
  const [process_udid, setprocess_udid] = useState("");
  const [showVersionPopup, setShowVersionPopup] = useState(false);

  const [checkpublish, Setcheckpublish] = useState()
 const [showSharePopup, setShowSharePopup] = useState(false);

  const windowSize = {
    width: window.innerWidth - 300,
    height: window.innerHeight - 300,
  };

  const [remainingHeight, setRemainingHeight] = useState(0);


  useEffect(() => {
    const calculateHeights = () => {
      const element = document.querySelector(".ss_new_hed");
      const element2 = document.querySelector(".app-header");

      const elementHeight = element ? element.getBoundingClientRect().height : 0;
      const appHeaderHeight = element2 ? element2.getBoundingClientRect().height : 0;

      const newHeight = window.innerHeight - (elementHeight + appHeaderHeight);
      setRemainingHeight(newHeight - 40);


    };

    // Initial setup
    calculateHeights();

    // Handle window resize
    window.addEventListener("resize", calculateHeights);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", calculateHeights);
  }, []);

  useEffect(() => {
    const calculateHeight = () => {
      const breadcrumbsElement = document.querySelector(".breadcrumbs-container");
      const appHeaderElement = document.querySelector(".app-header");

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
  const { level, parentId ,processId} = useParams();
  const location = useLocation();
  const LoginUser = useSelector((state) => state.user.user);

  // const { id, title, user ,ParentPageGroupId} = location.state || {};

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
  const [isFavorite, setIsFavorite] = useState(false);

  const [isNavigating, setIsNavigating] = useState(false);
  const memoizedNodeTypes = useMemo(
    () => ({
      progressArrow: PublishArrowBoxNode,
      pentagon: PublishPentagonNode,
      StickyNote:StickyNote
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

  const checkPublishData = useCallback(async (processId) => {
    // console.log("currentLevel",currentLevel)
    // const levelParam = 'Level0';
    const levelParam =
    currentParentId !== null
      ? `Level${currentLevel}_${currentParentId}`
      : `Level${currentLevel}`;
    const user_id = user ? user.id : null;
    const Process_id = processId ? processId : null;
    const data = await apiExports.checkPublishRecord(
      levelParam,
      parseInt(user_id),
      Process_id
    );
  
    return data;
  }, [user,currentLevel,currentParentId]); 

  useEffect(() => {
    const checkpublishfunction = async () => {
      const processId = id ? id : null;
  
      const data = await checkPublishData(processId);
  
      Setcheckpublish(data?.status);
    };
  
    checkpublishfunction();
  }, [checkPublishData, id]);
  

  


  useEffect(() => {
 
    const fetchNodes = async () => {
      try {
        const levelParam =
          currentParentId !== null
            ? `Level${currentLevel}_${currentParentId}`
            : `Level${currentLevel}`;
        const user_id = user ? user.id : null;
        const Process_id = id ? id : null;
        const draftStatus = "Draft";

        const data = await api.getNodes(
          levelParam,
          parseInt(user_id),
          Process_id
        );
        const getPublishedDate = await api.GetPublishedDate(
          levelParam,
          parseInt(user_id),
          Process_id,
          draftStatus
        );
        if (getPublishedDate.status === true) {
          setgetPublishedDate(getPublishedDate.created_at);
        } else {
          setgetPublishedDate("");
        }
        console.log("testing",levelParam,
          parseInt(user_id),
          Process_id)

        setprocess_img(data.process_img)
        setprocess_udid(data.process_uid)

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

  useEffect(()=>{
    const checkfav = async () => {
      const user_id = LoginUser ? LoginUser.id : null;
      const process_id = id ? id : null;
      if (!user_id || !process_id) {
        console.error("Missing required fields:", { user_id, process_id });
        return;
      }
      try {
        const PageGroupId=nodes[0]?.PageGroupId;
        const response = await checkFavProcess(user_id, process_id,PageGroupId);
        console.log("Response:", response);
        setIsFavorite(response.exists)
      } catch (error) {
        console.error("check fav error:", error);
      }
    }
    checkfav()
  },[LoginUser,id,nodes])


  useEffect(() => {
    const label = currentLevel === 0 ? title : title;
    const path =
    currentLevel === 0
    ? `/Draft-Process-View/${id}?title=${encodeURIComponent(title)}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${ParentPageGroupId}`
    : `/Draft-Process-View/${currentLevel}/${currentParentId}/${id}?title=${encodeURIComponent(title)}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${ParentPageGroupId}`;


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
    console.log("node",node?.type)
    if(node?.type ==="StickyNote"){
      return;
    }
    event.preventDefault();
    const selectedLabel = node.data.label || "";
    // const PageGroupId = node.PageGroupId;
    const newLevel = currentLevel + 1;
    const levelParam =
      node.id !== null
        ? `Level${newLevel}_${node.id}`
        : `Level${currentLevel}`;
    const user_id = user ? user.id : null;
    const Process_id = id ? id : null;
    const data = await api.checkRecord(
      levelParam,
      parseInt(user_id),
      Process_id
    );

    if (data.status === true) {
      if (data.Page_Title === "ProcessMap") {
        // navigate(`/Draft-Process-View/${newLevel}/${node.id}/${id}`, {
        //   state: {
        //     id: id,
        //     title: selectedLabel,
        //     user,
        //     ParentPageGroupId:  nodes[0]?.PageGroupId,
        //   },
        // });
        navigate(
        `/Draft-Process-View/${newLevel}/${node.id}/${id}?title=${selectedLabel}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${nodes[0]?.PageGroupId}`
        )
      }

      if (data.Page_Title === "Swimlane") {
        addBreadcrumb(
          `${selectedLabel} `,
          `/Draft-Swim-lanes-View/level/${newLevel}/${node.id}/${id}?title=${encodeURIComponent(selectedLabel)}&user=${encodeURIComponent(JSON.stringify(user))}&parentId=${node.id}&level=${newLevel}&ParentPageGroupId=${nodes[0]?.PageGroupId}`
        );
        navigate(`/Draft-Swim-lanes-View/level/${newLevel}/${node.id}/${id}?title=${encodeURIComponent(selectedLabel)}&user=${encodeURIComponent(JSON.stringify(user))}&parentId=${node.id}&level=${newLevel}&ParentPageGroupId=${nodes[0]?.PageGroupId}`)

     
      }
    } else {
      alert("Next level not exist")
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

  const navigateOnDraft = (page) => {
 
    const updatedBreadcrumbs = breadcrumbs.map((crumb, index) => {
      if (index === 0) return crumb; // First breadcrumb remains unchanged

      return {
        ...crumb,
        path: page === "editdraft"
          ? crumb.path.replace("published-map-level", "Draft-Process-View").replace("Map-level", "Draft-Process-View")
          : crumb.path.replace("Draft-Process-View", "published-map-level").replace("Draft-Process-View", "Map-level")
      };
    });

    setBreadcrumbs(updatedBreadcrumbs);
    if (id && user) {
      if (currentLevel === 0) {
        page === "editdraft"
          ? navigate('/Map-level', { state: { id, title, user ,ParentPageGroupId} })
          : 
          // navigate('/published-map-level', { state: { id, title, user,ParentPageGroupId } });
          navigate(`/published-map-level/${id}?title=${title}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${ParentPageGroupId}`)

      } else {
        page === "editdraft"
          ? navigate(`/level/${currentLevel}/${currentParentId}`, { state: { id, title, user ,ParentPageGroupId} })
          : 
          
          // navigate(`/published-map-level/${currentLevel}/${currentParentId}`, { state: { id, title, user,ParentPageGroupId } });
         navigate(`/published-map-level/${currentLevel}/${currentParentId}/${id}?title=${encodeURIComponent(title)}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${ParentPageGroupId}`)
      }
    } else {
      alert("Currently not navigate on draft mode");
    }
  };



// ye common page h
  const navigateToVersion = (process_id, level, version) => {
    const encodedTitle = encodeURIComponent("swimlane");
    navigate(`/Draft-Process-Version/${process_id}/${level}/${version}/${encodedTitle}`);
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
  const handleShareClick = () => {
    setShowSharePopup(true);
    console.log("breadcrumbs",breadcrumbs)
  };
  const handleVersionClick = () => {
    setShowVersionPopup(true);
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
        Procesuser={user}
        checkpublish={checkpublish}
        onShare={()=>handleShareClick()}
        onShowVersion={handleVersionClick}

      />
      <ReactFlowProvider>
        <div className="app-container" style={{ ...styles.appContainer, height: remainingHeight }}>
          <div className="content-wrapper" style={styles.contentWrapper}>

            <div className="flow-container" style={styles.flowContainer}>

            <div
  style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) rotate(-35deg)", // Center + Diagonal tilt
    fontSize: "72px", // Bigger for watermark effect
    fontWeight: "bold",
    color: "#0020601A", // 10% opacity for watermark style
    fontFamily: "'Poppins', sans-serif",
    zIndex: 0,
    pointerEvents: "none",
    whiteSpace: "nowrap",
    textTransform: "uppercase", // Optional: for all caps
    letterSpacing: "4px", // Optional: wider spacing
  }}
>
  View Draft
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
     


          
          {/* <div style={{
  position: "absolute",
  bottom: "10px",
  left: "20px",
  margin: "20px",
  fontSize: "18px",
  color: "#002060",
  fontFamily: "'Poppins', sans-serif",
  display: "flex",
  alignItems: "center",
  gap: "8px"  // Optional spacing between image and text
}}>
  <img 
    src={`${process.env.PUBLIC_URL}/img/rocket-solid.svg`} 
    alt="Rocket" 
    style={{ width: "20px", height: "20px" }}  // optional: control image size
  />
  {process_udid && (
    <span>ID {process_udid}</span>
  )}
</div> */}

<div style={{
  position: "absolute",
  bottom: "10px",
  left: "10px",
  margin: "20px",
  fontSize: "18px",
  color: "#002060",
  fontFamily: "'Poppins', sans-serif",
  display: "flex",
  alignItems: "center",
  gap: "8px"  // Optional spacing between image and text
}}>
  <img 
    src={`${process.env.PUBLIC_URL}/img/rocket-solid.svg`} 
    alt="Rocket" 
    style={{ width: "16px", height: "16px" }}  // optional: control image size
  />
  {/* {process_udid && (
    <span>ID {process_udid}</span>
  )} */}

<span>
  ID {nodes && nodes.length > 0 ? nodes[0].PageGroupId : ""}
</span>

</div>

        </div>
         {showSharePopup && (
                <SharePopup
                  processId={id}
                  processName={`ProcessName: ${headerTitle}`}
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
    />
)}

      </ReactFlowProvider>
    </div>
  );
};



export default DraftProcesMapLevel;

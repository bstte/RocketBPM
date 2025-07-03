import React, { useMemo, useState, useEffect, useContext, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  SmoothStepEdge,
  BezierEdge,
  StraightEdge,
  Background,
  MarkerType,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Header from "../../../components/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api, { checkFavProcess } from "../../../API/api";

import generateNodesAndEdges from "../../../AllNode/SwimlineNodes/generateNodesAndEdges";
import styles from "../SwimlaneStyles";
import PublishNodeType from "./DraftNodeType";
import { BreadcrumbsContext } from "../../../context/BreadcrumbsContext";

import '../../../Css/Swimlane.css'
import { useSelector } from "react-redux";
import apiExports from "../../../API/api";
import SharePopup from "../../../components/SharePopup";

// const rfStyle = {
//   width: "100%",
//   height: "100%",
//   backgroundColor: "#fff",
// };

const DraftSwimlineLevel = () => {



  const [windowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
      const { level, parentId ,processId} = useParams();
  
  const location = useLocation();
  // const { id, title, user, parentId, level, ParentPageGroupId } = location.state || {};
   const [showSharePopup, setShowSharePopup] = useState(false);
  
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
  const LoginUser = useSelector((state) => state.user.user);
  const [isFavorite, setIsFavorite] = useState(false);
  const [process_img, setprocess_img] = useState("");
  const [process_udid, setprocess_udid] = useState("");

  const headerTitle = `${title} `;
  const currentParentId = parentId || null;
  const currentLevel = level ? parseInt(level, 10) : 0;

  // const [mainContainerHeight, setmcHeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [appheaderheight, setahHeight] = useState(0);
  const [remainingHeight, setRemainingHeight] = useState(0);
  const [checkpublish, Setcheckpublish] = useState()

  useEffect(() => {

    const calculateHeights = () => {
      const element = document.querySelector(".ss_new_hed");
      const element2 = document.querySelector(".app-header");
      // const element3 = document.querySelector(".maincontainer");
      // Ensure elements are found before accessing height
      const elementHeight = element ? element.getBoundingClientRect().height : 0;
      const appHeaderHeight = element2 ? element2.getBoundingClientRect().height : 0;
      // const mainContainerHeight = element3 ? element3.getBoundingClientRect().height : 0;

      setHeight(elementHeight);
      setahHeight(appHeaderHeight);
      // setmcHeight(mainContainerHeight);

      // Correct calculation inside the function
      const newHeight = window.innerHeight - (elementHeight + appHeaderHeight);
      setRemainingHeight(newHeight - 46);
      //alert('WH :' +  window.innerHeight + 'HH : '+ elementHeight + 'AH : '+ appHeaderHeight + 'TH: ' + newHeight);
    };



    // Initial setup
    calculateHeights();

    // Handle window resize
    window.addEventListener("resize", calculateHeights);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", calculateHeights);
  }, []);

  // alert(`Window Height: ${window.innerHeight}, App Div Height: ${appheaderheight}, Header Height: ${height}, New Height: ${remainingHeight}`);


  const { nodes: initialNodes } = useMemo(
    () => generateNodesAndEdges(windowSize.width, windowSize.height, 'viewmode', height + 10, appheaderheight, remainingHeight),
    [windowSize, height, appheaderheight, remainingHeight]
  );
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  const [getPublishedDate, setgetPublishedDate] = useState("");
  const navigate = useNavigate();
  const [ChildNodes, setChiledNodes] = useState([]);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
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

  const checkPublishData = useCallback(async (processId) => {
    // console.log("currentLevel",currentLevel)
    const levelParam =
      currentParentId !== null
        ? `Level${currentLevel}_${currentParentId}`
        : `Level${currentLevel}`;
    // const levelParam = 'Level0';
    const user_id = user ? user.id : null;
    const Process_id = processId ? processId : null;
    const data = await apiExports.checkPublishRecord(
      levelParam,
      parseInt(user_id),
      Process_id
    );

    return data;
  }, [user, currentLevel, currentParentId]);

  useEffect(() => {
    const checkpublishfunction = async () => {
      // const processId = currentParentId;
      const processId = id ? id : null;

      const data = await checkPublishData(processId);

      Setcheckpublish(data?.status);
    };

    checkpublishfunction();
  }, [checkPublishData, id,currentParentId]);

  useEffect(() => {
    // const checkfav = async () => {
    //   const user_id = LoginUser ? LoginUser.id : null;
    //   const process_id = id ? id : null;


    //   if (!user_id || !process_id) {
    //     console.error("Missing required fields:", { user_id, process_id });
    //     return; // Stop execution if any field is missing
    //   }

    //   try {
    //     console.log("Sending data:", { user_id, process_id });
    //     const response = await checkFavProcess(user_id, process_id);
    //     console.log("Response:", response);
    //     setIsFavorite(response.exists)
    //   } catch (error) {
    //     console.error("check fav error:", error);
    //   }
    // }
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

        setgetPublishedDate(getPublishedDate.status ? getPublishedDate.created_at : "");
        setprocess_img(data.process_img);
        setprocess_udid(data.process_uid)

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
          if (node.parentId) {
            const parentNode = data.nodes.find((n) => n.node_id === node.parentId);
            if (parentNode && parentNode.position) {
              const parentPos = JSON.parse(parentNode.position);
              const parentWidth = groupWidth;
              const parentHeight = groupHeight;

              // Center child relative to parent
              centeredPosition = {
                x: parentPos.x + parentWidth / 2 - childWidth / 2,
                y: parentPos.y + parentHeight / 2 - childHeight / 2,
              };
            }
          }

          // Conditional styling
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
                justifyContent: "center",
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
    // checkfav()
    fetchNodes();
  }, [
    currentLevel,
    setNodes,
    setEdges,
    LoginUser,
    currentParentId,
    user,
    id,
    windowSize,
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
        const PageGroupId=ChildNodes[0]?.PageGroupId;
        const response = await checkFavProcess(user_id, process_id,PageGroupId);
        console.log("Response:", response);
        setIsFavorite(response.exists)
      } catch (error) {
        console.error("check fav error:", error);
      }
    }
    checkfav()
  },[LoginUser,id,ChildNodes])
  const memoizedNodeTypes = useMemo(() => nodeTypes, [nodeTypes]);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, [edgeTypes]);

  const iconNames = {

  };


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
    // console.log("breadcrumbs",breadcrumbs) 
    if (id && user) {

      page === "editdraft" ? navigate(`/swimlane/level/${currentLevel}/${currentParentId}`, { state: { id: id, title: title, user: user, parentId: currentParentId, level: currentLevel, ParentPageGroupId: ParentPageGroupId } })
        : 
        // navigate(`/published-swimlane/level/${currentLevel}/${currentParentId}`, { state: { id: id, title: title, user: user, parentId: currentParentId, level: currentLevel ,ParentPageGroupId: ParentPageGroupId} })
        navigate(`/published-swimlane/level/${currentLevel}/${currentParentId}/${id}?title=${encodeURIComponent(title)}&user=${encodeURIComponent(JSON.stringify(user))}&parentId=${currentParentId}&level=${currentLevel}&ParentPageGroupId=${ParentPageGroupId}`)


      // removeBreadcrumbsAfter(0);
    } else {
      alert("Currently not navigate on draft mode")
    }

  }
  const handleShareClick = () => {
    setShowSharePopup(true);
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
        getDraftedDate={getPublishedDate}
        setIsNavigating={() => removeBreadcrumbsAfter(currentLevel - 1)}
        Page={"ViewDraftswimlane"}
        isFavorite={isFavorite}
        Process_img={process_img}
        Procesuser={user}

        checkpublish={checkpublish}
        onShare={()=>handleShareClick()}

      />
      <div class="maincontainer" style={{ ...styles.appContainer, height: remainingHeight }}>
        <ReactFlowProvider>
          <div className="ss_publish_border" style={styles.scrollableWrapper}>
            <ReactFlow
              nodes={[...nodes, ...ChildNodes]}
              edges={edges}

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
            <div style={{
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
</div>
          </div>
          {showSharePopup && (
        <SharePopup
          processId={id}
          processName={`ProcessName: ${breadcrumbs.find(crumb => crumb.state?.id === "1")?.label}`}
          onClose={() => setShowSharePopup(false)}
        />
      )}

        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default DraftSwimlineLevel;

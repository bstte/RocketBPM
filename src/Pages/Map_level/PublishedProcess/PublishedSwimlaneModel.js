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
import "../../../Css/Swimlane.css";
import { useSelector } from "react-redux";
import VersionPopupView from "../../../components/VersionPopupView";
import { useDynamicHeight } from "../../../hooks/useDynamicHeight";
import useCheckFavorite from "../../../hooks/useCheckFavorite";
import { usePageGroupIdViewer } from "../../../hooks/usePageGroupIdViewer";
import YesNode from "../../../AllNode/YesNode";
import NoNode from "../../../AllNode/NoNode";
import { getLevelKey } from "../../../utils/getLevel";
import { useSwimlaneFetchNodes } from "../../../hooks/swimlane/useSwimlaneFetchNodes";
import { useProcessNavigation } from "../../../hooks/useProcessNavigation";

const PublishedSwimlaneModel = () => {
  const { height, appHeaderHeight, remainingHeight } = useDynamicHeight();
  const safeRemainingHeight = Math.min(Math.max(remainingHeight, 588), 588);
  const [windowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { level, parentId, processId } = useParams();
  // const location = useLocation();
  const [showVersionPopup, setShowVersionPopup] = useState(false);
  const [title, Settitle] = useState("");
  const { goToProcess } = useProcessNavigation();
  // const [ParentPageGroupId, SetParentPageGroupId] = useState(null);
  const [user, setUser] = useState(null);
  const [processDefaultlanguage_id, setprocessDefaultlanguage_id] =
    useState(null);
  const [OriginalDefaultlanguge_id, setOriginalDefaultlanguge_id] =
    useState(null);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const id = processId; // string

  const headerTitle = `${title} `;
  const currentParentId = parentId || null;
  const currentLevel = level ? parseInt(level, 10) : 0;
  const { nodes: initialNodes } = useMemo(
    () =>
      generateNodesAndEdges(
        windowSize.width,
        736,
        "viewmode",
        height + 10,
        appHeaderHeight,
        safeRemainingHeight
      ),
    [windowSize, height, appHeaderHeight, safeRemainingHeight]
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

  const { removeBreadcrumbsAfter, breadcrumbs, setBreadcrumbs } =
    useContext(BreadcrumbsContext);

  useCheckFavorite({
    id,
    childNodes: ChildNodes,
    setIsFavorite,
  });
  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguageId");
    if (savedLang) {
      fetchNodes(parseInt(savedLang)); // language apply karo
    } else {
      fetchNodes(processDefaultlanguage_id); // default
    }
  }, [
    currentLevel,
    setNodes,
    setEdges,
    LoginUser,
    currentParentId,
    id,
    windowSize,
  ]);

  const { fetchNodes } = useSwimlaneFetchNodes({
    api,
    mode: "publish", // 🔥 yahi change hoga view/draft me
    getLevelKey,
    currentLevel,
    currentParentId,
    LoginUser,
    id,
    windowSize,

    setters: {
      setUser,
      setChiledNodes,
      setEdges,
      setprocess_img,
      Settitle,
      setprocessDefaultlanguage_id,
      setOriginalDefaultlanguge_id,
      setSupportedLanguages,
      setgetPublishedDate
    }
  });

  // const fetchNodes = async (language_id = null) => {
  //   try {

  //     const levelParam = getLevelKey(currentLevel, currentParentId);

  //     const user_id = LoginUser ? LoginUser.id : null;
  //     const Process_id = id ? id : null;
  //     const publishedStatus = "Published";

  //     const data = await api.getPublishedNodes(
  //       levelParam,
  //       parseInt(user_id),
  //       Process_id,
  //       currentParentId,
  //       language_id
  //     );
  //     if (data && data.user_id) {
  //       // Construct user object based on backend logic
  //       setUser({
  //         id: data.actual_user_id,
  //         type: data.type || "self",
  //         role: data.role || "self",
  //         OwnId: data.user_id,
  //         actual_user_id: data.actual_user_id,
  //       });
  //     }
  //     const PageGroupId = data.nodes?.[0]?.page_group_id;
  //     const getPublishedDate = await api.GetPublishedDate(
  //       Process_id,
  //       publishedStatus,
  //       PageGroupId
  //     );

  //     setgetPublishedDate(
  //       getPublishedDate.status ? getPublishedDate.updated_at : ""
  //     );
  //     setprocess_img(data.process_img);
  //     setprocessDefaultlanguage_id(data.processDefaultlanguage_id);
  //       setOriginalDefaultlanguge_id(data.OriginalDefaultlanguge_id);
  //     setSupportedLanguages(data.ProcessSupportLanguage);

  //     Settitle(data.title);
  //     // SetParentPageGroupId(data.PageGroupId)
  //     const nodebgwidth = document.querySelector(".react-flow__node");
  //     const nodebgwidths = nodebgwidth
  //       ? nodebgwidth.getBoundingClientRect().width
  //       : 0;

  //     const nodebgheight = document.querySelector(".react-flow__node");
  //     const nodebgheights = nodebgheight
  //       ? nodebgheight.getBoundingClientRect().height
  //       : 0;

  //     const groupWidth = nodebgwidths;
  //     const groupHeight = nodebgheights;
  //     const childWidth = groupWidth * 0.9;
  //     const childHeight = groupHeight * 0.9;

  //     const parsedNodes = await Promise.all(
  //       data.nodes
  //         .filter((node) => node.type !== "StickyNote")
  //         .map(async (node) => {
  //           const parsedData = JSON.parse(node.data || "{}");
  //           const parsedPosition = JSON.parse(node.position || '{"x":0,"y":0}');
  //           const parsedMeasured = JSON.parse(
  //             node.measured || '{"width":40,"height":40}'
  //           );

  //           let centeredPosition = parsedPosition;
  //           let hasNextLevel = false;

  //           if (
  //             node.type === "progressArrow" &&
  //             parsedData?.processlink &&
  //             parsedData.processlink !== null &&
  //             parsedData.processlink !== ""
  //           ) {
  //             const match = parsedData.processlink.match(/level(\d+)/i);
  //             const extractedLevel = match ? parseInt(match[1]) : currentLevel;

  //             // 🔹 Increment level
  //             const newLevel = extractedLevel + 1;
  //             const levelParam = `level${newLevel}_${parsedData.processlink}`;
  //             try {
  //               const check = await api.checkPublishRecord(
  //                 levelParam,
  //                 Process_id
  //               );

  //               hasNextLevel = check?.status === true;
  //             } catch (e) {
  //               console.error("checkPublishRecord error", e);
  //             }
  //           }
  //           // Parent node positioning
  //           const nodeStyle =
  //             node.type === "Yes" ||
  //               node.type === "No" ||
  //               node.type === "FreeText"
  //               ? {} // No styles applied for these node types
  //               : {
  //                 width: groupWidth,
  //                 height: groupHeight,
  //                 childWidth: childWidth,
  //                 childHeight: childHeight,
  //                 display: "flex",
  //                 alignItems: "center",
  //                 justifyContent: "center",
  //               };

  //           return {
  //             ...node,
  //             data: {
  //               ...parsedData,
  //               width_height: parsedMeasured,
  //               defaultwidt: "40px",
  //               defaultheight: "40px",
  //               nodeResize: false,
  //               hasNextLevel,
  //             },
  //             type: node.type,
  //             id: node.node_id,
  //             parentId: node.parent_id,
  //             extent: "parent",
  //             measured: parsedMeasured,
  //             position: centeredPosition,
  //             draggable: Boolean(node.draggable),
  //             animated: Boolean(node.animated),
  //             style: nodeStyle,
  //           };
  //         })
  //     );

  //     const parsedEdges = data.edges.map((edge) => {

  //       return {
  //         ...edge,
  //         animated: Boolean(edge.animated),
  //         markerEnd: {
  //           type: MarkerType.ArrowClosed,
  //           color: "#002060",
  //           width: 12,
  //           height: 12,
  //         },
  //         style: { stroke: "#002060", strokeWidth: 2 },
  //         type: "step",
  //       };
  //     });
  //     setChiledNodes(parsedNodes);
  //     setEdges(parsedEdges);
  //   } catch (error) {
  //     console.error("Error fetching nodes:", error);
  //     alert("Failed to fetch nodes. Please try again.");
  //   }
  // };

  // const memoizedNodeTypes = useMemo(() => nodeTypes, [nodeTypes]);
  const memoizedNodeTypes = useMemo(
    () => ({
      ...nodeTypes,
      Yes: (props) => (
        <YesNode
          {...props}
          processDefaultlanguage_id={processDefaultlanguage_id}
        />
      ),
      No: (props) => (
        <NoNode
          {...props}
          processDefaultlanguage_id={processDefaultlanguage_id}
        />
      ),
    }),
    [processDefaultlanguage_id]
  );
  const memoizedEdgeTypes = useMemo(() => edgeTypes, [edgeTypes]);

  const iconNames = {};

  const navigateOnDraft = () => {

    if (!id || !user) {
      alert("Currently not navigate on draft mode");
      return;
    }

    const updatedBreadcrumbs = breadcrumbs.map((crumb, index) => {
      if (index === 0) return crumb;

      return {
        ...crumb,
        path: crumb.path.replace("/published/", "/draft/"),
      };
    });
    setBreadcrumbs(updatedBreadcrumbs);
    goToProcess({
      mode: "draft",
      view: "swimlane",
      processId: id,
      level: currentLevel,
      parentId: currentLevel === 0 ? undefined : currentParentId,
    });
    // if (id && user) {
    //   // navigate(`/Draft-Swim-lanes-View/level/${currentLevel}/${currentParentId}`, { state: { id: id, title: title, user: user, parentId: currentParentId, level: currentLevel,ParentPageGroupId } })
    //   navigate(
    //     `/draft-swimlane-view/level/${currentLevel}/${currentParentId}/${id}`
    //   );

    //   // removeBreadcrumbsAfter(0);
    // } else {
    //   alert("Currently not navigate on draft mode");
    // }
  };

  const navigateToVersion = (process_id, level, version) => {
    const user_id = LoginUser ? LoginUser.id : null;
    const encodedTitle = encodeURIComponent("swimlane");
    navigate(
      `/swimlane-version/${process_id}/${level}/${version}/${encodedTitle}/${user_id}/${currentParentId}`
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

    const PageGroupId = ChildNodes[0]?.page_group_id;

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

  const handleSupportViewlangugeId = (langId) => {
    localStorage.setItem("selectedLanguageId", langId);
    fetchNodes(langId);
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
        handleSupportViewlangugeId={handleSupportViewlangugeId}
        supportedLanguages={supportedLanguages}
        selectedLanguage={processDefaultlanguage_id}
        OriginalDefaultlanguge_id={OriginalDefaultlanguge_id}
      />
      <div style={{ ...styles.appContainer, height: safeRemainingHeight }}>
        <ReactFlowProvider>
          <div className="ss_publish_border scrollbar_wrapper" style={styles.scrollableWrapper}>
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
                selectedLanguage={processDefaultlanguage_id}
                OriginalDefaultlanguge_id={OriginalDefaultlanguge_id}
              />
            )}
            {usePageGroupIdViewer(ChildNodes)}
          </div>




        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default PublishedSwimlaneModel;

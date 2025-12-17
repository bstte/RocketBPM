import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
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
import api, { addFavProcess, removeFavProcess } from "../../../API/api";

import generateNodesAndEdges from "../../../AllNode/SwimlineNodes/generateNodesAndEdges";
import styles from "../SwimlaneStyles";
import PublishNodeType from "./DraftNodeType";
import { BreadcrumbsContext } from "../../../context/BreadcrumbsContext";

import "../../../Css/Swimlane.css";
import { useSelector } from "react-redux";
import apiExports from "../../../API/api";
import VersionPopupView from "../../../components/VersionPopupView";
import { useDynamicHeight } from "../../../hooks/useDynamicHeight";
import useCheckFavorite from "../../../hooks/useCheckFavorite";
import { usePageGroupIdViewer } from "../../../hooks/usePageGroupIdViewer";
import YesNode from "../../../AllNode/YesNode";
import NoNode from "../../../AllNode/NoNode";
import { useTranslation } from "../../../hooks/useTranslation";
import { getLevelKey } from "../../../utils/getLevel";
import { useSwimlaneFetchNodes } from "../../../hooks/swimlane/useSwimlaneFetchNodes";
import { useProcessNavigation } from "../../../hooks/useProcessNavigation";

const DraftSwimlineLevel = () => {
  const [windowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { level, parentId, processId } = useParams();
  const location = useLocation();
  const [showVersionPopup, setShowVersionPopup] = useState(false);
  const [title, Settitle] = useState("");
  const t = useTranslation();
  const [user, setUser] = useState(null);
  const { goToProcess } = useProcessNavigation();
  const id = processId; // string
  const LoginUser = useSelector((state) => state.user.user);
  const [isFavorite, setIsFavorite] = useState(false);
  const [process_img, setprocess_img] = useState("");
  const headerTitle = `${title} `;
  const currentParentId = parentId || null;
  const currentLevel = level ? parseInt(level, 10) : 0;
  const { height, appHeaderHeight, remainingHeight } = useDynamicHeight();
  const safeRemainingHeight = Math.min(Math.max(remainingHeight, 588), 588);
  const [checkpublish, Setcheckpublish] = useState();

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

  const [getDraftedDate, setDraftedDate] = useState("");
  const navigate = useNavigate();
  const [ChildNodes, setChiledNodes] = useState([]);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [processDefaultlanguage_id, setprocessDefaultlanguage_id] =
    useState(null);
  const [OriginalDefaultlanguge_id, setOriginalDefaultlanguge_id] =
    useState(null);
  const [supportedLanguages, setSupportedLanguages] = useState([]);

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

  const checkPublishData = useCallback(
    async (processId) => {

      const levelParam = getLevelKey(currentLevel, currentParentId);

      const Process_id = processId ? processId : null;
      const data = await apiExports.checkPublishRecord(levelParam, Process_id);

      return data;
    },
    [user, currentLevel, currentParentId]
  );

  useEffect(() => {
    const checkpublishfunction = async () => {
      // const processId = currentParentId;
      const processId = id ? id : null;

      const data = await checkPublishData(processId);

      Setcheckpublish(data?.status);
    };

    checkpublishfunction();
  }, [checkPublishData, id, currentParentId]);

  useEffect(() => {
    // checkfav()
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
    mode: "draft", // 🔥 yahi change hoga view/draft me
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
      setDraftedDate
    }
  });

  // const fetchNodes = async (language_id = null) => {
  //   try {

  //     const levelParam = getLevelKey(currentLevel, currentParentId);

  //     const user_id = LoginUser ? LoginUser.id : null;
  //     const Process_id = id ? id : null;
  //     const draftStatus = "Draft";

  //     const data = await api.getNodes(
  //       levelParam,
  //       parseInt(user_id),
  //       Process_id,
  //       currentParentId,
  //       language_id
  //     );
  //     // console.log("data",data)

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


  //     setprocessDefaultlanguage_id(data.processDefaultlanguage_id);
  //     setSupportedLanguages(data.ProcessSupportLanguage);
  //      setOriginalDefaultlanguge_id(data.OriginalDefaultlanguge_id);
  //     setprocess_img(data.process_img);
  //     Settitle(data.title);
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
  //       data.nodes.map(async (node) => {
  //         const parsedData = JSON.parse(node.data || "{}");
  //         const parsedPosition = JSON.parse(node.position || '{"x":0,"y":0}');
  //         const parsedMeasured = JSON.parse(
  //           node.measured || '{"width":40,"height":40}'
  //         );

  //         let centeredPosition = parsedPosition;

  //         // Parent node positioning
  //         if (node.parent_id) {
  //           const parentNode = data.nodes.find(
  //             (n) => n.node_id === node.parent_id
  //           );
  //           if (parentNode && parentNode.position) {
  //             const parentPos = JSON.parse(parentNode.position);
  //             const parentWidth = groupWidth;
  //             const parentHeight = groupHeight;

  //             // Center child relative to parent
  //             centeredPosition = {
  //               x: parentPos.x + parentWidth / 2 - childWidth / 2,
  //               y: parentPos.y + parentHeight / 2 - childHeight / 2,
  //             };
  //           }
  //         }
  //         let hasNextLevel = false;

  //         if (
  //           node.type === "progressArrow" &&
  //           parsedData?.processlink &&
  //           parsedData.processlink !== null &&
  //           parsedData.processlink !== ""
  //         ) {
  //           const match = parsedData.processlink.match(/level(\d+)/i);
  //           const extractedLevel = match ? parseInt(match[1]) : currentLevel;

  //           // 🔹 Increment level
  //           const newLevel = extractedLevel + 1;
  //           const levelParam = `level${newLevel}_${parsedData.processlink}`;
  //           try {
  //             const check = await api.checkRecord(levelParam, Process_id);

  //             hasNextLevel = check?.status === true;
  //           } catch (e) {
  //             console.error("checkRecord error", e);
  //           }
  //         }
  //         // Conditional styling
  //         const nodeStyle =
  //           node.type === "Yes" ||
  //             node.type === "No" ||
  //             node.type === "FreeText"
  //             ? {} // No styles applied for these node types
  //             : {
  //               width: groupWidth,
  //               height: groupHeight,
  //               childWidth: childWidth,
  //               childHeight: childHeight,
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //             };

  //         return {
  //           ...node,
  //           data: {
  //             ...parsedData,
  //             width_height: parsedMeasured,
  //             defaultwidt: "40px",
  //             defaultheight: "40px",
  //             nodeResize: false,
  //             hasNextLevel,
  //           },
  //           type: node.type,
  //           id: node.node_id,
  //           parentId: node.parent_id,
  //           extent: "parent",
  //           measured: parsedMeasured,
  //           position: centeredPosition,
  //           draggable: Boolean(node.draggable),
  //           animated: Boolean(node.animated),
  //           style: nodeStyle,
  //         };
  //       })
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
  //     console.log("parsedEdges version draft", parsedNodes);

  //     setChiledNodes(parsedNodes);
  //     setEdges(parsedEdges);
  //   } catch (error) {
  //     console.error("Error fetching nodes:", error);
  //     alert("Failed to fetch nodes. Please try again.");
  //   }
  // };

  useCheckFavorite({
    id,
    childNodes: ChildNodes,
    setIsFavorite,
  });
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

  const navigateOnDraft = (page) => {
    if (!id || !user) {
      alert("Currently not navigate on draft mode");
      return;
    }

    const targetMode =
      page === "editdraft" ? "edit" : "published";

    const updatedBreadcrumbs = breadcrumbs.map((crumb, index) => {
      if (index === 0) return crumb; // First breadcrumb remains unchanged

      return {
        ...crumb,
        path:
          page === "editdraft"
            ? crumb.path
              .replace("published", "draft")
              .replace("edit", "draft")
            : crumb.path
              .replace("draft", "published")
              .replace("draft", "edit"),
      };
    });

    setBreadcrumbs(updatedBreadcrumbs);
    goToProcess({
      mode: targetMode,
      view: "swimlane",
      processId: id,
      level: currentLevel,
      parentId: currentLevel === 0 ? undefined : currentParentId,
    });
    // console.log("breadcrumbs",breadcrumbs)
    // if (id && user) {
    //   page === "editdraft"
    //     ? navigate(`/swimlane/level/${currentLevel}/${currentParentId}/${id}`)
    //     : // navigate(`/published-swimlane/level/${currentLevel}/${currentParentId}`, { state: { id: id, title: title, user: user, parentId: currentParentId, level: currentLevel ,ParentPageGroupId: ParentPageGroupId} })
    //     navigate(
    //       `/published-swimlane/level/${currentLevel}/${currentParentId}/${id}`
    //     );

    //   // removeBreadcrumbsAfter(0);
    // } else {
    //   alert("Currently not navigate on draft mode");
    // }
  };
  // const handleShareClick = () => {
  //   setShowSharePopup(true);
  // };

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
  const navigateToVersion = (process_id, level, version) => {
    const user_id = LoginUser ? LoginUser.id : null;
    const encodedTitle = encodeURIComponent("swimlane");
    navigate(
      `/swimlane-version/${process_id}/${level}/${version}/${encodedTitle}/${user_id}/${currentParentId}`
    );
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
        getDraftedDate={getDraftedDate}
        setIsNavigating={() => removeBreadcrumbsAfter(currentLevel - 1)}
        Page={"ViewDraftswimlane"}
        isFavorite={isFavorite}
        Process_img={process_img}
        Procesuser={user || { id: null, role: "self", type: "self" }}
        checkpublish={checkpublish}
        onShowVersion={handleVersionClick}
        savefav={handleFav}
        handleSupportViewlangugeId={handleSupportViewlangugeId}
        supportedLanguages={supportedLanguages}
        selectedLanguage={processDefaultlanguage_id}
        OriginalDefaultlanguge_id={OriginalDefaultlanguge_id}
      />
      <div
        class="maincontainer"
        style={{ ...styles.appContainer, height: safeRemainingHeight }}
      >
        <ReactFlowProvider>
          <div className="ss_publish_border scrollbar_wrapper" style={styles.scrollableWrapper}>
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
                zIndex: 1,
                pointerEvents: "none",
                whiteSpace: "nowrap",
                textTransform: "uppercase", // Optional: for all caps
                letterSpacing: "4px", // Optional: wider spacing
                userSelect: "none", // Prevent text selection
              }}
            >
              {t("Draft")}
            </div>
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

export default DraftSwimlineLevel;

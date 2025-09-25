import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  SmoothStepEdge,
  BezierEdge,
  StraightEdge,
  Background,
  MarkerType,
  reconnectEdge,
  ConnectionMode,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import Header from "../../components/Header";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api, {
  addFavProcess,
  checkFavProcess,
  checkRecordWithGetLinkDraftData,
  filter_draft,
  getdataByNodeId,
  getNextPageGroupId,
  removeFavProcess,
  saveProcessInfo,
} from "../../API/api";
import CustomContextPopup from "../../components/CustomContextPopup";
import DetailsPopup from "../../components/DetailsPopup";
import NodeTypes from "./NodeTypes";
import generateNodesAndEdges from "../../AllNode/SwimlineNodes/generateNodesAndEdges";
import styles from "./SwimlaneStyles";
import AddObjectRole from "../../AllNode/SwimlineNodes/addobjectrole";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";
import "../../Css/Swimlane.css";
import { useSelector } from "react-redux";
import TextInputModal from "../../components/TextInputModal";
import VersionPopup from "./VersionPopup";
import StickyNote from "../../AllNode/StickyNote";
import CustomAlert from "../../components/CustomAlert";
import { useDynamicHeight } from "../../hooks/useDynamicHeight";
import useCheckFavorite from "../../hooks/useCheckFavorite";
import { useTranslation } from "../../hooks/useTranslation";
import { usePageGroupIdViewer } from "../../hooks/usePageGroupIdViewer";
import TranslationPopup from "../../hooks/TranslationPopup";
import { useLangMap } from "../../hooks/useLangMap";

const SwimlaneModel = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { level, parentId, processId } = useParams();
  const t = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  // const { id, title, user, parentId, level, ParentPageGroupId } =
  //   location.state || {};

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
  const headerTitle = `${title} `;
  const currentParentId = parentId || null;
  const currentLevel = level ? parseInt(level, 10) : 0;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [options, setOptions] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCheckboxPopupOpen, setIsCheckboxPopupOpen] = useState(false);
  const [LinknodeList, setLinknodeList] = useState([]);
  const [isexistingroleCheckboxPopupOpen, setIsexistingroleCheckboxPopupOpen] =
    useState(false);

  const [LinkexistingRole, setLinkexistingRole] = useState([]);

  const [selectedLinknodeIds, setSelectedLinknodeIds] = useState([]);
  const [selectedexistigrolenodeId, setSelectedexistingrolenodeId] =
    useState("");

  const [getDraftedDate, setDraftedDate] = useState("");
  const [KeepOldPosition, setKeepOldPosition] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [process_img, setprocess_img] = useState("");
  const [StickyNoteModeltext, setStickyNoteModeltext] = useState("");
  const LoginUser = useSelector((state) => state.user.user);
  const { height, appHeaderHeight, remainingHeight } = useDynamicHeight();

  const [selectedTitle, setSelectedTitle] = useState("");
  const [showTranslationPopup, setShowTranslationPopup] = useState(false);
  const [translationDefaults, setTranslationDefaults] = useState({
    en: "",
    de: "",
    es: "",
  });

  const { nodes: initialNodes } = useMemo(
    () =>
      generateNodesAndEdges(
        windowSize.width,
        windowSize.height,
        "",
        height + 10,
        appHeaderHeight,
        remainingHeight
      ),
    [windowSize, height, appHeaderHeight, remainingHeight]
  );

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [ChildNodes, setChiledNodes] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [MenuVisible, setMenuVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedNodefreetextId, setSelectedNodefreetextId] = useState(null);
  const [showVersionPopup, setShowVersionPopup] = useState(false);
  const [versionPopupPayload, setversionPopupPayload] = useState("");
  const [processDefaultlanguage_id, setprocessDefaultlanguage_id] =
    useState(null);

  const [selectedEdge, setSelectedEdge] = useState(null);
  const [getPublishedDate, setgetPublishedDate] = useState("");
  const [detailschecking, setdetailschecking] = useState(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [searchQuery, setSearchQuery] = useState("");
  const [ExistingrolesearchQuery, setExistingrolesearchQuery] = useState("");

  const [checkpublish, Setcheckpublish] = useState();
  const langMap = useLangMap();

  const ChildNodesRef = useRef(ChildNodes);
  useEffect(() => {
    ChildNodesRef.current = ChildNodes;
  }, [ChildNodes]);

  const [edges, setEdges] = useState([]);
  const isInitialLoad = useRef(true);
  // const nodeTypes = NodeTypes;
  const edgeTypes = useMemo(
    () => ({
      smoothstep: SmoothStepEdge,
      bezier: BezierEdge,
      straight: StraightEdge,
    }),
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");

  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const handleLabelChange = useCallback(
    (nodeId, newLabel) => {
      setChiledNodes((nds) =>
        nds.map((node) => {
          if (node.id !== nodeId) return node;

          // langKey nikaalo
          const langKey = langMap[processDefaultlanguage_id] || "en";

          // agar StickyNote hai
          if (node.type === "StickyNote") {
            return {
              ...node,
              data: {
                ...node.data,
                translations: {
                  ...(node.data.translations || {}),
                  [langKey]: newLabel,
                },
                label: newLabel,
              },
            };
          }

          // agar Swimlane (ya koi aur jisme details.title hai)
          return {
            ...node,
            data: {
              ...node.data,
              translations: {
                ...(node.data.translations || {}),
                [langKey]: newLabel,
              },
              details: {
                ...node.data.details,
                title: newLabel,
              },
            },
          };
        })
      );

      if (!isInitialLoad.current) {
        setHasUnsavedChanges(true);
      }
    },
    [setChiledNodes, processDefaultlanguage_id, setHasUnsavedChanges]
  );

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
        const user_id = user ? user.id : null;
        const Process_id = id ? id : null;

        const [publishedResponse, draftResponse, data] = await Promise.all([
          api.GetPublishedDate(
            levelParam,
            parseInt(user_id),
            Process_id,
            "Published"
          ),
          api.GetPublishedDate(
            levelParam,
            parseInt(user_id),
            Process_id,
            "Draft"
          ),
          api.getNodes(levelParam, parseInt(user_id), Process_id),
        ]);
        console.log("data", data);
        setgetPublishedDate(
          publishedResponse.status ? publishedResponse.created_at || "" : ""
        );
        setDraftedDate(
          draftResponse.status ? draftResponse.created_at || "" : ""
        );
        setprocess_img(data.process_img);
        // setprocess_udid(data.process_uid)
        setprocessDefaultlanguage_id(data.processDefaultlanguage_id);

        const nodebgwidth = document.querySelector(".react-flow__node");
        const nodebgwidths = nodebgwidth
          ? nodebgwidth.getBoundingClientRect().width
          : 0;

        const nodebgheight = document.querySelector(".react-flow__node");
        const nodebgheights = nodebgheight
          ? nodebgheight.getBoundingClientRect().height
          : 0;

        // Centralized size calculation
        const totalRows = 7;
        const totalColumns = 11;
        const groupWidth = nodebgwidths;
        const groupHeight = nodebgheights;
        const childWidth = groupWidth * 0.9;
        const childHeight = groupHeight * 0.9;

        const parsedNodes = data.nodes.map((node) => {
          const { parentId, ...remainingNodeProps } = node;
          const parsedData = JSON.parse(node.data);
          const parsedPosition = JSON.parse(node.position);
          const parsedMeasured = JSON.parse(node.measured);
          // console.log('parsedMeasured: ' + parsedMeasured);
          let centeredPosition = parsedPosition || { x: 0, y: 0 };

          // Parent node positioning
          if (parentId) {
            const parentNode = data.nodes.find((n) => n.node_id === parentId);
            if (parentNode && parentNode.position) {
              const parentPos = JSON.parse(parentNode.position);
              const parentWidth = windowSize.width / totalColumns - 14;
              const parentHeight = windowSize.height / totalRows - 14;
              const childWidth = parentWidth * 0.9;
              const childHeight = parentHeight * 0.9;

              // Proper center calculation
              centeredPosition = {
                x: parentPos.x + parentWidth / 2 - childWidth / 2,
                y: parentPos.y + parentHeight / 2 - childHeight / 2,
              };
            }
          }

          const nodeStyle =
            node.type === "Yes" ||
            node.type === "No" ||
            node.type === "FreeText" ||
            node.type === "StickyNote"
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
            ...remainingNodeProps,
            id: node.node_id,
            parentNode: parentId,
            parentId: parentId,
            data: {
              ...parsedData,
              onLabelChange: (newLabel) =>
                handleLabelChange(node.node_id, newLabel),
              width_height: parsedMeasured,
              defaultwidt: "40px",
              defaultheight: "40px",
              nodeResize: false,
            },
            type: node.type,
            extent: "parent",
            measured: parsedMeasured,
            position: centeredPosition,
            draggable: true,
            isNew: true,

            animated: Boolean(node.animated),
            style: nodeStyle,
          };
        });

        const parsedEdges = data.edges.map((edge) => {
          const sourceNode = data.nodes.find(
            (node) => node.node_id === edge.source
          );
          const targetNode = data.nodes.find(
            (node) => node.node_id === edge.target
          );

          const sourcePosition = sourceNode
            ? JSON.parse(sourceNode.position || '{"x":0,"y":0}')
            : { x: 0, y: 0 };
          const targetPosition = targetNode
            ? JSON.parse(targetNode.position || '{"x":0,"y":0}')
            : { x: 0, y: 0 };

          // Check if in same row or same column
          const isSameRow = Math.abs(sourcePosition.y - targetPosition.y) < 10; // 10px tolerance
          const isSameColumn =
            Math.abs(sourcePosition.x - targetPosition.x) < 10;

          const edgeType = isSameRow || isSameColumn ? "default" : "step";

          return {
            ...edge,
            animated: Boolean(edge.animated),
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#002060",
              width: 12,
              height: 12,
            },
            style: { stroke: "#002060", strokeWidth: 2 },
            type: edgeType,
          };
        });

        // isInitialLoad.current = false;
        // console.log("on load time data", data);
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
    handleLabelChange,
    setNodes,
    setEdges,
    currentParentId,
    user,
    id,
    windowSize,
  ]);

  const onNodesChange = useCallback(
    (changes) => setChiledNodes((nds) => applyNodeChanges(changes, nds)),
    [setChiledNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      const sourceNode = ChildNodesRef.current.find(
        (node) => node.node_id === params.source
      );
      const targetNode = ChildNodesRef.current.find(
        (node) => node.node_id === params.target
      );

      // console.log('Current ChildNodes:', ChildNodesRef.current);

      const sourcePosition = sourceNode
        ? sourceNode.position || { x: 0, y: 0 }
        : { x: 0, y: 0 };
      const targetPosition = targetNode
        ? targetNode.position || { x: 0, y: 0 }
        : { x: 0, y: 0 };

      // Check if in same row or same column
      const isSameRow = Math.abs(sourcePosition.y - targetPosition.y) < 10; // 10px tolerance
      const isSameColumn = Math.abs(sourcePosition.x - targetPosition.x) < 10;

      const edgeType = isSameRow || isSameColumn ? "default" : "step";

      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#002060",
              width: 12,
              height: 12,
            },
            style: { stroke: "#002060", strokeWidth: 2 },
            Level:
              currentParentId !== null
                ? `Level${currentLevel}_${currentParentId}`
                : `Level${currentLevel}`,
            user_id: user && user.id,
            Process_id: id && id,
            type: edgeType, // ✅ dynamic edge type
            Page_Title: "Swimlane",
            status: "draft",
          },
          eds
        )
      );
      setHasUnsavedChanges(true);
    },
    [setEdges, currentLevel, currentParentId, user, id]
  );

  const handleNodeClick = useCallback(
    (event, node) => {
      setSelectedEdge(null);
      setIsexistingroleCheckboxPopupOpen(false);
      setSelectedNodeId(node.id);
      handleClosePopup();
      setOptions([]);

      setIsCheckboxPopupOpen(false);
    },

    []
  );

  useEffect(() => {
    const checkpublishfunction = async () => {
      if (currentLevel !== 0) {
        try {
          const response = await filter_draft(ParentPageGroupId);
          // console.log("inside first map", response)

          if (response?.data === true) {
            Setcheckpublish(false);
          } else {
            Setcheckpublish(true);
          }
        } catch (error) {
          console.error("filter draft error", error);
        }
      }
    };
    checkpublishfunction();
  }, [ParentPageGroupId, currentLevel]);
  const addNode = async (type, position, label = "") => {
    let PageGroupId;

    if (!ChildNodes.PageGroupId) {
      const response = await getNextPageGroupId();
      PageGroupId = response.next_PageGroupId;
    } else {
      PageGroupId = ChildNodes[0]?.PageGroupId;
    }
    if (
      type === "Yes" ||
      type === "No" ||
      type === "FreeText" ||
      type === "StickyNote"
    ) {
      if (!position) {
        alert("Position not defind");
        return;
      }

      const newNodeId = uuidv4();
      const newNode = {
        id:
          currentParentId !== null
            ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
            : `Level${currentLevel}_${newNodeId}`,

        data: {
          label: type === "FreeText" || type === "StickyNote" ? label : "",
          shape: type,
          onLabelChange: (newLabel) =>
            handleLabelChange(
              currentParentId !== null
                ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
                : `Level${currentLevel}_${newNodeId}`,
              newLabel
            ),
          defaultwidt: "40px",
          defaultheight: "40px",
          autoFocus: true,

          nodeResize: false,
        },
        type: type,
        position: position,
        draggable: true,
        isNew: true,
        animated: true,
        Page_Title: "Swimlane",
        status: "draft",
        PageGroupId: PageGroupId,
      };

      setChiledNodes((nds) => [...nds, newNode]);
      setHasUnsavedChanges(true);
    } else if (selectedGroupId) {
      const selectedGroup = nodes.find((node) => node.id === selectedGroupId);

      const nodebgwidth = document.querySelector(".react-flow__node");
      const nodebgwidths = nodebgwidth
        ? nodebgwidth.getBoundingClientRect().width
        : 0;

      const nodebgheight = document.querySelector(".react-flow__node");
      const nodebgheights = nodebgheight
        ? nodebgheight.getBoundingClientRect().height
        : 0;

      const groupWidth = nodebgwidths;
      const groupHeight = nodebgheights;
      const childWidth = groupWidth * 0.9;
      const childHeight = groupHeight * 0.9;
      const centeredPosition = {
        x: selectedGroup.position.x + (groupWidth - childWidth) / 14 - 1,
        y: selectedGroup.position.y + (groupHeight - childHeight) / 14 - 0.5,
      };

      const newNodeId = uuidv4();
      const newNode = {
        id:
          currentParentId !== null
            ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
            : `Level${currentLevel}_${newNodeId}`,
        node_id:
          currentParentId !== null
            ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
            : `Level${currentLevel}_${newNodeId}`,

        parentNode: selectedGroupId,
        extent: "parent",
        data: {
          label: label,
          details: { title: label, content: "" },
          link: selectedexistigrolenodeId ? selectedexistigrolenodeId : "",
          autoFocus: true,
          shape: type,
          onLabelChange: (newLabel) =>
            handleLabelChange(
              currentParentId !== null
                ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
                : `Level${currentLevel}_${newNodeId}`,
              newLabel
            ),

          defaultwidt: "40px",
          defaultheight: "40px",
          nodeResize: false,
        },
        type: type,
        position: centeredPosition,
        draggable: true,
        isNew: true,
        animated: true,
        Page_Title: "Swimlane",
        status: "draft",
        PageGroupId: PageGroupId,
        style: {
          width: nodebgwidths,
          childWidth: nodebgwidths,
          childHeight: nodebgheights,
          height: nodebgheights,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      };

      setChiledNodes((nds) => [...nds, newNode]);
      setHasUnsavedChanges(true);
    } else {
      alert("Please select a group node first!");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const memoizedNodeTypes = useMemo(
    () => ({
      ...NodeTypes,
      StickyNote: (props) => (
        <StickyNote
          {...props}
          selectedNodeId={selectedNodeId}
          editable={true}
        />
      ),
    }),
    [selectedNodeId]
  );

  const memoizedEdgeTypes = useMemo(() => edgeTypes, [edgeTypes]);

  const handleSaveNodes = async (savetype) => {
    console.log("ChildNodes", ChildNodes);
    // console.log("edges", edges);

    if (savetype === "Published" && currentLevel !== 0) {
      try {
        const response = await filter_draft(ParentPageGroupId);
        // console.log("inside first", response)
        if (response.data === true) {
          alert("Publish all parent models first");
          return false;
        }
      } catch (error) {
        // console.log("inside ParentPageGroupId", ParentPageGroupId)

        console.error("filter draft error", error);
      }
    }

    const payload = {
      savetype,
      ...versionPopupPayload,
    };

    const Level =
      currentParentId !== null
        ? `Level${currentLevel}_${currentParentId}`
        : `Level${currentLevel}`;
    const user_id = user && user.id;
    const Process_id = id && id;
    const datasavetype = savetype;
    const LoginUserId = LoginUser ? LoginUser.id : null;

    try {
      if (versionPopupPayload) {
        await saveProcessInfo(payload);
      }

      const response = await api.saveNodes({
        Level,
        user_id,
        Process_id,
        datasavetype,
        LoginUserId,
        nodes: ChildNodes.map(
          ({
            id,
            data,
            type,
            position,
            draggable,
            animated,
            measured,
            Page_Title,
            parentNode,
            status,
            PageGroupId,
          }) => ({
            id,
            data,
            type,
            position,
            draggable,
            animated,
            measured,
            Page_Title,
            parentNode,
            status,
            PageGroupId,
          })
        ),
        edges: edges.map(
          ({
            id,
            source,
            target,
            markerEnd,
            animated,
            sourceHandle,
            targetHandle,
            Page_Title,
            status,
          }) => ({
            id,
            source,
            sourceHandle,
            target,
            targetHandle,
            markerEnd,
            animated,
            Page_Title,
            status,
          })
        ),
      });
      alert(response.message);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving nodes:", error);
      if (error.response && error.response.data) {
        console.error(
          `Failed to save nodes: ${JSON.stringify(error.response.data)}`
        );
      } else {
        console.error("Failed to save nodes. Please try again.");
      }
    }
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedNodeId(null);
  };

  // const updateNodeDetails = (nodeId, newDetails) => {

  //   setChiledNodes((nodes) =>
  //     nodes.map((node) =>
  //       node.node_id === nodeId
  //         ? {
  //           ...node,
  //           data: {
  //             ...node.data,
  //             details: {
  //               title: newDetails.title,
  //               content: newDetails.content,
  //             },
  //           },
  //         }
  //         : node
  //     )
  //   );
  // };

  // const saveDetails = (details) => {
  //   if (selectedNodeId) {
  //     updateNodeDetails(selectedNodeId, details);
  //     setSelectedNodeId(null);
  //     setHasUnsavedChanges(true);
  //   }
  //   closePopup();
  // };

const saveDetails = (details) => {
  const langKey = langMap[processDefaultlanguage_id] || "en";

  setChiledNodes((nodes) =>
    nodes.map((node) =>
      node.node_id === selectedNodeId
        ? {
            ...node,
            data: {
              ...node.data,
              label: details?.title,

              details: {
                ...node.data.details,
                ...details,

                translations: {
                  ...(node.data.details?.translations || {}),
                  [langKey]: {
                    ...(node.data.details?.translations?.[langKey] || {}),
                    title: details?.title || "",
                    content: details?.content || "",
                  },
                },
              },

              translations: {
                ...(node.data.translations || {}),
                [langKey]: details?.title || "",
              },
            },
          }
        : node
    )
  );

  setHasUnsavedChanges(true);
  setSelectedNodeId(null);
};



  const handleClosePopup = () => {
    setContextMenu(null);
    setMenuVisible(false);
    setSelectedNode(null);
    setdetailschecking(null);
  };
  const translation = () => {
    const node = ChildNodes.find((n) => n.id === selectedNodeId);
    console.log("get node", node);
    if (node) {
      // हर बार पूरा structure बनाओ (fallback खाली string)
      const defaults = {
        en: node.data?.translations?.en || "",
        de: node.data?.translations?.de || "",
        es: node.data?.translations?.es || "",
      };

      setTranslationDefaults(defaults);
      setShowTranslationPopup(true);
    }
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      const confirmDeletion = window.confirm(
        "Are you sure you want to delete this nodes?"
      );
      if (!confirmDeletion) return;

      setChiledNodes((nodes) =>
        nodes.filter((node) => node.id !== selectedNode.id)
      );
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      setHasUnsavedChanges(true);
    }
  };

  const handleNodeRightClick = (event, node) => {
    console.log("node id", node);
    setSelectedEdge(null);
    if (node.Page_Title === "Swimlane") {
      setOptions([]);
      if (node.node_id) {
        setSelectedNodeId(node.node_id);
      } else {
        setSelectedNodeId(node.id);
      }

      setdetailschecking(node);
      event.preventDefault();
      setSelectedNode(node);
      setPosition({ x: event.clientX, y: event.clientY });
      setMenuVisible(true);
      const popupHeight = 150;
      const screenHeight = window.innerHeight;
      let newY = event.clientY;
      if (event.clientY + popupHeight > screenHeight) {
        newY = event.clientY - popupHeight;
      }
      setContextMenu({
        x: event.clientX,
        y: newY,
        nodeId: node.id,
      });
    } else {
      const [, row, col] = node.row_id.split("_").map(Number);

      let options = [];

      // Determine options based on the node position
      if (row === 6 && col === 0) {
        options = [];
      } else if (col === 0 && row < 6) {
        options = [
          { label: t("add_role"), value: "Add Role" },
          {
            label: `${t("add_existing_role")}`,
            value: "Add existing role",
          },
        ];
      } else if (row === 6 && col > 0) {
        options = [{ label: t("add_process"), value: "Add Process" }];
      } else {
        options = [
          { label: t("add_activity"), value: "Add Activity" },
          { label: t("add_decision"), value: "Add Decision" },
          { label: t("add_sticky_note"), value: "Add Sticky Note" },
        ];
      }
      setPosition({ x: event.clientX, y: event.clientY });
      setOptions(options);
      setSelectedGroupId(node.id);
      setSelectedNode(node);
    }
  };

  const centerChildInParent = (parentNode, childNode) => {
    const parentCenterX = parentNode.position.x + parentNode.style.width / 11;
    const parentCenterY = parentNode.position.y + parentNode.style.height / 11;
    const updatedChildPosition = {
      x: parentCenterX - childNode.style.childWidth / 11,
      y: parentCenterY - childNode.style.childHeight / 11,
    };
    return updatedChildPosition;
  };

  const handleNodeDragStart = (event, node) => {
    setChiledNodes((prev) =>
      prev.map((child) =>
        child.id === node.id ? { ...child, parentId: undefined } : child
      )
    );

    setKeepOldPosition(node.position);
  };

  const getNearestParentNode = (childNode) => {
    if (!childNode || !childNode.style) {
      return null; // Avoid error by returning null
    }
    return nodes.reduce((nearest, parentNode) => {
      const childCenterX = childNode.position.x + childNode.style.width / 2;
      const childCenterY = childNode.position.y + childNode.style.height / 2;

      const parentLeft = parentNode.position.x;
      const parentRight = parentNode.position.x + parentNode.style.width + 1;
      const parentTop = parentNode.position.y;
      const parentBottom = parentNode.position.y + parentNode.style.height;

      // Check if at least 10% of the node is inside any cell
      const isOverlapping =
        childCenterX > parentLeft + parentNode.style.width * 0.05 &&
        childCenterX < parentRight - parentNode.style.width * 0.05 &&
        childCenterY > parentTop + parentNode.style.height * 0.05 &&
        childCenterY < parentBottom - parentNode.style.height * 0.05;

      if (isOverlapping) {
        return parentNode;
      }
      return nearest;
    }, null);
  };

  const handleNodeDragStop = (event, node) => {
    // console.log("old nodes ", node);

    if (node.id.startsWith("Level")) {
      // Find the nearest parent node
      const nearestParentNode = getNearestParentNode(node);

      if (node.type === "SwimlineRightsideBox") {
        const [, row, col] =
          nearestParentNode?.row_id.split("_").map(Number) || [];
        if (!nearestParentNode || col !== 0 || row >= 6) {
          setChiledNodes((prev) =>
            prev.map((child) =>
              child.id === node.id
                ? { ...child, position: KeepOldPosition }
                : child
            )
          );
          return;
        }
      }

      if (node.type === "progressArrow") {
        const [, row, col] =
          nearestParentNode?.row_id.split("_").map(Number) || [];

        // Ensure the node can only drop in the last row (row 6) and not in the first column (col !== 0)
        if (!nearestParentNode || row !== 6 || col === 0) {
          setChiledNodes((prev) =>
            prev.map((child) =>
              child.id === node.id
                ? { ...child, position: KeepOldPosition }
                : child
            )
          );
          return;
        }
      }

      if (node.type === "diamond" || node.type === "box") {
        const [, row, col] =
          nearestParentNode?.row_id.split("_").map(Number) || [];

        // Ensure the node can drop in any row except the last row and not in the first column
        if (!nearestParentNode || row === 6 || col === 0) {
          setChiledNodes((prev) =>
            prev.map((child) =>
              child.id === node.id
                ? { ...child, position: KeepOldPosition }
                : child
            )
          );
          return;
        }
      }

      if (
        node.type === "Yes" ||
        node.type === "No" ||
        node.type === "FreeText" ||
        node.type === "StickyNote"
      ) {
        return;
      }

      if (nearestParentNode) {
        const updatedPosition = centerChildInParent(nearestParentNode, node);
        setHasUnsavedChanges(true);
        setChiledNodes((prev) =>
          prev.map((child) =>
            child.id === node.id
              ? {
                  ...child,
                  parentNode: nearestParentNode.id,
                  position: updatedPosition,
                }
              : child
          )
        );
      }
    } else {
      // Handle parent node dragging and adjust children
      const affectedChildren = ChildNodes.filter(
        (child) => child.parentNode === node.id
      );

      const updatedChildren = affectedChildren.map((child) => ({
        ...child,
        position: centerChildInParent(node, child),
      }));

      setChiledNodes((prev) =>
        prev.map(
          (child) =>
            updatedChildren.find((updated) => updated.id === child.id) || child
        )
      );
    }
  };

  // Ensure to bind the handleNodeDragStart to the drag event on the node

  const switchNodeType = (type) => {
    if (selectedNodeId) {
      setChiledNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? {
                ...node,
                type: type,
                data: {
                  ...node.data,
                  shape: type,
                },
              }
            : node
        )
      );
      setHasUnsavedChanges(true);
    }
  };

  const { removeBreadcrumbsAfter, addBreadcrumb } =
    useContext(BreadcrumbsContext);

  const linkExistingmodel = async () => {
    const existinglink = ChildNodes.find(
      (node) => node.node_id === selectedNodeId
    );
    if (existinglink?.data?.link) {
      setSelectedLinknodeIds(existinglink?.data?.link);
    } else {
      setSelectedLinknodeIds([]);
    }

    const levelParam = "Level0";
    const user_id = user ? user.id : null;
    const Process_id = id ? id : null;
    const data = await api.getallpublishObject_Tolinkexistingmodel(
      levelParam,
      parseInt(user_id),
      Process_id
    );

    const filteredNodes = data.nodes.filter(
      (node) => node.type !== "StickyNote",
      (node) => node.node_id !== currentParentId
    );
    setLinknodeList(filteredNodes);
    // console.log("check data filteredNodes", filteredNodes)
    setIsCheckboxPopupOpen(true);
  };

  const AddexistingRole = async () => {
    const levelParam = "Level0";
    const user_id = user ? user.id : null;
    const Process_id = id ? id : null;
    const data = await api.getexistingrole(
      levelParam,
      parseInt(user_id),
      Process_id
    );

    // console.log("check data getexistingrole data", data)

    const filteredNodes = data.AllexistingRole.filter(
      (node) => node.node_id !== currentParentId
    );
    setLinkexistingRole(filteredNodes);
    // console.log("check data getexistingrole", filteredNodes)
    setIsexistingroleCheckboxPopupOpen(true);
  };

  const handleCheckboxChange = (nodeId, label) => {
    setSelectedLinknodeIds(nodeId);
    setSelectedTitle(label);
  };

  const handleexistingroleCheckboxChange = (nodeId) => {
    setSelectedexistingrolenodeId(nodeId);
  };

  const handleSaveExistingRole = () => {
    if (selectedexistigrolenodeId) {
      const selectedNode = parsedDataExistingrole.find(
        (item) => item.node_id === selectedexistigrolenodeId
      );
      console.log("selectedexistigrolenodeId", selectedexistigrolenodeId);

      console.log("selectedNode", selectedNode);

      const title = selectedNode?.data?.details?.title || "Untitled";

      setIsexistingroleCheckboxPopupOpen(false);
      addNode("SwimlineRightsideBox", "", title);
      setSelectedexistingrolenodeId("");
    }
  };

  const saveSelectedNodes = () => {
    if (selectedLinknodeIds) {
      setChiledNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNodeId) {
            // console.log("link existin gmodel", node)
            return {
              ...node,
              data: {
                ...node.data,
                link: selectedLinknodeIds,
                details: {
                  ...node.data.details,
                  title:
                    selectedTitle ||
                    node.data.details?.title ||
                    "Default Title",
                },
              },
            };
          }
          return node;
        })
      );

      setIsCheckboxPopupOpen(false);
      setHasUnsavedChanges(true);
    } else {
      alert("Please select a node before saving.");
    }
  };
  const removeExistingLink = () => {
    if (!selectedNodeId) return;

    CustomAlert.confirm(
      "Are you sure?",
      "This will remove the link.",
      () => {
        setChiledNodes((nds) =>
          nds.map((node) => {
            if (
              node.id === selectedNodeId ||
              node.parentId === selectedNodeId
            ) {
              return {
                ...node,
                data: {
                  ...node.data,
                  link: null, // remove link
                  details: {
                    ...(node.data.details || {}),
                    title: "", // clear title too
                  },
                },
              };
            }
            return node;
          })
        );

        setHasUnsavedChanges(true);

        CustomAlert.success(
          "Link Removed",
          "Link and title have been removed from the selected node and its child nodes."
        );
      },
      () => {
        CustomAlert.info("Cancelled", "No changes were made.");
      }
    );
  };

  const openExistingModel = async (nodelink) => {
    const confirmcondition = await handleBack(); // Wait for confirmation
    if (confirmcondition) {
      if (nodelink) {
        try {
          const response = await getdataByNodeId(nodelink, "draft");
          if (response.data && response.data.length > 0) {
            const user_id = response.data[0].user_id;
            const Process_id = response.data[0].Process_id;
            const id = response.data[0].Process_id;

            const user = {
              id: response.data[0].user_id,
            };

            let newLevel = 1;
            if (nodelink !== null) {
              const match = nodelink.match(/^Level(\d+)/);
              if (match && match[1]) {
                const currentLevel = parseInt(match[1], 10);
                newLevel = currentLevel + 1;
              }
            }

            const levelParam =
              nodelink !== null
                ? `Level${newLevel}_${nodelink}`
                : `Level${newLevel}`;
            console.log("newLevel", levelParam);

            const nodeData = await checkRecordWithGetLinkDraftData(
              levelParam,
              parseInt(user_id),
              Process_id,
              nodelink
            );
            const nodeDataParsed = JSON.parse(response.data[0].data);
            if (nodeData.status === true) {
              removeBreadcrumbsAfter(1);

              const allNodes = nodeData.allNodes; // 👈 API se mila array
              if (Array.isArray(allNodes) && allNodes.length > 0) {
                // sabse highest level se start
                allNodes.forEach((node) => {
                  const parsedData = JSON.parse(node.data || "{}");
                  const label = parsedData.label || "";
                  const node_id = node.node_id;
                  const process_id = node.Process_id;

                  // ✅ Level number get karo
                  let currentLevel = 0;
                  const match = node_id.match(/^Level(\d+)/);
                  if (match && match[1]) {
                    currentLevel = parseInt(match[1], 10);
                  }
                  const newLevel = currentLevel + 1;

                  const user = { id: node.user_id };

                  // ✅ URL banao
                  const url = `/Draft-Process-View/${newLevel}/${node_id}/${process_id}?title=${encodeURIComponent(
                    label
                  )}&user=${encodeURIComponent(
                    JSON.stringify(user)
                  )}&ParentPageGroupId=${node.PageGroupId}`;
                  console.log("addbreadcrums time", node);
                  // ✅ Breadcrumb add karo
                  addBreadcrumb(label, url);
                });
              }

              if (nodeData.Page_Title === "ProcessMap") {
                navigate(
                  `/Draft-Process-View/${newLevel}/${nodelink}/${id}?title=${encodeURIComponent(
                    nodeDataParsed.label || ""
                  )}&user=${encodeURIComponent(
                    JSON.stringify(user)
                  )}&ParentPageGroupId=${response.data[0]?.PageGroupId}`
                );
              }
              if (nodeData.Page_Title === "Swimlane") {
                navigate(
                  `/Draft-Swim-lanes-View/level/${newLevel}/${nodelink}/${id}?title=${encodeURIComponent(
                    nodeDataParsed.label || ""
                  )}&user=${encodeURIComponent(
                    JSON.stringify(user)
                  )}&parentId=${nodelink}&level=${newLevel}&ParentPageGroupId=${
                    response.data[0]?.PageGroupId
                  }`
                );
              }
            } else {
              alert("First create next model of this existing model");
            }
          } else {
            console.error("No data found in response.data");
          }
        } catch (error) {
          console.error("Error fetching link data:", error);
        }
      }
    }
  };
  const handleTextSubmit = (enteredText) => {
    setIsModalOpen(false);

    if (!enteredText) return;

    setHasUnsavedChanges(true);

    // If selectedNodeId is null, create a new node
    if (selectedNodefreetextId) {
      setChiledNodes((prevNodes) => {
        return prevNodes.map((node) =>
          node.id === selectedNodefreetextId
            ? { ...node, data: { ...node.data, label: enteredText } }
            : node
        );
      });
      setSelectedNodefreetextId(null);
    } else {
      addNode(
        "FreeText",
        { x: modalPosition.x - 70, y: modalPosition.y - 125 },
        enteredText
      );
    }
  };

  const UpdateText = () => {
    const data = ChildNodes.find((node) => node.id === selectedNodeId);

    setSelectedNodefreetextId(data.id);
    setModalText(data.data.label || "");
    setIsModalOpen(true);

    // console.log("this is free text udpate ",selectedNodeId)
  };

  const handlePopupAction = (action) => {
    const { x, y } = contextMenu;
    // console.log("contextMenu", contextMenu);

    const edgeId = contextMenu.edgeId;
    if (action === "Yes") {
      addNode("Yes", { x: x - 30, y: y - 125 }, edgeId);
    } else if (action === "No") {
      addNode("No", { x: x - 70, y: y - 125 }, edgeId);
    } else if (action === "addFreeText") {
      setIsModalOpen(true);
      setModalText("");
      setModalPosition({ x, y }); // Store x, y in state
    } else if (action === "addDetails") {
      openPopup();
    }
    setContextMenu(null);
    setSelectedEdge(null);
  };

  const menuItems = [
    ...(detailschecking?.type !== "SwimlineRightsideBox" &&
    detailschecking?.type !== "progressArrow" &&
    detailschecking?.type !== "Yes" &&
    detailschecking?.type !== "No" &&
    detailschecking?.type !== "FreeText" &&
    detailschecking?.type !== "StickyNote"
      ? [
          {
            label:
              detailschecking &&
              (!detailschecking?.data?.details?.title ||
                detailschecking?.data?.details?.title === "") &&
              (!detailschecking?.data?.details?.content ||
                detailschecking?.data?.details?.content === "")
                ? `${t("add_details")}`
                : `${t("edit_details")}`,
            action: () => handlePopupAction("addDetails"),
            borderBottom: true,
          },
        ]
      : []),
    ...(detailschecking?.type === "box"
      ? [
          {
            label: `${t("switch_shape_to_decision")}`,
            action: () => switchNodeType("diamond"),
            borderBottom: true,
          },
        ]
      : []),
    ...(detailschecking?.type === "diamond"
      ? [
          {
            label: `${t("switch_shape_to_activity")}`,
            action: () => switchNodeType("box"),
            borderBottom: true,
          },
        ]
      : []),
    ...(detailschecking?.type === "progressArrow"
      ? [
          ...(detailschecking?.data?.link
            ? [
                {
                  label: `${t("open_existing_model")}`,
                  action: () => openExistingModel(detailschecking?.data?.link),
                  borderBottom: true,
                },
                {
                  label: `${t("remove_existing_model")}`,
                  action: () => removeExistingLink(),
                  borderBottom: true,
                },
              ]
            : [
                {
                  label: `${t("link_existing_model")}`,
                  action: () => linkExistingmodel(),
                  borderBottom: true,
                },
              ]),
        ]
      : []),

    ...(detailschecking?.type === "FreeText"
      ? [
          {
            label: `${t("edit_text")}`,
            action: () => UpdateText(),
            borderBottom: true,
          },
        ]
      : []),

    {
      label: `${t("translation")}`,
      action: translation,
      borderBottom: false,
    },

    {
      label: `${t("Delete")}`,
      action: handleDeleteNode,
      borderBottom: false,
    },
  ];

  const iconNames = {};

  const deleteEdge = () => {
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdge.id));
    setSelectedEdge(null);
    setHasUnsavedChanges(true);
  };

  const onReconnect = useCallback((oldEdge, newConnection) => {
    setEdges((prevEdges) => reconnectEdge(oldEdge, newConnection, prevEdges));
    setHasUnsavedChanges(true);
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    const { clientX, clientY } = event;
    setPosition({ x: clientX, y: clientY });
    console.log("asdf", event);
    setMenuVisible(false);
    setOptions([]);
    setSelectedEdge(edge);
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      edgeId: edge.id,
    });
  }, []);

  const handleOptionClick = (option) => {
    if (option === "Add Role") {
      addNode("SwimlineRightsideBox");
    } else if (option === "Add existing role") {
      AddexistingRole();
    } else if (option === "Add Activity") {
      addNode("box");
    } else if (option === "Add Decision") {
      addNode("diamond");
    } else if (option === "Add Process") {
      addNode("progressArrow");
    } else if (option === "Add Sticky Note") {
      addNode("StickyNote", { x: position.x, y: position.y });
    }

    setOptions([]);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  const handleBack = async () => {
    if (hasUnsavedChanges) {
      const userConfirmed = window.confirm(
        "You have unsaved changes. Do you want to save them before leaving?"
      );
      if (!userConfirmed) {
        return false;
      }
      await handleSaveNodes("draft"); // Wait for saving to complete
    }
    return true;
  };

  const ExitNavigation = async (type) => {
    let confirmcondition = true;

    // sirf "exit" wale case me hi confirmation lena hai
    if (type === "exit") {
      confirmcondition = await handleBack();
    }
    if (confirmcondition) {
      if (id && user) {
        navigate(
          `/Draft-Swim-lanes-View/level/${currentLevel}/${currentParentId}/${id}?title=${encodeURIComponent(
            title
          )}&user=${encodeURIComponent(
            JSON.stringify(user)
          )}&parentId=${currentParentId}&level=${currentLevel}&ParentPageGroupId=${ParentPageGroupId}`
        );
      } else {
        alert("Currently not navigate on draft mode");
      }
    }
  };
  const parsedData = LinknodeList.map((item) => ({
    ...item,
    data: JSON.parse(item.data), // Parse the data field
  }));

  const filteredData = parsedData.filter(
    (item) =>
      item.data.label &&
      item.data.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const parsedDataExistingrole = LinkexistingRole.map((item) => ({
    ...item,
    data: typeof item.data === "string" ? JSON.parse(item.data) : item.data, // safety check
  }));

  const filteredDataExistingrole = parsedDataExistingrole.filter(
    (item) =>
      item.data?.details?.title &&
      item.data.details.title
        .toLowerCase()
        .includes(ExistingrolesearchQuery.toLowerCase())
  );

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

  // ye common page h
  const navigateToVersion = (process_id, level, version) => {
    const encodedTitle = encodeURIComponent("swimlane");
    navigate(
      `/Swimlane-Version/${process_id}/${level}/${version}/${encodedTitle}`
    );
  };

  const handleVersionClick = () => {
    setShowVersionPopup(true);
  };

  const updateNodeTranslations = (nodeId, translations) => {
    setChiledNodes((nds) =>
      nds.map((node) => {
        if (node.id !== nodeId) return node;

        const langKey = langMap[processDefaultlanguage_id] || "en";
        const newLabel =
          translations[langKey] || node.data.label || node.data?.details?.title;

        if (node.type === "StickyNote") {
          return {
            ...node,
            data: {
              ...node.data,
              translations,
              label: newLabel,
            },
          };
        }

        return {
          ...node,
          data: {
            ...node.data,
            translations,
            details: {
              ...node.data.details,
              title: newLabel,
            },
          },
        };
      })
    );
  };

  const handleSaveVersionDetails = (payload) => {
    setversionPopupPayload(payload);
    setShowVersionPopup(false);
  };
  return (
    <div>
      <Header
        savefav={handleFav}
        title={headerTitle}
        onSave={handleSaveNodes}
        onPublish={handleSaveNodes}
        addNode={addNode}
        handleBackdata={handleBack}
        iconNames={iconNames}
        getPublishedDate={getPublishedDate}
        getDraftedDate={getDraftedDate}
        setIsNavigating={() => removeBreadcrumbsAfter(currentLevel - 1)}
        Page={"Swimlane"}
        onExit={ExitNavigation}
        isFavorite={isFavorite}
        Process_img={process_img}
        checkpublish={checkpublish}
        onShowVersion={handleVersionClick}
      />

      <div
        className="publishcontainer"
        style={{ ...styles.appContainer, height: remainingHeight }}
      >
        <ReactFlowProvider>
          <div style={styles.scrollableWrapper}>
            <ReactFlow
              nodes={[...nodes, ...ChildNodes]}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={handleNodeClick}
              onNodeContextMenu={handleNodeRightClick}
              onReconnect={onReconnect}
              onContextMenu={handleContextMenu}
              onEdgeContextMenu={onEdgeClick}
              onNodeDragStart={handleNodeDragStart}
              onNodeDragStop={handleNodeDragStop}
              connectionLineType={ConnectionLineType.Step}
              connectionLineStyle={{ stroke: "#002060", strokeWidth: 2.5 }}
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

            {selectedEdge && (
              <div
                style={{
                  position: "absolute",
                  top: position.y,
                  left: position.x,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                  zIndex: 10,
                  minWidth: "180px",
                }}
              >
                {/* Menu Items */}

                {[
                  { label: `${t("add_yes_label")}`, action: "Yes" },
                  { label: `{${t("add_no_label")}}`, action: "No" },
                  { label: `${t("add_free_text")}`, action: "addFreeText" },
                ].map((item, index) => (
                  <div
                    className="menuitems"
                    key={index}
                    onClick={() => handlePopupAction(item.action)}
                  >
                    {item.label}
                  </div>
                ))}
                <div
                  className="menuitems"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this arrow?"
                      )
                    ) {
                      deleteEdge();
                    }
                  }}
                >
                  {t("delete_arrow")}
                </div>
              </div>
            )}

            <CustomContextPopup
              isVisible={!!MenuVisible}
              position={contextMenu || { x: 0, y: 0 }}
              menuItems={menuItems}
              onClose={handleClosePopup}
            />

            <DetailsPopup
              isOpen={isPopupOpen}
              onClose={closePopup}
              onSave={saveDetails}
              Details={
                ChildNodes.find((node) => node.node_id === selectedNodeId) ||
                null
              }
            />
          </div>

          {/* Checkbox Popup */}
          {isCheckboxPopupOpen && (
            <div style={popupStyle.container} className="swimlanepopup">
              <div style={popupStyle.header}>
                <span>{t("existing_model")}</span>
              </div>

              <input
                type="text"
                style={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <div style={popupStyle.body}>
                {filteredData.map((node) => (
                  <label
                    key={node.node_id}
                    style={{
                      ...popupStyle.label,
                      backgroundColor:
                        selectedLinknodeIds === node.node_id
                          ? "#f0f8ff"
                          : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLinknodeIds === node.node_id}
                      onChange={() =>
                        handleCheckboxChange(node.node_id, node.data.label)
                      }
                      style={popupStyle.checkbox}
                    />
                    {node.data.label && node.data.label}
                  </label>
                ))}
              </div>
              <div style={popupStyle.footer}>
                <button
                  onClick={saveSelectedNodes}
                  style={popupStyle.saveButton}
                >
                  {t("Save")}
                </button>
              </div>
            </div>
          )}

          {/* Existing Add role Popup */}
          {isexistingroleCheckboxPopupOpen && (
            <div style={popupStyle.container} className="swimlanepopup">
              <div style={popupStyle.header}>
                <span>{t("add_existing_role")}</span>
              </div>

              <input
                type="text"
                style={styles.searchInput}
                placeholder={t("search")}
                value={ExistingrolesearchQuery}
                onChange={(e) => setExistingrolesearchQuery(e.target.value)}
              />

              <div style={popupStyle.body}>
                {filteredDataExistingrole.map((node) => {
                  const isSelected = selectedexistigrolenodeId === node.node_id;
                  const title = node?.data?.details?.title || "Untitled";

                  return (
                    <div
                      key={node.node_id}
                      onClick={() =>
                        handleexistingroleCheckboxChange(node.node_id)
                      }
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e6f7ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = isSelected
                          ? "#f0f8ff"
                          : "transparent")
                      }
                      style={{
                        ...popupStyle.label,
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#f0f8ff" : "transparent",
                      }}
                    >
                      {title}
                    </div>
                  );
                })}
              </div>

              <div style={popupStyle.footer}>
                <button
                  onClick={handleSaveExistingRole}
                  style={popupStyle.saveButton}
                >
                  {t("Save")}
                </button>
              </div>
            </div>
          )}

          <TextInputModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleTextSubmit}
            initialValue={modalText} // Pass existing value to modal
          />

          {options.length > 0 && (
            <AddObjectRole
              position={position}
              options={options}
              onOptionClick={handleOptionClick}
              onClose={() => setIsPopupOpen(false)}
            />
          )}

          {usePageGroupIdViewer(ChildNodes)}
          <TranslationPopup
            isOpen={showTranslationPopup}
            onClose={() => setShowTranslationPopup(false)}
            defaultValues={translationDefaults}
            onSubmit={(values) => {
              console.log("Translations:", values);

              updateNodeTranslations(selectedNodeId, values);

              setShowTranslationPopup(false);
            }}
          />

          {showVersionPopup && (
            <VersionPopup
              processId={id}
              currentLevel={currentLevel}
              onClose={() => setShowVersionPopup(false)}
              currentParentId={currentParentId}
              viewVersion={navigateToVersion}
              LoginUser={LoginUser}
              title={headerTitle}
              handleSaveVersionDetails={handleSaveVersionDetails}
              status={"draft"}
            />
          )}
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default SwimlaneModel;

const popupStyle = {
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "300px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    fontWeight: "bold",
    fontSize: "18px",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  body: {
    marginBottom: "16px",
    maxHeight: "250px",
    overflowY: "auto",
  },
  label: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
    padding: "8px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  checkbox: {
    marginRight: "8px",
  },
  footer: {
    textAlign: "right",
  },
  saveButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

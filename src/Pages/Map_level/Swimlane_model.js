import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
  useContext,
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
  checkRecordWithGetLinkDraftData,
  deleteExistingRole,
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
import SwimlineRightsideBox from "../../AllNode/SwimlineNodes/SwimlineRightsideBox";
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
import { buildBreadcrumbs } from "../../utils/buildBreadcrumbs";
import YesNode from "../../AllNode/YesNode";
import NoNode from "../../AllNode/NoNode";
import { useFetchVersions } from "../../hooks/useFetchVersions";
import PublishPopup from "../../components/PublishPopup";
import EditorialChangePopup from "../../components/EditorialChangePopup";
import ContentChangePopup from "../../components/ContentChangePopup";
import { getLevelKey } from "../../utils/getLevel";
import { useSwimlaneLabelChange } from "../../hooks/swimlane/useSwimlaneLabelChange";
import { useSwimlaneFetchNodes } from "../../hooks/swimlane/useSwimlaneFetchNodes";
import { useProcessNavigation } from "../../hooks/useProcessNavigation";
import EdgeContextMenu from "../../components/EdgeContextMenu";
import ExistingModelPopup from "../../components/ExistingModelPopup";
import ExistingRolePopup from "../../components/ExistingRolePopup";
import ManageRoleGroupModal from "./components/ManageRoleGroupModal";
import AssignRoleOwnerModal from "./components/AssignRoleOwnerModal";

// NEW IMPORTS
import { getDropdownPosition, getLocalPositionInsideContainer } from "../../utils/swimlaneUtils";
import { useSwimlaneDrag } from "../../hooks/swimlane/useSwimlaneDrag";
import { useSwimlaneAddNode } from "../../hooks/swimlane/useSwimlaneAddNode";

const SwimlaneModel = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { level, parentId, processId } = useParams();
  const t = useTranslation();
  // const location = useLocation();
  const navigate = useNavigate();
  const [title, Settitle] = useState("");
  const [ParentPageGroupId, SetParentPageGroupId] = useState(null);
  const [showPublishPopup, setShowPublishPopup] = useState(false);
  const [showEditorialPopup, setShowEditorialPopup] = useState(false);
  const [showContentPopup, setShowContentPopup] = useState(false);
  const [user, setUser] = useState(null);
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
  const { goToProcess } = useProcessNavigation();
  const [getDraftedDate, setDraftedDate] = useState("");
  const [KeepOldPosition, setKeepOldPosition] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [process_img, setprocess_img] = useState("");
  const LoginUser = useSelector((state) => state.user.user);
  const { height, appHeaderHeight, remainingHeight } = useDynamicHeight();
  const safeRemainingHeight = Math.min(Math.max(remainingHeight, 588), 588);
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
        safeRemainingHeight
      ),
    [windowSize, height, appHeaderHeight, safeRemainingHeight]
  );

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [ChildNodes, setChiledNodes] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [MenuVisible, setMenuVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [roleGroupEditData, setRoleGroupEditData] = useState(null);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedNodefreetextId, setSelectedNodefreetextId] = useState(null);
  const [showVersionPopup, setShowVersionPopup] = useState(false);
  const [versionPopupPayload, setversionPopupPayload] = useState("");
  const [processDefaultlanguage_id, setprocessDefaultlanguage_id] =
    useState(null);
  const [OriginalDefaultlanguge_id, setOriginalDefaultlanguge_id] =
    useState(null);
  const [supportedLanguages, setSupportedLanguages] = useState([]);

  const [selectedEdge, setSelectedEdge] = useState(null);
  const [getPublishedDate, setgetPublishedDate] = useState("");
  const [detailschecking, setdetailschecking] = useState(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [searchQuery, setSearchQuery] = useState("");
  const [ExistingrolesearchQuery, setExistingrolesearchQuery] = useState("");

  const [checkpublish, Setcheckpublish] = useState();
  const [showRoleGroupModal, setShowRoleGroupModal] = useState(false);
  const [showAssignOwnerModal, setShowAssignOwnerModal] = useState(false);
  const [activeRoleForOwner, setActiveRoleForOwner] = useState(null);
  const langMap = useLangMap();
  const menuWidth = 180;
  const menuHeight = 160;

  // compute position relative to .publishcontainer
  const fixedPos = getDropdownPosition(position.x, position.y, menuWidth, menuHeight);

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
  const processLangRef = useRef(processDefaultlanguage_id);
  const langMapRef = useRef(langMap);

  useEffect(() => {
    processLangRef.current = processDefaultlanguage_id;
    langMapRef.current = langMap;
  }, [processDefaultlanguage_id, langMap]);

  const { handleLabelChange } = useSwimlaneLabelChange({
    setChiledNodes,
    setHasUnsavedChanges,
    processLangRef,
    langMapRef,
    isInitialLoad,
  });

  useCheckFavorite({
    id,
    childNodes: ChildNodes,
    setIsFavorite,
  });

  const { responseData } = useFetchVersions({
    processId: id,
    currentLevel,
    currentParentId,
    LoginUser,
    status: "draft",
  });
  const assignedUsers = responseData?.assigned_users || [];

  const { fetchNodes } = useSwimlaneFetchNodes({
    api,
    mode: "edit", // 🔥 yahi change hoga view/draft me
    getLevelKey,
    currentLevel,
    currentParentId,
    LoginUser,
    id,
    windowSize,

    // setters
    setters: {
      setUser,
      setChiledNodes,
      setEdges,
      setprocess_img,
      Settitle,
      SetParentPageGroupId,
      setprocessDefaultlanguage_id,
      setOriginalDefaultlanguge_id,
      setSupportedLanguages,
      setgetPublishedDate,
      setDraftedDate
    },
    handleLabelChange,
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguageId");
    if (savedLang) {
      fetchNodes(parseInt(savedLang)); // language apply karo
    } else {
      fetchNodes(processDefaultlanguage_id); // default
    }
    // Proactively fetch existing roles for Role Groups
    const fetchExistingRoles = async () => {
      try {
        const levelParam = "level0";
        const user_id = user ? user.id : LoginUser?.id;
        const Process_id = id;
        const data = await api.getexistingrole(levelParam, parseInt(user_id), Process_id);
        const filteredNodes = data.AllexistingRole.filter((node) => node.node_id !== currentParentId);
        setLinkexistingRole(filteredNodes);
      } catch (error) {
        console.error("Proactive role fetch error:", error);
      }
    };
    if (LoginUser?.id) fetchExistingRoles();
  }, [id, LoginUser, currentParentId]);

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

            Level: getLevelKey(currentLevel, currentParentId),

            user_id: user && user.id,
            Process_id: id && id,
            type: "step",
            page_title: "Swimlane",
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
      setIsModalOpen(false);
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

  // Hook for adding nodes
  const { addNode } = useSwimlaneAddNode({
    ChildNodes,
    setChiledNodes,
    nodes,
    currentParentId,
    currentLevel,
    setHasUnsavedChanges,
    handleLabelChange,
    selectedGroupId,
    selectedexistigrolenodeId,
    langMapRef,
    processLangRef
  });

  // Hook for dragging
  const { handleNodeDragStart, handleNodeDragStop } = useSwimlaneDrag({
    setChiledNodes,
    setKeepOldPosition,
    KeepOldPosition,
    nodes,
    ChildNodes,
    setHasUnsavedChanges
  });

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
      SwimlineRightsideBox: (props) => (
        <SwimlineRightsideBox
          {...props}
          processDefaultlanguage_id={processDefaultlanguage_id}
          langMap={langMap}
        />
      ),
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
    [selectedNodeId, processDefaultlanguage_id, langMap]
  );

  const memoizedEdgeTypes = useMemo(() => edgeTypes, [edgeTypes]);

  const handleSaveNodes = async (savetype) => {
    console.log("chiils node", ChildNodes);
    if (savetype === "Published" && currentLevel !== 0) {
      try {
        const response = await filter_draft(ParentPageGroupId);

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

    const Level = getLevelKey(currentLevel, currentParentId);

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
            page_title,
            parentNode,
            status,
            page_group_id,
          }) => ({
            id,
            data,
            type,
            position,
            draggable,
            animated,
            measured,
            page_title,
            parentNode,
            status,
            page_group_id,
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
            page_title,
            status,
          }) => ({
            id,
            source,
            sourceHandle,
            target,
            targetHandle,
            markerEnd,
            animated,
            page_title,
            status,
          })
        ),
      });
      CustomAlert.success("Success", response.message);

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

    if (node) {
      const defaults = supportedLanguages.reduce((acc, langId) => {
        const langKey = langMap[langId] || `lang_${langId}`;
        acc[langKey] = node.data?.translations?.[langKey] || "";
        return acc;
      }, {});

      setTranslationDefaults(defaults);
      setShowTranslationPopup(true);
    }
  };

  const handleDeleteNode = async () => {
    if (selectedNode) {
      const confirmDeletion = window.confirm(
        "Are you sure you want to delete this nodes?"
      );
      if (!confirmDeletion) return;
      if (
        selectedNode.type === "SwimlineRightsideBox" &&
        selectedNode.data?.link
      ) {

        try {
          const Process_id = selectedNode?.process_id;
          const PageGroupId = selectedNode?.page_group_id;
          const parentId = selectedNode?.parentId;
          const link = selectedNode.data?.link;

          const deleteresponse = await deleteExistingRole(
            Process_id,
            PageGroupId,
            parentId,
            link
          );
          // console.log("deleteresponse", deleteresponse)
          if (deleteresponse.status) {
            CustomAlert.success("Success", deleteresponse.message);
          }
        } catch (error) {
          console.error("delete existiong role time error:", error);
        }
      }
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
    // console.log("node id", node);
    setSelectedEdge(null);
    if (node.page_title === "Swimlane") {
      setOptions([]);
      if (node.node_id) {
        setSelectedNodeId(node.node_id);
      } else {
        setSelectedNodeId(node.id);
      }

      setdetailschecking(node);
      event.preventDefault();
      if (node?.data?.isRoleGroup) {
        setRoleGroupEditData(node.data);
      } else {
        setRoleGroupEditData(null);
      }
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

      // Add "Add Role Group" if vertical header
      if (col === 0 && row < 6) {
        setOptions(prev => [...prev, { label: "Add Role Group", value: "Add Role Group" }]);
      }
    }
  };

  const handleSaveRoleGroup = (data) => {
    setShowRoleGroupModal(false);

    // Check if we are editing an existing node
    const isEditing = selectedNode?.data?.isRoleGroup;

    const newNodeData = {
      label: data.groupName,
      isRoleGroup: true,
      roles: data.roles,
      translations: data.translations,
      details: {
        title: data.groupName,
        content: ""
      }
    };

    if (isEditing) {
      setChiledNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id ? { ...node, data: { ...node.data, ...newNodeData } } : node
        )
      );
      setHasUnsavedChanges(true);
      CustomAlert.success("Updated", "Role Group updated successfully.");
    } else {
      addNode("SwimlineRightsideBox", "", "", newNodeData);
    }
  };

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
    if (existinglink?.data?.processlink) {
      setSelectedLinknodeIds(existinglink?.data?.processlink);
    } else {
      setSelectedLinknodeIds([]);
    }

    const user_id = user ? user.id : null;
    const Process_id = id ? id : null;
    const data = await api.getallpublishObject_Tolinkexistingmodel(
      parseInt(user_id),
      Process_id
    );

    const filteredNodes = data.nodes.filter(
      (node) => node.type !== "StickyNote" && node.node_id !== currentParentId
    );

    setLinknodeList(filteredNodes);
    setIsCheckboxPopupOpen(true);
  };

  const AddexistingRole = async () => {
    const levelParam = "level0";
    const user_id = user ? user.id : null;
    const Process_id = id ? id : null;
    const data = await api.getexistingrole(
      levelParam,
      parseInt(user_id),
      Process_id
    );

    const filteredNodes = data.AllexistingRole.filter(
      (node) => node.node_id !== currentParentId
    );
    // console.log("filteredNodes",filteredNodes)
    setLinkexistingRole(filteredNodes);
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


      if (!selectedNode) return;

      // Clone existing node data
      const newNodeData = {
        ...selectedNode.data,
        link: selectedexistigrolenodeId,
      };
      setIsexistingroleCheckboxPopupOpen(false);

      // Add new node using cloned data
      addNode("SwimlineRightsideBox", "", "", newNodeData);

      setSelectedexistingrolenodeId("");
    }
  };

  const saveSelectedNodes = async () => {
    if (selectedLinknodeIds && selectedTitle) {
      // console.log("selectedLinknodeIds", selectedLinknodeIds);

      let hasNextLevel = false;

      const match = selectedLinknodeIds.match(/level(\d+)/i);
      const extractedLevel = match ? parseInt(match[1]) : currentLevel;

      // 🔹 Increment level
      const newLevel = extractedLevel + 1;
      const levelParam = `level${newLevel}_${selectedLinknodeIds}`;
      try {
        const check = await api.checkRecord(levelParam, processId);

        hasNextLevel = check?.status === true;
      } catch (e) {
        console.error("checkRecord error", e);
      }

      setChiledNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                processlink: selectedLinknodeIds,
                hasNextLevel,
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
                  processlink: null, // remove link
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
    const confirmcondition = await handleExitBack(); // Wait for confirmation
    if (confirmcondition) {
      if (nodelink) {
        try {
          const response = await getdataByNodeId(nodelink, "draft");
          if (response.data && response.data.length > 0) {
            const user_id = response.data[0].user_id;
            const Process_id = response.data[0].process_id;
            const id = response.data[0].process_id;

            let newLevel = 1;
            if (nodelink !== null) {
              const match = nodelink.match(/^level(\d+)/);
              if (match && match[1]) {
                const currentLevel = parseInt(match[1], 10);
                newLevel = currentLevel + 1;
              }
            }

            const levelParam =
              nodelink !== null
                ? `level${newLevel}_${nodelink}`
                : `level${newLevel}`;

            const nodeData = await checkRecordWithGetLinkDraftData(
              levelParam,
              parseInt(user_id),
              Process_id,
              nodelink
            );
            // console.log("nodeData", nodeData);

            if (nodeData.status === true) {
              removeBreadcrumbsAfter(1);
              const breadcrumbs = buildBreadcrumbs(
                nodeData.allNodes,
                nodeData.ids,
                Process_id
              );
              // console.log("breadcrums", breadcrumbs);
              breadcrumbs.forEach(({ label, path, state }) => {
                addBreadcrumb(label, path, state); // blank state as you said
              });

              const mode = "draft";

              const view =
                nodeData.Page_Title === "Swimlane" ? "swimlane" : "map";


              // single navigation point
              goToProcess({
                mode,
                view,
                processId: id,
                level: newLevel,
                parentId: nodelink,
              });
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

    const currentLangId = processLangRef.current;
    const langKey = langMapRef.current[Number(currentLangId)] || "en";

    if (selectedNodefreetextId) {
      // Update existing node
      setChiledNodes((prevNodes) => {
        return prevNodes.map((node) => {
          if (node.id === selectedNodefreetextId) {
            const updatedTranslations = {
              ...(node.data.translations || {}),
              [langKey]: enteredText,
            };

            return {
              ...node,
              data: {
                ...node.data,
                label: enteredText,
                translations: updatedTranslations,
              },
            };
          }
          return node;
        });
      });

      setSelectedNodefreetextId(null);
    } else {
      // Create new FreeText node with translations
      const translations = { [langKey]: enteredText };
      addNode(
        "FreeText",
        { x: modalPosition.x, y: modalPosition.y - 20 },
        enteredText,
        { translations }
      );
    }
  };

  const UpdateText = () => {
    const data = ChildNodes.find((node) => node.id === selectedNodeId);

    setSelectedNodefreetextId(data.id);
    setModalText(data.data.label || "");
    setIsModalOpen(true);
  };

  const handlePopupAction = (action) => {
    const { x, y } = fixedPos;
    // console.log("contextMenu", contextMenu);
    // console.log("fixedPos",fixedPos);

    const edgeId = contextMenu.edgeId;
    if (action === "Yes") {
      addNode("Yes", { x: x, y: y - 20 }, edgeId);
    } else if (action === "No") {
      addNode("No", { x: x, y: y - 20 }, edgeId);
    } else if (action === "addFreeText") {
      setIsModalOpen(true);
      setModalText("");
      setModalPosition({ x, y });
    } else if (action === "addDetails") {
      openPopup();
    } else if (action === "Add Role Group") {
      setShowRoleGroupModal(true);
    }
    setContextMenu(null);
    setSelectedEdge(null);
  };

  const handleAssignOwnerAction = (role) => {
    setActiveRoleForOwner(role);
    setShowAssignOwnerModal(true);
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
        ...(detailschecking?.data?.processlink
          ? [
            {
              label: `${t("open_existing_model")}`,
              action: () =>
                openExistingModel(detailschecking?.data?.processlink),
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

    ...(detailschecking?.type !== "Yes" && detailschecking?.type !== "No"
      ? [
        {
          label: `${t("translation")}`,
          action: translation,
          borderBottom: false,
        },
      ]
      : []),

    ...(detailschecking?.type === "SwimlineRightsideBox"
      ? [
        {
          label: "Assign Role Owner",
          action: () => handleAssignOwnerAction(detailschecking),
          borderBottom: true,
        },
        ...(detailschecking?.data?.isRoleGroup ? [
          {
            label: "Manage Role Group",
            action: () => setShowRoleGroupModal(true),
            borderBottom: true,
          }
        ] : [])
      ]
      : []),

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
    } else if (option === "Add Role Group") {
      setShowRoleGroupModal(true);
    } else if (option === "Add Sticky Note") {
      // addNode("StickyNote", { x: position.x, y: position.y });

      const pos = getLocalPositionInsideContainer(position.x, position.y);

      addNode("StickyNote", pos);
    }

    setOptions([]);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
  };


  const handleExitBack = async () => {
    if (!hasUnsavedChanges) return true; // No unsaved changes, just exit

    return new Promise((resolve) => {
      CustomAlert.confirmExit(
        async () => {
          // Save & Exit
          await handleSaveNodes("draft");
          resolve(true);
        },
        () => {
          // Exit without saving
          resolve(true);
        },
        () => {
          // Cancel
          resolve(false);
        }
      );
    });
  };

  const ExitNavigation = async (type) => {
    let confirmcondition = true;
    if (!id || !user) {
      alert("Currently not navigate on draft mode");
      return;
    }
    // sirf "exit" wale case me hi confirmation lena hai
    if (type === "exit") {
      confirmcondition = await handleExitBack();
    }
    if (confirmcondition) {
      goToProcess({
        mode: "draft",
        view: "swimlane",
        processId: id,
        level: currentLevel,
        parentId: currentLevel === 0 ? undefined : currentParentId,
      });
    }
  };
  const parsedData = LinknodeList.map((item) => ({
    ...item,
    data: JSON.parse(item.data), // Parse the data field
  }));

  const langKey = langMap[processDefaultlanguage_id] || "en";

  const translatedData = parsedData.map((item) => {
    const { translations = {}, label = "" } = item.data || {};
    const newLabel = translations[langKey] || label;

    return {
      ...item,
      data: {
        ...item.data,
        label: newLabel, // ✅ override label with translation
      },
    };
  });
  // console.log("translatedData",translatedData)
  const filteredData = translatedData.filter((item) =>
    item.data.label && item.data.label.toLowerCase().includes(searchQuery.toLowerCase())
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

    const PageGroupId = ChildNodes[0]?.page_group_id;

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

  // ye common page h
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

  const updateNodeTranslations = (nodeId, translations) => {
    setChiledNodes((nds) =>
      nds.map((node) => {
        if (node.id !== nodeId) return node;

        const langKey = langMap[processDefaultlanguage_id] || "en";
        const newLabel =
          translations[langKey] || node.data.label || node.data?.details?.title;

        if (node.type === "StickyNote" || node.type === "FreeText") {
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
    setHasUnsavedChanges(true);
  };


  const handleNext = (data) => {
    // console.log("STEP-1 DATA: ", data);

    // 👉 Agar Editorial Change select kiya hai
    if (data.editorialChange) {
      setShowPublishPopup(false);
      setShowEditorialPopup(true);
    }

    // 👉 Agar Classification Change select kiya hoga
    // yaha par future me doosra popup open karna h
    if (data.classificationChange) {
      setShowPublishPopup(false);
      setShowContentPopup(true);
    }
  };

  const { responseData: revisionresponse, refetch } = useFetchVersions({
    processId,
    currentLevel,
    currentParentId,
    LoginUser,
    status: "draft",
  });

  const handleSavePublish = async () => {
    const latestData = await refetch();
    const contact = latestData?.contact_info;
    // console.log("responseData", revisionresponse)
    // contact_info missing ya empty object
    if (!contact || Object.keys(contact).length === 0) {
      alert("Please assign Process Owner / Process Modeler to publish the model.");
      return;
    }

    // contact_info ke sare keys empty array hon?
    const allEmpty = Object.values(contact).every(
      (list) => !list || list.length === 0
    );

    if (allEmpty) {
      alert("Please assign Process Owner /  Process Modeler to publish the model.");
      return;
    }

    // Open popup if valid
    setShowPublishPopup(true);
  };

  const handleSaveVersionDetails = (payload) => {
    setversionPopupPayload(payload);
    setShowVersionPopup(false);
    setHasUnsavedChanges(true);
  };

  // const handleSupportViewlangugeId = (langId) => {
  //   fetchNodes(langId);
  // };

  const handleLanguageSwitch = async (langId) => {
    if (!hasUnsavedChanges) {
      // No unsaved changes — directly switch language
      fetchNodes(langId);
      localStorage.setItem("selectedLanguageId", langId);

      return;
    }

    const shouldProceed = await new Promise((resolve) => {
      CustomAlert.confirmLanguageSwitch(
        async () => {
          // ✅ Save & switch
          await handleSaveNodes("draft");
          resolve(true);
        },
        () => {
          // ⚠️ Discard and switch
          resolve(true);
        }
      );
    });

    if (shouldProceed) {
      fetchNodes(langId);
    }
  };
  return (
    <div>
      <Header
        savefav={handleFav}
        title={headerTitle}
        onSave={handleSaveNodes}
        onPublish={handleSaveNodes}
        addNode={addNode}
        handleBackdata={handleExitBack}
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
        handleSupportViewlangugeId={handleLanguageSwitch}
        supportedLanguages={supportedLanguages}
        selectedLanguage={processDefaultlanguage_id}
        OriginalDefaultlanguge_id={OriginalDefaultlanguge_id}
      />

      <div
        className="publishcontainer"
        style={{ ...styles.appContainer, height: safeRemainingHeight }}
      >
        <ReactFlowProvider>
          <div style={styles.scrollableWrapper} className="scrollbar_wrapper">
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

            <EdgeContextMenu
              visible={!!selectedEdge}
              position={fixedPos}
              t={t}
              onAction={handlePopupAction}
              onDelete={deleteEdge}
            />

            <CustomContextPopup
              isVisible={!!MenuVisible}
              position={contextMenu || { x: 0, y: 0 }}
              menuItems={menuItems}
              onClose={handleClosePopup}
            />


            <PublishPopup
              isOpen={showPublishPopup}
              onClose={() => setShowPublishPopup(false)}
              onNext={handleNext}
              revisionresponse={revisionresponse}
              selectedLanguage={processDefaultlanguage_id}

            />

            <EditorialChangePopup
              isOpen={showEditorialPopup}
              onBack={() => {
                setShowEditorialPopup(false);
                setShowPublishPopup(true);
              }}
              onPublish={(finalData) => {
                console.log("FINAL PUBLISH DATA", finalData);
                setShowEditorialPopup(false);
              }}

            />


            <ContentChangePopup
              isOpen={showContentPopup}
              type={"Swimlane"}
              onBack={() => {
                setShowContentPopup(false);
                setShowPublishPopup(true);
              }}
              onStartApproval={(finalData) => {
                console.log("CONTENT CHANGE FINAL:", finalData);
                setShowContentPopup(false);
              }}
              revisionresponse={revisionresponse}
            />

            <DetailsPopup
              className="detailspopup_swimlane"
              isOpen={isPopupOpen}
              onClose={closePopup}
              onSave={saveDetails}
              Details={
                ChildNodes.find((node) => node.node_id === selectedNodeId) ||
                null
              }
              supportedLanguages={supportedLanguages}
              selectedLanguage={processDefaultlanguage_id}
            />

            <ExistingModelPopup
              isOpen={isCheckboxPopupOpen}
              t={t}
              popupStyle={popupStyle}
              styles={styles}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredData={filteredData}
              selectedId={selectedLinknodeIds}
              onCheckboxChange={handleCheckboxChange}
              onSave={saveSelectedNodes}
            />

            <ExistingRolePopup
              isOpen={isexistingroleCheckboxPopupOpen}
              t={t}
              popupStyle={popupStyle}
              styles={styles}
              searchQuery={ExistingrolesearchQuery}
              setSearchQuery={setExistingrolesearchQuery}
              data={filteredDataExistingrole}
              selectedId={selectedexistigrolenodeId}
              onSelect={handleexistingroleCheckboxChange}
              onSave={handleSaveExistingRole}
            />

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
              supportedLanguages={supportedLanguages}
              onSubmit={(values) => {
                console.log("Translations:", values);

                // Update node logic
                const node = ChildNodes.find((n) => n.id === selectedNodeId);
                if (node) {
                  updateNodeTranslations(node.id, values);
                }

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
                versionPopupPayload={versionPopupPayload}
                supportedLanguages={supportedLanguages}
                selectedLanguage={processDefaultlanguage_id}
              />
            )}

            <ManageRoleGroupModal
              isOpen={showRoleGroupModal}
              onClose={() => {
                setShowRoleGroupModal(false);
                setRoleGroupEditData(null);
              }}
              onSav
              onSave={handleSaveRoleGroup}
              initialData={roleGroupEditData}
              supportedLanguages={supportedLanguages}
              langMap={langMap}
              existingRoles={parsedDataExistingrole}
              allUsers={assignedUsers}
              selectedLanguage={processDefaultlanguage_id}
            />

            <AssignRoleOwnerModal
              isOpen={showAssignOwnerModal}
              onClose={() => setShowAssignOwnerModal(false)}
              onAssign={(user) => {
                setChiledNodes(prev => prev.map(n =>
                  n.id === activeRoleForOwner.id ? { ...n, data: { ...n.data, owner: user } } : n
                ));
              }}
              initialOwner={activeRoleForOwner?.data?.owner}
              users={assignedUsers}
            />
          </div>
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

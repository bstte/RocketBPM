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
  reconnectEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Header from "../../components/Header";
import Popup from "../../components/Popup";
import ArrowBoxNode from "../../AllNode/ArrowBoxNode";
import PentagonNode from "../../AllNode/PentagonNode";
import api, { addFavProcess, filter_draft, getNextPageGroupId, removeFavProcess, saveProcessInfo } from "../../API/api";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";
import CustomContextMenu from "../../components/CustomContextMenu";
import CustomAlert from "../../components/CustomAlert";
import { useSelector } from "react-redux";
import "../../Css/MapLevel.css";
import StickyNote from "../../AllNode/StickyNote";
import VersionPopup from "./VersionPopup";
import { useDynamicHeight } from "../../hooks/useDynamicHeight";
import useCheckFavorite from "../../hooks/useCheckFavorite";
import { usePageGroupIdViewer } from "../../hooks/usePageGroupIdViewer";
import TranslationPopup from "../../hooks/TranslationPopup";
import { useLangMap } from "../../hooks/useLangMap";
const MapLevel = () => {
  const [totalHeight, setTotalHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [checkpublish, Setcheckpublish] = useState(true);
  const { remainingHeight } = useDynamicHeight();

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
  const { level, parentId, processId } = useParams();
  const location = useLocation();
  const LoginUser = useSelector((state) => state.user.user);
  const [showTranslationPopup, setShowTranslationPopup] = useState(false);
  const [translationDefaults, setTranslationDefaults] = useState({ en: "", de: "", es: "" });

  const langMap = useLangMap();

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
  const [showVersionPopup, setShowVersionPopup] = useState(false);

  const currentParentId = parentId || null;
  const { addBreadcrumb, removeBreadcrumbsAfter } = useContext(BreadcrumbsContext);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [popupTitle, setPopupTitle] = useState("");
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [checkRecord, setcheckRecord] = useState(null);
  const [getPublishedDate, setgetPublishedDate] = useState("");
  const [getDraftedDate, setDraftedDate] = useState("");
  const [process_img, setprocess_img] = useState("");
  const [processDefaultlanguage_id, setprocessDefaultlanguage_id] = useState(null);
  const [versionPopupPayload, setversionPopupPayload] = useState("");

  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [OriginalPosition, setOriginalPosition] = useState({
    x: 0,
    y: 0,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [headerTitle, setHeaderTitle] = useState(`${title} `);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const memoizedNodeTypes = useMemo(
    () => ({
      progressArrow: (props) => <ArrowBoxNode {...props} selectedNodeId={selectedNodeId} />,
      pentagon: (props) => <PentagonNode {...props} selectedNodeId={selectedNodeId} />,
      StickyNote: (props) => <StickyNote {...props} selectedNodeId={selectedNodeId} editable={true} />,
    }),
    [selectedNodeId]
  );
  const memoizedEdgeTypes = useMemo(
    () => ({
      smoothstep: SmoothStepEdge,
      bezier: BezierEdge,
      straight: StraightEdge,
    }),
    []
  );
  useEffect(() => {
    const checkpublishfunction = async () => {
      if (currentLevel !== 0) {
        try {
          const response = await filter_draft(ParentPageGroupId);
          console.log("inside first map", response)
          if (response?.data === true) {
            Setcheckpublish(false);

          } else {
            Setcheckpublish(true);

          }
        } catch (error) {
          console.error("filter draft error", error)
        }
      }
    };
    checkpublishfunction();
  }, [ParentPageGroupId, currentLevel]);
  const handleLabelChange = useCallback(
    (nodeId, newLabel) => {
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) => {
          if (node.id !== nodeId) return node;

          // language id → key map
          const langKey = langMap[processDefaultlanguage_id] || "en";

          return {
            ...node,
            data: {
              ...node.data,
              // update correct language
              translations: {
                ...(node.data.translations || {}),
                [langKey]: newLabel,
              },
              // optional: update "label" field भी ताकि UI compatible रहे
              label: newLabel,
            },
          };
        });

        const changedNode = prevNodes.find((n) => n.id === nodeId);
        if (changedNode && changedNode.data.label !== newLabel) {
          // setHasUnsavedChanges(true);
        }
        return updatedNodes;
      });
    },
    [setNodes, processDefaultlanguage_id]
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
        const draftStatus = "Draft";
        const PageGroupId = nodes[0]?.PageGroupId
        const [publishedResponse, draftResponse, data] = await Promise.all([
          api.GetPublishedDate(levelParam, parseInt(user_id), Process_id, publishedStatus, PageGroupId),
          api.GetPublishedDate(levelParam, parseInt(user_id), Process_id, draftStatus, PageGroupId),
          api.getNodes(levelParam, parseInt(user_id), Process_id),
        ]);
        if (publishedResponse.status === true) {
          setgetPublishedDate(publishedResponse.created_at || "");
        } else {
          setgetPublishedDate("");
        }
        if (draftResponse.status === true) {
          setDraftedDate(draftResponse.created_at || "");
        } else {
          setDraftedDate("");
        }
        setprocess_img(data.process_img)
        setprocessDefaultlanguage_id(data.processDefaultlanguage_id)

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
            const user_id = user ? user.id : null;
            const Process_id = id ? id : null;
            let hasNextLevel = false;
            try {
              const check = await api.checkRecord(levelParam, parseInt(user_id), Process_id);
              hasNextLevel = check?.status === true;
            } catch (e) {
              console.error("checkRecord error", e);
            }
            return {
              ...node,
              data: {
                ...parsedData,
                onLabelChange: (newLabel) => handleLabelChange(node.node_id, newLabel),

                width_height: parsedMeasured,
                node_id: node.node_id,
                LinkToStatus: node.LinkToStatus,
                hasNextLevel, // 👈 naya flag add kiya
              },
              type: node.type,
              id: node.node_id,
              measured: parsedMeasured,
              position: parsedPosition,
              draggable: Boolean(node.draggable),
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
        alert("Failed to fetch object. Please refresh this page.");
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
      currentLevel === 0
        ? "/Map-level"
        : `/level/${currentLevel}/${currentParentId}`;
    const state = {
      id: id,
      title: title,
      user: user,
    };
    if (currentLevel >= 0 && isNavigating) {
      const safeIndex = Math.max(1, currentLevel - 1);
      removeBreadcrumbsAfter(safeIndex);
    }
    addBreadcrumb(label, path, state);
    setIsNavigating(false);
  }, [
    currentLevel,
    isNavigating,
    currentParentId,
    addBreadcrumb,
    removeBreadcrumbsAfter,
    id,
    title,
    user,
  ]);
  const onConnect = useCallback((connection) => {
    console.log('Connected:', connection);
  }, []);
  const addNode = async (type, position, label = "") => {
    const newNodeId = uuidv4();
    let PageGroupId;
    if (!nodes.PageGroupId) {
      const response = await getNextPageGroupId();
      PageGroupId = response.next_PageGroupId;

    } else {
      PageGroupId = nodes[0]?.PageGroupId;
    }
    const newNode = {
      id:
        currentParentId !== null
          ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
          : `Level${currentLevel}_${newNodeId}`,
      data: {
        label: type === "StickyNote" ? label : "",
        shape: type,
        onLabelChange: (newLabel) =>
          handleLabelChange(
            currentParentId !== null
              ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
              : `Level${currentLevel}_${newNodeId}`,
            newLabel
          ),
        defaultwidt: 326,
        defaultheight: 90,
        width_height: type === "StickyNote"
          ? { width: 240, height: 180 }
          : { width: 326, height: 90 },
        nodeResize: true,
        autoFocus: true,
        isClickable: true,
        updateWidthHeight: (id, size) => {
          setNodes((prevNodes) =>
            prevNodes.map((node) =>
              node.id === id
                ? {
                  ...node,
                  data: {
                    ...node.data,
                    width_height: size,
                  },
                }
                : node
            )
          );
        },
      },
      type: type,
      status: "draft",
      position: { x: position.x, y: position.y },
      draggable: true,
      isNew: true,
      animated: true,
      Page_Title: "ProcessMap",
      PageGroupId: PageGroupId
    };
    setNodes((nds) => nds.concat(newNode));
    setHasUnsavedChanges(true);
    setSelectedNodeId(newNode.id);
    setTimeout(() => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === newNode.id ? { ...node, isNew: false } : node
        )
      );
    }, 1000);
  };


  const deleteNode = useCallback(() => {
    if (selectedNode) {
      const selectedNodeData = nodes.find((node) => node.id === selectedNode);

      // ✅ Agar LinkToStatus true hai to delete block karo
      if (selectedNodeData?.data?.LinkToStatus === true) {
        CustomAlert.warning(
          "Cannot Delete",
          "This node is already linked. You cannot delete a linked node."
        );
        return;
      }
      if (checkRecord?.status === true) {
        // 👉 Prevent delete — show info alert only
        CustomAlert.warning(
          "Cannot Delete",
          "This node has objects inside. Please delete them first."
        );
        return;
      }
      CustomAlert.confirm(
        "Delete Node",
        "Are you sure you want to delete this node?",
        () => {
          setNodes((nds) => nds.filter((node) => node.id !== selectedNode));
          setEdges((eds) =>
            eds.filter(
              (edge) => edge.source !== selectedNode && edge.target !== selectedNode
            )
          );
          setSelectedNode(null);
          setShowPopup(false);
          setHasUnsavedChanges(true);
          setHeaderTitle(`${title}`);
        }
      );
    }
  }, [selectedNode, setNodes, setEdges, title, checkRecord]);
  const handleNodeRightClick = async (event, node) => {
    setShowContextMenu(false);

    event.preventDefault();
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
    setcheckRecord(data)
    setSelectedNode(node.id);
    setPopupTitle(node.data.label || "Node Actions");
    const { clientX, clientY } = event;
    const flowContainer = document.querySelector(".flow-container");
    const containerRect = flowContainer.getBoundingClientRect();
    setPopupPosition({
      x: clientX - containerRect.left,
      y: clientY - containerRect.top,
    });
    setShowPopup(true);
  };
  useEffect(() => {
    const stateTitle = location.state?.title || title;
    setHeaderTitle(`${stateTitle}`);
  }, [location.state, currentLevel, title]);
  const handleCreateNewNode = async (type) => {
    if (selectedNode) {
      const selectedNodeData = nodes.find((node) => node.id === selectedNode);
      const selectedLabel = selectedNodeData?.data?.label || "";
      const newLevel = currentLevel + 1;
      setShowPopup(false);
      const confirmcondition = await handleBack();
      if (confirmcondition) {
        if (type === "ProcessMap") {
          if (checkRecord.status === true) {

            navigate(
              `/Draft-Process-View/${newLevel}/${selectedNode}/${id}?title=${selectedLabel}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${nodes[0]?.PageGroupId}`
            )
          } else {

            navigate(`/level/${newLevel}/${selectedNode}/${id}?title=${encodeURIComponent(selectedLabel || "")}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${nodes[0]?.PageGroupId}`)

          }
        }
        if (type === "Swimlane") {
          if (checkRecord.status === true) {
            navigate(`/Draft-Swim-lanes-View/level/${newLevel}/${selectedNode}/${id}?title=${encodeURIComponent(selectedLabel || "")}&user=${encodeURIComponent(JSON.stringify(user))}&parentId=${selectedNode}&level=${newLevel}&ParentPageGroupId=${nodes[0]?.PageGroupId}`)

          } else {

            addBreadcrumb(
              `${selectedLabel || ""} `,

              `/swimlane/level/${newLevel}/${selectedNode}/${id}?title=${encodeURIComponent(selectedLabel || "")}&user=${encodeURIComponent(JSON.stringify(user))}&parentId=${selectedNode}&level=${newLevel}&ParentPageGroupId=${nodes[0]?.PageGroupId}`

            );
            navigate(`/swimlane/level/${newLevel}/${selectedNode}/${id}?title=${encodeURIComponent(selectedLabel || "")}&user=${encodeURIComponent(JSON.stringify(user))}&parentId=${selectedNode}&level=${newLevel}&ParentPageGroupId=${nodes[0]?.PageGroupId}`)

          }
        }
      }
    }
  };
  const handleSaveNodes = async (savetype) => {
    if (savetype === "Published" && currentLevel !== 0) {

      try {
        const response = await filter_draft(ParentPageGroupId);
        console.log("inside first", response)

        if (response.data === true) {
          alert("Publish all parent models first");
          return false
        }
      } catch (error) {
        console.error("filter draft error", error)
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
        LoginUserId,
        datasavetype,
        nodes: nodes.map(
          ({
            id,
            data,
            type,
            position,
            draggable,
            animated,
            measured,
            Page_Title,
            status,
            PageGroupId
          }) => ({
            id,
            data,
            type,
            position,
            draggable,
            animated,
            measured,
            Page_Title,
            status,
            PageGroupId
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
          }) => ({
            id,
            source,
            sourceHandle,
            target,
            targetHandle,
            markerEnd,
            animated,
            Page_Title,
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
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" && selectedNode) {
        deleteNode();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNode, deleteNode]);
  const switchNodeType = (type) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode
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
      setShowPopup(false);
    }
  };
  const handleContextMenuOptionClick = (type) => {
    setShowContextMenu(false);
    if (type === "StickyNote") {


      addNode("StickyNote", { x: OriginalPosition.x, y: OriginalPosition.y });


    } else {
      addNode(type, { x: OriginalPosition.x, y: OriginalPosition.y });

    }
  };
  const handlePageClick = useCallback(() => {
    setShowPopup(false);
    if (showContextMenu) {
      setShowContextMenu(false);
    }
  }, [showContextMenu]);
  const handleGlobalContextMenu = (event) => {
    event.preventDefault();
    const flowContainer = document.querySelector(".flow-container");
    if (!flowContainer) return;

    if (event.target.closest(".react-flow__node")) {
      return;
    }
    const containerRect = flowContainer.getBoundingClientRect();
    setShowContextMenu(true);
    setContextMenuPosition({
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top,
    });
    setOriginalPosition({
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top,
    });
    setShowPopup(false)
  };
  useEffect(() => {
    document.addEventListener("click", handlePageClick);

    return () => {
      document.removeEventListener("click", handlePageClick);
    };
  }, [handlePageClick]);
  const iconNames = {};
  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      setEdges((prevEdges) => reconnectEdge(oldEdge, newConnection, prevEdges));
    },
    [setEdges]
  );
// const handleBack = async () => {
//   if (!hasUnsavedChanges) {
//     return true; // no unsaved changes, just exit
//   }

//   // Custom popup instead of window.confirm
//   return new Promise((resolve) => {
//     const userChoice = window.confirm(
//       "You have unsaved changes.\nPress OK to Save & Exit or Cancel to Exit without saving."
//     );

//     if (userChoice) {
//       // User wants to save before exit
//       handleSaveNodes("draft").then(() => resolve(true));
//     } else {
//       // Exit without saving
//       resolve(true);
//     }
//   });
// };

const handleBack = async () => {
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


  const translation = () => {
    const node = nodes.find((n) => n.id === selectedNode);
    console.log("get node", node)
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
  }
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
  const ExitNavigation = async (type) => {
    let confirmcondition = true;

    // sirf "exit" wale case me hi confirmation lena hai
    if (type === "exit") {
      confirmcondition = await handleBack();
    }

    if (confirmcondition) {
      if (id && user) {
        if (currentLevel === 0) {
          navigate(`/Draft-Process-View/${id}?title=${encodeURIComponent(title)}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${ParentPageGroupId}`
          )
          // navigate('/Draft-Process-View', { state: { id: id, title: title, user: user } })
        } else {
          navigate(`/Draft-Process-View/${currentLevel}/${currentParentId}/${id}?title=${encodeURIComponent(title)}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${ParentPageGroupId}`)
          // navigate(`/Draft-Process-View/${currentLevel}/${currentParentId}`, { state: { id: id, title: title, user: user } })
        }

      } else {
        alert("Currently not navigate on draft mode")
      }
    }
  }
  const handleNodeDragStart = (event, node) => {
    setNodes((nodes) =>
      nodes.map((n) => (n.id === node.id ? { ...n, originalPosition: { ...n.position } } : n))
    );
  };
  const handleNodeDragStop = (event, node) => {
    const flowContainer = document.querySelector(".flow-container");
    if (!flowContainer) return;
    const { left, top, right, bottom } = flowContainer.getBoundingClientRect();
    const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
    if (!nodeElement) return;
    const nodeRect = nodeElement.getBoundingClientRect();
    const isOutOfBounds =
      nodeRect.left < left ||
      nodeRect.top < top ||
      nodeRect.right > right ||
      nodeRect.bottom > bottom;
    if (isOutOfBounds) {
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === node.id ? { ...n, position: { ...n.originalPosition } } : n
        )
      );
    }
  };

  const handleNodeClick = (event, node) => {
    setSelectedNodeId(node.id);

  };

  const navigateToVersion = (process_id, level, version) => {
    const encodedTitle = encodeURIComponent("ProcessMap");
    navigate(`/Draft-Process-Version/${process_id}/${level}/${version}/${encodedTitle}`);
  };

  const handleVersionClick = () => {
    setShowVersionPopup(true);
  };

  const updateNodeTranslations = (nodeId, translations) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== nodeId) return n;

        // current default language ka key nikaalo
        const langKey = langMap[processDefaultlanguage_id] || "en";
        const newLabel = translations[langKey] || n.data.label;

        return {
          ...n,
          data: {
            ...n.data,
            translations,   // ✅ update all translations
            label: newLabel // ✅ sync label with current language
          },
        };
      })
    );
  };




  const handleSaveVersionDetails = (payload) => {
    setversionPopupPayload(payload)
    setShowVersionPopup(false)
  }
  return (
    <div>
      <Header
        title={headerTitle}
        onSave={handleSaveNodes}
        onPublish={handleSaveNodes}
        addNode={() => console.log("add node")}
        handleBackdata={handleBack}
        iconNames={iconNames}
        currentLevel={currentLevel}
        getPublishedDate={getPublishedDate}
        getDraftedDate={getDraftedDate}
        setIsNavigating={setIsNavigating}
        Page={"Draft"}
        onExit={ExitNavigation}
        savefav={handleFav}
        isFavorite={isFavorite}
        Process_img={process_img}
        checkpublish={checkpublish}
        onShowVersion={handleVersionClick}

      />
      {/* <button onClick={checkbreadcrums}>
        Test
      </button> */}
      <ReactFlowProvider>
        <div className="app-container" style={{ ...styles.appContainer, height: remainingHeight }}>
          <div className="content-wrapper" style={styles.contentWrapper}>
            <div
              className="flow-container"
              style={styles.flowContainer}
              onContextMenu={handleGlobalContextMenu}
            >
              <ReactFlow
                //nodeExtent={[[0, 0], [flowcontainerwidth, remainingHeight]]}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                onConnect={onConnect}
                onReconnect={onReconnect}
                nodeTypes={memoizedNodeTypes}
                edgeTypes={memoizedEdgeTypes}
                minZoom={0.1}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                panOnDrag={false}
                fitView={true}
                onNodeDragStart={handleNodeDragStart}
                onNodeDragStop={handleNodeDragStop}
                panOnScroll={false}
                maxZoom={0.5}
                proOptions={{ hideAttribution: true }}
                onNodeContextMenu={handleNodeRightClick}
                preventScrolling={false}
                nodesDraggable={true}
                style={styles.reactFlowStyle}
              ></ReactFlow>
              <CustomContextMenu
                showContextMenu={showContextMenu}
                contextMenuPosition={contextMenuPosition}
                handleContextMenuOptionClick={handleContextMenuOptionClick}
              />
              <Popup
                showPopup={showPopup}
                popupPosition={popupPosition}
                popupTitle={popupTitle}
                selectedNodeType={
                  nodes.find((node) => node.id === selectedNode)?.type
                }
                switchNodeType={switchNodeType}
                handleCreateNewNode={handleCreateNewNode}
                deleteNode={deleteNode}
                translation={translation}
                condition={checkRecord}
              />
            </div>
          </div>

          {usePageGroupIdViewer(nodes)}


        </div>
        <TranslationPopup
          isOpen={showTranslationPopup}
          onClose={() => setShowTranslationPopup(false)}
          defaultValues={translationDefaults}
          onSubmit={(values) => {
            console.log("Translations:", values);


            updateNodeTranslations(selectedNode, values);

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
            type={"ProcessMaps"}
            versionPopupPayload={versionPopupPayload}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
};
export default MapLevel;
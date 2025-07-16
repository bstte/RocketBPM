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
import api, { addFavProcess, checkFavProcess, filter_draft, removeFavProcess } from "../../API/api";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";
import CustomContextMenu from "../../components/CustomContextMenu";
import CustomAlert from "../../components/CustomAlert";
import { useSelector } from "react-redux";
import "../../Css/MapLevel.css";
import StickyNote from "../../AllNode/StickyNote";
import StickyNoteModel from "../../components/StickyNoteModel";
import VersionPopup from "./VersionPopup";
const MapLevel = () => {
  const [totalHeight, setTotalHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [checkpublish, Setcheckpublish] = useState(true);
  const [remainingHeight, setRemainingHeight] = useState(0);

  // const flowcontainer = document.querySelector(".flow-container");
  // const flowcontainerwidth = flowcontainer ? flowcontainer.getBoundingClientRect().width : 0;
  // alert(flowcontainerwidth);
  useEffect(() => {
    const calculateHeights = () => {
      const element = document.querySelector(".ss_new_hed");
      const element2 = document.querySelector(".app-header");
      const elementHeight = element ? element.getBoundingClientRect().height : 0;
      const appHeaderHeight = element2 ? element2.getBoundingClientRect().height : 0;
      const newHeight = window.innerHeight - (elementHeight + appHeaderHeight);
      setRemainingHeight(newHeight - 40);
    };
    calculateHeights();
    window.addEventListener("resize", calculateHeights);
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
  const { level, parentId } = useParams();
  const location = useLocation();
  const LoginUser = useSelector((state) => state.user.user);
  const { id, title, user, ParentPageGroupId } = location.state || {};
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
  const [process_udid, setprocess_udid] = useState("");

  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [OriginalPosition, setOriginalPosition] = useState({
    x: 0,
    y: 0,
  });
  const [selectedNodeStickyNoteId, setSelectedNodeStickyNoteId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [headerTitle, setHeaderTitle] = useState(`${title} `);
  const [isNavigating, setIsNavigating] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        const updatedNodes = prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        );
        const changedNode = prevNodes.find((n) => n.id === nodeId);
        if (changedNode && changedNode.data.label !== newLabel) {
          // setHasUnsavedChanges(true);
        }
        return updatedNodes;
      });
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
        const draftStatus = "Draft";
        const [publishedResponse, draftResponse, data] = await Promise.all([
          api.GetPublishedDate(levelParam, parseInt(user_id), Process_id, publishedStatus),
          api.GetPublishedDate(levelParam, parseInt(user_id), Process_id, draftStatus),
          api.getNodes(levelParam, parseInt(user_id), Process_id),
        ]);
        console.log("data", data)
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
              nodeResize: true,
              node_id: node.node_id,
              isClickable: false,
              LinkToStatus: node.LinkToStatus,

            },
            type: node.type,
            id: node.node_id,
            measured: parsedMeasured,
            position: parsedPosition,
            draggable: Boolean(node.draggable),
            animated: Boolean(node.animated),
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


  useEffect(() => {
    const checkfav = async () => {
      const user_id = LoginUser ? LoginUser.id : null;
      const process_id = id ? id : null;
      if (!user_id || !process_id) {
        console.error("Missing required fields:", { user_id, process_id });
        return;
      }
      try {
        const PageGroupId = nodes[0]?.PageGroupId;
        const response = await checkFavProcess(user_id, process_id, PageGroupId);
        console.log("Response:", response);
        setIsFavorite(response.exists)
      } catch (error) {
        console.error("check fav error:", error);
      }
    }
    checkfav()
  }, [LoginUser, id, nodes])


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
  const addNode = (type, position, label = "") => {
    console.log("position", position);
    const newNodeId = uuidv4();
    let PageGroupId;
    if (nodes.length === 0) {
      // PageGroupId = uuidv4();
      PageGroupId = Math.floor(100000000 + Math.random() * 900000000);

    } else {
      PageGroupId = nodes[0]?.PageGroupId;
    }
    console.log("page groupid", PageGroupId)
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
        width_height: { width: 326, height: 90 },
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
  }, [selectedNode, setNodes, setEdges, title]);
  const handleNodeRightClick = async (event, node) => {
    setShowContextMenu(false);
    // if (node.type === "StickyNote") {
    //   return;
    // }
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
    // console.log("check nodes section ", nodes[0]?.PageGroupId)
    if (selectedNode) {
      const selectedNodeData = nodes.find((node) => node.id === selectedNode);
      const selectedLabel = selectedNodeData?.data?.label || "";
      const newLevel = currentLevel + 1;
      setShowPopup(false);
      const confirmcondition = await handleBack();
      if (confirmcondition) {
        if (type === "ProcessMap") {
          if (checkRecord.status === true) {
            // navigate(`/Draft-Process-View/${newLevel}/${selectedNode}`, {
            //   state: { id, title: selectedLabel, user, ParentPageGroupId: nodes[0]?.PageGroupId },
            // });
            navigate(
              `/Draft-Process-View/${newLevel}/${selectedNode}/${id}?title=${selectedLabel}&user=${encodeURIComponent(JSON.stringify(user))}&ParentPageGroupId=${nodes[0]?.PageGroupId}`
            )
          } else {
            navigate(`/level/${newLevel}/${selectedNode}`, {
              state: { id, title: selectedLabel, user, ParentPageGroupId: nodes[0]?.PageGroupId },
            });
          }
        }
        if (type === "Swimlane") {
          if (checkRecord.status === true) {
            // navigate(`/Draft-Swim-lanes-View/level/${newLevel}/${selectedNode}`, {
            //   state: {
            //     id,
            //     title: selectedLabel,
            //     user,
            //     parentId: selectedNode,
            //     level: newLevel,
            //     ParentPageGroupId: nodes[0]?.PageGroupId
            //   },
            // });

            navigate(`/Draft-Swim-lanes-View/level/${newLevel}/${selectedNode}/${id}?title=${encodeURIComponent(selectedLabel || "")}&user=${encodeURIComponent(JSON.stringify(user))}&parentId=${selectedNode}&level=${newLevel}&ParentPageGroupId=${nodes[0]?.PageGroupId}`)

          } else {
            addBreadcrumb(
              `${selectedLabel} `,
              `/swimlane/level/${newLevel}/${selectedNode}`,
              { id, title, user, parentId: selectedNode, level: newLevel }
            );
            navigate(`/swimlane/level/${newLevel}/${selectedNode}`, {
              state: {
                id,
                title: selectedLabel,
                user,
                parentId: selectedNode,
                level: newLevel,
                ParentPageGroupId: nodes[0]?.PageGroupId
              },
            });
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
    const Level =
      currentParentId !== null
        ? `Level${currentLevel}_${currentParentId}`
        : `Level${currentLevel}`;
    const user_id = user && user.id;
    const Process_id = id && id;
    const datasavetype = savetype;
    const LoginUserId = LoginUser ? LoginUser.id : null;

    try {
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

      setIsModalOpen(true);
      setModalText("")
      console.log("modalText", modalText)

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
  const handleBack = async () => {
    if (hasUnsavedChanges) {
      const userConfirmed = window.confirm(
        "You have unsaved changes. Do you want to save them before leaving?"
      );
      if (!userConfirmed) {
        return false;
      }
      await handleSaveNodes("draft");
    }
    return true;
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
      // borderLeft: "1px solid #002060",
      // borderRight: "1px solid #002060",
      // borderBottom: "1px solid #002060",

      border: '2px solid #FF364A',
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
  const ExitNavigation = async () => {
    const confirmcondition = await handleBack();
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
  // console.log("nodes",nodes)
  const handleNodeClick = (event, node) => {
    setSelectedNodeId(node.id);
    // if (node.type === "StickyNote") {
    //   setSelectedNodeStickyNoteId(node.id);
    //   setModalText(node.data.label || "");
    //   setIsModalOpen(true)
    // }
  };
  const handleTextSubmit = (enteredText) => {
    setIsModalOpen(false);
    if (!enteredText) return;
    if (selectedNodeStickyNoteId) {
      setNodes((prevNodes) => {
        return prevNodes.map((node) =>
          node.id === selectedNodeStickyNoteId
            ? { ...node, data: { ...node.data, label: enteredText } }
            : node
        );
      });
      setSelectedNodeStickyNoteId(null)
    } else {
      addNode("StickyNote", { x: OriginalPosition.x, y: OriginalPosition.y }, enteredText);

    }
  };

  // ye common page h
  const navigateToVersion = (process_id, level, version) => {
    const encodedTitle = encodeURIComponent("swimlane");
    navigate(`/Draft-Process-Version/${process_id}/${level}/${version}/${encodedTitle}`);
  };

  const handleVersionClick = () => {
    setShowVersionPopup(true);
  };
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
              <StickyNoteModel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleTextSubmit}
                initialValue={modalText}
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
                condition={checkRecord}
              />
            </div>
          </div>
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


        {showVersionPopup && (
          <VersionPopup
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
export default MapLevel;
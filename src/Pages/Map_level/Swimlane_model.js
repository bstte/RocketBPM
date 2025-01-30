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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import Header from "../../components/Header";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import api, { filter_draft } from "../../API/api";
import CustomContextPopup from "../../components/CustomContextPopup";
import DetailsPopup from "../../components/DetailsPopup";
import NodeTypes from "./NodeTypes";
import generateNodesAndEdges from "../../../src/AllNode/SwimlineNodes/generateNodesAndEdges";
import styles from "./SwimlaneStyles";
import AddObjectRole from "../../AllNode/SwimlineNodes/addobjectrole";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";
import '../../Css/Swimlane.css'

const SwimlaneModel = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { id, title, user, parentId, level, ParentPageGroupId } =
    location.state || {};
  const headerTitle = `${title} `;
  const currentParentId = parentId || null;
  const currentLevel = level ? parseInt(level, 10) : 0;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [options, setOptions] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCheckboxPopupOpen, setIsCheckboxPopupOpen] = useState(false);
  const [LinknodeList, setLinknodeList] = useState([]);
  const [selectedLinknodeIds, setSelectedLinknodeIds] = useState([]);
  const [getDraftedDate, setDraftedDate] = useState("");
  const [KeepOldPosition, setKeepOldPosition] = useState(null);

  const { nodes: initialNodes } = useMemo(
    () => generateNodesAndEdges(windowSize.width, windowSize.height),
    [windowSize]
  );

  useEffect(() => {
    setNodes(initialNodes); // Update nodes dynamically
  }, [initialNodes]);

  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [ChildNodes, setChiledNodes] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [MenuVisible, setMenuVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [getPublishedDate, setgetPublishedDate] = useState("");
  const [detailschecking, setdetailschecking] = useState(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const isInitialLoad = useRef(true);
  const nodeTypes = NodeTypes;
  const edgeTypes = useMemo(
    () => ({
      smoothstep: SmoothStepEdge,
      bezier: BezierEdge,
      straight: StraightEdge,
    }),
    []
  );



  const handleLabelChange = useCallback(
    (nodeId, newLabel) => {
      setChiledNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                details: {
                  ...node.data.details,
                  title: newLabel,
                },
              },
            };
          }
          return node;
        })
      );
      if (!isInitialLoad.current) {
        setHasUnsavedChanges(true);
      }
    },
    [setChiledNodes, setHasUnsavedChanges]
  );

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        // console.log("check user ,", user);
        const levelParam =
          currentParentId !== null
            ? `Level${currentLevel}_${currentParentId}`
            : `Level${currentLevel}`;
        const user_id = user ? user.id : null;
        const Process_id = id ? id : null;

        const publishedStatus = "Published";
        const draftStatus = "Draft";

        const [publishedResponse, draftResponse, data] = await Promise.all([
          api.GetPublishedDate(
            levelParam,
            parseInt(user_id),
            Process_id,
            publishedStatus
          ),
          api.GetPublishedDate(
            levelParam,
            parseInt(user_id),
            Process_id,
            draftStatus
          ),
          api.getNodes(levelParam, parseInt(user_id), Process_id),
        ]);

        // Set Published date
        if (publishedResponse.status === true) {
          setgetPublishedDate(publishedResponse.created_at || "");
        } else {
          setgetPublishedDate("");
        }

        // Set Draft date
        if (draftResponse.status === true) {
          setDraftedDate(draftResponse.created_at || "");
        } else {
          setDraftedDate("");
        }

        const totalRows = 8;
        const totalColumns = 11;
        const groupWidth = windowSize.width / totalColumns - 14;
        const groupHeight = windowSize.height / totalRows - 14;
        const childWidth = groupWidth * 0.9;
        const childHeight = groupHeight * 0.9;
        const parsedNodes = data.nodes.map((node) => {
          const { parentId, ...remainingNodeProps } = node;
          const parsedData = JSON.parse(node.data);
          const parsedPosition = JSON.parse(node.position);
          const parsedMeasured = JSON.parse(node.measured);
        
          let centeredPosition = parsedPosition;
        
          if (parentId) {
            const parentNode = data.nodes.find((n) => n.node_id === parentId);
        
            if (parentNode) {
              const parentWidth = windowSize.width / totalColumns - 14;
              const parentHeight = windowSize.height / totalRows - 14;
        
              const childWidth = parentWidth * 0.9;
              const childHeight = parentHeight * 0.9;
        
              const parentCenterX = parentNode.position.x + parentWidth / 2;
              const parentCenterY = parentNode.position.y + parentHeight / 2;
        
              centeredPosition = {
                x: parentCenterX - childWidth / 2,
                y: parentCenterY - childHeight / 2,
              };
            }
          }
        
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
            position: centeredPosition, // Updated position
            draggable: true,
            isNew: true,
            animated: Boolean(node.animated),
            style: {
              width: groupWidth,
              height: groupHeight,
              childWidth: childWidth,
              childHeight: childHeight,
            },
          };
        });
        
        const parsedEdges = data.edges.map((edge) => ({
          ...edge,
          animated: Boolean(edge.animated),
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { stroke: "#000", strokeWidth: "0.29vh" },
          type: "step",
        }));
        isInitialLoad.current = false;
        console.log("on load time parsedNodes", parsedNodes);
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

  useEffect(() => {
    const handleRefresh = (event) => {
      const userConfirmed = window.confirm(
        "You have unsaved changes. Do you really want to leave?"
      );

      console.log("confirm data", userConfirmed);
      if (userConfirmed) {
        navigate("/List-process-title");
      } else {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleRefresh);

    return () => {
      window.removeEventListener("beforeunload", handleRefresh);
    };
  }, [navigate]);
  
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
            },
            style: { stroke: "#000", strokeWidth: 2 },
            Level:
              currentParentId !== null
                ? `Level${currentLevel}_${currentParentId}`
                : `Level${currentLevel}`,
            user_id: user && user.id,
            Process_id: id && id,
            type: "step",
            Page: "Swimlane",
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
      setOptions([]);
    },

    []
  );

  const addNode = (type, position, label = "") => {
    let PageGroupId;

    if (ChildNodes.length === 0) {
      PageGroupId = uuidv4();
    } else {
      PageGroupId = ChildNodes[0]?.PageGroupId;
    }

    if (type === "Yes" || type === "No" || type === "FreeText") {
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
          label: type === "FreeText" ? label : "",
          shape: type,
          onLabelChange: (newLabel) => handleLabelChange(newNodeId, newLabel),

          defaultwidt: "40px",
          defaultheight: "40px",
          nodeResize: false,
        },
        type: type,
        position: position || {
          x: Math.random() * 250,
          y: Math.random() * 250,
        },
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
      const groupWidth = selectedGroup?.style?.width || 100;
      const groupHeight = selectedGroup?.style?.height || 100;
      const childWidth = groupWidth * 0.9;
      const childHeight = groupHeight * 0.9;
      const centeredPosition = {
        x: selectedGroup.position.x + (groupWidth - childWidth) / 2,
        y: selectedGroup.position.y + (groupHeight - childHeight) / 2,
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
          label: "",
          details: { title: "", content: "" },
          link: "",
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
          width: childWidth,
          childWidth: childWidth,
          childHeight: childHeight,
          height: childHeight,
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

  const memoizedNodeTypes = useMemo(() => nodeTypes, [nodeTypes]);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, [edgeTypes]);

  const handleSaveNodes = async (savetype) => {
    console.log("ChildNodes", ChildNodes);
    if (savetype === "Published" && currentLevel !== 0) {
      try {
        const response = await filter_draft(ParentPageGroupId);
        if (response.data === true) {
          alert("First published previous page");
          return false;
        }
      } catch (error) {
        console.error("filter draft error", error);
      }
    }

    const Level =
      currentParentId !== null
        ? `Level${currentLevel}_${currentParentId}`
        : `Level${currentLevel}`;
    const user_id = user && user.id;
    const Process_id = id && id;
    const datasavetype = savetype;

    try {
      const response = await api.saveNodes({
        Level,
        user_id,
        Process_id,
        datasavetype,
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

  const updateNodeDetails = (nodeId, newDetails) => {

    setChiledNodes((nodes) =>
      nodes.map((node) =>
        node.node_id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                details: {
                  title: newDetails.title,
                  content: newDetails.content,
                },
              },
            }
          : node
      )
    );
  };

  const saveDetails = (details) => {
    if (selectedNodeId) {
      updateNodeDetails(selectedNodeId, details);
      setSelectedNodeId(null);
      setHasUnsavedChanges(true);
    }
    closePopup();
  };

  const handleClosePopup = () => {
    setContextMenu(null);
    setMenuVisible(false);
    setSelectedNode(null);
    setdetailschecking(null);
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
      handleClosePopup();
    }
  };

  const handleNodeRightClick = (event, node) => {
    setSelectedEdge(null);
    if (node.Page_Title === "Swimlane") {
      setOptions([]);
      setSelectedNodeId(node.node_id);
      setdetailschecking(node);
      event.preventDefault();
      setSelectedNode(node);
      setPosition({ x: event.clientX, y: event.clientY });
      setMenuVisible(true);
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        nodeId: node.id,
      });
    } else {
      const [, row, col] = node.row_id.split("_").map(Number);

      let options = [];

      // Determine options based on the node position
      if (row === 6 && col === 0) {
        options = [];
      } else if (col === 0 && row < 6) {
        options = ["Add Role"];
      } else if (row === 6 && col > 0) {
        options = ["Add Process"];
      } else {
        options = ["Add Activities", "Add Decision"];
      }
      setPosition({ x: event.clientX, y: event.clientY });
      setOptions(options);
      setSelectedGroupId(node.id);
      setSelectedNode(node);
    }
  };

  const centerChildInParent = (parentNode, childNode) => {
    const parentCenterX = parentNode.position.x + parentNode.style.width / 2;
    const parentCenterY = parentNode.position.y + parentNode.style.height / 2;
    const updatedChildPosition = {
      x: parentCenterX - childNode.style.childWidth / 2,
      y: parentCenterY - childNode.style.childHeight / 2,
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

  const handleNodeDragStop = (event, node) => {
    console.log("old nodes ", node);

    if (node.id.startsWith("Level")) {
      // Find the nearest parent node
      const nearestParentNode = nodes.find(
        (n) =>
          node.position.x >= n.position.x &&
          node.position.x <= n.position.x + n.style.width &&
          node.position.y >= n.position.y &&
          node.position.y <= n.position.y + n.style.height
      );

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
        node.type === "FreeText"
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

  const { breadcrumbs, removeBreadcrumbsAfter } =
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

    const fullPath = breadcrumbs[2].path;
    const extractedValue = fullPath.split("/").pop();

    const levelParam = "Level0";
    const user_id = user ? user.id : null;
    const Process_id = id ? id : null;
    const data = await api.getNodes(levelParam, parseInt(user_id), Process_id);
    const filteredNodes = data.nodes.filter(
      (node) => node.node_id !== extractedValue
    );
    setLinknodeList(filteredNodes);
    setIsCheckboxPopupOpen(true);
  };

  const handleCheckboxChange = (nodeId) => {
    setSelectedLinknodeIds(nodeId);
  };

  const saveSelectedNodes = () => {
    if (selectedLinknodeIds) {
      setChiledNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                link: selectedLinknodeIds,
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

  const handlePopupAction = (action) => {
    const { x, y } = contextMenu;
    console.log("contextMenu", contextMenu);

    if (action === "Yes") {
      addNode("Yes", { x: x - 30, y: y - 125 });
    } else if (action === "No") {
      addNode("No", { x: x - 70, y: y - 125 });
    } else if (action === "addFreeText") {
      const userInput = prompt("Enter text for the new node:");
      if (userInput) {
        addNode("FreeText", { x: x - 70, y: y - 125 }, userInput);
      }
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
    detailschecking?.type !== "No"
      ? [
          {
            label:
              detailschecking &&
              (!detailschecking?.data?.details?.title ||
                detailschecking?.data?.details?.title === "") &&
              (!detailschecking?.data?.details?.content ||
                detailschecking?.data?.details?.content === "")
                ? "Add details"
                : "Edit details",
            action: () => handlePopupAction("addDetails"),
            borderBottom: true,
          },
        ]
      : []),
    ...(detailschecking?.type === "box"
      ? [
          {
            label: "Switch shape to Decision",
            action: () => switchNodeType("diamond"),
            borderBottom: true,
          },
        ]
      : []),
      ...(detailschecking?.type === "diamond"
        ? [
            {
              label: "Switch shape to Activity",
              action: () => switchNodeType("box"),
              borderBottom: true,
            },
          ]
        : []),
    ...(detailschecking?.type === "progressArrow"
      ? [
          {
            label: "Link Existing model",
            action: () => linkExistingmodel(),
            borderBottom: true,
          },
        ]
      : []),

    {
      label: "Delete",
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
    } else if (option === "Add Activities") {
      addNode("box");
    } else if (option === "Add Decision") {
      addNode("diamond");
    } else if (option === "Add Process") {
      addNode("progressArrow");
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
  
  const ExitNavigation = async () => {
    const confirmcondition = await handleBack(); // Wait for confirmation
    if (confirmcondition) {
      if (id && user) {
        navigate(`/Draft-Swim-lanes-View/level/${currentLevel}/${currentParentId}`, {
          state: { id: id, title: title, user: user, parentId: currentParentId, level: currentLevel }
        });
      } else {
        alert("Currently not navigate on draft mode");
      }
    }
  };
  
  
  return (
    <div>
      <Header
        title={headerTitle}
        onSave={handleSaveNodes}
        onPublish={handleSaveNodes}
        addNode={addNode}
        handleBackdata={handleBack}
        iconNames={iconNames}
        getPublishedDate={getPublishedDate}
        getDraftedDate={getDraftedDate}
        setIsNavigating={() => removeBreadcrumbsAfter(currentLevel - 1)}
        Page={"Draft"}
        onExit={ExitNavigation}
      />

      <div style={styles.appContainer} className="custom_swimlane">
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
                  { label: "Add yes label", action: "Yes" },
                  { label: "Add no label", action: "No" },
                  { label: "Add free text", action: "addFreeText" },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderBottom: index === 0 ? "1px solid #f0f0f0" : "none",
                      transition: "background-color 0.2s ease",
                    }}
                    onClick={() => handlePopupAction(item.action)}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f1f1f1")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {item.label}
                  </div>
                ))}
                <div
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this arrow?"
                      )
                    ) {
                      deleteEdge();
                    }
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f1f1f1")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  Delete Arrow
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
            <div style={popupStyle.container}>
              <div style={popupStyle.header}>
                <span>Existing Model</span>
                <button
                  style={popupStyle.closeButton}
                  onClick={() => setIsCheckboxPopupOpen(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div style={popupStyle.body}>
                {LinknodeList.map((node) => (
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
                      onChange={() => handleCheckboxChange(node.node_id)}
                      style={popupStyle.checkbox}
                    />
                    {node.data && JSON.parse(node.data).label}
                  </label>
                ))}
              </div>
              <div style={popupStyle.footer}>
                <button
                  onClick={saveSelectedNodes}
                  style={popupStyle.saveButton}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {options.length > 0 && (
            <AddObjectRole
              position={position}
              options={options}
              onOptionClick={handleOptionClick}
              onClose={() => setIsPopupOpen(false)}
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

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
  ConnectionLineType,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import Header from "../../components/Header";
import { v4 as uuidv4 } from "uuid";
import { useLocation, useNavigate } from "react-router-dom";
import api, { checkFavProcess, filter_draft } from "../../API/api";
import CustomContextPopup from "../../components/CustomContextPopup";
import DetailsPopup from "../../components/DetailsPopup";
import NodeTypes from "./NodeTypes";
import generateNodesAndEdges from "../../../src/AllNode/SwimlineNodes/generateNodesAndEdges";
import styles from "./SwimlaneStyles";
import AddObjectRole from "../../AllNode/SwimlineNodes/addobjectrole";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";
import '../../Css/Swimlane.css'
import { useSelector } from "react-redux";
import TextInputModal from "../../components/TextInputModal";

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [process_img, setprocess_img] = useState("");

  const LoginUser = useSelector((state) => state.user.user);

  const [height, setHeight] = useState(0);
  const [appheaderheight, setahHeight] = useState(0);
  const [remainingHeight, setRemainingHeight] = useState(0);

  useEffect(() => {
    const calculateHeights = () => {
      const element = document.querySelector(".ss_new_hed");
      const element2 = document.querySelector(".app-header");

      // Ensure elements are found before accessing height
      const elementHeight = element ? element.getBoundingClientRect().height : 0;
      const appHeaderHeight = element2 ? element2.getBoundingClientRect().height : 0;

      setHeight(elementHeight);
      setahHeight(appHeaderHeight);

      // Correct calculation inside the function
      const newHeight = window.innerHeight - (elementHeight + appHeaderHeight - 13);
      setRemainingHeight(newHeight);
    };

    // Initial setup
    calculateHeights();

    // Handle window resize
    window.addEventListener("resize", calculateHeights);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", calculateHeights);
  }, []);

// alert(`Window Height: ${window.innerHeight}, App Div Height: ${appheaderheight}, Header Height: ${height}, New Height: ${remainingHeight}`);


  // Pass updated heights into generateNodesAndEdges
  const { nodes: initialNodes } = useMemo(
    () => generateNodesAndEdges(windowSize.width, windowSize.height, '', height + 10, appheaderheight),
    [windowSize, height, appheaderheight]
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
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [getPublishedDate, setgetPublishedDate] = useState("");
  const [detailschecking, setdetailschecking] = useState(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [searchQuery, setSearchQuery] = useState("");

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });



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
    const checkfav = async () => {
      const user_id = LoginUser ? LoginUser.id : null;
      const process_id = id ? id : null;


      if (!user_id || !process_id) {
        console.error("Missing required fields:", { user_id, process_id });
        return; // Stop execution if any field is missing
      }

      try {
        console.log("Sending data:", { user_id, process_id });
        const response = await checkFavProcess(user_id, process_id);
        console.log("Response:", response);
        setIsFavorite(response.exists)
      } catch (error) {
        console.error("check fav error:", error);
      }
    }
    checkfav()
  }, [LoginUser, id])

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
          api.GetPublishedDate(levelParam, parseInt(user_id), Process_id, "Published"),
          api.GetPublishedDate(levelParam, parseInt(user_id), Process_id, "Draft"),
          api.getNodes(levelParam, parseInt(user_id), Process_id),
        ]);

        setgetPublishedDate(publishedResponse.status ? publishedResponse.created_at || "" : "");
        setDraftedDate(draftResponse.status ? draftResponse.created_at || "" : "");
        setprocess_img(data.process_img);

        const nodebgwidth = document.querySelector(".react-flow__node");
        const nodebgwidths = nodebgwidth ? nodebgwidth.getBoundingClientRect().width : 0;

        const nodebgheight = document.querySelector(".react-flow__node");
        const nodebgheights = nodebgheight ? nodebgheight.getBoundingClientRect().height : 0;

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

          return {
            ...remainingNodeProps,
            id: node.node_id,
            parentNode: parentId,
            parentId: parentId,
            data: {
              ...parsedData,
              onLabelChange: (newLabel) => handleLabelChange(node.node_id, newLabel),
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
            style: {
              width: groupWidth,
              height: groupHeight,
              childWidth: childWidth,
              childHeight: childHeight,
              display:"flex",
              alignItems:"center",
              justifyContent:"center"
            },
          };
        });

        const parsedEdges = data.edges.map((edge) => ({
          ...edge,
          animated: Boolean(edge.animated),
          markerEnd: { type: MarkerType.ArrowClosed, color: "#002060", width: 12, height: 12 },
          style: { stroke: "#000", strokeWidth: 2.5 },
          type: "step",
        }));

        isInitialLoad.current = false;
        console.log("on load time data", data);
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
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#002060",
              width: 12, height: 12
            },
            style: { stroke: "#002060", strokeWidth: 2.5 },
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

      const nodebgwidth = document.querySelector(".react-flow__node");
      const nodebgwidths = nodebgwidth ? nodebgwidth.getBoundingClientRect().width : 0;

      const nodebgheight = document.querySelector(".react-flow__node");
      const nodebgheights = nodebgheight ? nodebgheight.getBoundingClientRect().height : 0;


      const groupWidth = nodebgwidths;
      const groupHeight = nodebgheights;
      const childWidth = groupWidth * 0.9;
      const childHeight = groupHeight * 0.9;
      const centeredPosition = {
        x: selectedGroup.position.x + (groupWidth - childWidth) / 14,
        y: selectedGroup.position.y + (groupHeight - childHeight) / 14,
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


      // new code
  const popupHeight = 150; 
  const screenHeight = window.innerHeight;
  let newY = event.clientY;

 
  if (event.clientY + popupHeight > screenHeight) {
    newY = event.clientY - popupHeight; 
  }

      setContextMenu({
        x: event.clientX, y: newY,
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
    const parentCenterX = parentNode.position.x + parentNode.style.width / 14;
    const parentCenterY = parentNode.position.y + parentNode.style.height / 14;
    const updatedChildPosition = {
      x: parentCenterX - childNode.style.childWidth / 14,
      y: parentCenterY - childNode.style.childHeight / 14,
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
      const parentRight = parentNode.position.x + parentNode.style.width;
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
    console.log("old nodes ", node);

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

  const handleTextSubmit = (enteredText) => {
    setIsModalOpen(false);
    if (enteredText) {
      console.log("modalPosition", modalPosition)
      addNode("FreeText", { x: modalPosition.x - 70, y: modalPosition.y - 125 }, enteredText);
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
      setIsModalOpen(true);

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
      detailschecking?.type !== "FreeText"
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
  const parsedData = LinknodeList.map(item => ({
    ...item,
    data: JSON.parse(item.data) // Parse the data field
  }));

  const filteredData = parsedData.filter(item =>
    item.data.label && item.data.label.toLowerCase().includes(searchQuery)
  );
  //console.log("filtefilteredData", filteredData)  


  
  

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
        isFavorite={isFavorite}
        Process_img={process_img}

      />

      <div style={{ ...styles.appContainer, height: remainingHeight }}>
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
              connectionLineType={ConnectionLineType.Step} // ✅ Correct Arrow Type
              connectionLineStyle={{ stroke: "#002060", strokeWidth: 2.5 }} // ✅ Correct Arrow Style
              connectionRadius={10}
              connectionMode={ConnectionMode.Loose} // ✅ Correct Syntax

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
                      onChange={() => handleCheckboxChange(node.node_id)}
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
                  Save
                </button>
              </div>
            </div>
          )}
          <TextInputModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleTextSubmit} />

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

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
import api, { addFavProcess, checkFavProcess, filter_draft } from "../../API/api";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";
import CustomContextMenu from "../../components/CustomContextMenu";
import CustomAlert from "../../components/CustomAlert";
import { useSelector } from "react-redux";
import "../../Css/MapLevel.css";

const MapLevel = () => {

  const [totalHeight, setTotalHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  // New Code
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // const windowSize = {
  //   width: window.innerWidth - 300,
  //   height: window.innerHeight - 300,
  // };



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
  const currentParentId = parentId || null;
  const { addBreadcrumb, removeBreadcrumbsAfter } =
    useContext(BreadcrumbsContext);
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


  // const memoizedNodeTypes = useMemo(
  //   () => ({
  //     progressArrow: ArrowBoxNode,
  //     pentagon: PentagonNode,
  //   }),
  //   []
  // );

    // New Code
  const memoizedNodeTypes = useMemo(
    () => ({
      progressArrow: (props) => <ArrowBoxNode {...props} selectedNodeId={selectedNodeId} />,
      pentagon: (props) => <PentagonNode {...props} selectedNodeId={selectedNodeId} />,
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

  const handleLabelChange = useCallback(
    (nodeId, newLabel) => {
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        );

        // Check if the label has changed to set unsaved changes
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
    const checkfav=async()=>{
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
        setprocess_img(data.process_img)

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
               isClickable:false
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
          style: { stroke: "#000", strokeWidth: 2 },
          type: "step",
        }));
        setNodes(parsedNodes);
        setEdges(parsedEdges);
      } catch (error) {
        console.error("Error fetching nodes:", error);
        alert("Failed to fetch object. Please refresh this page.");
      }
    };


    checkfav()
    fetchNodes();
  }, [
    currentLevel,
    LoginUser,
    handleLabelChange,
    setNodes,
    setEdges,
    currentParentId,
    user,
    id,
  ]);

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
      // Ensure the 0th breadcrumb is not removed
      const safeIndex = Math.max(1, currentLevel - 1);
      removeBreadcrumbsAfter(safeIndex);
    }

    addBreadcrumb(label, path, state);
    // console.log("isNavigating",isNavigating)

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
    // Your callback logic here
    console.log('Connected:', connection);
  }, []);

 

  const addNode = (type, position) => {
    console.log("position", position);
    const newNodeId = uuidv4();
    let PageGroupId;

    if (nodes.length === 0) {
      PageGroupId = uuidv4();
    } else {
      PageGroupId = nodes[0]?.PageGroupId;
    }

    const newNode = {
      id:
        currentParentId !== null
          ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
          : `Level${currentLevel}_${newNodeId}`,
      data: {
        label: "",
        shape: type,
        onLabelChange: (newLabel) =>
          handleLabelChange(
            currentParentId !== null
              ? `Level${currentLevel}_${newNodeId}_${currentParentId}`
              : `Level${currentLevel}_${newNodeId}`,
            newLabel
          ),

        defaultwidt: "230px",
        defaultheight: "120px",
        nodeResize: true,
        autoFocus: true,
        isClickable:true
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
      // New Code
    setSelectedNodeId(newNode.id)
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
           
            navigate(`/Draft-Process-View/${newLevel}/${selectedNode}`, {
              state: { id, title: selectedLabel, user, ParentPageGroupId: nodes[0]?.PageGroupId },
            });
          } else {
            navigate(`/level/${newLevel}/${selectedNode}`, {
              state: { id, title: selectedLabel, user, ParentPageGroupId: nodes[0]?.PageGroupId },
            });
          }

        }

        if (type === "Swimlane") {
          if (checkRecord.status === true) {
            navigate(`/Draft-Swim-lanes-View/level/${newLevel}/${selectedNode}`, {
              state: {
                id,
                title: selectedLabel,
                user,
                parentId: selectedNode,
                level: newLevel,
                ParentPageGroupId: nodes[0]?.PageGroupId
              },
            });
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

  // Save nodes and edges to backend
  const handleSaveNodes = async (savetype) => {
    if (savetype === "Published" && currentLevel !== 0) {

      try {
        const response = await filter_draft(ParentPageGroupId);
        if (response.data === true) {
          alert("First published previous page");
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
    try {
      const response = await api.saveNodes({
        Level,
        user_id,
        Process_id,
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
      // console.log("response",response)
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
    addNode(type, { x: OriginalPosition.x, y: OriginalPosition.y  });
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
  
    // Original Position Ko Center Set Karna
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

  // Called when edge is reconnected
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
      await handleSaveNodes("draft"); // Wait for saving to complete
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
  const handleFav = async () => {
    const user_id = LoginUser ? LoginUser.id : null;
    const process_id = id ? id : null;
    const type = user ? user.type : null;
  
    if (!user_id || !process_id || !type) {
      console.error("Missing required fields:", { user_id, process_id, type });
      return; // Stop execution if any field is missing
    }
  
    try {
      console.log("Sending data:", { user_id, process_id, type });
      const response = await addFavProcess(user_id, process_id, type);
      setIsFavorite(true)
      console.log("Response:", response);
    } catch (error) {
      console.error("Add fav error:", error);
    }
  };
  

  const ExitNavigation = async () => {
    const confirmcondition = await handleBack();
    if (confirmcondition) {
      if (id && user) {
        if (currentLevel === 0) {
          navigate('/Draft-Process-View', { state: { id: id, title: title, user: user } })
        } else {
          navigate(`/Draft-Process-View/${currentLevel}/${currentParentId}`, { state: { id: id, title: title, user: user } })
        }

      } else {
        alert("Currently not navigate on draft mode")
      }
    }
  }


  const handleNodeDragStart = (event, node) => {
    // Store the original position before dragging
    setNodes((nodes) =>
      nodes.map((n) => (n.id === node.id ? { ...n, originalPosition: { ...n.position } } : n))
    );
  };
  
  const handleNodeDragStop = (event, node) => {
    const flowContainer = document.querySelector(".flow-container");
    if (!flowContainer) return; // Safety check for container existence
  
    const { left, top, right, bottom } = flowContainer.getBoundingClientRect();
  
    const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
    if (!nodeElement) return; // Ensure the node is in the DOM
  
    const nodeRect = nodeElement.getBoundingClientRect();
  
    // Detect if node moved out of container bounds
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
  
    // New Code
  const handleNodeClick = (event, node) => {
    setSelectedNodeId(node.id); // Set the selected node ID
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

      />
      {/* <button onClick={checkbreadcrums}>
        Test
      </button> */}
      <ReactFlowProvider>
        <div className="app-container" style={styles.appContainer}>
          <div className="content-wrapper" style={styles.contentWrapper}>
            <div
              className="flow-container"
              style={styles.flowContainer}
              onContextMenu={handleGlobalContextMenu}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onReconnect={onReconnect}
                nodeTypes={memoizedNodeTypes}
                edgeTypes={memoizedEdgeTypes}
                // new code
                onNodeClick={handleNodeClick} 

                minZoom={0.1}
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnDrag={false}
                fitView
                onNodeDragStart={handleNodeDragStart}
                onNodeDragStop={handleNodeDragStop}
                panOnScroll={false}
                maxZoom={0.6}
                proOptions={{ hideAttribution: true }}
                onNodeContextMenu={handleNodeRightClick}
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
                condition={checkRecord}
              />
            </div>
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
};



export default MapLevel;

// src/Map_level/MapLevel.jsx
import React, { useState, useCallback, useMemo, useRef, useEffect, useContext } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    Controls,
    useEdgesState,
    useNodesState,
    SmoothStepEdge,
    BezierEdge,
    StraightEdge,
    Background,
    MarkerType,
} from '@xyflow/react'; // Ensure correct import path
import '@xyflow/react/dist/style.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Header from '../../components/Header';
import Popup from '../../components/Popup';

// Import all your node types
import ArrowBoxNode from '../../AllNode/ArrowBoxNode';
import PentagonNode from '../../AllNode/PentagonNode';
import DiamondNode from '../../AllNode/DiamondNode';
import BoxNode from '../../AllNode/BoxNode';
import LabelNode from '../../AllNode/LabelNode';


import api from '../../API/api';

import { BreadcrumbsContext } from '../../context/BreadcrumbsContext'; // Import BreadcrumbsContext
// import CustomHeader from '../../components/CustomHeader';

const nodeTypes = {
    pentagon: PentagonNode,
    progressArrow: ArrowBoxNode,
    diamond: DiamondNode,
    box: BoxNode,
    label: LabelNode,

};

const edgeTypes = {
    smoothstep: SmoothStepEdge,
    bezier: BezierEdge,
    straight: StraightEdge,

};

const MapLevel = () => {
    const navigate = useNavigate();
    const { level, parentId } = useParams(); // Extract route parameters

    const location = useLocation();
    const { id, title, Editable, user } = location.state || {}; // Access the ID and title, with a fallback

    const currentLevel = level ? parseInt(level, 10) : 0; // Default to Level 0
    const currentParentId = parentId || null;

    const { addBreadcrumb, removeBreadcrumbsAfter } = useContext(BreadcrumbsContext); // Consume BreadcrumbsContext

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [popupTitle, setPopupTitle] = useState('');
    const [pageTitle, setPageTitle] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const popupRef = useRef(null);

    // Dragging state for the popup
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Header title state
    const [headerTitle, setHeaderTitle] = useState(`${title} (LEVEL ${currentLevel})`);

    // Label change handler
    const handleLabelChange = useCallback((nodeId, newLabel) => {

        setNodes((nds) =>
            nds.map((node) =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, label: newLabel } }
                    : node
            )
        );
        setHasUnsavedChanges(true); // Set unsaved changes to true when label changes

    }, [setNodes]);

    const handleCreateNewNodeByText = useCallback((NodeId) => {
        if (NodeId) {
            console.log(NodeId);
            const newLevel = currentLevel + 1;
            setShowPopup(false);
            navigate(`/level/${newLevel}/${NodeId}`, { state: { id, title: title, Editable: Editable, user: user } });
        }
    }, [currentLevel, navigate, Editable, id, title, user]);



    // Fetch nodes and edges from the backend based on current level
    useEffect(() => {

        const fetchNodes = async () => {
            try {
                const levelParam = currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`;
                const user_id = user ? user.id : null;
                const Process_id = id ? id : null;
                const data = await api.getNodes(levelParam, parseInt(user_id), Process_id);

                const parsedNodes = data.nodes.map((node) => {
                    const parsedData = JSON.parse(node.data);
                    const parsedPosition = JSON.parse(node.position);
                    const parsedMeasured = JSON.parse(node.measured);

                    return {
                        ...node,
                        data: {
                            ...parsedData,
                            onLabelChange: (newLabel) => handleLabelChange(node.node_id, newLabel),
                            handleCreateNewNode: (nodeId) => {
                                handleCreateNewNodeByText(nodeId);
                            },
                            width_height: parsedMeasured,
                            Editable: Editable,
                            nodeResize:true

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
                    style: { stroke: '#000', strokeWidth: 2 },
                    type: 'step'

                }));

                setNodes(parsedNodes);
                setEdges(parsedEdges);
            } catch (error) {
                console.error('Error fetching nodes:', error);
                alert('Failed to fetch nodes. Please try again.');
            }
        };

        fetchNodes();
    }, [currentLevel, handleLabelChange, setNodes, setEdges, currentParentId, handleCreateNewNodeByText, user, Editable, id]);





    // Update breadcrumbs when currentLevel or currentParentId changes
    useEffect(() => {
        const label = currentLevel === 0 ? 'Home' : `Level ${currentLevel}`;
        const path = currentLevel === 0 ? '/' : `/level/${currentLevel}/${currentParentId}`;

        // Remove any breadcrumbs after the previous level
        if (currentLevel > 0) {
            removeBreadcrumbsAfter(currentLevel - 1);
        }
        setHeaderTitle(`${title} (LEVEL ${currentLevel})`);
        // Add the current breadcrumb
        addBreadcrumb(label, path);
    }, [currentLevel, currentParentId, addBreadcrumb, removeBreadcrumbsAfter, title]);

    const memoizedEdgeTypes = useMemo(() => edgeTypes, []);

    const onConnect = useCallback(
        (params) => {

            setEdges((eds) =>
                addEdge({
                    ...params,
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                    },
                    style: { stroke: '#000', strokeWidth: 2 },
                    Level: currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`,
                    user_id: user && user.id,
                    Process_id: id && id,
                    type: 'step',
                    Page_Title:"ProcessMap",

                }, eds)
            );
            setHasUnsavedChanges(true);
        },

        [setEdges, currentLevel, currentParentId, user, id]
    );


  
    useEffect(() => {
        const handleRefresh = (event) => {
          const userConfirmed = window.confirm(
            'You have unsaved changes. Do you really want to leave?'
          );
    
          console.log("confirm data",userConfirmed)
          if (userConfirmed) {
            // alert("confirm")
            navigate('/List-process-title'); // Redirect to the desired route
          } else {
            // alert("not confirm")
            event.preventDefault();
          }
        };
    
        window.addEventListener('beforeunload', handleRefresh);
    
        return () => {
          window.removeEventListener('beforeunload', handleRefresh);
        };
      }, [navigate]);
    
    const addNode = (type, position) => {
        const newNodeId = uuidv4();


        console.log("type", type)
        const newNode = {
            id: currentParentId !== null ? `Level${currentLevel}_${newNodeId}_${currentParentId}` : `Level${currentLevel}_${newNodeId}`,
            data: {
                label: '',
                shape: type,
                onLabelChange: (newLabel) => handleLabelChange(currentParentId !== null ? `Level${currentLevel}_${newNodeId}_${currentParentId}` : `Level${currentLevel}_${newNodeId}`, newLabel),
                Editable: Editable,
                defaultwidt: '230px',
                defaultheight: '120px',
                nodeResize:true
            },
            type: type,
            position: position || { x: Math.random() * 250, y: Math.random() * 250 },
            draggable: true,
            isNew: true,
            animated: true,
            Page_Title:"ProcessMap",
            Level: currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`,
            user_id: user && user.id,
            Process_id: id && id
        };

        setNodes((nds) => nds.concat(newNode));
        setHasUnsavedChanges(true)
        // Remove the 'isNew' flag after a short delay
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
            const confirmDeletion = window.confirm("Are you sure you want to delete this nodes?");
            if (!confirmDeletion) return;

            setNodes((nds) => nds.filter((node) => node.id !== selectedNode));
            setEdges((eds) =>
                eds.filter(
                    (edge) => edge.source !== selectedNode && edge.target !== selectedNode
                )
            );
            setSelectedNode(null);
            setShowPopup(false);
            setHasUnsavedChanges(true)
            setHeaderTitle(`${title} (LEVEL ${currentLevel})`);
        }
    }, [selectedNode, setNodes, setEdges, currentLevel, title]);

    const handleNodeRightClick = (event, node) => {

        event.preventDefault();
        setSelectedNode(node.id);
        setPopupTitle(node.data.label || 'Node Actions');
        const { clientX, clientY } = event;
        const flowContainer = document.querySelector('.flow-container');
        const containerRect = flowContainer.getBoundingClientRect();

        setPopupPosition({
            x: clientX - containerRect.left,
            y: clientY - containerRect.top,
        });
        setShowPopup(true);
    };




  // src/Map_level/MapLevel.jsx
const handleCreateNewNode = async (type) => {
    if (selectedNode) {

        // Logic for creating either Process Map or Swim Lane Model
        const newLevel = currentLevel + 1;
        setShowPopup(false); // Close the popup after selection
        const levelParam = selectedNode !== null ? `Level${newLevel}_${selectedNode}` : `Level${currentLevel}`;
        const user_id = user ? user.id : null;
        const Process_id = id ? id : null;
        const data = await api.getNodes(levelParam, parseInt(user_id), Process_id);
        
        // Check if the retrieved data contains nodes
        const existingNodes = data.nodes || [];

        // Initialize flags to check existing Page_Titles
        let hasSwimlane = false;
        let hasProcessMap = false;

        // Check existing nodes for Page_Title
        existingNodes.forEach(node => {
            if (node.Page_Title === 'Swimlane') {
                hasSwimlane = true;
            }
            if (node.Page_Title === 'ProcessMap') {
                hasProcessMap = true;
            }
        });

        // Determine navigation based on the type and existing Page_Titles
        if (type === 'ProcessMap') {
            if (hasSwimlane) {
                alert('You have already created a Swimlane.'); // Alert if Swimlane exists
            } else {
                navigate(`/level/${newLevel}/${selectedNode}`, {
                    state: { id, title, Editable, user },
                });
            }
        } else if (type === 'Swimlane') {
            if (hasProcessMap) {
                alert('You have already created a Process Map.'); // Alert if ProcessMap exists
            } else {
                navigate(`/swimlane/level/${newLevel}/${selectedNode}`, {
                    state: { id, title, Editable, user, parentId: selectedNode, level: newLevel },
                });
            }
        }
    }
};



    // Close popup when clicking outside
    const handleClickOutside = useCallback(
        (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        },
        [setShowPopup]
    );

    useEffect(() => {
        if (showPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPopup, handleClickOutside]);

    // Save nodes and edges to backend
    const handleSaveNodes = async () => {

        console.log("nodes ", nodes);
        console.log("edges",edges)
        try {
            const response = await api.saveNodes({
                nodes: nodes.map(({ id, data, type, position, draggable, animated, measured, Level, user_id, Process_id, Page_Title}) => ({
                    id,
                    data,
                    type,
                    position,
                    draggable,
                    animated,
                    measured,
                    Level,
                    user_id,
                    Process_id,
                    Page_Title

                })),
                edges: edges.map(({ id, source, target, markerEnd, animated, Level, sourceHandle, targetHandle, user_id, Process_id,Page_Title }) => ({
                    id,
                    source,
                    sourceHandle,
                    target,
                    targetHandle,
                    markerEnd,
                    animated,
                    Level,
                    user_id,
                    Process_id,
                    Page_Title
                })),
            });
            // if (!hasUnsavedChanges) {

            alert(response.message);
            // }

            setHasUnsavedChanges(false)
        } catch (error) {
            console.error('Error saving nodes:', error);
            if (error.response && error.response.data) {
                console.error(`Failed to save nodes: ${JSON.stringify(error.response.data)}`);
            } else {
                console.error('Failed to save nodes. Please try again.');
            }
        }
    };

    const onMouseMove = useCallback(
        (event) => {
            if (!isDragging) return;
            const flowContainer = document.querySelector('.flow-container');
            const containerRect = flowContainer.getBoundingClientRect();

            let newX = event.clientX - containerRect.left - dragOffset.x;
            let newY = event.clientY - containerRect.top - dragOffset.y;

            // Prevent the popup from going outside the flow-container
            const popupWidth = 220;
            const popupHeight = 300;

            newX = Math.max(0, Math.min(newX, containerRect.width - popupWidth));
            newY = Math.max(0, Math.min(newY, containerRect.height - popupHeight));

            setPopupPosition({ x: newX, y: newY });
        },
        [isDragging, dragOffset]
    );

    const endDrag = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', endDrag);
        } else {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', endDrag);
        }

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', endDrag);
        };
    }, [isDragging, onMouseMove, endDrag]);

    const memoizedNodeTypes = useMemo(() => nodeTypes, []);

    // Keyboard shortcut for deletion
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Delete' && selectedNode) {
                deleteNode();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedNode, deleteNode]);

    const handleBack = () => {
        if (hasUnsavedChanges) {
            // Show a confirmation dialog when there are unsaved changes
            const userConfirmed = window.confirm("You have unsaved changes. Do you want to save them before leaving?");

            if (userConfirmed) {
                // If user confirms, save the changes
                handleSaveNodes();
            }
            // If user does not confirm, proceed without saving
        }

        // You can add the logic to navigate back or perform other actions here
        console.log("Navigating back or performing the back action");
    };

    const iconNames = {
        progressArrow: 'Arrow Node',
        pentagon: 'Pentagon Node',
    
        box: 'Box Node',
        label: 'Label Node',
      };

    return (
        <div>

            <ReactFlowProvider >

                <div className="app-container" style={styles.appContainer}>
                    {/* Header */}
                    {/* <CustomHeader title={headerTitle} /> */}

                    {Editable ? (
                        <Header title={headerTitle} onSave={handleSaveNodes} addNode={addNode} handleBackdata={handleBack} iconNames={iconNames}/>

                    ) : null}

                    {/* Content: Sidebar + Flow Area */}
                    <div className="content-wrapper" style={styles.contentWrapper}>



                        {/* Flow Area */}
                        <div className="flow-container" style={styles.flowContainer}>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                nodeTypes={memoizedNodeTypes}
                                edgeTypes={memoizedEdgeTypes}
                                minZoom={0.1}
                                zoomOnScroll={false} // Disable zoom with scroll
                                zoomOnPinch={false}  // Disable zoom with pinch gesture
                                panOnDrag={false}    // Optional: Disable panning by dragging
                                panOnScroll={false}
                                maxZoom={0.6}
                                onNodeContextMenu={handleNodeRightClick}
                                style={styles.reactFlowStyle}
                            >
                                <Background variant="lines" />

                                <Controls />
                            </ReactFlow>

                            {/* Popup */}
                            <Popup
                                showPopup={showPopup}
                                popupPosition={popupPosition}
                                popupTitle={popupTitle}
                                setShowPopup={setShowPopup}
                                handleCreateNewNode={handleCreateNewNode}
                                deleteNode={deleteNode}
                                popupRef={popupRef}
                                startDrag={(event) => {
                                    setIsDragging(true);
                                    setDragOffset({
                                        x: event.clientX - popupPosition.x,
                                        y: event.clientY - popupPosition.y,
                                    });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </ReactFlowProvider>
        </div>
    );
};

const styles = {
    appContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        marginTop: "0px",
        backgroundColor: '#f8f9fa',
    },
    contentWrapper: {
        display: 'flex',
        flex: 1,
        borderLeft: '1px solid #002060',
        borderRight: '1px solid #002060',
        borderBottom: '1px solid #002060',
    },
    flowContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        position: 'relative',
    },
    reactFlowStyle: {
        width: '100%',
        height: '100%',
    },

};

export default MapLevel;

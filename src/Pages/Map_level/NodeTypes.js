import SwimlineArrowBoxNode from '../../AllNode/SwimlineNodes/SwimlineArrowBoxNode';
import SwimlineBoxNode from '../../AllNode/SwimlineNodes/SwimlineBoxNode';
import SwimlineDiamondNode from '../../AllNode/SwimlineNodes/SwimlineDiamondNode';
import SwimlineRightsideBox from '../../AllNode/SwimlineNodes/SwimlineRightsideBox';
import LabelNode from '../../AllNode/LabelNode';
import YesNode from '../../AllNode/YesNode';
import NoNode from '../../AllNode/NoNode';

const NodeTypes = {
  progressArrow: SwimlineArrowBoxNode,
  diamond: SwimlineDiamondNode,
  box: SwimlineBoxNode,
  SwimlineRightsideBox: SwimlineRightsideBox,
  label: LabelNode,
  Yes: YesNode,
  No: NoNode,
};

export default NodeTypes;




// import React, { useCallback, useMemo, useState, useEffect } from 'react';
// import {
//   ReactFlow,
//   ReactFlowProvider,
//   addEdge,
//   SmoothStepEdge,
//   BezierEdge,
//   StraightEdge,
//   useEdgesState,
//   Background,
//   MarkerType,
//   reconnectEdge,
//   useNodesState,
// } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';
// import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
// import Header from '../../components/Header';
// import { v4 as uuidv4 } from 'uuid'; 
// import { useLocation, useNavigate } from 'react-router-dom';
// import api from '../../API/api';
// import CustomContextPopup from '../../components/CustomContextPopup';
// import DetailsPopup from '../../components/DetailsPopup';
// import NodeTypes from './NodeTypes';
// import generateNodesAndEdges from '../../../src/AllNode/SwimlineNodes/generateNodesAndEdges'
// import styles from './SwimlaneStyles';

// const rfStyle = {
//   width: '100%',
//   height: '100%',
//   backgroundColor: '#fff',
// };


// const SwimlaneModel=()=> {
//   const [windowSize, setWindowSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight,
//   });
//   const location = useLocation(); 
//   const navigate = useNavigate(); 
//   const { id, title, user, parentId, level } = location.state || {}; 
//   const headerTitle=`${title} (LEVEL ${level})`;
//   const currentParentId = parentId || null;
//   const currentLevel = level ? parseInt(level, 10) : 0; 
//   const [position, setPosition] = useState({ x: 0, y: 0 }); 
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [isSimpleAddRolePopupOpen, setIsSimpleAddRolePopupOpen] = useState(false);
//   const { nodes: initialNodes, } = useMemo(() => generateNodesAndEdges(windowSize.width, windowSize.height), [windowSize]);
//   const [selectedGroupId, setSelectedGroupId] = useState(null);

//   const [ChildNodes, setChiledNodes, onNodesChange] = useNodesState([]);
//   const [contextMenu, setContextMenu] = useState(null);
//   const [selectedNode, setSelectedNode] = useState(null);
//   const [selectedNodeId, setSelectedNodeId] = useState(null);
//   const [detailschecking, setdetailschecking] = useState(null);
//   const [nodes, setNodes] = useState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const nodeTypes = NodeTypes ;
//   const edgeTypes = useMemo(
//     () => ({
//       smoothstep: SmoothStepEdge,
//       bezier: BezierEdge,
//       straight: StraightEdge,
//       step: SmoothStepEdge, // Add step here if you're using it

//     }),
//     [] 
//   );
  
//   useEffect(() => {
//     const handleRefresh = (event) => {
//       const userConfirmed = window.confirm(
//         'You have unsaved changes. Do you really want to leave?'
//       );

//       console.log("confirm data", userConfirmed)
//       if (userConfirmed) {
//         navigate('/List-process-title'); // Redirect to the desired route
//       } else {
//         event.preventDefault();
//       }
//     };

//     window.addEventListener('beforeunload', handleRefresh);

//     return () => {
//       window.removeEventListener('beforeunload', handleRefresh);
//     };
//   }, [navigate]);


//   const handleLabelChange = useCallback((nodeId, newLabel) => {
//     setChiledNodes((nds) =>
//       nds.map((node) =>
//         node.id === nodeId
//           ? { ...node, data: { ...node.data, label: newLabel } }
//           : node
//       )
//     );
//     console.log('Label changed for node:', nodeId, 'New label:', newLabel);
//   }, [setChiledNodes]);

//   useEffect(() => {
//     const fetchNodes = async () => {
//       try {
//         // console.log("check user ,", user);
//         const levelParam = currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`;
//         const user_id = user ? user.id : null;
//         const Process_id = id ? id : null;
//         const data = await api.getNodes(levelParam, parseInt(user_id), Process_id);
//         const totalRows = 8;
//         const totalColumns = 11;
//         const groupWidth = windowSize.width / totalColumns - 14;
//         const groupHeight = windowSize.height / totalRows - 14;

//         const parsedNodes = data.nodes.map((node) => {
//           const parsedData = JSON.parse(node.data);
//           const parsedPosition = JSON.parse(node.position);
//           const parsedMeasured = JSON.parse(node.measured);

//           return {
//             ...node,
//             data: {
//               ...parsedData,
//               onLabelChange: (newLabel) => handleLabelChange(node.node_id, newLabel),
//               width_height: parsedMeasured,
          
//               defaultwidt: '40px',
//               defaultheight: '40px',
//               nodeResize: false,
//             },
//             type: node.type,
//             id: node.node_id,
//             parentId: node.parentId,
//             extent: 'parent',
//             measured: parsedMeasured,
//             position: parsedPosition,
//             draggable: Boolean(node.draggable),
//             animated: Boolean(node.animated),
//             style: {
//               width: groupWidth,
//               height: groupHeight,
//             },
//           };
//         });

//         const parsedEdges = data.edges.map((edge) => ({
//           ...edge,
//           animated: Boolean(edge.animated),
//           markerEnd: {
//             type: MarkerType.ArrowClosed,
//           },
//           style: { stroke: '#000', strokeWidth: 2 },
//           type: 'step',
//         }));

//         setChiledNodes(parsedNodes);
//         setEdges(parsedEdges);
//       } catch (error) {
//         console.error('Error fetching nodes:', error);
//         alert('Failed to fetch nodes. Please try again.');
//       }
//     };

//     fetchNodes();
//   }, [currentLevel, handleLabelChange, setNodes, setEdges, currentParentId, user, id, windowSize]);

//   const onConnect = useCallback(
//     (params) => {

//       setEdges((eds) =>
//         addEdge({
//           ...params,
//           markerEnd: {
//             type: MarkerType.ArrowClosed,
//           },
//           style: { stroke: '#000', strokeWidth: 2 },
//           Level: currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`,
//           user_id: user && user.id,
//           Process_id: id && id,
//           type: 'step',
//           Page: "Swimlane",

//         }, eds)
//       );
//     },

//     [setEdges, currentLevel, currentParentId, user, id]
//   );

//   const handleNodeClick = useCallback(
//     (event, node) => {
//       if (node.type === 'group' && node.style.borderRight.includes('#022261')) {
//         const rect = event.target.getBoundingClientRect();
//         setPosition({ x: rect.left, y: rect.top });
//         setIsSimpleAddRolePopupOpen(true);
//         setSelectedGroupId(node.id);
//       } else if (node.type === 'group') {
//         setSelectedGroupId(node.id);
//         setIsSimpleAddRolePopupOpen(false);

//         setChiledNodes((nds) =>
//           nds.map((n) =>
//             n.id === node.id
//               ? {
//                 ...n,
//                 style: {
//                   ...n.style,
//                 },
//               }
//               : {
//                 ...n,
//                 style: {
//                   ...n.style,
//                 },
//               }
//           )
//         );
//       }
//     },
//     [setChiledNodes]
//   );



//   const addNode = (type, position) => {

//     if (type === "Yes" || type === "No") {
//       if (!position) {
//         alert('Position not defind');
//         return;
//       }

//       const newNodeId = uuidv4();
//       const newNode = {
//         id: currentParentId !== null ? `Level${currentLevel}_${newNodeId}_${currentParentId}` : `Level${currentLevel}_${newNodeId}`,

//         data: {
//           label: '',
//           shape: type,
//           onLabelChange: (newLabel) => handleLabelChange(newNodeId, newLabel),
    
//           defaultwidt: '40px',
//           defaultheight: '40px',
//           nodeResize: false

//         },
//         type: type,
//         position: position || { x: Math.random() * 250, y: Math.random() * 250 },
//         draggable: true,
//         isNew: true,
//         animated: true,
//         Page_Title: "Swimlane",
//         Level: currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`,
//         user_id: user && user.id,
//         Process_id: id && id,

//       };

//       setChiledNodes((nds) => [...nds, newNode]);
//     } else if (selectedGroupId) {
//       const selectedGroup = nodes.find((node) => node.id === selectedGroupId);
//       const groupWidth = selectedGroup?.style?.width || 100; 
//       const groupHeight = selectedGroup?.style?.height || 100; 
//       const childWidth = groupWidth * 0.9; 
//       const childHeight = groupHeight * 0.9; // 80% of the group height
//       const newNodeId = uuidv4();
//       const newNode = {
//         id: currentParentId !== null ? `Level${currentLevel}_${newNodeId}_${currentParentId}` : `Level${currentLevel}_${newNodeId}`,
//         node_id: currentParentId !== null ? `Level${currentLevel}_${newNodeId}_${currentParentId}` : `Level${currentLevel}_${newNodeId}`,

//         parentId: selectedGroupId,
//         extent: 'parent',
//         data: {
//           label: '',
//           details: { title: "", content: "" },
//           shape: type,
//           onLabelChange: (newLabel) => handleLabelChange(newNodeId, newLabel),
     
//           defaultwidt: '40px',
//           defaultheight: '40px',
//           nodeResize: false

//         },
//         type: type,
//         position: position || { x: Math.random() * 250, y: Math.random() * 250 },
//         draggable: true,
//         isNew: true,
//         animated: true,
//         Page_Title: "Swimlane",
//         Level: currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`,
//         user_id: user && user.id,
//         Process_id: id && id,
//         style: {
//           width: childWidth,
//           height: childHeight,
//         },
//       };

//       setChiledNodes((nds) => [...nds, newNode]);
//     } else {
//       alert('Please select a group node first!');
//     }
//   };


//   useEffect(() => {
//     const handleResize = () => {
//       setWindowSize({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const memoizedNodeTypes = useMemo(() => nodeTypes, [nodeTypes]);
//   const memoizedEdgeTypes = useMemo(() => edgeTypes, [edgeTypes]);
  


//   const handleSaveNodes = async () => {

//     try {
//       const response = await api.saveNodes({
//         nodes: ChildNodes.map(({ id, data, type, position, draggable, animated, measured, Level, user_id, Process_id, Page_Title, parentId }) => ({
//           id,
//           data,
//           type,
//           position,
//           draggable,
//           animated,
//           measured,
//           Level,
//           user_id,
//           Process_id,
//           Page_Title,
//           parentId

//         })),
//         edges: edges.map(({ id, source, target, markerEnd, animated, Level, sourceHandle, targetHandle, user_id, Process_id, Page_Title }) => ({
//           id,
//           source,
//           sourceHandle,
//           target,
//           targetHandle,
//           markerEnd,
//           animated,
//           Level,
//           user_id,
//           Process_id,
//           Page_Title
//         })),
//       });
  
//       alert(response.message);

//     } catch (error) {
//       console.error('Error saving nodes:', error);
//       if (error.response && error.response.data) {
//         console.error(`Failed to save nodes: ${JSON.stringify(error.response.data)}`);
//       } else {
//         console.error('Failed to save nodes. Please try again.');
//       }
//     }
//   };


//   const openPopup = () => {
//     setIsPopupOpen(true)
//   };
//   const closePopup = () => {
//     setIsPopupOpen(false)
//     setSelectedNodeId(null)

//   };

//   const updateNodeDetails = (nodeId, newDetails) => {
//     setChiledNodes((nodes) =>
//       nodes.map((node) =>
//         node.node_id === nodeId
//           ? {
//             ...node,
//             data: {
//               ...node.data,
//               details: {
//                 title: newDetails.title,
//                 content: newDetails.content,
//               },
//             },
//           }
//           : node
//       )
//     );
//   };



//   const saveDetails = (details) => {

//     if (selectedNodeId) {
//       updateNodeDetails(selectedNodeId, details);

//       setSelectedNodeId(null)
//       // alert("Details saved!");
//     }
//     closePopup();
//   };


//   const handlePopupAction = (action) => {

//     const { x, y } = contextMenu;

//     if (action === 'Yes') {
//       addNode('Yes', { x: x - 30, y: y - 125 });
//     } else if (action === 'No') {
//       addNode('No', { x: x - 70, y: y - 125 });
//       // Your logic for adding a level
//     } else if (action === 'addDetails') {
//       openPopup()
//     }
//     setContextMenu(null); // Close the context menu
//   };


//   const handleClosePopup = () => {
//     setContextMenu(null);
//     setSelectedNode(null);
//     setdetailschecking(null);
//   };

//   const handleDeleteNode = () => {
//     if (selectedNode) {
//       const confirmDeletion = window.confirm("Are you sure you want to delete this nodes?");
//       if (!confirmDeletion) return;

//       setChiledNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id));
//       setEdges((eds) =>
//         eds.filter(
//           (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
//         )
//       );
//       handleClosePopup();
//     }
//   };


//   const handleNodeRightClick = (event, node) => {
//     // console.log("nodes",node.Page_Title)
//     if (node.Page_Title === "Swimlane") {
//       setSelectedNodeId(node.node_id)
//       setdetailschecking(node)
//       event.preventDefault(); // Prevent default context menu
//       setSelectedNode(node);
//       setPosition({ x: event.clientX, y: event.clientY }); // Update position

//       setContextMenu({
//         x: event.clientX,
//         y: event.clientY,
//         nodeId: node.id,
//       });
//     }

//   };

//   const menuItems = [
//     ...(detailschecking?.type === "diamond" ? [
//       {
//         label: 'Add yes label',
//         action: () => handlePopupAction('Yes'),
//         borderBottom: true,
//       },
//       {
//         label: 'Add no label',
//         action: () => handlePopupAction('No'),
//         borderBottom: true,
//       },
//     ] : []),
//     ...(detailschecking?.type !== "SwimlineRightsideBox" ? [
//       {
//         label: detailschecking &&
//           (
//             (!detailschecking?.data?.details?.title || detailschecking?.data?.details?.title === "") &&
//             (!detailschecking?.data?.details?.content || detailschecking?.data?.details?.content === "")
//           )
//           ? 'Add details'
//           : 'Edit details',
//         action: () => handlePopupAction('addDetails'),
//         borderBottom: true,
//       },
//     ] : []),
//     {
//       label: 'Delete',
//       action: handleDeleteNode,
//       borderBottom: false,
//     },
//   ];


//   const handleAddRole = () => {
//     addNode('SwimlineRightsideBox'); 

//     setIsSimpleAddRolePopupOpen(false); 
//   };

//   const iconNames = {
//     progressArrow: 'Arrow Node',
//     diamond: 'Diamond Node',
//     box: 'Box Node',

//   };

//   const onEdgeUpdate = useCallback(
//     (oldEdge, newConnection) => {
//       setEdges((eds) =>
//         eds.map((edge) => (edge.id === oldEdge.id ? { ...edge, ...newConnection } : edge))
//       );
//     },
//     [setEdges]
//   );

//        // Called when edge is reconnected
//   const onReconnect = useCallback(
//     (oldEdge, newConnection) => {
//       setEdges((prevEdges) => reconnectEdge(oldEdge, newConnection, prevEdges));
//     },
//     [],
//   );

//   return (
//     <div>

//         <Header
//           title={headerTitle}
//           onSave={handleSaveNodes}
//           addNode={addNode}
//           handleBackdata={() => console.log('Back Clicked')}
//           iconNames={iconNames}
//         />
//         <div style={styles.appContainer}>
//       <ReactFlowProvider>
      
//         <div style={styles.scrollableWrapper}>
//           <ReactFlow
//             nodes={[...nodes, ...ChildNodes]}

//             edges={edges}
//             onNodesChange={onNodesChange}
//             onEdgesChange={onEdgesChange}
//             onConnect={onConnect}
//             onReconnect={onReconnect}
//             onNodeClick={handleNodeClick}
//             onNodeContextMenu={handleNodeRightClick} 
      
//             nodeTypes={memoizedNodeTypes}
//             edgeTypes={memoizedEdgeTypes}
//             minZoom={0}
//             zoomOnScroll={false}
//             zoomOnPinch={false}
//             panOnDrag={false}
//             panOnScroll={false}
//             maxZoom={1}
//             style={rfStyle}
//           >
//             <Background color="#fff" gap={16} />
//           </ReactFlow>

//           <CustomContextPopup
//             isVisible={!!contextMenu}
//             position={contextMenu || { x: 0, y: 0 }}
//             menuItems={menuItems}
//             onClose={handleClosePopup}

//           />


//           {isSimpleAddRolePopupOpen && (
//             <div
//               className="add-role-popup"
//               onClick={(e) => {
//                 e.stopPropagation(); 
//                 handleAddRole();
//               }}
//               style={{
//                 position: 'absolute',
//                 top: position.y + 30,
//                 left: position.x + 60,
//                 background: '#f8f8f8',
//                 border: '1px solid #ccc',
//                 paddingLeft: '15px',
//                 paddingRight: '15px',

//                 borderRadius: '5px',
//               }}
//             >
//               Add Role
//             </div>
//           )}


//           <DetailsPopup
//             isOpen={isPopupOpen}
//             onClose={closePopup}
//             onSave={saveDetails}
//             Details={ChildNodes.find(node => node.node_id === selectedNodeId) || null}
//           />
//         </div>
//       </ReactFlowProvider>
//       </div>
//           </div>
//   );
// }

// export default SwimlaneModel;

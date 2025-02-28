// import React, { useState, useCallback, useMemo } from "react";
// import {
//   ReactFlow,
//   Background,
//   useNodesState,
//   ReactFlowProvider,
// } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";
// import NodeTypes from "./NodeTypes";

// const generateTableNodes = () => {
//   const nodes = [];
//   const cellWidth = 100;
//   const cellHeight = 60;

//   for (let row = 0; row < 7; row++) {
//     for (let col = 0; col < 11; col++) {
//       nodes.push({
//         id: `cell-${row}-${col}`,
//         data: { label: null },
//         position: {
//           x: col * cellWidth,
//           y: row * cellHeight,
//         },
//         style: {
//           width: cellWidth - 2,
//           height: cellHeight - 2,
//           border: "1px solid #ccc",
//           backgroundColor: "#f1f1f1",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         },
//         draggable: true,
//       });
//     }
//   }

//   return nodes;
// };

// const TableFlow = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState(generateTableNodes());
//   const [childNodes, setChildNodes] = useState([]);
//   const [selectedCell, setSelectedCell] = useState(null);
//   const [contextMenu, setContextMenu] = useState(null);
//   const nodeTypes = NodeTypes;

//   const handleLabelChange = useCallback((nodeId, newLabel) => {
//     setChildNodes((nds) =>
//       nds.map((node) => {
//         if (node.id === nodeId) {
//           return {
//             ...node,
//             data: {
//               ...node.data,
//               details: {
//                 ...node.data.details,
//                 title: newLabel,
//               },
//             },
//           };
//         }
//         return node;
//       })
//     );
//   }, []);

//   const memoizedNodeTypes = useMemo(() => nodeTypes, [nodeTypes]);

//   const addChildNode = useCallback(() => {
//     if (!selectedCell) return;

//     const parentNode = nodes.find((node) => node.id === selectedCell);
//     if (!parentNode) return;

//     const newChildNode = {
//       id: `child-${Date.now()}`,
//       data: {
//         label: "",
//         details: { title: "", content: "" },
//         link: "",
//         autoFocus: true,
//         shape: "box",
//       },
//       position: {
//         x: parentNode.position.x + parentNode.style.width / 2 - 40,
//         y: parentNode.position.y + parentNode.style.height / 2 - 20,
//       },
//       parentNode: selectedCell,
//       type: "box",
//       style: {
//         width: 80,
//         height: 40,
//         backgroundColor: "#d4edda",
//         border: "1px dashed #28a745",
//         textAlign: "center",
//         fontSize: "12px",
//         lineHeight: "40px",
//       },
//       draggable: true,
//     };

//     setChildNodes((prev) => [...prev, newChildNode]);
//     setContextMenu(null);
//   }, [selectedCell, nodes]);

//   const handleNodeClick = useCallback((event, node) => {
//     alert("hi")
   
//   }, []);

//   const handleContextMenu = useCallback((event, node) => {
//     event.preventDefault();
//     if (node.id.startsWith("cell-")) {
//       setSelectedCell(node.id);
//       setContextMenu({
//         x: event.clientX,
//         y: event.clientY,
//       });
//     }
//   }, []);

//   const handleClickOutside = () => setContextMenu(null);

//   const handleNodeDragStop = (event, node) => {
//     console.log("Drag stopped:", node);

//     if (node.id.startsWith("child-")) {
//       const nearestParentNode = nodes.find(n => 
//         node.position.x >= n.position.x && 
//         node.position.x <= n.position.x + n.style.width &&
//         node.position.y >= n.position.y && 
//         node.position.y <= n.position.y + n.style.height
//       );

//       if (nearestParentNode) {
//         setChildNodes((prev) =>
//           prev.map((child) =>
//             child.id === node.id
//               ? { ...child, parentNode: nearestParentNode.id, position: node.position }
//               : child
//           )
//         );
//       }
//     } else {
//       // When dragging a parent node, update the positions of its child nodes
//       const affectedChildren = childNodes.filter(child => child.parentNode === node.id);
//       const newChildNodes = affectedChildren.map(child => ({
//         ...child,
//         position: {
//           x: node.position.x + node.style.width / 2 - 40,
//           y: node.position.y + node.style.height / 2 - 20,
//         },
//       }));
//       setChildNodes(prev => prev.map(child => newChildNodes.find(n => n.id === child.id) || child));
//     }
//   };

//   const handleSavedata = () => {
//     console.log("childNodes", childNodes);
//   };

//   return (
//     <div style={styles.container} onClick={handleClickOutside}>
//       <h3 style={styles.header}>Table with Right-Click Node Addition</h3>
//       <button onClick={handleSavedata}>Save Button</button>
//       <div style={styles.wrapper}>
//         <ReactFlow
//           nodes={[...nodes, ...childNodes]}
//           edges={[]}
//           nodeTypes={memoizedNodeTypes}
//           onNodesChange={onNodesChange}
//           onNodeClick={handleNodeClick}
//           onNodeContextMenu={handleContextMenu}
//           onNodeDragStop={handleNodeDragStop}
//         >
//           <Background color="#E6E6E6" />
//         </ReactFlow>
//         {contextMenu && (
//           <div
//             style={{
//               ...styles.contextMenu,
//               top: contextMenu.y,
//               left: contextMenu.x,
//             }}
//           >
//             <button onClick={addChildNode} style={styles.contextMenuButton}>
//               Add Node
//             </button>
//           </div>
//         )}
//         {childNodes.map(child => (
//           <div
//             key={child.id}
//             style={{
//               position: "absolute",
//               left: child.position.x + child.style.width / 2 - 10, // Center arrow below the child node
//               top: child.position.y + child.style.height + 5, // Position below the child node
//             }}
//           >
//             <span style={styles.arrow}>&#8595;</span> {/* Down arrow */}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const App = () => (
//   <ReactFlowProvider>
//     <TableFlow />
//   </ReactFlowProvider>
// );

// export default App;

// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     height: "100vh",
//   },
//   header: {
//     textAlign: "center",
//     padding: "10px",
//     fontSize: "20px",
//     fontWeight: "bold",
//     backgroundColor: "#007BFF",
//     color: "#fff",
//   },
//   wrapper: {
//     flex: 1,
//     margin: "10px",
//     position: "relative",
//   },
//   contextMenu: {
//     position: "absolute",
//     backgroundColor: "#fff",
//     border: "1px solid #ccc",
//     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//     zIndex: 1000,
//     borderRadius: "4px",
//   },
//   contextMenuButton: {
//     padding: "8px 12px",
//     fontSize: "14px",
//     color: "#fff",
//     backgroundColor: "#28a745",
//     border: "none",
//     cursor: "pointer",
//     width: "100%",
//   },
//   arrow: {
//     fontSize: "24px",
//     color: "#28a745",
//   },
// };

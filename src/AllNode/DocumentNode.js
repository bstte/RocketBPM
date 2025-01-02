


// // src/AllNode/ArrowBoxNode.jsx
// import { memo, useState, useEffect, useRef, useCallback } from 'react';
// import { Handle, Position, NodeResizer } from '@xyflow/react';

// const DocumentNode = ({ data, isNew }) => {
//   const [label, setLabel] = useState(data.label);
//   const textareaRef = useRef(null);
//   const [isResizing, setIsResizing] = useState(false);
//   const [isClickable, setIsClickable] = useState(false);
 

//   useEffect(() => {
//     setLabel(data.label);
//   }, [data.label]);

//   useEffect(() => {
//     if (isNew && textareaRef.current) {
//       textareaRef.current.focus();
//     }
//   }, [isNew]);

//   const handleChange = (e) => {
//     setLabel(e.target.value);

//     if (data.onLabelChange) { // Use data.onLabelChange
//       data.onLabelChange(e.target.value);
//     }
//   };

//   const handleBlur = () => {
//     if (data.onLabelChange) { // Use data.onLabelChange
//       data.onLabelChange(label);
//     }
//   };

//   const handleClick = () => {
//     setIsClickable((prev) => !prev);
//   };

//   const handleResizeStart = () => {
//     if (!isClickable) return;
//     setIsResizing(true);
//   };

//   const handleResizeStop = () => {
//     setIsResizing(false);
//   };

//   // Start rotation on mousedown
//   // const handleRotationStart = () => {
//   //   setIsRotating(true);
//   // };

// <<<<<<< HEAD:src/ArrowBoxNode.js
//   // // End rotation on mouseup
//   // const handleRotationEnd = () => {
//   //   setIsRotating(false);
//   // };

//   // // Handle rotation by mouse movement
//   // const handleMouseMove = (e) => {
//   //   if (isRotating) {
//   //     const rect = inputRef.current.getBoundingClientRect();
//   //     const centerX = rect.left + rect.width / 2;
//   //     const centerY = rect.top + rect.height / 2;
//   //     const radians = Math.atan2(e.clientY - centerY, e.clientX - centerX);
//   //     const angle = (radians * 180) / Math.PI;
//   //     setRotation(angle);
//   //   }
//   // };
// =======
//   // End rotation on mouseup
//   const handleRotationEnd = useCallback(() => {
//     setIsRotating(false);
//   }, []);

//   // Handle rotation by mouse movement
//   const handleMouseMove = useCallback(
//     (e) => {
//       if (isRotating && textareaRef.current) {
//         const rect = textareaRef.current.getBoundingClientRect();
//         const centerX = rect.left + rect.width / 2;
//         const centerY = rect.top + rect.height / 2;
//         const radians = Math.atan2(e.clientY - centerY, e.clientX - centerX);
//         const angle = (radians * 180) / Math.PI;
//         setRotation(angle);
//       }
//     },
//     [isRotating]
//   );
// >>>>>>> dd83d24 (Update project with latest changes):src/AllNode/DocumentNode.js

//   // useEffect(() => {
//   //   if (isRotating) {
//   //     document.addEventListener('mousemove', handleMouseMove);
//   //     document.addEventListener('mouseup', handleRotationEnd);
//   //   } else {
//   //     document.removeEventListener('mousemove', handleMouseMove);
//   //     document.removeEventListener('mouseup', handleRotationEnd);
//   //   }

// <<<<<<< HEAD:src/ArrowBoxNode.js
//   //   return () => {
//   //     document.removeEventListener('mousemove', handleMouseMove);
//   //     document.removeEventListener('mouseup', handleRotationEnd);
//   //   };
//   // }, [isRotating]);
// =======
//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleRotationEnd);
//     };
//   }, [isRotating, handleMouseMove, handleRotationEnd]);
// >>>>>>> dd83d24 (Update project with latest changes):src/AllNode/DocumentNode.js

//   return (
//     <div
//       style={{
//         ...styles.wrapper, // Rotate the entire wrapper, including node and resizer
       
//       }}
//       onClick={handleClick}
//     >
//       {isClickable && (
//         <>
//           {/* Node Resizer */}
//           <NodeResizer
//             minWidth={100}
//             minHeight={50}
//             onResizeStart={handleResizeStart}
//             onResizeStop={handleResizeStop}
//           />
//           {/* Rotation Icon */}
        
//         </>
//       )}

//       {/* Source Handles */}
   

//       <Handle type="target" position={Position.Bottom} id="bottom-target" style={styles.handle} />
//       <Handle type="source" position={Position.Bottom} id="bottom-source" style={styles.handle} />

//       <Handle type="target" position={Position.Top} id="top-target" style={styles.handle} />
//       <Handle type="source" position={Position.Top} id="top-source" style={styles.handle} />

//       <Handle type="target" position={Position.Left} id="left-target" style={styles.handle} />
//       <Handle type="source" position={Position.Left} id="left-source" style={styles.handle} />
      
//       <Handle type="target" position={Position.Right} id="right-target" style={styles.handle} />
//       <Handle type="source" position={Position.Right} id="right-source" style={styles.handle} />

//       {/* Arrow Box */}
//       <div
//         style={{
//           ...styles.documentBox,
//           minWidth: isResizing ? 'auto' : data.width_height ? data.width_height.width : data.defaultwidt,
//           minHeight: isResizing ? 'auto' : data.width_height ? data.width_height.height : data.defaultheight,
//         }}
//       >
//         <textarea
//           ref={textareaRef}
//           value={label}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           placeholder='Type ....'

//           style={styles.textarea}
//           rows={3} // Initial number of rows; adjust as needed
//           maxLength={200} // Optional: limit characters
//         />
//       </div>
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     position: 'relative',
//     width: '100%',
//     height: '100%',
//   },
//   documentBox: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'absolute',
//     textAlign: 'center',
//     backgroundColor: '#2ecc71',
//     color: '#fff',
//     border: '2px solid #fff',
//     borderRadius: '5px',
//     width: '100%',
//     height: '100%',
//     boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
//     padding: '10px',
//     boxSizing: 'border-box',
//     overflow: 'hidden',
//   },
//   textarea: {
//     background: 'transparent',
//     border: 'none',
//     color: 'inherit',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     width: '100%',
//     height: '100%',
//     resize: 'none',
//     outline: 'none',
//     textAlign: 'center',
//     overflowWrap: 'break-word',
//     whiteSpace: 'pre-wrap',
//     lineHeight: '1.4', // Adjust line height for better readability
//   },
//   rotationIcon: {
//     position: 'absolute',
//     top: '-15px', // Position slightly above the node
//     right: '-15px', // Align it to the right
//     cursor: 'pointer',
//     backgroundColor: '#fff',
//     padding: '5px',
//     borderRadius: '50%',
//     boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
//   },
//     handle: {
//     width: '16px',
//     height: '16px',
//     backgroundColor: '#4CAF50',
//     borderRadius: '50%',
//     border: '2px solid #fff',
//     boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
//   },
// };

// // Placeholder styling component
// const PlaceholderStyles = () => (
//   <style>
//     {`
//       .textarea-class::placeholder {
//         color: #ccc; /* Placeholder text color */
//       }
//     `}
//   </style>
// );

// // Wrap BoxNode with PlaceholderStyles
// const DocumentNodeWithPlaceholder = (props) => (
//   <>
//     <PlaceholderStyles />
//     <DocumentNode {...props} />
//   </>
// );
// export default memo(DocumentNodeWithPlaceholder);

// // src/AllNode/LabelNode.jsx
// import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
// import {  NodeResizer } from '@xyflow/react';
// import { FaSyncAlt } from 'react-icons/fa'; // Rotation icon

// const LabelNode = ({ data, isNew }) => {
//   const [label, setLabel] = useState(data.label || '');
//   const [isEditing, setIsEditing] = useState(false);
//   const inputRef = useRef(null);
//   const [isResizing, setIsResizing] = useState(false);
//   const [isClickable, setIsClickable] = useState(false);
//   const [rotation, setRotation] = useState(0);
//   const [isRotating, setIsRotating] = useState(false);

//   // Update label when data changes
//   useEffect(() => {
//     setLabel(data.label || '');
//   }, [data.label]);

//   // Focus on input when node is new
//   useEffect(() => {
//     if (isNew && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isNew]);

//   // Handle label changes
//   const handleChange = (e) => {
//     setLabel(e.target.value);
//     if (data.onLabelChange) {
//       data.onLabelChange(e.target.value);
//     }
//   };

//   // Handle blur event to save changes
//   const handleBlur = () => {
//     setIsEditing(false);
//     if (data.onLabelChange) {
//       data.onLabelChange(label);
//     }
//   };

//   // Toggle edit mode
//   const handleLabelClick = () => {
//     setIsEditing(true);
//   };

//   // Toggle resizable and rotatable state
//   const handleClick = () => {
//     setIsClickable((prev) => !prev);
//   };

//   // Handle resizing
//   const handleResizeStart = () => {
//     if (!isClickable) return;
//     setIsResizing(true);
//   };

//   const handleResizeStop = () => {
//     setIsResizing(false);
//   };

//   // Start rotation
//   const handleRotationStart = () => {
//     setIsRotating(true);
//   };

//   // End rotation
//   const handleRotationEnd = useCallback(() => {
//     setIsRotating(false);
//   }, []);

//   // Calculate rotation angle based on mouse movement
//   const handleMouseMove = useCallback(
//     (e) => {
//       if (isRotating && inputRef.current) {
//         const rect = inputRef.current.getBoundingClientRect();
//         const centerX = rect.left + rect.width / 2;
//         const centerY = rect.top + rect.height / 2;
//         const radians = Math.atan2(e.clientY - centerY, e.clientX - centerX);
//         const angle = (radians * 180) / Math.PI;
//         setRotation(angle);
//       }
//     },
//     [isRotating]
//   );

//   // Add and remove event listeners for rotation
//   useEffect(() => {
//     if (isRotating) {
//       document.addEventListener('mousemove', handleMouseMove);
//       document.addEventListener('mouseup', handleRotationEnd);
//     } else {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleRotationEnd);
//     }

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleRotationEnd);
//     };
//   }, [isRotating, handleMouseMove, handleRotationEnd]);

//   return (
//     <div
//       style={{
//         ...styles.wrapper,
//         transform: `rotate(${rotation}deg)`,
//       }}
//       onClick={handleClick}
//     >
//       {isClickable && (
//         <>
//           {/* Node Resizer */}
//           <NodeResizer
//             minWidth={50}
//             minHeight={30}
//             onResizeStart={handleResizeStart}
//             onResizeStop={handleResizeStop}
//           />
//           {/* Rotation Icon */}
//           <div
//             style={styles.rotationIcon}
//             onMouseDown={handleRotationStart}
//           >
//             <FaSyncAlt />
//           </div>
//         </>
//       )}

//       {/* Label Box */}
//       <div
//         style={{
//           ...styles.labelBox,
//           minWidth: isResizing ? 'auto' : data.width_height ? data.width_height.width : "100px",
//           minHeight: isResizing ? 'auto' : data.width_height ? data.width_height.height : '50px',
//         }}
//       >
// {isEditing && data.Editable || !data.label ? (
//             <input
//             ref={inputRef}
//             value={label}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             placeholder='Enter label'
//             className="textarea-class" // For placeholder styling
//             style={styles.input}
//           />
//         ) : (
//           <span onClick={handleLabelClick} style={styles.text}>
//             {label || 'Click to add label'}
//           </span>
//         )}
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
//   labelBox: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//     textAlign: 'center',

//     color: '#000',
//     borderRadius: '3px',
//     width: '100%',
//     height: '100%',
//     padding: '5px',
//     boxSizing: 'border-box',
//     overflow: 'hidden',
//   },
//   input: {
//     width: '100%',
//     padding: '5px',
//     borderRadius: '3px',
//     border: '1px solid #ccc',
//     outline: 'none',
//     textTransform: 'uppercase',    fontFamily: "'Poppins', sans-serif",
//     fontSize: '34px', // Adjust font size as needed
//     boxSizing: 'border-box',
//   },
//   text: {
//     cursor: 'pointer',
//     padding: '5px',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '100%',
//     height: '100%',
//     fontWeight: 'medium', // **Added for bold text**
//     textTransform: 'uppercase',    fontFamily: "'Poppins', sans-serif",
//     fontSize: '34px', // Ensure font size matches input
//     wordBreak: 'break-word', // Allow text to wrap
//   },
//   rotationIcon: {
//     position: 'absolute',
//     top: '-15px',
//     right: '-15px',
//     cursor: 'pointer',
//     backgroundColor: '#fff',
//     padding: '5px',
//     borderRadius: '50%',
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
//test
// // Wrap LabelNode with PlaceholderStyles
// const LabelNodeWithPlaceholder = (props) => (
//   <>
//     <PlaceholderStyles />
//     <LabelNode {...props} />
//   </>
// );

// export default memo(LabelNodeWithPlaceholder);

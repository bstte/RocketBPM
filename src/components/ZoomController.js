// import { useState } from "react";

// const GlobalZoomButtons = () => {
//   const [zoom, setZoom] = useState(1);

//   const applyZoom = (value) => {
//     setZoom(value);
//     document.documentElement.style.setProperty("--zoom-level", value);
//   };

//   const zoomIn = () => applyZoom(Math.min(zoom + 0.1, 2));
//   const zoomOut = () => applyZoom(Math.max(zoom - 0.1, 0.5));
//   const resetZoom = () => applyZoom(1);

//   return (
//     <div className="zoom_screen_btns">
//         <div>Zoom</div>
//       <button onClick={zoomOut}>−</button>
//       <button onClick={zoomIn}>+</button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     position: "fixed",
//     right: "20px",
//     top: "20px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "6px",
//     zIndex: 999999,
//   },
// };

// export default GlobalZoomButtons;
// import React, { useEffect, useState, useMemo } from "react";
// import { Box, Card, IconButton } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { useSelector } from "react-redux";
// import { getUserNodes } from "../../API/api";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import CustomHeader from '../../components/CustomHeader';
// import "./Dashboard.css"; 
// import {
//   ReactFlow,
//   ReactFlowProvider,
//   SmoothStepEdge,
//   BezierEdge,
//   StraightEdge,
// } from "@xyflow/react";

// import PublishArrowBoxNode from "../../AllNode/PublishAllNode/PublishArrowBoxNode";
// import PublishPentagonNode from "../../AllNode/PublishAllNode/PublishPentagonNode";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const user = useSelector((state) => state.user.user);
//   const [filteredNodes, setFilteredNodes] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedProcess, setSelectedProcess] = useState(null);
//   const [ProcessTitle, setProcessTitle] = useState(null);
//   const navigate = useNavigate();
//     const [totalHeight, setTotalHeight] = useState(0);
//       const [windowHeight, setWindowHeight] = useState(window.innerHeight);
//       const windowSize = {
//         width: window.innerWidth - 300,
//         height: window.innerHeight - 300,
//     };
    
      
    
//       useEffect(() => {
//         const calculateHeight = () => {
//           const breadcrumbsElement = document.querySelector(".breadcrumbs-container");
//           const appHeaderElement = document.querySelector(".app-header");
    
//           if (breadcrumbsElement && appHeaderElement) {
//             const combinedHeight = breadcrumbsElement.offsetHeight + appHeaderElement.offsetHeight + 100;
//             setTotalHeight(combinedHeight);
//           }
//         };
//         calculateHeight();
//         const handleResize = () => {
//           setWindowHeight(window.innerHeight);
//           calculateHeight();
//         };
//         window.addEventListener("resize", handleResize);
//         return () => {
//           window.removeEventListener("resize", handleResize);
//         };
//       }, []);

//   const memoizedNodeTypes = useMemo(
//     () => ({
//       progressArrow: PublishArrowBoxNode,
//       pentagon: PublishPentagonNode,
//     }),
//     []
//   );

//   const memoizedEdgeTypes = useMemo(
//     () => ({
//       smoothstep: SmoothStepEdge,
//       bezier: BezierEdge,
//       straight: StraightEdge,
//     }),
//     []
//   );

//   const getProcessTitle = (id) => {
//     const process = ProcessTitle?.find((p) => p.id === parseInt(id));
//     return process ? process.process_title : "Unknown";
//   };

  
//   useEffect(() => {
//     const getUserNodesData = async () => {
//       try {
//         const user_id = user?.id;
//         if (!user_id) return;
//         const response = await getUserNodes(parseInt(user_id));
// console.log("response",response)
//         setProcessTitle(response.ProcessTitle)
//         if (response?.nodes) {
//           const categorizedNodes = response.nodes[""].reduce((acc, node) => {
//             const processId = String(node.Process_id);
//             if (!acc[processId]) acc[processId] = [];
//             acc[processId].push(node);
//             return acc;
//           }, {});

//           const processedNodes = Object.keys(categorizedNodes).map(
//             (processId) => ({
//               processId,
//               nodes: categorizedNodes[processId].map((node) => {
//                 const parsedData = JSON.parse(node.data);
//                 const parsedPosition = JSON.parse(node.position);
//                 const parsedMeasured = JSON.parse(node.measured);

//                 return {
//                   id: node.node_id,
//                   type: node.type,
//                   position: parsedPosition,
//                   data: {
//                     ...parsedData,
//                     node_id: node.node_id,
//                     width_height: parsedMeasured,
//                     nodeResize: true,
//                     autoFocus: true,
//                   },
//                   draggable: false,
//                   animated: false,
//                 };
//               }),
//             })
//           );

//           setFilteredNodes(processedNodes);
//         }
//       } catch (error) {
//         console.error("getUserNodes error:", error);
//       }
//     };

//     getUserNodesData();
//   }, []);

//   // Open Menu
//   const handleOpenMenu = (event, processId) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProcess(processId);
//   };

//   // Close Menu
//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//     setSelectedProcess(null);
//   };

//   const styles = {
//     appContainer: {
//       display: "flex",
//       flexDirection: "column",
//       height: totalHeight > 0 ? `${windowHeight - totalHeight}px` : "auto",
//       marginTop: "0px",
//       backgroundColor: "#f8f9fa",
//     },
//     contentWrapper: {
//       display: "flex",
//       flex: 1,
//       borderLeft: "1px solid #002060",
//       borderRight: "1px solid #002060",
//       borderBottom: "1px solid #002060",
//     },
//     flowContainer: {
//       flex: 1,
//       backgroundColor: "#ffffff",
//       position: "relative",
//     },
//     reactFlowStyle: {
//       width: "100%",
//       height: "100%",
//     },
//   };

// // Slider settings
// const settings = {
//   dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 2, // Show 3 cards at a time
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     arrows: true,
//     centerMode: false, 
//     centerPadding: "20px",
//   responsive: [
//     { breakpoint: 1024, settings: { slidesToShow: 2 } }, // Show 2 cards on medium screens
//     { breakpoint: 600, settings: { slidesToShow: 1 } },  // Show 1 card on small screens
//   ],
// };


  
//   return (

//         <div>

//     <div className="ss_logo_hed_sec">
//       <div class="ss_logo_lft_div">
//         <img src="https://newprocesslab.com/wp-content/uploads/2021/12/cropped-Logo_NewProcessLab_60x523-1-1.png" />
//       </div>

//       <div className="ss_profile_rit_div">
//     <img src="../../../img/user-profile-image.jpeg" />
//       </div>
//     </div>

//           <div className="ss_title_bar"> <CustomHeader title="My Process Worlds" /></div>

//     <div className="ss_dash_slider_bx">
//     <div className="ss_add_process_div">
//     <p>
//             Add process world
//             </p>
//             <div className="ss_add_proces_img"> <img src="../../../img/plus.png" /></div>
//             </div>
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, padding: 2 }} className="ss_dash_slid_bx" sx={{ padding: 2 }}>
           
//     <Slider {...settings}>
//       {filteredNodes.map((item) => (
//         <Card
//           key={item.processId}
//           sx={{
//             width: "95%", 
//             minHeight: "300px",
//             padding: 2,
//             position: "relative",
//             display: "flex",
//             flexDirection: "column",
//             boxShadow: "none", // 
//             border: "1px solid #ddd", 
//           }}
//         >
//           {/* Three dots menu */}
//           <IconButton
//             sx={{ position: "absolute", top: 10, right: 10 }}
//             onClick={(event) => handleOpenMenu(event, item.processId)}
//           >
//             <MoreVertIcon />
//           </IconButton>

//           <label> {getProcessTitle(item.processId)}</label>

//           {/* React Flow Component */}
//           <div className="ss_dash_slid_img">
//             <img src="../../../img/dashboard-slider-image.jpg" />
//             <a href="#">Preview Image of Level 1</a>
//             </div>

//           {/* Custom dropdown menu */}
//           {selectedProcess === item.processId && (
//             <Box
//               sx={{
//                 position: "absolute",
//                 top: 35,
//                 right: 10,
//                 width: "150px",
//                 bgcolor: "white",
//                 boxShadow: 3,
//                 borderRadius: 1,
//                 padding: 1,
//                 zIndex: 1000,
//               }}
//             >
//               <p onClick={handleCloseMenu} style={{ cursor: "pointer", margin: 0 }}>✏ Published</p>
//               <p onClick={handleCloseMenu} style={{ cursor: "pointer", margin: 0 }}>✏ View Draft</p>
//               <p onClick={handleCloseMenu} style={{ cursor: "pointer", margin: 0 }}>✏ Managed Users</p>
//               <p onClick={handleCloseMenu} style={{ cursor: "pointer", margin: 0 }}>🗑 Delete Process</p>
//               <p onClick={()=>navigate('/Setting')} style={{ cursor: "pointer", margin: 0 }}>🗑 Setting</p>
//             </Box>
//           )}
//         </Card>
//       ))}
//     </Slider>
//   </Box>
//   </div>

// <div className="ss_container">
//   <div className="row">
//     <div className="col-lg-4">
//       <h4><img src="../../../img/two-fingers.png" /> Welcome, [First Name]!</h4>
//       <div className="ss_dash_sec_2_img"><img src="../../../img/video-image.jpg" /></div>
//     </div>
//     <div className="col-lg-8">
//       <div className="ss_dash_table_mn">
//         <h4><img src="../../../img/star-bold.svg" />My Favorites</h4>
        
//         <div className="ss_dash_table">
//         <table>
//         <thead>
//             <tr>
//                 <th width="63%">Process Name</th>
//                 <th width="22%">Source</th>
//                 <th width="15%">Published Date</th>
//             </tr>
//         </thead>
//         <tbody>
//             <tr>
//                 <td>XYZ</td>
//                 <td>NewProcessLab.com</td>
//                 <td>Jan 20, 2025</td>
//             </tr>
//             <tr>
//                 <td>ABC</td>
//                 <td>Process World X</td>
//                 <td>Jan 01, 2025</td>
//             </tr>
//             <tr>
//                 <td>123</td>
//                 <td>NewProcessLab.com</td>
//                 <td>Jan 15, 2025</td>
//             </tr>
//         </tbody>
//     </table>

//         </div>
//         <div className="ss_table_btm_para"><p>Activate the on <img src="../../../img/star.png" /> a process model to add a favorite.
//         </p></div>
//       </div>

//     </div>
//   </div>
// </div>

//     </div>
//   );
// };

// export default Dashboard;

// ye code anil ne bd me likha tha jo mere hisab se wast h esiliye file se hta kr yha pr likh diya hu agr zrurt hogi to bd ye use kr liya jayega
// wiase ye hight nikal kr appContainer style me hiegt defind krta h






// import { useEffect, useState } from "react";

// export const useDynamicAppHeight = () => {
//   const [totalHeight, setTotalHeight] = useState(0);
//   const [windowHeight, setWindowHeight] = useState(window.innerHeight);

//   useEffect(() => {
//     const calculateHeight = () => {
//       const breadcrumbsElement = document.querySelector(
//         ".breadcrumbs-container"
//       );
//       const appHeaderElement = document.querySelector(".app-header");

//       if (breadcrumbsElement && appHeaderElement) {
//         const combinedHeight =
//           breadcrumbsElement.offsetHeight +
//           appHeaderElement.offsetHeight +
//           100;

//         setTotalHeight(combinedHeight);
//       }
//     };

//     calculateHeight();

//     const handleResize = () => {
//       setWindowHeight(window.innerHeight);
//       calculateHeight();
//     };

//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return { totalHeight, windowHeight };
// };

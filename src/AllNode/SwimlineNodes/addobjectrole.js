// import React from "react";
// import PropTypes from "prop-types";

// const AddObjectRole = ({ position, options, onOptionClick, onClose }) => {
//   if (!options) return null;

//   return (
//     <div
//       style={{
//         ...styles.container,
//         top: position.y,
//         left: position.x,
//       }}
//       onContextMenu={(e) => e.preventDefault()}
//     >
//       {options.map((option, index) => (
//         <div className="menuitems" key={index}>
//           <div            
//             onClick={() => {
//               onOptionClick(option.value);
//               onClose();
//             }}
            
//           >
//             {option.label}
//           </div>

//           {/* Add a white line between options except for the last one */}
//           {index < options.length - 1 && <div style={styles.separator} />}
//         </div>
//       ))}
//     </div>
//   );
// };

// // Styles object
// const styles = {
//   container: {
//     position: "absolute",
//     background: "#e7e7e7",
//     borderRadius: "2px",
//     boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//     zIndex: 1000,
//     minWidth: "200px",
//   },
//   option: {
//     padding: "8px 12px",
//     cursor: "pointer",
//     color: "#011f60",
//     fontWeight: "500",
//     borderBottom: "1px solid rgb(255, 255, 255)"
//   },
// };

// // PropTypes for validation
// AddObjectRole.propTypes = {
//   position: PropTypes.shape({
//     x: PropTypes.number.isRequired,
//     y: PropTypes.number.isRequired,
//   }).isRequired,
//   options: PropTypes.arrayOf(PropTypes.string).isRequired,
//   onOptionClick: PropTypes.func.isRequired,
//   onClose: PropTypes.func.isRequired,
// };

// export default AddObjectRole;




import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const AddObjectRole = ({ position, options, onOptionClick, onClose }) => {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!options || options.length === 0) return null;

  const flowContainer = document.querySelector(".publishcontainer");
  const containerRect = flowContainer?.getBoundingClientRect();

  let x = position.x;
  let y = position.y;
  const menuWidth = 200;
  const menuHeight = options.length * 40;

  if (containerRect) {
    const maxX = containerRect.width - menuWidth - 10;
    const maxY = containerRect.height - menuHeight - 10;

    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;

    if (x < 10) x = 10;
    if (y < 10) y = 10;
  }

  return (
    <div
      ref={menuRef}
      style={{
        ...styles.container,
        top: y,
        left: x,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {options.map((option, index) => (
        <div
          className="menuitems"
          key={index}
          style={styles.option}
          onClick={() => {
            onOptionClick(option.value);
            onClose();
          }}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    position: "absolute",
    background: "#e7e7e7",
    borderRadius: "4px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    minWidth: "200px",
  },
  option: {
    padding: "10px 12px",
    cursor: "pointer",
    color: "#011f60",
    fontWeight: "500",
    borderBottom: "1px solid rgb(255, 255, 255)",
  },
};

AddObjectRole.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
  onOptionClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddObjectRole;

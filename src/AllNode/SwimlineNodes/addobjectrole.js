import React from "react";
import PropTypes from "prop-types";

const AddObjectRole = ({ position, options, onOptionClick, onClose }) => {
  if (!options) return null;

  return (
    <div
      style={{
        ...styles.container,
        top: position.y,
        left: position.x,
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {options.map((option, index) => (
        <div key={index}>
        <div
  style={styles.option}
  onClick={() => {
    onOptionClick(option);
    onClose();
  }}
  onMouseEnter={(e) => {
    e.target.style.backgroundColor = "#f0f0f0";
  }}
  onMouseLeave={(e) => {
    e.target.style.backgroundColor = "transparent";
  }}
>
  {option}
</div>

          {/* Add a white line between options except for the last one */}
          {index < options.length - 1 && <div style={styles.separator} />}
        </div>
      ))}
    </div>
  );
};

// Styles object
const styles = {
  container: {
    position: "absolute",
    background: "#e7e7e7",
    borderRadius: "2px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    minWidth: "200px",
  },
  option: {
    padding:"8px 12px",
    cursor: "pointer",
    color:"#011f60",
    fontWeight: "500",
    borderBottom: "1px solid rgb(255, 255, 255)"
  },
};

// PropTypes for validation
AddObjectRole.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onOptionClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddObjectRole;

// Popup.js
import React from "react";
import PropTypes from "prop-types";

const Popup = ({
  showPopup,
  popupPosition,
  handleCreateNewNode,
  deleteNode,
  selectedNodeType,
  switchNodeType,
  condition,
}) =>
  showPopup && (
    <div
      className="popup"
      style={{
        ...styles.popup,
        left: `${popupPosition.x}px`,
        top: `${popupPosition.y}px`,
      }}
    >
      <div className="newpopmenuitems" style={styles.popupTitle}>
        {condition.status === true ? (
          <button
            onClick={() => handleCreateNewNode(condition.Page_Title)}
            style={styles.popupButton}
          >
            Open Model
          </button>
        ) : (
          <>
            <button
              onClick={() => handleCreateNewNode("ProcessMap")}
              style={styles.popupButton}
            >
              Create New Process Map Model
            </button>
            <button
              onClick={() => handleCreateNewNode("Swimlane")}
              style={styles.popupButton}
            >
              Create New Swimlane Model
            </button>
          </>
        )}



        {selectedNodeType === "progressArrow" && (
          <button
            onClick={() => switchNodeType("pentagon")}
            style={styles.popupButton}
          >
            {`Switch shape to Steer & Enable Process`}
          </button>
        )}
        {selectedNodeType === "pentagon" && (
          <button
            onClick={() => switchNodeType("progressArrow")}
            style={styles.popupButton}
          >
            {`Switch shape to Value Adding Process`}
          </button>
        )}


        <button onClick={deleteNode} style={styles.popupButton}>
          {`Delete`}
        </button>


      </div>
    </div>
  );

const styles = {
  popup: {
    position: "absolute",
    background: "#e7e7e7",
    borderRadius: "0px",
    padding: 0,
    boxShadow: "2px 4px 9px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    minWidth: "200px",
  },
  popupTitle: {
    marginTop: "0px",
  },
  popupButton: {
    display: "block",
    width: "100%",
    background: "none",
    color: "#002060",
    border: "none",
    borderBottom: "1px solid #fff",
    paddingLeft: "25px",
    paddingRight: "25px",
    paddingTop: "10px",
    paddingBottom: "10px",
    textAlign: "left",
    cursor: "pointer",
    transition: "background 0.2s",
    fontWeight: "300",
    fontSize: "1rem",
  },
};

Popup.propTypes = {
  showPopup: PropTypes.bool.isRequired,
  popupPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  handleCreateNewNode: PropTypes.func.isRequired,
  deleteNode: PropTypes.func.isRequired,
  selectedNodeType: PropTypes.string,
};

// Add the following line
export default Popup;

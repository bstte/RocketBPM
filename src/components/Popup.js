// Popup.js
import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../hooks/useTranslation";
const Popup = ({
  showPopup,
  popupPosition,
  handleCreateNewNode,
  deleteNode,
  translation,
  selectedNodeType,
  switchNodeType,
  condition,
}) => {
  const t = useTranslation();
// Menu dimensions (adjust to your style)
  const menuWidth = 300;
  const menuHeight = 250;

  // Prevent menu overflow
  let x = popupPosition.x;
  let y = popupPosition.y;
  const { innerWidth, innerHeight } = window;

  if (x + menuWidth > innerWidth) x = innerWidth - menuWidth - 80;
  if (y + menuHeight > innerHeight) y = innerHeight - menuHeight;
  
  return (
    showPopup && (
      <div
        className="popup"
        style={{
          ...styles.popup,
         top: `${y}px`,
          left: `${x}px`,
        }}
      >
        <div className="newpopmenuitems" style={styles.popupTitle}>
          {selectedNodeType !== "StickyNote" && (
            <>
              {condition.status === true ? (
                <button
                  onClick={() => handleCreateNewNode(condition.Page_Title)}
                  style={styles.popupButton}
                >
                  {t("Open_Model")}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleCreateNewNode("ProcessMap")}
                    style={styles.popupButton}
                  >
                    {t('Create_New_Process_Map_Model')}
                  </button>
                  <button
                    onClick={() => handleCreateNewNode("Swimlane")}
                    style={styles.popupButton}
                  >
                    {t('Create_New_Swimlane_Model')}
                  </button>
                </>
              )}



              {selectedNodeType === "progressArrow" && (
                <button
                  onClick={() => switchNodeType("pentagon")}
                  style={styles.popupButton}
                >
                  {t('switch_shape_to_steer_enable_process')}
                </button>
              )}
              {selectedNodeType === "pentagon" && (
                <button
                  onClick={() => switchNodeType("progressArrow")}
                  style={styles.popupButton}
                >

                  {t('switch_shape_to_value_adding_process')}
                </button>
              )}

            </>
          )}

          <button onClick={translation} style={styles.popupButton}>
            {t("translation")}
          </button>

          <button onClick={deleteNode} style={styles.popupButton}>
            {t("Delete")}
          </button>


        </div>
      </div>
    )
  );
};
const styles = {
  popup: {
    position: "fixed",
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

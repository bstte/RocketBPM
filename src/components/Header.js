import React, { useContext, useState } from "react";
import { ProgressArrow, Pentagon, Diamond, Box, Label } from "./Icon";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { BreadcrumbsContext } from "../context/BreadcrumbsContext";

const Header = ({
  title,
  onSave,
  onExit,
  onPublish,
  addNode,
  handleBackdata,
  iconNames,
  currentLevel,
  getPublishedDate,
  getDraftedDate,
  setIsNavigating,
  Page,
}) => {
  const user = useSelector((state) => state.user.user);

  const [hoveredIcon, setHoveredIcon] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlehomeBack = async() => {
    const confirmcondition = await handleBackdata(); 
    if (confirmcondition) {
      navigate("/List-process-title");
    }
  
   
  };
  const { breadcrumbs } = useContext(BreadcrumbsContext);

  const iconComponents = {
    progressArrow: <ProgressArrow />,
    pentagon: <Pentagon />,
    diamond: <Diamond />,
    box: <Box />,
    label: <Label />,
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to logout?");
    if (isConfirmed) {
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  const formattedDate = getPublishedDate
    ? new Date(getPublishedDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "";
  const formattedDatedraft = getDraftedDate
    ? new Date(getDraftedDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
    : "";

  const handleBreadcrumbClick = async(path, state) => {
    const confirmcondition = await handleBackdata(); 
    console.log("confirmcondition click",confirmcondition)
    if (confirmcondition!==false) {
      setIsNavigating(true);
      navigate(path, { state });
    }
  };

  return (
    <>
      <div style={styles.mainheader}>
        <div style={styles.mhcolleft}>
          <img
            src="https://sp-ao.shortpixel.ai/client/to_auto,q_glossy,ret_img/https://newprocesslab.com/wp-content/uploads/2021/12/cropped-Logo_NewProcessLab_60x523-1-1.png"
            alt="RocketBPM"
            style={styles.mainlogo}
          />
        </div>
        <div style={styles.mhcolright}>
          <div style={styles.loginuserbox}>
            <div style={styles.loginuserpics}>
              <img src="/img/user.png" alt="User" style={styles.loginuserpic} />
            </div>
            <div style={styles.loginusername}>
              <div>{`Hi, ${user?.name || ""}`}</div>
              <span
                onClick={handleLogout}
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                Logout?
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="breadcrumbs-container"
        style={styles.breadcrumbsContainer}
      >
        {breadcrumbs
          .filter((crumb) => crumb.label !== title)
          .map((crumb, index, array) => (
            <span key={index}>
              {index === 0 ? (
                <span
                  onClick={() => handleBreadcrumbClick(crumb.path, crumb.state)}
                  style={styles.breadcrumbLink}
                >
                  <HomeIcon
                    style={{
                      width: 22,
                      height: 21,
                      verticalAlign: "middle",
                      marginRight: 5,
                    }}
                  />
                </span>
              ) : (
                <span
                  onClick={() => handleBreadcrumbClick(crumb.path, crumb.state)}
                  style={styles.breadcrumbLink}
                >
                  {crumb.label}
                </span>
              )}
              {index < array.length - 1 && (
                <span style={styles.separator}> {">"} </span>
              )}
            </span>
          ))}
      </div>

      <header className="app-header" style={styles.header}>
        <h1 style={styles.headerTitle}>
          {currentLevel === 0 && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={handlehomeBack}
            >
              <ArrowBackIcon fontSize="medium" />
            </IconButton>
          )}
          {title}
        </h1>

        <div style={styles.iconContainer}>
          {Object.keys(iconNames).map((iconKey) => (
            <div key={iconKey} style={styles.iconWrapper}>
              <button
                onMouseEnter={() => setHoveredIcon(iconKey)}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={() => addNode(iconKey)}
                style={styles.iconButton}
                aria-label={`Add ${iconNames[iconKey]}`}
              >
                <div
                  style={{
                    ...styles.iconStyle,
                    transform:
                      hoveredIcon === iconKey ? "scale(1.5)" : "scale(0.9)",
                  }}
                >
                  {iconComponents[iconKey]}
                </div>
              </button>
            </div>
          ))}
        </div>
        <div style={styles.flexbox}>

          {Page === "Draft" && (
            <>
              <div>
                <button
                  onClick={() => onSave("draft")}
                  style={{
                    ...styles.saveButton,
                    backgroundColor: "#218838",
                  }}
                >
                  Save as Draft
                </button>
              </div>
              <div style={styles.pdate}>
                <div>
                  Draft On
                  <br />
                  {formattedDatedraft}
                </div>
              </div>

              <div>
                <button
                  onClick={() => onPublish("Published")}
                  style={{
                    ...styles.saveButton,
                    backgroundColor: "#218838",
                  }}
                >
                  Publish
                </button>
              </div>
              <div style={styles.pdate}>
                <div>
                  Published
                  <br />
                  {formattedDate}
                </div>
              </div>
              <button
                  onClick={() =>onExit("exit")}
                  style={{
                    ...styles.saveButton,
                    backgroundColor: "#218838",
                  }}
                >
                  Exit
                </button>
            </>
          )}

          {
            Page === "Published" && (
              <>
                <div style={styles.pdate}>
                  <div>
                    Published
                    <br />
                    {formattedDate}
                  </div>
                </div>
              </>
            )
          }

          {
            Page === "ViewDraft" && (
              <>
                <div style={styles.pdate}>
                  <div>
                    Draft On
                    <br />
                    {formattedDatedraft}
                  </div>
                </div>
              </>
            )
          }

          {Page === "Published" && (
            <>
              <div>
                <button
                  onClick={() => onSave("draft")}
                  style={{
                    ...styles.saveButton,
                    backgroundColor: "#218838",
                  }}
                >
                  View Draft
                </button>
              </div>
            </>
          )}

          {Page === "ViewDraft" && (
            <>
              <div>
                <button
                  onClick={() => onSave("draft")}
                  style={{
                    ...styles.saveButton,
                    backgroundColor: "#218838",
                  }}
                >
                  Edit Draft
                </button>
              </div>
            </>
          )}
        </div>
      </header>
    </>
  );
};

const styles = {
  header: {
    padding: "0.7vw 15px",
    border: "1px solid #002060",
    color: "#343a40",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    margin: 0,
    fontSize: "1.2vw",
    fontWeight: "300",
    color: "#002060",
    textTransform: "uppercase",
  },
  iconContainer: {
    display: "flex",
    gap: "15px",
  },
  iconButton: {
    width: "2.7vw",
    height: "2.7vw",
    backgroundColor: "transparent",
    border: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    padding: "0",
    transition: "background-color 0.3s ease",
  },
  iconWrapper: {
    position: "relative",
  },
  iconStyle: {
    width: "32px",
    height: "32px",
    color: "#000",
    transition: "transform 0.3s ease",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745", // Green color for visibility
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  },
  mainheader: {
    width: "100%",
    display: "flex",
    marginBottom: "15px",
  },
  mainlogo: {
    width: "15vw",
  },
  mhcolleft: {
    width: "50%",
    display: "flex",
    alignItems: "center",
  },
  mhcolright: {
    width: "50%",
    display: "flex",
    justifyContent: "flex-end",
  },
  loginuserbox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  loginuserpic: {
    width: "2vw",
  },
  loginusername: {
    fontSize: "1vw",
  },
  pdate: {
    textTransform: "uppercase",
    textAlign: "center",
    fontSize: "0.8rem",
  },
  flexbox: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  secondarylogo: {
    width: "12vw",
  },
  breadcrumbsContainer: {
    margin: "10px 0",
    padding: "5px 10px",
    backgroundColor: "#f9f9f9", // Light background for breadcrumbs

    display: "flex", // Flexbox for inline items
    alignItems: "center", // Center items vertically
    fontFamily: "'Poppins', sans-serif",
  },
  breadcrumbLink: {
    textDecoration: "none",
    color: "#007bff", // Standard blue for links
    cursor: "pointer", // Change the cursor to indicate it's clickable
    padding: "5px 8px", // Increase clickable area if needed
    backgroundColor: "transparent", // Transparent background to look like a link
    border: "none", // Remove border if it's a button
  },
};

export default Header;

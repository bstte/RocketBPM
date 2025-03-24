import React, { useContext, useState, useRef, useEffect } from "react";
import { ProgressArrow, Pentagon, Diamond, Box, Label } from "./Icon";
import { IconButton } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { BreadcrumbsContext } from "../context/BreadcrumbsContext";
import StarIcon from "@mui/icons-material/Star";
import { ImageBaseUrl } from "../API/api";


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
  savefav, isFavorite, Process_img, Procesuser
}) => {
  const user = useSelector((state) => state.user.user);
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


  const [hoveredIcon, setHoveredIcon] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // const handlehomeBack = async () => {
  //   const confirmcondition = await handleBackdata();
  //   console.log(confirmcondition)
  //   if (confirmcondition === undefined) {
  //     navigate("/dashboard");
  //   }


  // };


  const { breadcrumbs } = useContext(BreadcrumbsContext);

  const iconComponents = {
    progressArrow: <ProgressArrow />,
    pentagon: <Pentagon />,
    diamond: <Diamond />,
    box: <Box />,
    label: <Label />,
  };


  useEffect(() => {
    setIsLoading(true); // Start loading
    const timer = setTimeout(() => {
      if (Process_img) {
        const img = new Image();
        img.src = `${ImageBaseUrl}/${Process_img}`;
        img.onload = () => {
          setImageSrc(img.src);
          setIsLoading(false); // Image loaded
        };
      } else {
        setImageSrc("https://newprocesslab.com/wp-content/uploads/2021/12/cropped-Logo_NewProcessLab_60x523-1-1.png");
        setIsLoading(false); // Default image loaded
      }
    }, 1000); // 1 sec delay for smooth loading

    return () => clearTimeout(timer);
  }, [Process_img]);



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

  const handleBreadcrumbClick = async (path, state) => {
    const confirmcondition = await handleBackdata();
    console.log("confirmcondition click", confirmcondition)
    if (confirmcondition !== false) {
      setIsNavigating(true);
      navigate(path, { state });
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);



  return (
    <>
      <div style={styles.mainheader} className="ss_new_hed">


        <div
          className="breadcrumbs-container"
          style={styles.mhcolleft}
        >
          {breadcrumbs
            .filter((crumb) => crumb.label !== title)
            .map((crumb, index, array) => (
              <span key={index} className="ss_hm_dash_home_icon">
                {index === 0 ? (
                  <span
                    onClick={() => handleBreadcrumbClick(crumb.path, crumb.state)}
                  >

                  <img src={`${process.env.PUBLIC_URL}/img/rocket-solid.svg`} alt="Rocket" />

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

        <div style={styles.mhcolright} className="ss_header_new_right">


          <div style={styles.loginuserbox} className="ss_hed_rit_user_secnew">
            {Page === "Published" && Procesuser.role !== "User" && (
              <>

                <button
                  onClick={() => onSave("draft")}
                  style={{
                    ...styles.saveButton,
                    backgroundColor: "#002060",
                  }}
                >
                  View Draft
                </button>

                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="favorite" className="ss_hed_star_img"
                >
                  <img src={`${process.env.PUBLIC_URL}/img/star-regular.svg`} alt="Star" />
                </IconButton>


                <button className="header_share_btn">
                  <img src={`${process.env.PUBLIC_URL}/img/share.png`} alt="Share" />
                </button>


              </>
            )}

            {(Page === "ViewDraftmodel" || Page === "ViewDraftswimlane") && (
              <>
                {Procesuser?.type !== "assign" && (
                  <div>

                    <button
                      onClick={() => onSave("editdraft")}
                      style={{
                        ...styles.saveButton,
                        backgroundColor: "#002060",
                      }}
                    >
                      {Page === "ViewDraftmodel" ? " EDIT MODEL" : " EDIT SWIMLANE MODEL"}
                    </button>
                  </div>
                )}


                <div>
                  <button
                    onClick={() => onSave("published")}
                    style={{
                      ...styles.saveButton,
                      backgroundColor: "#002060",
                    }}
                  >
                    VIEW PUBLISHED
                  </button>
                </div>
                <div>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="favorite" className="ss_hed_star_img"
                  >
                    <img src={`${process.env.PUBLIC_URL}/img/star-regular.svg`} alt="Star" />
                  </IconButton>
                </div>

                <div>
                  <button className="header_share_btn">
                    <img src={`${process.env.PUBLIC_URL}/img/share.png`} alt="Share" />
                  </button>
                </div>

              </>
            )}

            {Page === "Draft" && (
              <>
                <div>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="favorite"
                    onClick={savefav}
                  >
                    <StarIcon fontSize="large" style={{ color: isFavorite ? "red" : "gray" }} />
                  </IconButton>
                  <button
                    onClick={() => onSave("draft")}
                    style={{
                      ...styles.saveButton,
                      backgroundColor: "#002060",
                    }}
                  >
                    Save as Draft
                  </button>
                </div>


                <div>
                  <button
                    onClick={() => onPublish("Published")}
                    style={{
                      ...styles.saveButton,
                      backgroundColor: "#002060",
                    }}
                  >
                    Publish
                  </button>
                </div>

                <button
                  onClick={() => onExit("exit")}
                  style={{
                    ...styles.saveButton,
                    backgroundColor: "#002060",
                  }}
                >
                  Exit
                </button>
              </>
            )}

            <div className="ss_profile_rit_div">


              {/* Dropdown Button */}
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <div id="dropdownBtn" onClick={toggleDropdown}>

                  {user?.Profile_image ? (
                    <img src={`${ImageBaseUrl}uploads/profile_images/${user?.Profile_image}`} alt="Profile" />
                  ) : (
                    <img src="/img/user.png" alt="User" style={styles.loginuserpic} />
                  )}

                </div>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    <button onClick={() => navigate('/Account')}>Edot Profile</button>
                    <button onClick={() => handleLogout()}>Log out</button>

                  </div>
                )}
              </div>

            </div>
            {/* <div style={styles.loginusername}>
              <div>{` ${user?.first_name || ""}`}</div>
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
            </div> */}
          </div>
        </div>
      </div>



      <header className="app-header" style={styles.header}>
        <h1 style={styles.headerTitle} className="sameheight">
          {/* {currentLevel === 0 && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={handlehomeBack}
            >
              <ArrowBackIcon fontSize="medium" />
            </IconButton>
          )} */}

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
        <div style={styles.flexbox} className="ss_hed_box_mn">

          {Page === "Draft" && (
            <>

              <div style={styles.pdate}>
                <div>
                  Draft on
                  <br />
                  {formattedDatedraft}
                </div>
              </div>


              <div style={styles.pdate}>
                <div>
                  Published
                  <br />
                  {formattedDate}
                </div>
              </div>
              <div style={styles.mhcolleft} className="ss_box_hed_right_img">
              {isLoading ? (
                  <p>Image Loading...</p>
                ) : (
                  <img src={imageSrc} alt="RocketBPM" style={styles.mainlogo} />
                )}
              </div>
            </>
          )}

          {
            Page === "Published" && (
              <>
                <div style={styles.pdate} class="ss_box_hed_right_1">
                  <div>
                    Published
                    <br />
                    {formattedDate}
                  </div>

                </div>
                <div style={styles.mhcolleft} className="ss_box_hed_right_1_img">
                {isLoading ? (
                  <p>Image Loading...</p>
                ) : (
                  <img src={imageSrc} alt="RocketBPM" style={styles.mainlogo} />
                )}

                </div>
              </>
            )
          }

          {(Page === "ViewDraftmodel" || Page === "ViewDraftswimlane") && (
            <>
              <div style={styles.pdate} className="ss_box_hed_right_2">
                <div>
                  Draft on
                  <br />
                  {formattedDatedraft}
                </div>
              </div>
              <div style={styles.mhcolleft} className="ss_box_hed_right_img">
              {isLoading ? (
                  <p>Image Loading...</p>
                ) : (
                  <img src={imageSrc} alt="RocketBPM" style={styles.mainlogo} />
                )}
              </div>
            </>
          )
          }




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
    fontSize: "18pt",
    fontWeight: "300",
    color: "#002060",
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
    textAlign: "right",
    fontSize: "8pt",
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
    color: "#002060", // Standard blue for links
    cursor: "pointer", // Change the cursor to indicate it's clickable
    padding: "5px 8px", // Increase clickable area if needed
    backgroundColor: "transparent", // Transparent background to look like a link
    border: "none", // Remove border if it's a button
  },
};

export default Header;

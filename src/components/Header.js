import React, { useContext, useState, useRef, useEffect } from "react";
import { ProgressArrow, Pentagon, Diamond, Box, Label } from "./Icon";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { BreadcrumbsContext } from "../context/BreadcrumbsContext";
import { FaArrowLeft } from 'react-icons/fa';
import { ImageBaseUrl } from "../API/api";
import { copyLinkToClipboard, copyNameAndLinkToClipboard } from "../utils/shareHelper";
import { useTranslation } from "../hooks/useTranslation";
import ShareDropdown from "./ShareDropdown";

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
  savefav, isFavorite, Process_img, Procesuser, checkpublish, onShowVersion, processId
}) => {
  const user = useSelector((state) => state.user.user);
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  const [hoveredIcon, setHoveredIcon] = useState(null);



  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const t = useTranslation();
  const { breadcrumbs, removeBreadcrumbsAfter } = useContext(BreadcrumbsContext);

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
        setImageSrc("/img/RocketBPM_rocket_logo.png");
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

  const handleBreadcrumbClick = async (path, state, index) => {
    const confirmcondition = await handleBackdata();
    console.log("confirmcondition click", confirmcondition)
    if (confirmcondition !== false) {
      setIsNavigating(true);
      removeBreadcrumbsAfter(index);

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
          {Page === "ViewProcessmapVersion" ? (
            <FaArrowLeft
              fontSize="large"
              style={{ cursor: "pointer" }}
              onClick={handleBackdata}
            />
          ) : (
            breadcrumbs
              .filter((crumb) => crumb.label.trim() !== title.trim())
              .map((crumb, index, array) => (
                <span key={index} className="ss_hm_dash_home_icon">
                  {index === 0 ? (
                    <span
                      onClick={() => handleBreadcrumbClick(crumb.path, crumb.state)}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/img/rocket-solid.svg`}
                        alt="Rocket"
                      />
                    </span>
                  ) : (
                    <span
                      onClick={() =>
                        handleBreadcrumbClick(crumb.path, crumb.state, index)
                      }
                      style={styles.breadcrumbLink}
                    >
                      {crumb.label}
                    </span>
                  )}
                  {index < array.length - 1 && (
                    <span style={styles.separator}> {">"} </span>
                  )}
                </span>
              ))
          )}
        </div>




        <div style={styles.mhcolright} className="ss_header_new_right">


          <div style={styles.loginuserbox} className="ss_hed_rit_user_secnew">
            {(Page === "Published" || Page === "ViewPublishswimlane") && (
              <>

                <button
                  onClick={() => onSave("draft")}
                  style={{
                    ...styles.saveButton,
                    backgroundColor: "#002060",
                  }}
                >
                  {t("View_draft")}
                </button>
                <div onClick={onShowVersion} title="Version Info" className="headericons" style={{ display: "flex" }}>
                  <svg height="22px" width="22px" version="1.1" id="x32" viewBox="0 0 512 512" fill="#002060"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path class="st0" d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992 C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007 c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667 s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822 c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497 c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242 C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467 c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458 C314.716,152.979,297.039,174.043,273.169,176.123z"></path> </g> </g></svg>
                </div>
                {
                  isFavorite ? (
                    <div className="headericons active">
                      <img src={`${process.env.PUBLIC_URL}/img/star-solid.svg`} alt="Star" onClick={savefav} />
                    </div>
                  ) : (
                    <>
                      <div className="headericons">
                        <img src={`${process.env.PUBLIC_URL}/img/star-regular.svg`} alt="Star" onClick={savefav} />
                      </div>
                    </>
                  )
                }


                <ShareDropdown processId={processId} processName={title} t={t} iconClass="headericons_1" />



              </>
            )}

            {(Page === "ViewDraftmodel" || Page === "ViewDraftswimlane") && (
              <>
                {Procesuser.role !== "User" && (
                  <div>

                    <button
                      onClick={() => onSave("editdraft")}
                      style={{
                        ...styles.saveButton,
                        backgroundColor: "#002060",
                      }}
                    >
                      {Page === "ViewDraftmodel" ? `${t("EDIT_MODEL")}` : `${t("EDIT_SWIMLANE_MODEL")}`}
                    </button>
                  </div>
                )}

                {
                  checkpublish && (
                    <div>
                      <button
                        onClick={() => onSave("published")}
                        style={{
                          ...styles.saveButton,
                          backgroundColor: "#002060",
                        }}
                      >
                        {t("View_published")}

                      </button>
                    </div>
                  )
                }


                <div onClick={onShowVersion} title="Version Info" className="headericons">
                  <svg height="22px" width="22px" version="1.1" id="x32" viewBox="0 0 512 512" fill="#002060"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path class="st0" d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992 C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007 c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667 s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822 c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497 c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242 C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467 c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458 C314.716,152.979,297.039,174.043,273.169,176.123z"></path> </g> </g></svg>
                </div>


                {
                  isFavorite ? (
                    <div className="headericons active" style={{ display: "flex" }}>
                      <img src={`${process.env.PUBLIC_URL}/img/star-solid.svg`} alt="Star" onClick={savefav} />
                    </div>
                  ) : (
                    <>
                      <div className="headericons" style={{ display: "flex" }}>
                        <img src={`${process.env.PUBLIC_URL}/img/star-regular.svg`} alt="Star" onClick={savefav} />
                      </div>
                    </>
                  )
                }

               <ShareDropdown processId={processId} processName={title} t={t} iconClass="headericons_2" />


              </>
            )}

            {(Page === "Draft" || Page === "Swimlane") && (
              <>
                {
                  isFavorite ? (
                    <div className="headericons active" style={{ display: "flex" }}>
                      <img src={`${process.env.PUBLIC_URL}/img/star-solid.svg`} alt="Star" onClick={savefav} />
                    </div>
                  ) : (
                    <>
                      <div className="headericons" style={{ display: "flex" }}>
                        <img src={`${process.env.PUBLIC_URL}/img/star-regular.svg`} alt="Star" onClick={savefav} />
                      </div>
                    </>
                  )
                }

                <div onClick={onShowVersion} title="Version Info" className="headericons" style={{ display: "flex" }}>
                  <svg height="22px" width="22px" version="1.1" id="x32" viewBox="0 0 512 512" fill="#002060"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path class="st0" d="M255.992,0.008C114.626,0.008,0,114.626,0,256s114.626,255.992,255.992,255.992 C397.391,511.992,512,397.375,512,256S397.391,0.008,255.992,0.008z M300.942,373.528c-10.355,11.492-16.29,18.322-27.467,29.007 c-16.918,16.177-36.128,20.484-51.063,4.516c-21.467-22.959,1.048-92.804,1.597-95.449c4.032-18.564,12.08-55.667,12.08-55.667 s-17.387,10.644-27.709,14.419c-7.613,2.782-16.225-0.871-18.354-8.234c-1.984-6.822-0.404-11.161,3.774-15.822 c10.354-11.484,16.289-18.314,27.467-28.999c16.934-16.185,36.128-20.483,51.063-4.524c21.467,22.959,5.628,60.732,0.064,87.497 c-0.548,2.653-13.742,63.627-13.742,63.627s17.387-10.645,27.709-14.427c7.628-2.774,16.241,0.887,18.37,8.242 C306.716,364.537,305.12,368.875,300.942,373.528z M273.169,176.123c-23.886,2.096-44.934-15.564-47.031-39.467 c-2.08-23.878,15.58-44.934,39.467-47.014c23.87-2.097,44.934,15.58,47.015,39.458 C314.716,152.979,297.039,174.043,273.169,176.123z"></path> </g> </g></svg>
                </div>
                <div>
                  <button
                    onClick={() => onSave("draft")}
                    style={{
                      ...styles.saveButton,
                      backgroundColor: "#002060",
                    }}
                  >
                    {t("Save_as_Draft")}

                  </button>
                </div>


                <div>
                  <button
                    onClick={() => onPublish("Published")}
                    style={{
                      ...styles.saveButton,
                      backgroundColor: !checkpublish ? "gray" : "#002060",
                    }}
                    title={!checkpublish ? "Publish all parent models first" : ""}

                  >
                    {t("Publish")}

                  </button>
                </div>

                <button
                  onClick={() => onExit("exit")}
                  style={{
                    ...styles.saveButton,
                    backgroundColor: "#002060",
                  }}
                >
                  {t("Exit")}
                </button>



                <button
                  onClick={() => onExit("exit_without_saving")}
                  style={{
                    ...styles.saveButton,
                    backgroundColor: "#002060",
                  }}
                >
                  {t("exit_without_saving")}
                </button>
              </>
            )}

            <div className="ss_profile_rit_div mspage">




              <>
                {/* Dropdown Button */}
                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <div id="dropdownBtn" onClick={toggleDropdown}>

                    {user?.Profile_image ? (
                      <img src={
                        user?.Profile_image.startsWith('http')
                          ? user.Profile_image // âœ… Google ka full URL
                          : `${ImageBaseUrl}uploads/profile_images/${user.Profile_image}` // âœ… Local image
                      } alt="Profile" />
                    ) : (
                      <img src="/img/user-circle-solid.svg" alt="User" style={styles.loginuserpic} />
                    )}

                  </div>
                  {dropdownOpen && (
                    <div className="dropdown-content">
                      <button onClick={() => navigate('/Account')}>{t('Edit_Profile')}</button>
                      <button onClick={() => handleLogout()}>{t("Log_out")}</button>

                    </div>
                  )}
                </div>
              </>


            </div>

          </div>
        </div>
      </div>



      <header className="app-header" style={styles.header}>

        <h1 style={styles.headerTitle} className="sameheight">

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

          {(Page === "Draft" || Page === "Swimlane") && (
            <>

              <div style={styles.pdate}>
                <div>

                  {t("Draft")}
                  <br />
                  {formattedDatedraft}
                </div>
              </div>


              <div style={styles.pdate}>
                <div>
                  {t("Published")}

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
                    {t("Published")}
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

                  {t("Draft")}
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
    lineHeight: "18pt",
    fontWeight: "300",
    color: "#002060",
    display: "flex",
    alignItems: "center",
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
    color: "#002060",
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
    fontSize: "7pt",
    color: "#002060"
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
    padding: "0px 8px", // Increase clickable area if needed
    backgroundColor: "transparent", // Transparent background to look like a link
    border: "none", // Remove border if it's a button
  },
};

export default Header;
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { Box, Card, CircularProgress } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from "react-redux";
import apiExports, {
  checkRecord,
  getFavProcessesByUser,
  getUserNodes,
  getvideo,
  ImageBaseUrl,
} from "../../API/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomHeader from "../../components/CustomHeader";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";
import MiniMapPreview from "./MiniMapPreview";
import { useTranslation } from "../../hooks/useTranslation";
import ProcessMenu from "../../components/ProcessMenu";
// import { Opacity } from "@mui/icons-material";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);

  const [checkpublish, Setcheckpublish] = useState();
  const [Loading, SetLoading] = useState(false);
  const [filteredNodes, setFilteredNodes] = useState(() => {
    return JSON.parse(localStorage.getItem("filteredNodes")) || [];
  });

  const [getFavProcessesUser, setgetFavProcessesUser] = useState(() => {
    return JSON.parse(localStorage.getItem("favProcesses")) || [];
  });

  const [videoUrl, setVideoUrl] = useState(() => {
    return localStorage.getItem("videoUrl") || "";
  });
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [ProcessTitle, setProcessTitle] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const t = useTranslation();

  const { addBreadcrumb, resetBreadcrumbs } = useContext(BreadcrumbsContext);

  const getProcessTitle = (id) => {
    const process = ProcessTitle?.find((p) => p.id === parseInt(id));
    return process ? process.process_title : "";
  };

  const getProcessImage = (id) => {
    const process = ProcessTitle?.find((p) => p.id === parseInt(id));
    // If image exists, return full URL else return default logo
    return process && process.Process_img
      ? `${ImageBaseUrl}${process.Process_img}`
      : "/img/RocketBPM_rocket_logo.png";
  };

  useEffect(() => {
    const getUserNodesData = async () => {
      try {
        const user_id = user?.id;
        if (!user_id) return;

        const response = await getUserNodes(parseInt(user_id));
        setProcessTitle(response.ProcessTitle);

        if (!response?.assignedProcesses) return;

        const assignedUserData = response.assignedProcesses.reduce((acc, p) => {
          if (!acc[p.user_id]) acc[p.user_id] = {};
          acc[p.user_id][p.process_id] = p.Role;
          return acc;
        }, {});

        const nodesArray = response.nodes?.[""] || [];

        const categorizedNodes = nodesArray.reduce((acc, node) => {
          const processId = String(node.Process_id);
          const assignedRole =
            assignedUserData[node.user_id]?.[node.Process_id] || "Self";

          if (!acc[processId]) {
            acc[processId] = {
              processId,
              type: assignedRole !== "Self" ? "assign" : "self",
              id: node.user_id,
              role: assignedRole,
            };
          }

          return acc;
        }, {});

        // ✅ Add missing processes (which have no nodes)
        // ✅ Add missing processes based on ProcessTitle
        response.ProcessTitle.forEach((process) => {
          const processId = String(process.id);
          if (!categorizedNodes[processId]) {
            const assignment = response.assignedProcesses.find(
              (a) => a.process_id === process.id
            );

            if (assignment) {
              categorizedNodes[processId] = {
                processId,
                type: assignment.user_id === user_id ? "assign" : "assign",
                id: assignment.user_id,
                role: assignment.Role,
              };
            } else {
              // If not assigned to anyone, set default
              categorizedNodes[processId] = {
                processId,
                type: "self",
                id: user_id,
                role: "None",
              };
            }
          }
        });

        const processedNodes = Object.values(categorizedNodes);

        setFilteredNodes(processedNodes);
        localStorage.setItem("filteredNodes", JSON.stringify(processedNodes));
      } catch (error) {
        console.error("getUserNodes error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUserNodesData();
  }, [user?.id]);

  const getPublishedDatedata = useCallback(
    async (processId, PageGroupId) => {
      const user_id = user?.id;
      const publishedStatus = "Published";

      if (!user_id) return null;

      try {
        const response = await apiExports.GetPublishedDate(
          processId,
          publishedStatus,
          PageGroupId
        );
        return response?.updated_at || null; // Ensure a valid date is returned
      } catch (error) {
        console.error("Error fetching published date:", error);
        return null;
      }
    },
    [user?.id]
  );

  const [publishedDates, setPublishedDates] = useState({});
  useEffect(() => {
    const fetchPublishedDates = async () => {
      const dates = {};
      for (const item of getFavProcessesUser) {
        const date = await getPublishedDatedata(
          item.process_id,
          item.PageGroupId
        );
        // Make key: processId + PageGroupId
        const key = `${item.process_id}_${item.PageGroupId}`;
        dates[key] = date;
      }
      setPublishedDates(dates);
    };

    if (getFavProcessesUser.length > 0) {
      fetchPublishedDates();
    }
  }, [getFavProcessesUser, getPublishedDatedata]);

  useEffect(() => {
    localStorage.removeItem("selectedLanguageId");

    const getvideodata = async () => {
      try {
        const response = await getvideo();
        if (
          response &&
          response.youtube_url &&
          response.youtube_url.startsWith("http")
        ) {
          setVideoUrl(response.youtube_url);
          localStorage.setItem("videoUrl", response.youtube_url);
        } else {
          console.warn("Invalid video URL received:", response.youtube_url);
        }
      } catch (error) {
        console.error("get video error:", error);
      }
    };

    const addHomeBreadCrums = () => {
      const label = "Home";
      const path = "/dashboard";

      const state = {};
      resetBreadcrumbs();

      addBreadcrumb(label, path, state);
    };

    const getFavProcessesUser = async () => {
      const user_id = user ? user.id : null;

      if (!user_id) {
        console.error("Missing required fields:", { user_id });
        return; // Stop execution if any field is missing
      }

      try {
        const response = await getFavProcessesByUser(user_id);
        console.log("Response fav:", response);
        setgetFavProcessesUser(response.data);
        localStorage.setItem("favProcesses", JSON.stringify(response.data));
      } catch (error) {
        console.error("check fav error:", error);
      }
    };

    getvideodata();
    addHomeBreadCrums();
    getFavProcessesUser();
  }, [user?.id, addBreadcrumb, resetBreadcrumbs, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close menu if clicking outside of the dropdown
      if (!event.target.closest(".process-menu")) {
        setSelectedProcess(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Open Menu
  const handleOpenMenu = async (event, item) => {
    event.stopPropagation();
    setSelectedProcess(item.processId);
    const data = await checkPublishData(item);
    Setcheckpublish(data?.status);
    SetLoading(true);
  };

  const checkPublishData = async (item) => {
    const levelParam = "Level0";
    // const user_id = item ? item.id : null;
    const Process_id = item ? item.processId : null;
    const data = await apiExports.checkPublishRecord(levelParam, Process_id);

    return data;
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      console.error("Invalid video URL:", url);
      return ""; // Return an empty string if invalid
    }

    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v"); // Extracting 'v' parameter
      console.log("videoId");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    } catch (error) {
      console.error("Error parsing URL:", error);
      return ""; // Return empty string in case of error
    }
  };

  // Slider settings
  const settings = {
    dots: false,
    infinite: filteredNodes.length > 2 ? true : false,
    speed: 500,
    slidesToShow: Math.min(3, filteredNodes.length),
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    arrows: true,
    centerMode: false,
    centerPadding: "0px",
    adaptiveHeight: true,

    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(3, filteredNodes.length) },
      },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const formattedDate = (dateString) => {
    if (!dateString) return "draft";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const NavigateOnClick = async (item) => {
    const data = await checkPublishData(item);
    if (data.status) {
      navigate(`/published-map-level/${item.processId}`);
    } else {
      navigate(`/Draft-Process-View/${item.processId}`);
    }
  };

  const sliderRef = useRef(null);
  const [slideHeight, setSlideHeight] = useState(0);

  // Function to get and set the height
  const updateHeight = () => {
    const slideElement = sliderRef.current?.innerSlider?.list.querySelector(
      ".ss_dash_slid_bx .slick-track > div > div"
    );

    if (slideElement) {
      const height = slideElement.clientHeight;
      setSlideHeight(height);
    }
  };

  // Run after render
  useEffect(() => {
    updateHeight(); // Initial load
    window.addEventListener("resize", updateHeight); // Adjust on resize

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handlefavClick = async (
    Process_id,
    user_id,
    Level,
    PageGroupId,
    label
  ) => {
    try {
      const id = Process_id;
      const user = { id: user_id, type: "dashboard on click time" };

      // Extract level number if possible, else 0
      const newLevel = Level?.match(/^Level(\d+)/)?.[1]
        ? parseInt(Level.match(/^Level(\d+)/)[1], 10) + 1
        : 0;

      const levelParam = `Level${newLevel}${Level ? `_${Level}` : ""}`;

      const [nodeData, publishdata] = await Promise.all([
        checkRecord(levelParam, Process_id),
        apiExports.checkPublishRecord(levelParam, Process_id),
      ]);

      if (!nodeData.status) {
        alert("First create next model of this existing model");
        return;
      }

      let url = "";

      if (nodeData.Page_Title === "ProcessMap") {
        url = `/${
          publishdata.status ? "published-map-level" : "Draft-Process-View"
        }/${newLevel === 0 ? id : `${newLevel}/${Level}/${id}`}`;
      }

      if (nodeData.Page_Title === "Swimlane") {
        url = `/${
          publishdata.status
            ? "published-swimlane/level"
            : "Draft-Swim-lanes-View/level"
        }/${newLevel}/${Level}/${id}`;
      }

      if (url) navigate(url);
    } catch (error) {
      console.error("Error fetching link data:", error);
    }
  };

  return (
    <div>
      <div className="ss_title_bar">
        {" "}
        <CustomHeader title={t("my_process_world")} />
      </div>

      <div className="ss_dash_slider_bx">
        <div className="ss_dash_slid_bx">
          {isLoading ? (
            // Show Loader while fetching data
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              {filteredNodes.length > 2 ? (
                <Slider {...settings}>
                  {filteredNodes.map((item) => (
                    <Card
                      className="process_box_item_2"
                      key={item.processId}
                      sx={{
                        width: "95%",
                        minHeight: "300px",
                        padding: 2,
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "none", //
                        border: "1px solid #ddd",
                      }}
                    >
                      <div className="header_withlogo">
                        <div className="title_and_logo">
                          <label className="text_blue">
                            {" "}
                            {getProcessTitle(item.processId)}
                          </label>
                          <div
                            className="menu_button"
                            onClick={(e) => handleOpenMenu(e, item)}
                          >
                            <div className="circle_icons one">
                              <svg
                                fill="#002060"
                                height="20px"
                                width="20px"
                                viewBox="0 0 32 32"
                              >
                                <g strokeWidth="0"></g>
                                <g
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></g>
                                <g>
                                  <path d="M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z M21.7,14.7l-5,5C16.5,19.9,16.3,20,16,20s-0.5-0.1-0.7-0.3 l-5-5c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l4.3,4.3l4.3-4.3c0.4-0.4,1-0.4,1.4,0S22.1,14.3,21.7,14.7z" />
                                </g>
                              </svg>
                            </div>

                            {/* Custom dropdown menu */}
                            {selectedProcess === item.processId && (
                              <ProcessMenu
                                item={item}
                                ProcessTitle={ProcessTitle}
                                checkpublish={checkpublish}
                                t={t}
                              />
                            )}
                          </div>
                        </div>

                        {/* <div className="ss_title_underline"></div> */}
                        <div className="header_logo">
                          <img
                            src={getProcessImage(item.processId)}
                            alt="Process Logo"
                            className="process_logo"
                          />
                        </div>
                      </div>
                      {/* React Flow Component */}
                      <div
                        className="ss_dash_slid_img"
                        onClick={() => NavigateOnClick(item)}
                      >
                        <MiniMapPreview
                          processId={item.processId}
                          userId={item.id}
                        />
                      </div>
                    </Card>
                  ))}
                  {user && user.type !== "User" ? (
                    <div
                      className="ss_add_process_div ss_1 noprocessimg"
                      style={{ height: `${slideHeight}px` }}
                    >
                      <div style={{ width: "100%" }}>
                        <div className="header_withlogo">
                          {t("Add_process_world")}
                        </div>
                        <div
                          className="ss_dash_slid_img"
                          style={{ padding: "10px" }}
                        >
                          <div
                            className="ss_add_proces_img"
                            onClick={() => navigate("/Add-process-title")}
                          >
                            <img
                              src="../../../img/plus.png"
                              alt="profile img"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </Slider>
              ) : (
                <div className="process_boxes">
                  {filteredNodes.map((item) => (
                    <Card
                      className="process_box_item_1"
                      key={item.processId}
                      sx={{
                        width: "95%",
                        minHeight: "300px",
                        padding: 2,
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "none", //
                        border: "1px solid #ddd",
                      }}
                    >
                      <div className="header_withlogo">
                        <div className="title_and_logo">
                          <label className="text_blue">
                            {" "}
                            {getProcessTitle(item.processId)}
                          </label>
                          <div
                            className="menu_button"
                            onClick={(e) => handleOpenMenu(e, item)}
                          >
                            <div className="circle_icons two">
                              <svg
                                fill="#002060"
                                height="20px"
                                width="20px"
                                viewBox="0 0 32 32"
                              >
                                <g strokeWidth="0"></g>
                                <g
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></g>
                                <g>
                                  <path d="M16,2C8.3,2,2,8.3,2,16s6.3,14,14,14s14-6.3,14-14S23.7,2,16,2z M21.7,14.7l-5,5C16.5,19.9,16.3,20,16,20s-0.5-0.1-0.7-0.3 l-5-5c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l4.3,4.3l4.3-4.3c0.4-0.4,1-0.4,1.4,0S22.1,14.3,21.7,14.7z" />
                                </g>
                              </svg>
                            </div>

                            {/* Custom dropdown menu */}
                            {selectedProcess === item.processId && (
                              <ProcessMenu
                                item={item}
                                checkpublish={checkpublish}
                                t={t}
                              />
                            )}
                          </div>
                        </div>
                        {/* <div className="ss_title_underline"></div> */}
                        <div className="header_logo">
                          <img
                            src={getProcessImage(item.processId)}
                            alt="Process Logo"
                            className="process_logo"
                          />
                        </div>
                      </div>
                      <div
                        className="ss_dash_slid_img"
                        onClick={() => NavigateOnClick(item)}
                      >
                        <MiniMapPreview
                          processId={item.processId}
                          userId={item.id}
                        />
                      </div>
                    </Card>
                  ))}

                  {user && user.type !== "User" && (
                    <div className="ss_add_process_div ss_2">
                      <div style={{ width: "100%" }}>
                        <div className="header_withlogo">
                          {t("Add_process_world")}
                        </div>
                        <div
                          className="ss_add_proces_img"
                          onClick={() => navigate("/Add-process-title")}
                        >
                          <img src="../../../img/plus.png" alt="profile img" />
                        </div>
                        <div className="ss_dash_slid_img">
                          <img
                            src="../../../img/dashboard-slider-image.jpg"
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="ss_container">
        <div className="row">
          <div className="col-lg-4">
            <h4>
              <img src="../../../img/two-fingers.svg" alt="" /> {t("Welcome")},{" "}
              {user?.first_name}!
            </h4>
            <div className="ss_dash_sec_2_img">
              <iframe
                className="video"
                title="Video Player"
                src={getYouTubeEmbedUrl(videoUrl)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="ss_dash_table_mn">
              <h4>
                <img src="../../../img/star-solid.svg" alt="" />
                {t("my_favorites")}
              </h4>

              <div className="ss_dash_table">
                <table>
                  <thead>
                    <tr>
                      <th width="35%">{t("Process")}</th>
                      <th width="35%">{t("process_world")}</th>
                      <th width="20%">{t("Published")}</th>
                    </tr>
                  </thead>

                  {getFavProcessesUser.map((item) => {
                    // parse node.data only if parentId exists and node exists
                    let label = null;
                    if (item.parentId && item.node && item.node.data) {
                      try {
                        const parsedData = JSON.parse(item.node.data);
                        label = parsedData.label || null;
                      } catch (e) {
                        console.error("Error parsing node data", e);
                      }
                    }

                    return (
                      <tbody key={item.id}>
                        <tr>
                          <td
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              handlefavClick(
                                item.process_id,
                                item.user_id,
                                item.parentId,
                                item.PageGroupId,
                                label
                              )
                            }
                          >
                            {label || getProcessTitle(item.process_id)}
                          </td>
                          <td>{getProcessTitle(item.process_id)}</td>

                          <td>
                            {formattedDate(
                              publishedDates[
                                `${item.process_id}_${item.PageGroupId}`
                              ]
                            )}
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
              </div>
              <div className="ss_table_btm_para">
                <p>
                  {" "}
                  <img src="../../../img/star-regular.svg" alt="" />{" "}
                  {t("Activate_the_process_model_to_add_a_favorite.")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

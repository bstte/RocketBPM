import React, { useContext, useEffect, useState } from "react";
import { Box, Card, IconButton, CircularProgress } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from "react-redux";
import apiExports, { getFavProcessesByUser, getUserNodes, getvideo } from "../../API/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomHeader from '../../components/CustomHeader';
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";

const Dashboard = () => {
  const user = useSelector((state) => state.user.user);

  const [checkpublish, Setcheckpublish] = useState()
  const [Loading, SetLoading] = useState(false)
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
  const { addBreadcrumb, resetBreadcrumbs } = useContext(BreadcrumbsContext);



  const getProcessTitle = (id) => {
    const process = ProcessTitle?.find((p) => p.id === parseInt(id));
    return process ? process.process_title : "";
  };
  useEffect(() => {
    const getUserNodesData = async () => {
      try {
        const user_id = user?.id;
        if (!user_id) return;

        const response = await getUserNodes(parseInt(user_id));
        console.log("response", response);
        setProcessTitle(response.ProcessTitle);

        if (!response?.nodes || !response?.assignedProcesses) return;


        const assignedUserData = response.assignedProcesses.reduce((acc, p) => {
          if (!acc[p.user_id]) {
            acc[p.user_id] = {};
          }
          acc[p.user_id][p.process_id] = p.Role;
          return acc;
        }, {});

        const nodesArray = response.nodes[""] || [];

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

        const processedNodes = Object.values(categorizedNodes);
        console.log("processedNodes", processedNodes);

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

  const [publishedDates, setPublishedDates] = useState({});

  useEffect(() => {
    const fetchPublishedDates = async () => {
      const dates = {};
      for (const item of getFavProcessesUser) {
        dates[item.process_id] = await getPublishedDatedata(item.process_id);
      }
      setPublishedDates(dates);
    };
  
    if (getFavProcessesUser.length > 0) {
      fetchPublishedDates();
    }
  }, [getFavProcessesUser]);


const getPublishedDatedata = async (processId) => {
  console.log("hit prototype")
  const user_id = user?.id;
  const publishedStatus = "Published";

  if (!user_id) return null;

  try {
    const response = await apiExports.GetPublishedDate("Level0", parseInt(user_id), processId, publishedStatus);
    console.log("publisd date respone",response?.created_at)
    return response?.created_at || null; // Ensure a valid date is returned
  } catch (error) {
    console.error("Error fetching published date:", error);
    return null;
  }
};



  useEffect(() => {
    const getvideodata = async () => {
      try {
        const response = await getvideo();
        if (response && response.youtube_url && response.youtube_url.startsWith("http")) {
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
      const label = "Home"
      const path = '/dashboard'

      const state = {

      };
      resetBreadcrumbs()

      addBreadcrumb(label, path, state);
    }

    const getFavProcessesUser = async () => {
      const user_id = user ? user.id : null;


      if (!user_id) {
        console.error("Missing required fields:", { user_id, });
        return; // Stop execution if any field is missing
      }

      try {

        const response = await getFavProcessesByUser(user_id,);
        console.log("Response:", response);
        setgetFavProcessesUser(response.data);
        localStorage.setItem("favProcesses", JSON.stringify(response.data));
      } catch (error) {
        console.error("check fav error:", error);
      }
    }

    getvideodata()
    addHomeBreadCrums()
    getFavProcessesUser()

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
  const handleOpenMenu = async (event, processId) => {
    event.stopPropagation();
    setSelectedProcess(processId);
   const data=await checkPublishData(processId)
    Setcheckpublish(data?.status)
    SetLoading(true)
  };


  const checkPublishData=async(processId)=>{
    const levelParam = 'Level0'
    const user_id = user ? user.id : null;
    const Process_id = processId ? processId : null;
     const data = await apiExports.checkPublishRecord(
      levelParam,
      parseInt(user_id),
      Process_id
    );

    return data
  }

  const getYouTubeEmbedUrl = (url) => {
    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      console.error("Invalid video URL:", url);
      return ""; // Return an empty string if invalid
    }

    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v"); // Extracting 'v' parameter
      console.log("videoId",)
      return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    } catch (error) {
      console.error("Error parsing URL:", error);
      return ""; // Return empty string in case of error
    }
  };

  // Slider settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(2, filteredNodes.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    centerMode: false,
    centerPadding: "20px",
    adaptiveHeight: true,

    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: Math.min(2, filteredNodes.length) } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const formattedDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  

  const NavigateOnClick =async (item) => {
const data =await checkPublishData(item.processId)
if(data.status){
     navigate("/published-map-level", { state: { id: parseInt(item.processId), title: getProcessTitle(item.processId), user: item } })

}else{
       navigate("/Draft-Process-View", {
        state: {
          id: parseInt(item.processId),
          title: getProcessTitle(item.processId),
          user: item,
        },
      })

}
console.log(data)
  }

  return (

    <div >

      <div className="ss_title_bar"> <CustomHeader title="My Process Worlds" /></div>

      <div className="ss_dash_slider_bx">

        <div className="ss_dash_slid_bx">
          {isLoading ? (
            // Show Loader while fetching data
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <Slider {...settings}>
              {filteredNodes.map((item) => (

                <Card
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
                  {/* Three dots menu */}
                  <IconButton
                    sx={{ position: "absolute", top: 10, right: 10 }}
                    onClick={(event) => handleOpenMenu(event, item.processId)}
                  >
                    <MoreVertIcon />
                  </IconButton>

                  <label> {getProcessTitle(item.processId)}</label>

                  {/* React Flow Component */}
                  <div className="ss_dash_slid_img" onClick={()=>NavigateOnClick(item)}>
                    <img src="../../../img/dashboard-slider-image.jpg" alt="" />
                    <button>
                      Preview Image of Level 1
                    </button>
                    {/* <a href="#"></a> */}
                  </div>

                  {/* Custom dropdown menu */}
                  {selectedProcess === item.processId && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 35,
                        right: 10,
                        width: "150px",
                        bgcolor: "white",
                        boxShadow: 3,
                        borderRadius: 1,
                        padding: 1,
                        zIndex: 1000,
                      }}
                    >

                      {Loading && (
                        item.type === "self" ? (
                          <>
                            {/* Show all options when type is self */}
                            {checkpublish && (
                              <p
                                onClick={() =>
                                  navigate("/published-map-level", {
                                    state: {
                                      id: parseInt(item.processId),
                                      title: getProcessTitle(item.processId),
                                      user: item,
                                    },
                                  })
                                }
                                style={{ cursor: "pointer", margin: 0 }}
                              >
                                ✏ Published
                              </p>
                            )}
                            <p
                              onClick={() =>
                                navigate("/Draft-Process-View", {
                                  state: {
                                    id: parseInt(item.processId),
                                    title: getProcessTitle(item.processId),
                                    user: item,
                                  },
                                })
                              }
                              style={{ cursor: "pointer", margin: 0 }}
                            >
                              ✏ View Draft
                            </p>
                            <p
                              onClick={() =>
                                navigate("/User-Management", {
                                  state: {
                                    process: { id: parseInt(item.processId), user_id: item.id },
                                  },
                                })
                              }
                              style={{ cursor: "pointer", margin: 0 }}
                            >
                              ✏ Managed Users
                            </p>
                            <p
                              onClick={() =>
                                navigate("/Setting", {
                                  state: { ProcessId: parseInt(item.processId) },
                                })
                              }
                              style={{ cursor: "pointer", margin: 0 }}
                            >
                              🗑 Setting
                            </p>
                          </>
                        ) : (
                          <>
                            {/* Show only Published when role is User */}
                            {item.role === "User" && (
                              <p
                                onClick={() =>
                                  navigate("/published-map-level", {
                                    state: {
                                      id: parseInt(item.processId),
                                      title: getProcessTitle(item.processId),
                                      user: item,
                                    },
                                  })
                                }
                                style={{ cursor: "pointer", margin: 0 }}
                              >
                                ✏ Published
                              </p>
                            )}
                            {/* Show Published and View Draft when role is Modeler */}
                            {item.role === "Modeler" && (
                              <>
                                {checkpublish && (
                                  <p
                                    onClick={() =>
                                      navigate("/published-map-level", {
                                        state: {
                                          id: parseInt(item.processId),
                                          title: getProcessTitle(item.processId),
                                          user: item,
                                        },
                                      })
                                    }
                                    style={{ cursor: "pointer", margin: 0 }}
                                  >
                                    ✏ Published
                                  </p>
                                )}
                                <p
                                  onClick={() =>
                                    navigate("/Draft-Process-View", {
                                      state: {
                                        id: parseInt(item.processId),
                                        title: getProcessTitle(item.processId),
                                        user: item,
                                      },
                                    })
                                  }
                                  style={{ cursor: "pointer", margin: 0 }}
                                >
                                  ✏ View Draft
                                </p>
                              </>
                            )}
                          </>
                        )
                      )}



                    </Box>
                  )}
                </Card>
              ))}
            </Slider>
          )}
        </div>
        {user && user.type !== "User" ? (
          <div className="ss_add_process_div">
            <p>
              Add process world
            </p>
            <div className="ss_add_proces_img" onClick={() => navigate('/Add-process-title')}> <img src="../../../img/plus.png" alt="profile img" /></div>
          </div>
        ) : null}


      </div>

      <div className="ss_container">
        <div className="row">
          <div className="col-lg-4">
            <h4><img src="../../../img/two-fingers.svg" alt="" /> Welcome, [{user?.first_name}]!</h4>
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
              <h4><img src="../../../img/star-solid.svg" alt="" />My Favorites</h4>

              <div className="ss_dash_table">
                <table>
                  <thead>
                    <tr>
                      <th width="63%">Process Name</th>
                      <th width="15%">Published</th>
                    </tr>
                  </thead>
                  {getFavProcessesUser.map((item) => (
                    <tbody>

                      <tr>
                        <td>{getProcessTitle(item.process_id)}</td>

                      <td>{formattedDate(publishedDates[item.process_id])}</td>
                      </tr>
                    </tbody>
                  ))}

                </table>

              </div>
              <div className="ss_table_btm_para"><p>Activate the on <img src="../../../img/star.png" alt="" /> a process model to add a favorite.
              </p></div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

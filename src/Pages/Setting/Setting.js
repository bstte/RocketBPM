import { useEffect, useRef, useState } from "react";
import CustomHeader from "../../components/CustomHeader";
import "./Setting.css";
import {  useLocation, useNavigate } from "react-router-dom";
import { getProcessTitleById, updateProcess, ImageBaseUrl, deleteProcess, removeProcessImage } from "../../API/api";
import CustomAlert from "../../components/CustomAlert";

const Setting = () => {
  const location = useLocation();
  const { ProcessId } = location.state || {};
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // ✅ Loading state added

  const [processData, setProcessData] = useState({
    process_title: "",
    Process_img: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch process data by ID
  useEffect(() => {
    const fetchProcessData = async () => {
      if (!ProcessId) return;
      try {
        setLoading(true); 

        const response = await getProcessTitleById(ProcessId);
        if (response.data) {
          setProcessData(response.data);
        }
      } catch (error) {
        console.error("Error fetching process data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProcessData();
  }, [ProcessId]);

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
          setSelectedImage(img.src);
      };
    }
  };

  // Delete Process Function
  const handleDeleteProcess = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This process will be removed from all assigned locations."
    );

    if (!confirmDelete) return;

    try {
      await deleteProcess(ProcessId);
      alert("Process deleted successfully!");
      navigate("/dashboard", { replace: true });
      
    } catch (error) {
      console.error("Error deleting process:", error);
      alert("Failed to delete the process. Please try again.");
    }
  };

  const updateProcessdata = async () => {
    const formData = new FormData();
    formData.append("process_title", processData.process_title);
  
    if (selectedImage) {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      formData.append("Process_img", new File([blob], "profile.jpg", { type: "image/jpeg" }));
    }
  
    try {
      await updateProcess(ProcessId, formData); // Pass ProcessId as a parameter
      alert("Process updated successfully!");
      navigate("/dashboard")
    } catch (error) {
      console.error("Error updating process:", error);
      alert("Failed to update the process. Please try again.");
    }
  };
  
  const handleRemoveImage = async () => {
    CustomAlert.confirm(
        "Remove Profile Image",
        "Are you sure you want to remove your profile image?",
        async () => {
            if(selectedImage){
                setSelectedImage(null);

            }else{
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("User not authenticated! Please login.");
                    return;
                }
                console.log("ProcessId",ProcessId)
    
                try {
                    const response = await removeProcessImage(token,ProcessId);
                    const data = response.data; // Fix here
    
                    if (response.status === 200) { // Check status code
                      alert("Process image removed successfully!");
                      setProcessData((prev) => ({ ...prev, Process_img: null })); 
                    } else {
                        alert(data.message || "Failed to remove Process image.");
                    }
                    
                } catch (error) {
                    console.error("Error removing Process image:", error);
                    alert("Something went wrong. Please try again.");
                }
            }
          
        }
    );
};


  

  return (
    <div>
      <div className="ss_title_bar">
        <CustomHeader title="Settings" />
      </div>

      <div className="ss_sett_page_mn_div">
        <div className="ss_sett_lft_div">
          <h4>Edit Properties</h4>
          <div className="ss_logo_lft_div">
          {loading ? (
              <p>Loading...</p> 
            ) : selectedImage ? (
              <img src={selectedImage} alt="Selected" className="profile-image" />
            ) : processData.Process_img ? (
              <img src={`${ImageBaseUrl}/${processData.Process_img}`} alt="Process" className="profile-image" />
            ) : (
              <label>No Image</label>
            )}

           
          </div>

          <div className="ss_recheigh">
            <p>Recommended height: 34 pixel</p>
            <ul>
              <li><button onClick={() => fileInputRef.current.click()}>UPDATE</button></li>
              <li><button onClick={handleRemoveImage}>REMOVE</button></li>
            </ul>
          </div>

          <div className="ss_sett_input_sec">
            <ul>
              <li>
                <input
                  type="text"
                  name="process_title"
                  placeholder="Name of Process World"
                  value={processData.process_title}
                  onChange={(e) => setProcessData({ ...processData, process_title: e.target.value })}
                />
              </li>
              <li>Max. 35 characters</li>
            </ul>
          </div>
        </div>

        <div className="ss_sett_delete">
          <h4>Delete Process World</h4>
          <p>Be careful. Deleting a process world will really delete it.</p>
          <button onClick={handleDeleteProcess}>Delete</button>
        </div>

        <div className="ss_table_btm_btn">
          <ul>
            <li><button className="ss_add_user_btn" onClick={() => navigate(-1)}>Cancel</button></li>
            <li><button className="ss_add_user_btn" onClick={updateProcessdata}>Save</button></li>
          </ul>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageChange}
        accept="image/*"
      />
    </div>
  );
};

export default Setting;

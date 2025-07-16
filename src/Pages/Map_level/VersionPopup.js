import React, { useEffect, useState } from "react";
import "../../Css/VersionPopup.css";
import { saveProcessInfo, versionlist,ReplaceVersion } from "../../API/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomAlert from "../../components/CustomAlert";

const VersionPopup = ({ processId, currentLevel, currentParentId, onClose, viewVersion ,LoginUser}) => {
  const [activeTab, setActiveTab] = useState("contact");
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revisionText, setRevisionText] = useState("");

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [emailList, setEmailList] = useState([]);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState({
    owner: [],
    architecture: [],
    manager: [],
  });

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const LoginUserId= LoginUser ? LoginUser.id : null;
        const levelParam = currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`;
        const response = await versionlist(processId, levelParam,LoginUserId);
        console.log("respone",response)
        setVersions(response.versions || []);
        setAssignedUsers(response.assigned_users || []);
        setEmailList((response.assigned_users || []).map(u => u.user.email));

            // ✅ Set existing saved data
      setSelectedEmails(response.contact_info || {
        owner: [],
        architecture: [],
        manager: [],
      });

      setRevisionText(response.revision_info || "");


      } catch (error) {
        console.error("Error fetching versions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [processId, currentLevel, currentParentId]);

  const openEmailPopup = (role) => {
    setCurrentRole(role);
    setShowEmailPopup(true);
  };

  const selectEmail = (email) => {
    setSelectedEmails(prev => {
      const currentList = prev[currentRole] || [];  // fallback if undefined
      const alreadySelected = currentList.includes(email);
      return {
        ...prev,
        [currentRole]: alreadySelected
          ? currentList.filter(e => e !== email)
          : [...currentList, email],
      };
    });
  };
  
  const handleSave = async (tab) => {
    try {

      const levelParam = currentParentId !== null ? `Level${currentLevel}_${currentParentId}` : `Level${currentLevel}`;

      const payload = {
        process_id: processId,
        level: levelParam, // ✅ Add level to payload

      };
  
      if (tab === "contact") {
        payload.contact_info = selectedEmails;
      } else if (tab === "revision") {
        payload.revision_info = revisionText;
      }
  
      // Only call API if there's something to save
      if (payload.contact_info || payload.revision_info) {
        const response = await saveProcessInfo(payload);
        alert("Saved successfully!");
        console.log("Saved data:", response);
      } else {
        alert("Nothing to save for this tab.");
      }
    } catch (error) {
      alert("Error saving data.");
      console.error("Save failed:", error);
    }
  };
  

  const ReplaceVersionpage = async (level, processId, version) => {
    try {
      const response = await ReplaceVersion(level, processId, version);
      console.log("response replace version", response);
  
      if (response && response.message) {
        // ✅ show success alert
        CustomAlert.success("Success", response.message);
  
        // ✅ refresh page after short delay
        setTimeout(() => {
          window.location.reload();
        }, 1000); // 1 second delay so user can see success
      }
  
    } catch (error) {
      console.log("error replace version", error);
      CustomAlert.error("Error", "Failed to replace version.");
    }
  };
  
  // ✅ Call this when user clicks "Replace"
  const handleReplaceClick = (level, processId, version) => {
    CustomAlert.confirm(
      "Are you sure?",
      "This will replace the version. This action cannot be undone!",
      () => {
        // ✅ if confirmed
        ReplaceVersionpage(level, processId, version);
      },
      () => {
        // ✅ if cancelled
        console.log("User cancelled replace version");
      }
    );
  };

  return (
    <div className="version-popup-overlay">
      <div className="version-popup">
        {/* Header */}
        <div className="popup-header">
  <h3>Version Details</h3>
  <div className="popup-actions">
    <button className="save-btn" onClick={() => handleSave(activeTab)}>💾 Save</button>
    <button className="close-btn" onClick={onClose}>✕</button>
  </div>
</div>


        {/* Tabs */}
        <div className="tab-buttons">
          <button onClick={() => setActiveTab("contact")} className={activeTab === "contact" ? "active" : ""}>Contact</button>
          <button onClick={() => setActiveTab("revision")} className={activeTab === "revision" ? "active" : ""}>Revision Info</button>
          <button onClick={() => setActiveTab("version")} className={activeTab === "version" ? "active" : ""}>Version</button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "contact" && (
            <div className="contact-tab">
              {assignedUsers.length === 0 ? (
<p>Assigned user does not exist.</p>
              ) : (
                ["owner", "architecture", "manager"].map((role) => (
                  <div key={role} className="contact-item">
                    <label style={{ textTransform: "capitalize" }}>
                      {role === "owner" ? "Process Owner" : role === "architecture" ? "Process Architecture" : "Process Manager"}
                    </label>
                    <button onClick={() => openEmailPopup(role)}>+</button>
                    <div className="email-list">
                    {(selectedEmails[role] || []).map((email, idx) => (

                        <span className="email-chip" key={idx}>{email}</span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "revision" && (
            <div className="revision-tab">
              <ReactQuill value={revisionText} onChange={setRevisionText} placeholder="Write revision information..." />
            </div>
          )}

          {activeTab === "version" && (
            <div className="version-tab">
              {loading ? (
                <p>Loading...</p>
              ) : versions.length === 0 ? (
                <p>No version history found.</p>
              ) : (
                <table className="version-table">
                  <thead>
                    <tr>
                      <th>Version</th>
                      <th>Date & Time</th>
                      <th>User</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map((version, index) => (
                      <tr key={index}>
                        <td>{version.version}</td>
                        <td>{new Date(version.created_at).toLocaleString()}</td>
                        <td>{version.first_name} {version.last_name}</td>
                        <td className="actions">
                          <button onClick={() =>
                            viewVersion(version.process_id, version.level, version.version)
                          }>
                            👁
                          </button>
                          <button onClick={()=>handleReplaceClick(version.level,version.process_id,version.version)}>Replace</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Email Popup */}
        {showEmailPopup && (
  <div className="email-popup-overlay">
    <div className="email-popup">
      <div className="email-popup-header">
        <h4>Select users for <span className="popup-role">{currentRole}</span></h4>
        <button className="popup-close-btn" onClick={() => setShowEmailPopup(false)}>✕</button>
      </div>
      
      <div className="email-list-container">
        {emailList.map((email, index) => (
          <div key={index} className="email-item">
            <input
              type="checkbox"
              id={`email-${index}`}
              checked={(selectedEmails[currentRole] || []).includes(email)}

              onChange={() => selectEmail(email)}
            />
            <label htmlFor={`email-${index}`}>{email}</label>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default VersionPopup;

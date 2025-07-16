import React, { useEffect, useState } from "react";
import "../Css/VersionPopup.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { versionlist } from "../API/api";

const VersionPopupView = ({ processId, currentLevel, currentParentId, onClose, viewVersion ,LoginUser}) => {
  const [activeTab, setActiveTab] = useState("contact");
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revisionText, setRevisionText] = useState("");

  const [assignedUsers, setAssignedUsers] = useState([]);
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

        setVersions(response.versions || []);
        setAssignedUsers(response.assigned_users || []);

        setSelectedEmails(response.contact_info || {
            owner: [],
            architecture: [],
            manager: [],
          });
    
          setRevisionText(response.revision_info || "");
    
       
      } catch (error) {
        console.error("Error fetching version data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [processId, currentLevel, currentParentId]);

  return (
    <div className="version-popup-overlay">
      <div className="version-popup">
        {/* Header */}
        <div className="popup-header">
          <h3>Version Details</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
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
                      {role === "owner"
                        ? "Process Owner"
                        : role === "architecture"
                        ? "Process Architecture"
                        : "Process Manager"}
                    </label>
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
              <ReactQuill value={revisionText} readOnly theme="bubble" />
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
                          <button onClick={() => viewVersion(version.process_id, version.level, version.version)}>👁</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionPopupView;

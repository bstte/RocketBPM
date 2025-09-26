import React, { useEffect, useState } from "react";
import "../../Css/VersionPopup.css";
import { versionlist, ReplaceVersion, ImageBaseUrl } from "../../API/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomAlert from "../../components/CustomAlert";
import { DefaultemailIcon, DefaultUserIcon, PlusIcon } from "../../components/Icon";
import { useTranslation } from "../../hooks/useTranslation";

const VersionPopup = ({
  processId,
  currentLevel,
  currentParentId,
  onClose,
  viewVersion,
  LoginUser,
  title,
  handleSaveVersionDetails,
  status,
  type,
  versionPopupPayload
}) => {
  const [activeTab, setActiveTab] = useState("contact");
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revisionText, setRevisionText] = useState("");

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [emailList, setEmailList] = useState([]);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedEmails, setSelectedEmails] = useState({
    domain_owner: [],
    owner: [],
    architecture: [],
    manager: [],
  });

  const t = useTranslation();


  useEffect(() => {
    if (versionPopupPayload) {
      // agar parent me Save dabaya tha to wahi data dikhao
      setSelectedEmails(versionPopupPayload.contact_info || {
        domain_owner: [],
        owner: [],
        architecture: [],
        manager: [],
      });
      setRevisionText(versionPopupPayload.revision_info || "");
    }
  }, [versionPopupPayload]);

useEffect(() => {
  const fetchVersions = async () => {
    try {
      const LoginUserId = LoginUser ? LoginUser.id : null;
      const levelParam =
        currentParentId !== null
          ? `Level${currentLevel}_${currentParentId}`
          : `Level${currentLevel}`;
      const response = await versionlist(processId, levelParam, LoginUserId, status);

      setVersions(response.versions || []);
      setAssignedUsers(response.assigned_users || []);
      setEmailList((response.assigned_users || []).map((u) => u.user.email));

      // 🔑 Only update from API if local payload is not present
      if (!versionPopupPayload) {
        setSelectedEmails(
          response.contact_info || {
            domain_owner: [],
            owner: [],
            architecture: [],
            manager: [],
          }
        );
        setRevisionText(response.revision_info || "");
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchVersions();
}, [processId, currentLevel, currentParentId, LoginUser, versionPopupPayload]);

  // ➕ Popup open
  const openEmailPopup = (role) => {
    setCurrentRole(role);
    setSearchQuery("");
    setShowEmailPopup(true);
  };

  // ✅ Select/Deselect email
  const selectEmail = (email) => {
    setSelectedEmails((prev) => {
      const currentList = prev[currentRole] || [];
      const alreadySelected = currentList.includes(email);

      let updated = alreadySelected
        ? currentList.filter((e) => e !== email)
        : [...currentList, email];

      // Process Owner / Domain Owner => only 1 allowed
      if (currentRole === "owner" || currentRole === "domain_owner") {
        updated = alreadySelected ? [] : [email];
      }

      return {
        ...prev,
        [currentRole]: updated,
      };
    });
  };

  // ❌ Remove user
  const removeUser = (role, email) => {
    setSelectedEmails((prev) => ({
      ...prev,
      [role]: prev[role].filter((e) => e !== email),
    }));
  };

  // 💾 Save
  const handleSave = async (tab) => {
    try {
      const levelParam =
        currentParentId !== null
          ? `Level${currentLevel}_${currentParentId}`
          : `Level${currentLevel}`;

      const payload = {
        process_id: processId,
        level: levelParam,
        contact_info: selectedEmails,
        revision_info: revisionText,
      };

      if (payload.contact_info || payload.revision_info) {
        handleSaveVersionDetails(payload);
      } else {
        alert("Nothing to save for this tab.");
      }
    } catch (error) {
      alert("Error saving data.");
      console.error("Save failed:", error);
    }
  };

  // 🔄 Replace Version
  const ReplaceVersionpage = async (level, processId, version) => {
    try {
      const response = await ReplaceVersion(level, processId, version);
      if (response && response.message) {
        CustomAlert.success("Success", response.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log("error replace version", error);
      CustomAlert.error("Error", "Failed to replace version.");
    }
  };

  const handleReplaceClick = (level, processId, version) => {
    CustomAlert.confirm(
      "Are you sure?",
      "This will replace the version. This action cannot be undone!",
      () => ReplaceVersionpage(level, processId, version),
      () => { }
    );
  };

  // 🔎 Filtered users by search
  // 🔎 Filtered users by search
  const filteredUsers =
    searchQuery.trim() === ""
      ? [] // ✅ agar search empty hai, koi user mat dikhao
      : assignedUsers.filter((u) =>
        `${u.user.first_name} ${u.user.last_name} ${u.user.email}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

  // Roles config (different for map vs swimlane)
  const roleBlocks =
    type === "ProcessMaps"
      ? ["domain_owner", "owner"] // Only Domain Owner + Process Owner
      : ["owner", "architecture", "manager"]; // Swimlane

  return (
    <div className="version-popup-overlay">
      <div className="version-popup">
        {/* Header */}
        <div className="popup-header">
          <h3>{title}</h3>
          <div className="popup-actions">
            <button className="popup-button cancel" onClick={onClose}>
              {t("Cancel")}
            </button>
            <button
              className="popup-button save"
              onClick={() => handleSave(activeTab)}
            >
              {t("Save")}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-buttons">
          <button
            onClick={() => setActiveTab("contact")}
            className={activeTab === "contact" ? "active" : ""}
          >
            {t("Contacts")}
          </button>
          <button
            onClick={() => setActiveTab("revision")}
            className={activeTab === "revision" ? "active" : ""}
          >
            {t("revision_info")}
          </button>
          <button
            onClick={() => setActiveTab("version")}
            className={activeTab === "version" ? "active" : ""}
          >
            {t("version")}
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* CONTACT TAB */}
          {activeTab === "contact" && (
            <div className="contact-tab">
              {roleBlocks.map((role) => {
                const roleUsers = assignedUsers
                  .filter((user) => (selectedEmails[role] || []).includes(user.user.email))
                  .sort((a, b) => a.user.last_name.localeCompare(b.user.last_name));

                return (
                  <div key={role} className="contact-item">
                    <div className="flex_full">
                      <label>
                        {role === "domain_owner"
                          ? "Process Domain Owner:"
                          : role === "owner"
                            ? "Process Owner:"
                            : role === "architecture"
                              ? "Process Architects:"
                              : "Process Managers:"}
                      </label>
                    </div>

                    {roleUsers.length > 0 ? (
                      roleUsers.map((roleUser, index) => (
                        <div key={index} className="owner_details_list">
                          <div className="owner_details">
                            <div className="owner-pic">
                              {roleUser.user?.image ? (
                                <img
                                  src={`${ImageBaseUrl}uploads/profile_images/${roleUser.user.image}`}
                                  alt="Profile"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <DefaultUserIcon />
                              )}
                            </div>
                            <div className="owner-desc">
                              <span className="owner-name">
                                {roleUser.user.first_name} {roleUser.user.last_name}
                              </span>
                              <div className="owner-actions owner-flex">
                                <a href={`mailto:${roleUser.user.email}`} className="email-icon">
                                  <DefaultemailIcon />
                                </a>
                                <button
                                style={{marginLeft:20}}
                                className="popup-button remove"
                                  onClick={() => removeUser(role, roleUser.user.email)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>

                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="owner_details_list">
                        <div className="owner_details">
                          <div className="owner-pic">
                            <DefaultUserIcon />
                          </div>
                    
                        </div>
                      </div>
                    )}

                    {/* ➕ Add button (hide if owner/domain_owner already assigned) */}
                    {!(role === "owner" && roleUsers.length === 1) &&
                      !(role === "domain_owner" && roleUsers.length === 1) && (
                        <div className="owner_details_list">
                          <div className="owner_details">
                            <div
                              className="owner-pic"
                              onClick={() => openEmailPopup(role)}
                            >
                              <PlusIcon />
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          )}

          {/* REVISION TAB */}
          {activeTab === "revision" && (
            <div className="revision-tab">
              <ReactQuill
                value={revisionText}
                onChange={setRevisionText}
                placeholder="Write revision information..."
              />
            </div>
          )}

          {/* VERSION TAB */}
          {activeTab === "version" && (
            <div className="version-tab" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {loading ? (
                <p>Loading...</p>
              ) : versions.length === 0 ? (
                <p>{t("no_version_history_found")}</p>
              ) : (
                <table className="version-table">
                  <thead>
                    <tr>
                      <th>{t("version")}</th>
                      <th>{t("date_time")}</th>
                      <th>{t("user")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {versions.map((version, index) => (
                      <tr key={index}>
                        <td>{version.version}</td>
                        <td>{new Date(version.created_at).toLocaleString()}</td>
                        <td>{version.first_name} {version.last_name}</td>
                        <td className="actions">
                          <button
                            onClick={() =>
                              viewVersion(version.process_id, version.level, version.version)
                            }
                          >
                            👁
                          </button>
                          <button
                            onClick={() =>
                              handleReplaceClick(version.level, version.process_id, version.version)
                            }
                          >
                            {t("replace")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* EMAIL SEARCH POPUP */}
        {showEmailPopup && (
          <div className="email-popup-overlay">
            <div className="email-popup">
              <div className="email-popup-header">
                <h4>
                  {t("select_users_for")} <span className="popup-role">{currentRole}</span>
                </h4>
                <button
                  className="popup-close-btn"
                  onClick={() => setShowEmailPopup(false)}
                >
                  ✕
                </button>
              </div>

              <input
                type="text"
                placeholder="Search user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="email-search-box"
              />

              <div className="email-list-container">
                {filteredUsers.map((u, index) => (
                  <div key={index} className="email-item">
                    <input
                      type="checkbox"
                      id={`email-${index}`}
                      checked={(selectedEmails[currentRole] || []).includes(u.user.email)}
                      onChange={() => selectEmail(u.user.email)}
                    />
                    <label htmlFor={`email-${index}`}>
                      {u.user.first_name} {u.user.last_name} ({u.user.email})
                    </label>
                  </div>
                ))}

                {filteredUsers.length === 0 && <p>No users found</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionPopup;

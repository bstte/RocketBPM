import React, { useEffect, useState } from "react";
import "../Css/VersionPopup.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ImageBaseUrl, versionlist } from "../API/api";
import { DefaultemailIcon, DefaultUserIcon } from "./Icon";
import { useTranslation } from "../hooks/useTranslation";

const VersionPopupView = ({
  processId,
  currentLevel,
  currentParentId,
  onClose,
  viewVersion,
  LoginUser,
  title,
  status,
  type,
}) => {
  const [activeTab, setActiveTab] = useState("contact");
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revisionText, setRevisionText] = useState("");

  const [assignedUsers, setAssignedUsers] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState({
    owner: [],
    architecture: [],
    manager: [],
    domain_owner: [],
  });

  const t = useTranslation();

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const LoginUserId = LoginUser ? LoginUser.id : null;

        const levelParam =
          currentParentId !== null
            ? `Level${currentLevel}_${currentParentId}`
            : `Level${currentLevel}`;
        const response = await versionlist(
          processId,
          levelParam,
          LoginUserId,
          status
        );

        setVersions(response.versions || []);
        setAssignedUsers(response.assigned_users || []);

        setSelectedEmails(
          response.contact_info || {
            owner: [],
            architecture: [],
            manager: [],
            domain_owner: [],
          }
        );

        setRevisionText(response.revision_info || "");
      } catch (error) {
        console.error("Error fetching version data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [processId, currentLevel, currentParentId, LoginUser]);

  // ✅ Roles config
  const roleBlocks =
    type === "ProcessMaps"
      ? ["domain_owner", "owner"]
      : ["owner", "architecture", "manager"];

  return (
    <div className="version-popup-overlay">
      <div className="version-popup">
        {/* Header */}
        <div className="popup-header">
          <h3>{title}</h3>
          <button className="popup-button cancel" onClick={onClose}>
            {t("Cancel")}
          </button>
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
          {activeTab === "contact" && (
            <div className="contact-tab">
              {assignedUsers.length === 0 ? (
                <p>{t("assigned_user_does_not_exist")}</p>
              ) : (
                roleBlocks.map((role) => {
                  const roleUsers = assignedUsers.filter((user) =>
                    (selectedEmails[role] || []).includes(user.user.email)
                  );

                  return (
                    <div key={role} className="contact-item">
                      <div className="flex_full">
                        <label style={{ textTransform: "capitalize" }}>
                          {role === "domain_owner"
                            ? `${t("process_domain_owner")}`
                            : role === "owner"
                            ? `${t("process_owner")}`
                            : role === "architecture"
                            ? `${t("process_architecture")}`
                            : `${t("process_manager")}`}
                        </label>
                      </div>

                      {roleUsers.length > 0 ? (
                        roleUsers.map((roleUser, index) => (
                          <div key={index} className="owner_details_list">
                            <div className="owner_details">
                              <div className="owner-pic">
                                {roleUser.user && roleUser.user.image ? (
                                  <img
                                    src={`${ImageBaseUrl}uploads/profile_images/${roleUser.user.image}`}
                                    alt="Profile"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                    }}
                                  />
                                ) : (
                                  <DefaultUserIcon />
                                )}
                              </div>
                              <div className="owner-desc">
                                <span className="owner-name">
                                  {`${roleUser.user.first_name} ${
                                    roleUser.user.last_name || ""
                                  }`}
                                </span>

                                <div className="owner-email">
                                  <DefaultemailIcon />
                                  <span style={{ marginLeft: "8px" }}>
                                    {roleUser.user.email}
                                  </span>
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
                            <div className="owner-desc">
                              <span className="owner-name">{t("no_user")}</span>
                              <div className="owner-email">
                                <DefaultemailIcon />
                                <span style={{ marginLeft: "8px" }}></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "revision" && (
            <div className="revision-tab">
              <ReactQuill value={revisionText} readOnly theme="bubble" />
            </div>
          )}

          {activeTab === "version" && (
            <div
              className="version-tab"
              style={{
                maxHeight: "300px", // ya jitni height chahiye
                overflowY: "auto",
              }}
            >
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
                        <td>
                          {new Date(version.created_at).toLocaleString()}
                        </td>
                        <td>
                          {version.first_name} {version.last_name}
                        </td>
                        <td className="actions">
                          <button
                            onClick={() =>
                              viewVersion(
                                version.process_id,
                                version.level,
                                version.version
                              )
                            }
                          >
                            👁
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
      </div>
    </div>
  );
};

export default VersionPopupView;

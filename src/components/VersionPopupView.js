import React, { useEffect, useState } from "react";
import "../Css/VersionPopup.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ImageBaseUrl, versionlist } from "../API/api";
import { DefaultemailIcon, DefaultUserIcon } from "./Icon";
import { useTranslation } from "../hooks/useTranslation";
import { useLangMap } from "../hooks/useLangMap";
import { useFetchVersions } from "../hooks/useFetchVersions";

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
  selectedLanguage,
  OriginalDefaultlanguge_id
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
    modeler: [],
  });
  const langMap = useLangMap(); // inside component

  const t = useTranslation();
  const { responseData, refetch } = useFetchVersions({
    processId,
    currentLevel,
    currentParentId,
    LoginUser,
    status,
  });
  useEffect(() => {
    if (!responseData) return;
    if (!langMap || Object.keys(langMap).length === 0) return;
    setLoading(false)
  
    setVersions(responseData.versions || []);
    setAssignedUsers(responseData.assigned_users || []);

    setSelectedEmails(
      responseData.contact_info || {
        owner: [],
        architecture: [],
        manager: [],
        domain_owner: [],
        modeler: [],
      }
    );

    let revisionData = {};
    try {
      revisionData =
        typeof responseData.revision_info === "string"
          ? JSON.parse(responseData.revision_info)
          : responseData.revision_info || {};
    } catch (e) {
      console.error("Failed to parse revision_info", e);
    }

    const langKey = langMap[selectedLanguage] || "loading...";
    const ORIGlanguageKey = langMap[OriginalDefaultlanguge_id] || "loading...";
    setRevisionText(
      revisionData[langKey]?.content ??
      revisionData[ORIGlanguageKey]?.content ??
      ""
    );
  }, [responseData, langMap, selectedLanguage]);
  // ✅ Roles config

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
            {t("contact")}
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
              {(() => {
                if (!assignedUsers || assignedUsers.length === 0) {
                  // Agar assignedUsers empty ya undefined
                  return <p>{t("No_Process_Management_Roles_assigned")}</p>;
                }

                // Prepare role blocks
                const roleBlocks =
                  type === "ProcessMaps"
                    ? ["domain_owner", "owner", "modeler"]
                    : ["owner", "architecture", "manager", "modeler"];

                // Filter roles jisme at least ek user assigned ho
                const roleBlocksWithUsers = roleBlocks
                  .map((role) => {
                    const roleUsers = assignedUsers.filter((user) =>
                      (selectedEmails[role] || []).includes(user.user?.email)
                    );
                    return { role, roleUsers };
                  })
                  .filter((block) => block.roleUsers.length > 0);

                if (roleBlocksWithUsers.length === 0) {
                  // Agar koi bhi role me user assigned nahi
                  return <p>{t("no_process_management_roles_assigned")}</p>;
                }

                // Display blocks jisme user assigned ho
                return roleBlocksWithUsers.map((block) => (
                  <div key={block.role} className="contact-item">
                    <div className="flex_full">
                      <label style={{ textTransform: "capitalize" }}>


                        {block.role === "domain_owner"
                          ? t("process_domain_owner")
                          : block.role === "owner"
                            ? t("process_owner")
                            : block.role === "architecture"
                              ? t("process_architects")
                              : block.role === "manager"
                                ? t("process_manager")
                                : block.role === "modeler"
                                  ? t("process_modeler")   // ⭐ नया Label
                                  : ""}
                      </label>
                    </div>

                    {block.roleUsers.map((roleUser, index) => (
                      <div key={index} className="owner_details_list">
                        <div className="owner_details">
                          <div className="owner-pic">
                            {roleUser.user?.image ? (
                              <img
                                src={
                                  roleUser?.user.image.startsWith("http")
                                    ? roleUser?.user.image // ✅ Google ka full URL
                                    : `${ImageBaseUrl}uploads/profile_images/${roleUser.user.image}` // ✅ Local image
                                }
                                alt="Profile"
                              />
                            ) : (
                              <DefaultUserIcon />
                            )}
                          </div>
                          <div className="owner-desc">
                            <span className="owner-name">
                              {roleUser.user.first_name}{" "}
                              {roleUser.user.last_name || ""}
                            </span>

                            <div className="owner-email">
                              <a
                                href={`mailto:${roleUser.user.email}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <DefaultemailIcon />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ));
              })()}
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
                        <td>{new Date(version.created_at).toLocaleString()}</td>
                        <td>
                          <div className="owner-actions owner-flex">
                            {version.email && (
                              <>
                                <a
                                  href={`mailto:${version.email}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <DefaultemailIcon />
                                </a>
                              </>
                            )}

                            <div style={{ marginLeft: 10 }}>
                              {version.first_name} {version.last_name}
                            </div>
                          </div>
                        </td>
                        <td className="actions">
                          {index !== 0 && (
                            <button
                              onClick={() =>
                                viewVersion(
                                  version.process_id,
                                  version.level,
                                  version.version
                                )
                              }
                            >
                              {t("view")}
                            </button>
                          )}
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

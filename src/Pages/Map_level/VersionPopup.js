import React, { useEffect, useState } from "react";
import "../../Css/VersionPopup.css";
import { versionlist, ReplaceVersion, ImageBaseUrl } from "../../API/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomAlert from "../../components/CustomAlert";
import {
  DefaultemailIcon,
  DefaultUserIcon,
  PlusIcon,
} from "../../components/Icon";
import { useTranslation } from "../../hooks/useTranslation";
import { useLangMap } from "../../hooks/useLangMap";
import TranslationTextAreaPopup from "../../hooks/TranslationTextAreaPopup";
import { useFetchVersions } from "../../hooks/useFetchVersions";
import { getLevelKey } from "../../utils/getLevel";

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
  versionPopupPayload,
  supportedLanguages,
  selectedLanguage,
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

  const [selectedUsers, setSelectedUsers] = useState({
    domain_owner: [],
    owner: [],
    architecture: [],
    manager: [],
    modeler: [],
  });
  const [showTranslationPopup, setShowTranslationPopup] = useState(false);
  const [translations, setTranslations] = useState({});
  const langMap = useLangMap(); // same hook used in first component

  const t = useTranslation();
  const { responseData, refetch } = useFetchVersions({
    processId,
    currentLevel,
    currentParentId,
    LoginUser,
    status,
  });


  useEffect(() => {
    if (versionPopupPayload) {
      setSelectedUsers(
        versionPopupPayload.contact_info || {
          domain_owner: [],
          owner: [],
          architecture: [],
          manager: [],
          modeler: [],
        }
      );
      // 🧠 Load revision translations
      const revisionData = versionPopupPayload.revision_info;
      if (typeof revisionData === "object") {
        setTranslations(revisionData);
        const langKey = langMap[selectedLanguage] || "en";
        setRevisionText(revisionData[langKey]?.content || "");
      } else {
        setRevisionText(revisionData || "");
      }
    }
    setLoading(false)
  }, [versionPopupPayload, selectedLanguage]);

  useEffect(() => {
    if (!responseData || !langMap || Object.keys(langMap).length === 0)
      return;


    // Versions
    setVersions(responseData.versions || []);

    // Assigned Users List
    const users = responseData.assigned_users || [];
    setAssignedUsers(users);
    setEmailList(users.map((u) => u.user.email));

    // If popup data already loaded, skip overwriting
    if (versionPopupPayload) return;

    // contact_info
    setSelectedUsers(
      responseData.contact_info || {
        domain_owner: [],
        owner: [],
        architecture: [],
        manager: [],
        modeler: [],
      }
    );

    // revision_info
    let revisionData = {};
    try {
      revisionData =
        typeof responseData.revision_info === "string"
          ? JSON.parse(responseData.revision_info)
          : responseData.revision_info || {};
    } catch (e) {
      console.error("revision_info parse error", e);
    }

    setTranslations(revisionData);

    const langKey = langMap[selectedLanguage];
    setRevisionText(revisionData?.[langKey]?.content || "");


  }, [responseData, langMap, selectedLanguage, versionPopupPayload]);

  // ➕ Popup open
  const handleAddUser = (role) => {
    setCurrentRole(role);
    setSearchQuery("");
    setShowEmailPopup(true);
  };

  // ✅ Select/Deselect email
  const selectUser = (userId) => {
    setSelectedUsers((prev) => {
      const currentList = prev[currentRole] || [];
      const alreadySelected = currentList.includes(userId);

      let updated = alreadySelected
        ? currentList.filter((id) => id !== userId)
        : [...currentList, userId];

      // Single user roles
      if (
        currentRole === "owner" ||
        currentRole === "modeler" ||
        currentRole === "domain_owner"
      ) {
        updated = alreadySelected ? [] : [userId];
      }

      return {
        ...prev,
        [currentRole]: updated,
      };
    });
  };


  // ❌ Remove user
  const removeUser = (role, userId) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [role]: prev[role].filter((id) => id !== userId),
    }));
  };


  // 💾 Save
  const handleSave = async (tab) => {
    console.log("revision_info", translations);
    try {

      const levelParam = getLevelKey(currentLevel, currentParentId);

      const payload = {
        process_id: processId,
        level: levelParam,
        contact_info: selectedUsers,
        revision_info: translations,
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


  const filteredUsers =
    searchQuery.trim() === ""
      ? []
      : assignedUsers
        .filter((u) => {
          if (currentRole === "modeler") {
            return u.role_id === 1;        // ⭐ केवल Process Modeler के लिए
          }
          return true;                    // ⭐ बाकी roles में कोई filter नहीं
        })
        .filter((u) =>
          `${u.user.first_name} ${u.user.last_name} ${u.user.email}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );


  // Roles config (different for map vs swimlane)
  const roleBlocks =
    type === "ProcessMaps"
      ? ["domain_owner", "owner", "modeler"] // Only Domain Owner + Process Owner
      : ["owner", "architecture", "manager", "modeler"]; // Swimlane

  return (
    <>
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
            {/* CONTACT TAB */}
            {activeTab === "contact" && (
              <div className="contact-tab">
                {roleBlocks.map((role) => {
                  const roleUsers = assignedUsers
                    .filter((user) =>
                      (selectedUsers[role] || []).includes(user.user.id)
                    )

                    .sort((a, b) =>
                      a.user.last_name.localeCompare(b.user.last_name)
                    );

                  return (
                    <div key={role} className="contact-item">
                      <div className="flex_full">
                        <label>
                          {role === "domain_owner"
                            ? t("process_domain_owner")
                            : role === "owner"
                              ? t("process_owner")
                              : role === "architecture"
                                ? t("process_architects")
                                : role === "manager"
                                  ? t("process_manager")
                                  : role === "modeler"
                                    ? t("process_modeler")   // ⭐ नया Label
                                    : ""}

                        </label>
                      </div>

                      {roleUsers.length > 0
                        ? roleUsers.map((roleUser, index) => (
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
                                  {roleUser.user.first_name}{" "}
                                  {roleUser.user.last_name}
                                </span>
                                <div className="owner-actions owner-flex">
                                  <a
                                    href={`mailto:${roleUser.user.email}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <DefaultemailIcon />
                                  </a>

                                  <button
                                    style={{ marginLeft: 20 }}
                                    className="popup-button remove"
                                    onClick={() =>
                                      removeUser(role, roleUser.user.id)
                                    }
                                  >

                                    {t("remove")}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                        : null}

                      {/* ➕ Add button (hide if owner/domain_owner already assigned) */}

                      {!loading && // ⏳ Wait until API data loaded
                        !(role === "owner" && roleUsers.length === 1) &&
                        !(role === "modeler" && roleUsers.length === 1) &&
                        !(role === "domain_owner" && roleUsers.length === 1) && (
                          <div className="owner_details_list">
                            <div className="owner_details">
                              <div
                                className="owner-pic"
                                onClick={() => handleAddUser(role)}
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h4 style={{ margin: 0 }}>{t("revision_info")}</h4>
                  <button
                    className="popup-button"
                    style={{ backgroundColor: "#d9d9d9", color: "#000" }}
                    onClick={() => setShowTranslationPopup(true)}
                  >
                    {t("translation")}
                  </button>
                </div>

                <ReactQuill
                  value={revisionText}
                  onChange={(value) => {
                    setRevisionText(value);
                    const langKey = langMap[selectedLanguage] || "en";
                    setTranslations((prev) => ({
                      ...prev,
                      [langKey]: {
                        ...(typeof prev[langKey] === "object" &&
                          prev[langKey] !== null
                          ? prev[langKey]
                          : {}),
                        content: value,
                      },
                    }));
                  }}
                  placeholder="Write revision information..."
                />
              </div>
            )}

            {/* VERSION TAB */}
            {activeTab === "version" && (
              <div
                className="version-tab"
                style={{ maxHeight: "300px", overflow: "auto" }}
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
                        <th>{t("Type")}</th>
                        <th>{t("Status")}</th>

                        <th>{t("date_time")}</th>
                        <th>{t("user")}</th>
                        <th>{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {versions.map((version, index) => (
                        <tr key={index}>
                          <td>{version.version}</td>
                          <td>{version.change_type || "-"}</td>
                          <td>
                            {version.approval_status === "Approved" ? (
                              <span style={{ color: "green", fontWeight: "600" }}>
                                {t("Approved")} {t("by")} {version.approver_name}
                              </span>
                            ) : version.approval_status === "Rejected" ? (
                              <span style={{ color: "red", fontWeight: "600" }}>
                                {t("Rejected")} {t("by")} {version.approver_name}
                              </span>
                            ) : (
                              <span>{version.approval_status || "-"}</span>
                            )}
                          </td>


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
                              <>
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

                                {version.status !== "Published" &&
                                  version.approval_status !== "Rejected" && (
                                    <button
                                      onClick={() =>
                                        handleReplaceClick(
                                          version.level,
                                          version.process_id,
                                          version.version
                                        )
                                      }
                                    >
                                      {t("restore")}
                                    </button>
                                  )
                                }

                              </>
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

          {/* EMAIL SEARCH POPUP */}
          {showEmailPopup && (
            <div className="email-popup-overlay">
              <div className="email-popup">
                <div className="email-popup-header">
                  <h4>
                    {t("select_users_for")}{" "}
                    <span className="popup-role">{t(`${currentRole}`)}</span>
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
                        checked={(selectedUsers[currentRole] || []).includes(
                          u.user.id
                        )}
                        onChange={() => selectUser(u.user.id)}
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

      {
        showTranslationPopup && (
          <TranslationTextAreaPopup
            isOpen={showTranslationPopup}
            onClose={() => setShowTranslationPopup(false)}
            defaultValues={translations}
            onSubmit={(values) => {
              setTranslations(values);
              const langKey = langMap[selectedLanguage] || "en";
              setRevisionText(values[langKey]?.content || "");
              setShowTranslationPopup(false);
            }}
            supportedLanguages={supportedLanguages}
          />
        )
      }
    </>
  );

};

export default VersionPopup;

import React, { useState } from "react";
import AssignRoleOwnerModal from "./AssignRoleOwnerModal";
import TranslationPopup from "../../../hooks/TranslationPopup";
import { useTranslation } from "../../../hooks/useTranslation";
import { FaPlus, FaMinus, FaUser, FaGlobe } from "react-icons/fa";

const ManageRoleGroupModal = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    supportedLanguages,
    langMap,
    existingRoles = [],
    allUsers = [],
    selectedLanguage,
    onUpdateRoleTranslations,
    onUpdateRoleOwner,
    onCreateRole // 🔥 Prop to call API from parent
}) => {
    const [groupName, setGroupName] = useState(initialData?.groupName || initialData?.label || initialData?.details?.title || "");
    const [translations, setTranslations] = useState(initialData?.translations || {});
    const [selectedRoles, setSelectedRoles] = useState(initialData?.roles || []);
    const [showOwnerModal, setShowOwnerModal] = useState(false);
    const [activeRoleForOwner, setActiveRoleForOwner] = useState(null);
    const [showTranslationPopup, setShowTranslationPopup] = useState(false);
    const [translationDefaults, setTranslationDefaults] = useState({});
    const [translationTarget, setTranslationTarget] = useState(null); // 'group' or { roleId: ... }

    // State for creating a new role
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleTranslations, setNewRoleTranslations] = useState({});
    const [isCreatingRole, setIsCreatingRole] = useState(false);
    const [searchTermAvailable, setSearchTermAvailable] = useState("");
    const [searchTermSelected, setSearchTermSelected] = useState("");

    const langKey = langMap[selectedLanguage] || "EN";
    // console.log("node initialData 123", initialData);
    const isRoleSelected = (role) => {
        const roleId = role.node_id || role.id;
        return selectedRoles.some(r => r.id === roleId);
    };

    React.useEffect(() => {
        if (isOpen) {
            // console.log("Modal opened, resetting state from initialData");
            // Handle both new data (groupName) and saved data (label or details.title)
            const name = initialData?.groupName || initialData?.label || initialData?.details?.title || "";
            setGroupName(name);
            setTranslations(initialData?.translations || {});
            setSelectedRoles(initialData?.roles || []);
        }
    }, [isOpen]); // 🔥 Removed initialData from dependencies to prevent reset during updates

    const addRoleToGroup = (role) => {
        // Handle data structure from parsedDataExistingrole
        const roleId = role.node_id || role.id;
        const roleName = role.data?.details?.title || role.name || "Unnamed Role";

        if (!selectedRoles.find(r => (r.id === roleId))) {
            setSelectedRoles([...selectedRoles, {
                id: roleId,
                name: roleName,
                owner: role.data?.owner || null,
                data: role.data,
                translations: role.data?.translations || {}
            }]);
        }
    };

    const removeRoleFromGroup = (roleId) => {
        setSelectedRoles(selectedRoles.filter(r => r.id !== roleId));
    };

    const handleAssignOwner = (user) => {
        const roleId = activeRoleForOwner.id;
        // Update local state
        setSelectedRoles(prev => prev.map(r =>
            r.id === roleId ? { ...r, owner: user } : r
        ));

        // 🔥 Push update to Parent/Global state immediately
        if (onUpdateRoleOwner) {
            onUpdateRoleOwner(roleId, user);
        }
    };

    const openTranslation = (target, existingTranslations) => {
        // For roles, always prefer translations from existingRoles (One Source of Truth)
        let translationsToUse = existingTranslations;
        if (target?.roleId) {
            const masterRole = existingRoles.find(er => (er.node_id || er.id) === target.roleId);
            if (masterRole?.data?.translations) {
                translationsToUse = masterRole.data.translations;
            }
        }

        const defaults = supportedLanguages.reduce((acc, langId) => {
            const langKey = langMap[langId] || `lang_${langId}`;
            acc[langKey] = translationsToUse?.[langKey] || "";
            return acc;
        }, {});
        setTranslationDefaults(defaults);
        setTranslationTarget(target);
        setShowTranslationPopup(true);
    };

    const handleTranslationSubmit = (values) => {
        console.log("translate value", values);

        if (translationTarget === "group") {
            setTranslations(values);

            // 🔥 current language ka value input me dikhao
            if (values[langKey]) {
                setGroupName(values[langKey]);
            }
        }
        else if (translationTarget === "new_role") {
            setNewRoleTranslations(values);
            if (values[langKey]) {
                setNewRoleName(values[langKey]);
            }
        }
        else if (translationTarget?.roleId) {
            const roleId = translationTarget.roleId;

            // Update local state
            setSelectedRoles(prev =>
                prev.map(r =>
                    r.id === roleId
                        ? { ...r, translations: values, name: values[langKey] || r.name } // 🔥 Update name locally for immediate feedback
                        : r
                )
            );

            // 🔥 Push update to Parent/Global state immediately
            if (onUpdateRoleTranslations) {
                onUpdateRoleTranslations(roleId, values);
            }
        }

        setShowTranslationPopup(false);
    };

    const handleInternalRoleCreate = async () => {
        if (!newRoleName.trim()) return;
        setIsCreatingRole(true);
        try {
            await onCreateRole(newRoleName, newRoleTranslations);
            setNewRoleName("");
            setNewRoleTranslations({});
        } finally {
            setIsCreatingRole(false);
        }
    };

    const t = useTranslation();
    const stripHtml = (html) => {
        if (!html) return "";
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const availableRoles = existingRoles.filter(role => {
        const roleId = role.node_id || role.id;
        return !selectedRoles.some(r => r.id === roleId) && !role.data?.isRoleGroup;
    });

    const filteredAvailableRoles = availableRoles.filter(role => {
        const name = role.data?.translations?.[langKey] || role.data?.details?.title || role.name || "";
        return name.toLowerCase().includes(searchTermAvailable.toLowerCase());
    });
    console.log("filteredAvailableRoles", existingRoles)
    const filteredSelectedRoles = selectedRoles.filter(role => {
        const masterRole = existingRoles.find(er => (er.node_id || er.id) === role.id);
        const name = role.translations?.[langKey] || masterRole?.data?.translations?.[langKey] || masterRole?.data?.details?.title || masterRole?.name || role.name || "";
        return name.toLowerCase().includes(searchTermSelected.toLowerCase());
    });

    if (!isOpen) return null;
    return (
        <div className="role-modal-overlay">
            <div className="role-modal-content wide">
                <h3>{t("manage_role_group")}</h3>

                <div className="section-block">
                    <h4 className="section-title">{t("Define Role Group Name")}</h4>
                    <div className="bordered-input-card">
                        <label className="card-inner-label">{t("Role Group Name")}</label>
                        <div className="card-input-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={groupName}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setGroupName(value);
                                    setTranslations(prev => ({ ...prev, [langKey]: value }));
                                }}
                                placeholder={t("enter_group_name")}
                                className="blue-input"
                            />
                            <button className="icon-btn-filled" onClick={() => openTranslation("group", translations)} title={t("translate")}><FaGlobe /></button>
                        </div>
                    </div>
                </div>

                <div className="role-selection-area">
                    <div className="existing-roles">
                        <h4>{t("add_roles_to_role_group")}</h4>
                        <input
                            type="text"
                            placeholder="Search.."
                            value={searchTermAvailable}
                            onChange={(e) => setSearchTermAvailable(e.target.value)}
                            className="search-input"
                        />
                        <div className="table-scroll-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t("role_name")}</th>
                                        <th>{t("owner")}</th>
                                        <th>{t("Action")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAvailableRoles.map(role => {
                                        const roleId = role.node_id || role.id;
                                        const rawName = role.data?.translations?.[langKey] || role.data?.details?.title || role.name || "";
                                        const displayName = stripHtml(rawName);
                                        const displayOwner = role.data?.owner;

                                        return (
                                            <tr key={roleId}>
                                                <td>{displayName}</td>
                                                <td>{displayOwner ? `${displayOwner.first_name} ${displayOwner.last_name}` : "Unassigned"}</td>
                                                <td className="actions">
                                                    <button onClick={() => addRoleToGroup(role)} title={t("add_role_to_role_group")} className="action-btn"><FaPlus /></button>
                                                    <button onClick={() => { setActiveRoleForOwner({ ...role, owner: displayOwner }); setShowOwnerModal(true); }} title={t("assign_owner")} className="action-btn"><FaUser /></button>
                                                    <button onClick={() => openTranslation({ roleId: roleId }, role.data?.translations || {})} title={t("translate")} className="action-btn"><FaGlobe /></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredAvailableRoles.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#666' }}> {t("no_roles_found")}</div>}
                        </div>
                    </div>

                    <div className="selected-roles">
                        <h4>{t("selected_roles_in_group")}</h4>
                        <input
                            type="text"
                            placeholder="Search.."
                            value={searchTermSelected}
                            onChange={(e) => setSearchTermSelected(e.target.value)}
                            className="search-input"
                        />
                        <div className="table-scroll-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{t("role_name")}</th>
                                        <th>{t("owner")}</th>
                                        <th>{t("Action")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSelectedRoles.map(role => {
                                        const masterRole = existingRoles.find(er => (er.node_id || er.id) === role.id);
                                        const rawName = role.translations?.[langKey] || masterRole?.data?.translations?.[langKey] || masterRole?.data?.details?.title || masterRole?.name || role.name || "";
                                        const displayName = stripHtml(rawName);
                                        const displayOwner = masterRole?.data?.owner || role.owner;

                                        return (
                                            <tr key={role.id}>
                                                <td>{displayName}</td>
                                                <td>{displayOwner ? `${displayOwner.first_name} ${displayOwner.last_name}` : "Unassigned"}</td>
                                                <td className="actions">
                                                    <button onClick={() => removeRoleFromGroup(role.id)} className="action-btn remove-btn" title={t("remove_role_from_role_group")}><FaMinus /></button>
                                                    <button onClick={() => { setActiveRoleForOwner({ ...role, owner: displayOwner }); setShowOwnerModal(true); }} title={t("assign_owner")} className="action-btn"><FaUser /></button>
                                                    <button onClick={() => openTranslation({ roleId: role.id }, masterRole?.data?.translations || role.translations)} title={t("translate")} className="action-btn"><FaGlobe /></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredSelectedRoles.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>{t("no_roles_selected")}</div>}
                        </div>
                    </div>
                </div>

                <div className="section-block" style={{ marginTop: '15px' }}>
                    <h4 className="section-title">{t("create_new_role")}</h4>
                    <div className="bordered-input-card">
                        <label className="card-inner-label">{t("role_name")}</label>
                        <div className="card-input-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={newRoleName}
                                placeholder={t("enter_role_name")}
                                className="blue-input"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setNewRoleName(val);
                                    setNewRoleTranslations(prev => ({ ...prev, [langKey]: val }));
                                }}
                            />
                            <button className="icon-btn-filled" onClick={() => openTranslation("new_role", newRoleTranslations)} title={t("translate")}><FaGlobe /></button>
                            <button
                                onClick={handleInternalRoleCreate}
                                disabled={!newRoleName.trim() || isCreatingRole}
                                className="create-btn"
                            >
                                {isCreatingRole ? "..." : t("create")}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-btn">{t("Cancel")}</button>
                    <button
                        onClick={() => onSave({ groupName, translations, roles: selectedRoles })}
                        className="save-btn"
                    >
                        {t("Save")}
                    </button>
                </div>

                <AssignRoleOwnerModal
                    isOpen={showOwnerModal}
                    onClose={() => setShowOwnerModal(false)}
                    onAssign={handleAssignOwner}
                    initialOwner={activeRoleForOwner?.owner}
                    users={allUsers}
                />

                <TranslationPopup
                    isOpen={showTranslationPopup}
                    onClose={() => setShowTranslationPopup(false)}
                    onSubmit={handleTranslationSubmit}
                    defaultValues={translationDefaults}
                    supportedLanguages={supportedLanguages}
                    title={translationTarget === "group" ? t("translate_group_name") : t("translate_role_name")}
                />
            </div>
            <style>{`

            .role-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          color: #002060;
        }
        .role-modal-content.wide { 
          width: 1000px; max-width: 95%; background: white; padding: 25px; border-radius: 8px;   max-height: 90vh;  overflow-y: hidden; display: flex; flex-direction: column; 
          box-shadow: 0 4px 15px rgba(0,32,96,0.15);
        }
        .role-modal-content.wide h3 {
          font-weight: bold; font-size: 14px; margin-top: 0; margin-bottom: 15px; color: #002060;
        }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 12px; }
        
        .section-block { margin-bottom: 15px; }
        .section-title { font-weight: bold; font-size: 11px; margin-top: 0; margin-bottom: 6px; color: #002060; }
        
        .bordered-input-card {
          border: 1px solid #002060; padding: 6px 10px; border-radius: 4px; background: #fff;
        }
        .card-inner-label {
          font-size: 9px; font-weight: bold; color: #002060; margin-bottom: 5px; display: block; text-transform: none;
        }
        .card-input-row { display: flex; gap: 8px; align-items: center; }
        
        .icon-btn-filled {
          cursor: pointer; background: #002060; border: none; border-radius: 4px; padding: 8px 12px; 
          font-size: 13px; color: white; display: flex; align-items: center; justify-content: center;
        }

        .blue-input { 
          width: 100%; padding: 8px 12px; border: 1px solid #002060 !important;
          font-size: 12px; color: #002060; font-family: 'Poppins', sans-serif; font-weight: 300; background: #fff;
        }
        .blue-input::placeholder { color: #7A8699; }

        .search-input {
          width: 100%; padding: 8px 12px; border: none !important; border-bottom: 1px solid #002060 !important; border-radius: 0;
          font-size: 12px; color: #7A8699; font-family: 'Poppins', sans-serif; font-weight: 300; display: block; outline: none; box-sizing: border-box;
        }

        .role-selection-area { display: flex; gap: 20px; flex: 1; min-height: 0; margin-bottom: 15px; }
        .existing-roles, .selected-roles { flex: 1; border: 1px solid #002060; border-radius: 4px; display: flex; flex-direction: column; min-height: 250px; }
        .existing-roles h4, .selected-roles h4 {
          margin: 0; padding: 10px; border-bottom: 1px solid #002060; font-size: 12px; font-weight: bold; background: #fff;
        }

        .table-scroll-container { flex: 1; overflow-y: auto; }
        
        /* Thin Scrollbar style */
        .table-scroll-container::-webkit-scrollbar { width: 4px; }
        .table-scroll-container::-webkit-scrollbar-track { background: #f1f1f1; }
        .table-scroll-container::-webkit-scrollbar-thumb { background: #002060; border-radius: 2px; }

        table { width: 100%; border-collapse: collapse; }
        th { 
          padding: 6px 10px; text-align: left; border-bottom: 1px solid #002060; 
          font-size: 9px; font-weight: 300; color: #002060; text-transform: uppercase; 
        }
        td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #e1e8f5; font-size: 12px; font-weight: 300; }
        
        .actions { display: flex; gap: 4px; }
        .action-btn { 
          padding: 4px 6px; font-size: 11px; cursor: pointer; background: #002060; border: none; border-radius: 4px; color: white; 
          display: flex; align-items: center; justify-content: center; min-width: 24px; height: 24px;
        }
        .action-btn:hover { opacity: 0.9; }
        .action-btn i, .action-btn svg { font-size: 10px; }

        .icon-btn-bordered { 
          cursor: pointer; background: white; border: 1px solid #002060; border-radius: 4px; padding: 6px 10px; 
          font-size: 12px; color: #002060; display: flex; align-items: center; justify-content: center;
        }

        .create-btn { 
          padding: 6px 12px; background-color: #002060; color: white; border: none; border-radius: 4px; 
          cursor: pointer; font-size: 11px; font-weight: bold; 
        }

        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 15px; border-top: 1px solid #e1e8f5; }
        .cancel-btn { padding: 8px 20px; border: none; background: #E9EEF5; color: #002060; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; }
        .save-btn { padding: 8px 20px; border: none; background: #002060; color: white; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; }
      `}</style>
        </div>
    );
};

export default ManageRoleGroupModal;

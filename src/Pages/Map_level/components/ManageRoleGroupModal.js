import React, { useState } from "react";
import AssignRoleOwnerModal from "./AssignRoleOwnerModal";
import TranslationPopup from "../../../hooks/TranslationPopup";

const ManageRoleGroupModal = ({ isOpen, onClose, onSave, initialData, supportedLanguages, langMap, existingRoles = [], allUsers = [], selectedLanguage }) => {
    const [groupName, setGroupName] = useState(initialData?.groupName || initialData?.label || initialData?.details?.title || "");
    const [translations, setTranslations] = useState(initialData?.translations || {});
    const [selectedRoles, setSelectedRoles] = useState(initialData?.roles || []);
    const [showOwnerModal, setShowOwnerModal] = useState(false);
    const [activeRoleForOwner, setActiveRoleForOwner] = useState(null);
    const [showTranslationPopup, setShowTranslationPopup] = useState(false);
    const [translationDefaults, setTranslationDefaults] = useState({});
    const [translationTarget, setTranslationTarget] = useState(null); // 'group' or { roleId: ... }

    const langKey = langMap[selectedLanguage] || "en";
  console.log("node initialData 123", initialData);
    const isRoleSelected = (role) => {
        const roleId = role.node_id || role.id;
        return selectedRoles.some(r => r.id === roleId);
    };

    React.useEffect(() => {
        if (isOpen) {
            // Handle both new data (groupName) and saved data (label or details.title)
            const name = initialData?.groupName || initialData?.label || initialData?.details?.title || "";
            setGroupName(name);
            setTranslations(initialData?.translations || {});
            setSelectedRoles(initialData?.roles || []);
        }
    }, [isOpen, initialData]);

    const addRoleToGroup = (role) => {
        // Handle data structure from parsedDataExistingrole
        const roleId = role.node_id || role.id;
        const roleName = role.data?.details?.title || role.name || "Unnamed Role";

        if (!selectedRoles.find(r => (r.id === roleId))) {
            setSelectedRoles([...selectedRoles, {
                id: roleId,
                name: roleName,
                owner: null,
                data: role.data,
                translations: role.data?.translations || {}
            }]);
        }
    };

    const removeRoleFromGroup = (roleId) => {
        setSelectedRoles(selectedRoles.filter(r => r.id !== roleId));
    };

    const handleAssignOwner = (user) => {
        setSelectedRoles(prev => prev.map(r =>
            r.id === activeRoleForOwner.id ? { ...r, owner: user } : r
        ));
    };

    const openTranslation = (target, existingTranslations) => {
        const defaults = supportedLanguages.reduce((acc, langId) => {
            const langKey = langMap[langId] || `lang_${langId}`;
            acc[langKey] = existingTranslations?.[langKey] || "";
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
        else if (translationTarget?.roleId) {
            setSelectedRoles(prev =>
                prev.map(r =>
                    r.id === translationTarget.roleId
                        ? { ...r, translations: values }
                        : r
                )
            );
        }

        setShowTranslationPopup(false);
    };

    if (!isOpen) return null;

    return (
        <div className="role-modal-overlay">
            <div className="role-modal-content wide">
                <h3>Manage Role Group</h3>

                <div className="form-group">
                    <label>Role Group Name</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => {
                                const value = e.target.value;
                                setGroupName(value);

                                setTranslations(prev => ({
                                    ...prev,
                                    [langKey]: value   // 🔥 sync with current language
                                }));
                            }}
                            placeholder="Enter group name"
                            style={{ flex: 1 }}
                        />
                        <button className="icon-btn" onClick={() => openTranslation("group", translations)}>🌐 Translate</button>
                    </div>
                </div>

                <div className="role-selection-area">
                    <div className="existing-roles">
                        <h4>Available Roles</h4>
                        <div className="list">
                            {existingRoles.map(role => {
                                const roleId = role.node_id || role.id;
                                const selected = isRoleSelected(role);

                                return (
                                    <div
                                        key={roleId}
                                        className={`item ${selected ? "selected" : ""}`}
                                        onClick={() => !selected && addRoleToGroup(role)}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <input
                                                type="checkbox"
                                                checked={selected}
                                                readOnly
                                            />
                                            <span>{role.data?.details?.title || role.name}</span>
                                        </div>
                                        {selected ? <span>✓</span> : <span>+</span>}
                                    </div>
                                );
                            })}

                            {existingRoles.length === 0 && <div style={{ padding: 10 }}>No roles found</div>}
                            <button className="add-new-role-btn" onClick={() => alert("Create new role feature coming soon")}>+ Create New Role</button>
                        </div>
                    </div>

                    <div className="selected-roles">
                        <h4>Selected Roles in Group</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Role Name</th>
                                    <th>Owner</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedRoles.map(role => (
                                    <tr key={role.id}>
                                        <td>{role.name}</td>
                                        <td>{role.owner ? `${role.owner.first_name} ${role.owner.last_name}` : "Unassigned"}</td>
                                        <td className="actions">
                                            <button onClick={() => { setActiveRoleForOwner(role); setShowOwnerModal(true); }}>Assign Owner</button>
                                            <button onClick={() => openTranslation({ roleId: role.id }, role.translations)}>Translate</button>
                                            <button onClick={() => removeRoleFromGroup(role.id)} className="remove-btn">Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {selectedRoles.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>No roles selected</div>}
                    </div>
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                    <button
                        onClick={() => onSave({ groupName, translations, roles: selectedRoles })}
                        className="save-btn"
                    >
                        Save Role Group
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
                    title={translationTarget === "group" ? "Translate Group Name" : "Translate Role Name"}
                />
            </div>
            <style>{`

            .existing-roles .item.selected {
  background: #e6f0ff;
  border-left: 3px solid #002060;
  font-weight: 500;
}

.existing-roles .item.selected:hover {
  background: #e6f0ff;
}

.existing-roles .item input[type="checkbox"] {
  pointer-events: none;
}



        .role-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;
          font-family: 'Poppins', sans-serif;
        }
        .role-modal-content.wide { width: 800px; max-width: 95%; background: white; padding: 25px; border-radius: 8px;   max-height: 90vh;  overflow-y: auto;  }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
        .form-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        
        .role-selection-area { display: flex; gap: 20px; margin-bottom: 20px; }
        .existing-roles, .selected-roles { flex: 1; border: 1px solid #eee; padding: 10px; border-radius: 4px; display: flex; flex-direction: column; }
        .existing-roles .list { max-height: 400px; overflow-y: auto; }
        .existing-roles .item { 
          padding: 8px; border-bottom: 1px solid #f0f0f0; cursor: pointer; display: flex; justify-content: space-between;
          font-size: 13px;
        }
        .existing-roles .item:hover { background: #f0f4ff; }
        .add-new-role-btn { width: 100%; padding: 10px; margin-top: 10px; border: 1px dashed #002060; color: #002060; background: none; cursor: pointer; }
        
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; font-size: 13px; }
        .actions { display: flex; gap: 5px; flex-wrap: wrap; }
        .actions button { padding: 4px 8px; font-size: 11px; cursor: pointer; background: #002060; border: 1px solid #ccc; border-radius: 2px; color: white; }
        .remove-btn { color: white !important; background: #ff4d4f !important; border: none !important; }
        .icon-btn { cursor: pointer; background: #eee; border: 1px solid #ccc; border-radius: 4px; padding: 0 10px; font-size: 12px; }
        
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 20px; border-top: 1px solid #eee; }
        .cancel-btn { padding: 10px 20px; border: none; background: #eee; cursor: pointer; }
        .save-btn { padding: 10px 20px; border: none; background: #002060; color: white; cursor: pointer; }
      `}</style>
        </div>
    );
};

export default ManageRoleGroupModal;

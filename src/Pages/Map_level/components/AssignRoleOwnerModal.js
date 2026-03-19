import React, { useState } from "react";
import CustomAlert from "../../../components/CustomAlert";
import { useTranslation } from "../../../hooks/useTranslation";

const AssignRoleOwnerModal = ({ isOpen, onClose, onAssign, initialOwner, users = [] }) => {
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(initialOwner || null);
    const t = useTranslation();

    React.useEffect(() => {
        if (isOpen) {
            setSelectedUser(initialOwner || null);
        }
    }, [isOpen, initialOwner]);

    const filteredUsers = users.filter((u) => {
        const fullName = `${u.user?.first_name || ""} ${u.user?.last_name || ""}`.toLowerCase();
        const email = (u.user?.email || "").toLowerCase();
        const term = search.toLowerCase();
        return fullName.includes(term) || email.includes(term);
    });

    if (!isOpen) return null;

    return (
        <div className="role-modal-overlay">
            <div className="role-modal-content">
                <h3>{t("assign_role_owner")}</h3>
                <input
                    type="text"
                    placeholder={t("search")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="blue-input"
                />
                <div className="table-scroll-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{t("Name")}</th>
                                <th>{t("E-Mail")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => {
                                const isSelected = selectedUser?.id === u.user.id;
                                return (
                                    <tr
                                        key={u.user.id}
                                        className={`user-item ${isSelected ? "selected" : ""}`}
                                        onClick={() => setSelectedUser(u.user)}
                                    >
                                        <td style={{ fontWeight: isSelected ? 'bold' : '300' }}>{u.user.first_name} {u.user.last_name}</td>
                                        <td>{u.user.email}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && <div style={{ padding: 10, textAlign: 'center', color: '#666' }}> {t("no_users_found")}</div>}
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-btn">{t("Cancel")}</button>
                    <button
                        onClick={() => {
                            if (selectedUser) {
                                onAssign(selectedUser);
                                onClose();
                            } else {
                                CustomAlert.warning(t("no_selection"), t("please_select_a_user"));
                            }
                        }}
                        className="save-btn"
                    >
                        {t("assign")}
                    </button>
                </div>
            </div>
            <style>{`
        .role-modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10000;
          font-family: 'Poppins', sans-serif; font-weight: 300; color: #002060;
        }
        .role-modal-content {
          background: white; padding: 20px; border-radius: 8px; width: 500px;
          max-height: 80vh; overflow-y: hidden; display: flex; flex-direction: column;
          box-shadow: 0 4px 15px rgba(0,32,96,0.15);
        }
        .role-modal-content h3 {
          font-weight: bold; font-size: 14px; margin-top: 0; margin-bottom: 15px; color: #002060; text-transform: uppercase;
        }
        .blue-input { 
          width: 100%; padding: 8px 12px; border: 1px solid #002060 !important; border-radius: 4px; 
          font-size: 12px; color: #002060; font-family: 'Poppins', sans-serif; font-weight: 300; margin-bottom: 10px;
        }
        .table-scroll-container { flex: 1; overflow-y: auto; max-height: 250px; border: 1px solid #002060; border-radius: 4px; margin-bottom: 15px; }
        .table-scroll-container::-webkit-scrollbar { width: 4px; }
        .table-scroll-container::-webkit-scrollbar-thumb { background: #002060; border-radius: 2px; }

        table { width: 100%; border-collapse: collapse; }
        th { 
          padding: 6px 10px; text-align: left; border-bottom: 1px solid #002060; 
          font-size: 9px; font-weight: 300; color: #002060; text-transform: uppercase; background: #f9fbff;
        }
        td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #e1e8f5; font-size: 12px; font-weight: 300; }
        
        .user-item:hover { background: #f4f7fe; }
        .user-item.selected { background: #e6f0ff !important; color: #002060; font-weight: bold; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 15px; border-top: 1px solid #e1e8f5; }
        .cancel-btn { padding: 8px 16px; border: none; background: #E9EEF5; color: #002060; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; }
        .save-btn { padding: 8px 16px; border: none; background: #002060; color: white; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 12px; }
      `}</style>
        </div>
    );
};

export default AssignRoleOwnerModal;

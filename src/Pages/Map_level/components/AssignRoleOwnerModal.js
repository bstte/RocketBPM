import React, { useState } from "react";
import CustomAlert from "../../../components/CustomAlert";

const AssignRoleOwnerModal = ({ isOpen, onClose, onAssign, initialOwner, users = [] }) => {
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(initialOwner || null);

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
                <h3>Assign Role Owner</h3>
                <input
                    type="text"
                    placeholder="Search user..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <div className="user-list">
                    {filteredUsers.map((u) => (
                        <div
                            key={u.user.id}
                            className={`user-item ${selectedUser?.id === u.user.id ? "selected" : ""}`}
                            onClick={() => setSelectedUser(u.user)}
                        >
                            <span>{u.user.first_name} {u.user.last_name} ({u.user.email})</span>
                        </div>
                    ))}
                    {filteredUsers.length === 0 && <div style={{ padding: 10, textAlign: 'center' }}>No users found</div>}
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                    <button
                        onClick={() => {
                            if (selectedUser) {
                                onAssign(selectedUser);
                                onClose();
                            } else {
                                CustomAlert.warning("No selection", "Please select a user.");
                            }
                        }}
                        className="save-btn"
                    >
                        Assign
                    </button>
                </div>
            </div>
            <style>{`
        .role-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex; justify-content: center; align-items: center;
          z-index: 10000;
          font-family: 'Poppins', sans-serif;
        }
        .role-modal-content {
          background: white; padding: 20px; border-radius: 8px; width: 400px;
          max-height: 80vh; overflow-y: auto;
        }
        .search-input {
          width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;
        }
        .user-list { border: 1px solid #eee; max-height: 200px; overflow-y: auto; margin-bottom: 15px; }
        .user-item { padding: 8px; cursor: pointer; border-bottom: 1px solid #f9f9f9; }
        .user-item:hover { background: #f0f4ff; }
        .user-item.selected { background: #002060; color: white; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
        .cancel-btn { padding: 8px 16px; border: none; background: #eee; cursor: pointer; }
        .save-btn { padding: 8px 16px; border: none; background: #002060; color: white; cursor: pointer; }
      `}</style>
        </div>
    );
};

export default AssignRoleOwnerModal;

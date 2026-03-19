import React from "react";
import { useTranslation } from "../../../hooks/useTranslation";

const RoleGroupTooltip = ({
    roles = [],
    groupName,
    langMap,
    processDefaultlanguage_id,
}) => {
    const langKey = langMap?.[processDefaultlanguage_id] || "EN";

    const t = useTranslation();
    return (
        <div style={styles.container}>
            <style>{`
                .tooltip-body::-webkit-scrollbar { width: 4px; }
                .tooltip-body::-webkit-scrollbar-track { background: #f1f1f1; }
                .tooltip-body::-webkit-scrollbar-thumb { background: #002060; border-radius: 2px; }
            `}</style>
            <div style={styles.tooltip}>
                <div style={styles.tooltipHeader}>
                    <span style={{ fontWeight: "bold", fontSize: "12px" }}>{groupName || t("role_group_breakdown")}</span>
                </div>

                <div
                    className="nowheel nopan tooltip-body"
                    style={styles.tooltipBody}
                    onWheel={(e) => e.stopPropagation()}
                >
                    {roles.length > 0 ? (
                        <ul style={styles.roleList}>
                            {roles.map((role, idx) => {
                                const displayName =
                                    role.translations?.[langKey] || role.name;

                                return (
                                    <li key={idx} style={styles.roleItem}>
                                        <span style={styles.roleName}>{displayName}</span>

                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div style={styles.emptyText}>
                            {t("no_roles_assigned_to_this_group")}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ✅ Tooltip-specific styles yahin rahenge */
const styles = {
    container: {
        display: "inline-block",
        pointerEvents: "auto",
        fontFamily: "'Poppins', sans-serif",
    },
    tooltip: {
        backgroundColor: "#ffffff",
        color: "#002060",
        minWidth: "240px",
        maxWidth: "300px",
        borderRadius: "4px",
        zIndex: 2000000,
        boxShadow: "0 4px 15px rgba(0,32,96,0.15)",
        border: "1px solid #002060",
    },
    tooltipHeader: {
        backgroundColor: "#f9fbff",
        padding: "10px 14px",
        borderBottom: "1px solid #e1e8f5",
        fontSize: "12px",
        fontWeight: "bold",
    },
    tooltipBody: {
        padding: 0,
        maxHeight: "280px", // Fits approx 8 roles scrolling
        overflowY: "auto",
    },
    roleList: {
        margin: 0,
        padding: 0,
        listStyle: "none",
    },
    roleItem: {
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        borderBottom: "1px solid #e1e8f5",
    },
    roleName: {
        fontSize: "12px",
        fontWeight: "300",
    },
    roleOwner: {
        fontSize: "11px",
        color: "#7A8699",
        marginTop: "3px",
    },
    emptyText: {
        padding: "5px",
        fontStyle: "italic",
        opacity: 0.7,
        fontSize: "12px",
    },
};

export default RoleGroupTooltip;

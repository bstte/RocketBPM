import React from "react";

const RoleGroupTooltip = ({
    roles = [],
    langMap,
    processDefaultlanguage_id,
}) => {
    const langKey = langMap?.[processDefaultlanguage_id] || "en";

    return (
        <div style={styles.tooltip}>
            <div style={styles.tooltipHeader}>
                <span style={{ fontWeight: "700" }}>Role Group Breakdown</span>
            </div>

            <div style={styles.tooltipBody}>
                {roles.length > 0 ? (
                    <ul style={styles.roleList}>
                        {roles.map((role, idx) => {
                            const displayName =
                                role.translations?.[langKey] || role.name;

                            return (
                                <li key={idx} style={styles.roleItem}>
                                    <span style={styles.roleName}>{displayName}</span>

                                    {role.owner && (
                                        <span style={styles.roleOwner}>
                                            Owner: {role.owner.first_name} {role.owner.last_name}
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div style={styles.emptyText}>
                        No roles assigned to this group
                    </div>
                )}
            </div>
        </div>
    );
};

/* ✅ Tooltip-specific styles yahin rahenge */
const styles = {
    tooltip: {
        position: "absolute",
        top: "50%",
        left: "calc(100% + 15px)",
        transform: "translateY(-50%)",
        backgroundColor: "#ffffff",
        color: "#002060",
        minWidth: "240px",
        maxWidth: "300px",
        borderRadius: "8px",
        zIndex: 1000000,
        boxShadow:
            "0 12px 30px rgba(0,32,96,0.2), 0 0 1px rgba(0,0,0,0.1)",
        border: "1px solid #e1e8f5",
        borderLeft: "4px solid #002060",
    },
    tooltipHeader: {
        backgroundColor: "#f4f7fe",
        padding: "10px 14px",
        borderBottom: "1px solid #e1e8f5",
        fontSize: "13px",
    },
    tooltipBody: {
        padding: "12px 14px",
        maxHeight: "200px",
        overflowY: "auto",
    },
    roleList: {
        margin: 0,
        padding: 0,
        listStyle: "none",
    },
    roleItem: {
        marginBottom: "10px",
        display: "flex",
        flexDirection: "column",
        borderLeft: "2px solid #002060",
        paddingLeft: "10px",
    },
    roleName: {
        fontSize: "12px",
        fontWeight: "600",
    },
    roleOwner: {
        fontSize: "11px",
        color: "#666",
        marginTop: "3px",
    },
    emptyText: {
        padding: "5px",
        fontStyle: "italic",
        opacity: 0.7,
    },
};

export default RoleGroupTooltip;

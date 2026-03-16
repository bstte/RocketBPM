import React, { useState, useEffect, useRef } from 'react';
import api from "../API/api";

const TreeNode = ({ node, level, onToggle, selectedId }) => {
    const isSelected = selectedId === node.node_id;
    const hasChildren = node.children && node.children.length > 0;
    const [expanded, setExpanded] = useState(false);

    const handleToggle = (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    return (
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 0',
                    paddingLeft: `${level * 24}px`,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
                    borderRadius: '6px',
                    marginBottom: '2px',
                    position: 'relative'
                }}
                className="tree-node-row"
                onClick={() => onToggle(node.node_id, node.data.label)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isSelected ? '#e3f2fd' : '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSelected ? '#e3f2fd' : 'transparent'}
            >
                <div
                    onClick={handleToggle}
                    style={{
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '4px',
                        cursor: 'pointer',
                        color: '#555',
                        visibility: hasChildren ? 'visible' : 'hidden'
                    }}
                >
                    {expanded ? (
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    ) : (
                        <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>

                {/* <div style={{ marginRight: '8px', display: 'flex', alignItems: 'center', color: isSelected ? '#2196f3' : '#757575' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div> */}

                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div
                        style={{
                            width: '18px',
                            height: '18px',
                            border: isSelected ? '2px solid #2196f3' : '2px solid #bdbdbd',
                            borderRadius: '4px',
                            marginRight: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isSelected ? '#2196f3' : 'white',
                            transition: 'all 0.2s'
                        }}
                    >
                        {isSelected && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        )}
                    </div>
                    <span style={{
                        fontSize: '14px',
                        color: '#333',
                        fontWeight: isSelected ? '500' : '400',
                        userSelect: 'none'
                    }}>
                        {node.data.label || "Untitled Process"}
                    </span>
                </div>
            </div>

            {hasChildren && expanded && (
                <div style={{ position: 'relative' }}>
                    {node.children.map(child => (
                        <TreeNode
                            key={child.node_id}
                            node={child}
                            level={level + 1}
                            onToggle={onToggle}
                            selectedId={selectedId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const ExistingModelPopup = ({
    isOpen,
    t,
    popupStyle,
    styles,
    searchQuery,
    setSearchQuery,
    filteredData,
    selectedId,
    onCheckboxChange,
    onSave,
}) => {
    const [displayNodes, setDisplayNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchInputRef = useRef(null);

    // Create a stable key from filteredData IDs to avoid unnecessary re-runs
    const dataFingerprint = filteredData ? filteredData.map(n => n.node_id).join(',') : '';

    useEffect(() => {
        if (isOpen && filteredData) {
            filterValidNodes();
        }
    }, [isOpen, dataFingerprint]); // Changed dependency from filteredData to dataFingerprint

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    const filterValidNodes = async () => {
        setLoading(true);
        try {
            const checkPromises = filteredData.map(async (node) => {
                const targetLevelStr = node.level || 'level0';
                const match = targetLevelStr.match(/level(\d+)/);
                const currentDepth = match ? parseInt(match[1], 10) : 0;
                const nextDepth = currentDepth + 1;
                const nextLevelKey = `level${nextDepth}_${node.node_id}`;

                try {
                    const check = await api.checkRecord(nextLevelKey, node.process_id);
                    // Filter: Must exist (ignoring Swimlane check as requested)
                    if (check && check.status === true) {
                        return node;
                    }
                } catch (e) {
                    // Ignore errors
                }
                return null;
            });

            const results = await Promise.all(checkPromises);
            const validNodes = results.filter(n => n !== null);
            setDisplayNodes(validNodes);

        } catch (error) {
            console.error("Error filtering nodes:", error);
            setDisplayNodes([]);
        } finally {
            setLoading(false);
        }
    };

    const buildTree = (nodes) => {
        const nodeMap = {};
        const roots = [];

        // Initialize map
        nodes.forEach(node => {
            // Clone data to avoid mutating props
            const nodeCopy = { ...node, children: [] };
            nodeMap[node.node_id] = nodeCopy;
        });

        // Loop again to link
        nodes.forEach(node => {
            const levelStr = node.level || "";
            const match = levelStr.match(/^level\d+_(.+)$/);

            let parentId = null;
            if (match) {
                parentId = match[1];
            }

            const currentNode = nodeMap[node.node_id];

            if (parentId && nodeMap[parentId]) {
                nodeMap[parentId].children.push(currentNode);
            } else {
                roots.push(currentNode);
            }
        });

        return roots;
    };

    const treeData = buildTree(displayNodes);

    if (!isOpen) return null;

    return (
        <div style={{
            ...popupStyle.container,
            width: '600px', // Increased width
            maxWidth: '50vw',
            height: '50vh', // Increased height

            display: 'flex',
            flexDirection: 'column'
        }} className="swimlanepopup global_popup_modal">
            <div style={popupStyle.header}>
                <span>{t("existing_model")}</span>
            </div>

            <input
                type="text"
                ref={searchInputRef}
                style={{ ...styles.searchInput, marginTop: '10px' }}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div style={{ ...popupStyle.body, padding: '15px', flex: 1, overflowY: 'auto' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                        <div className="spinner" style={{
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #3498db',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            animation: 'spin 2s linear infinite',
                            marginRight: '10px'
                        }}></div>
                        {/* Adding keyframes for spinner if not present globally, though simple text works too */}
                        <style>{`
                            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                         `}</style>
                        <span>{t("loading")}</span>
                    </div>
                ) : (
                    treeData.length > 0 ? (
                        treeData.map((node) => (
                            <TreeNode
                                key={node.node_id}
                                node={node}
                                level={0}
                                onToggle={onCheckboxChange}
                                selectedId={selectedId}
                            />
                        ))
                    ) : (
                        <div style={{ padding: '10px', color: '#666', textAlign: 'center' }}>No matching models found.</div>
                    )
                )}
            </div>

            <div style={{
                ...popupStyle.footer,
                marginTop: 'auto',
                paddingTop: '15px',
                borderTop: '1px solid #eee'
            }}>
                <button onClick={onSave} className="global-btn" style={{ width: '100px' }}>
                    {t("Save")}
                </button>
            </div>
        </div>
    );
};

export default ExistingModelPopup;

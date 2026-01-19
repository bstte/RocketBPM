import React, { useState, useEffect } from 'react';
import api from "../API/api";
import { useLangMap } from '../hooks/useLangMap';

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
                onClick={() => onToggle(node)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isSelected ? '#e3f2fd' : '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSelected ? '#e3f2fd' : 'transparent'}
            >
                {/* Indentation lines would go here if we had absolute positioning context, simplified for now */}

                {/* Toggle Icon */}
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

                {/* Node Icon */}
                {/* <div style={{ marginRight: '8px', display: 'flex', alignItems: 'center', color: isSelected ? '#2196f3' : '#757575' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div> */}

                {/* Checkbox & Label */}
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
                    {/* Vertical guideline can be added here if needed, but indentation is usually enough */}
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

const MoveNodePopup = ({ isOpen, onClose, onMove, ProcessId, userId, currentParentId, processDefaultlanguage_id, selectedNodeId }) => {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const langMap = useLangMap();

    // Fetch process maps on open
    useEffect(() => {
        if (isOpen) {
            fetchProcessMaps();
            setSearchQuery("");
            setSelectedTarget(null);
        }
    }, [isOpen]);

    const fetchProcessMaps = async () => {
        setLoading(true);
        try {
            const data = await api.getallpublishObject_Tolinkexistingmodel(
                parseInt(userId),
                ProcessId
            );

            let candidates = data.nodes.filter(
                (node) => node.type !== "StickyNote" && node.node_id !== currentParentId
            );

            if (selectedNodeId) {
                candidates = candidates.filter(node => node.node_id !== selectedNodeId);
            }

            const checkPromises = candidates.map(async (node) => {
                const targetLevelStr = node.level || 'level0';
                const match = targetLevelStr.match(/level(\d+)/);
                const currentDepth = match ? parseInt(match[1], 10) : 0;
                const nextDepth = currentDepth + 1;
                const nextLevelKey = `level${nextDepth}_${node.node_id}`;

                try {
                    const check = await api.checkRecord(nextLevelKey, node.process_id);
                    // Filter: Must exist AND not be Swimlane
                    if (check && check.status === true && check.Page_Title !== "Swimlane") {
                        return node;
                    }
                } catch (e) {
                    // Ignore errors
                }
                return null;
            });

            const results = await Promise.all(checkPromises);
            const filteredNodes = results.filter(n => n !== null);
            setProcesses(filteredNodes);

        } catch (error) {
            console.error("Error fetching process maps:", error);
            setProcesses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = (node) => {
        if (selectedTarget && selectedTarget.node_id === node.node_id) {
            setSelectedTarget(null);
        } else {
            setSelectedTarget(node);
        }
    };

    const handleMoveClick = () => {
        if (!selectedTarget) return;

        const targetLevelStr = selectedTarget.level || 'level0';
        const match = targetLevelStr.match(/level(\d+)/);
        const currentDepth = match ? parseInt(match[1], 10) : 0;
        const nextDepth = currentDepth + 1;
        const nextLevelKey = `level${nextDepth}_${selectedTarget.node_id}`;

        const movePayload = {
            processId: selectedTarget.process_id,
            levelKey: nextLevelKey
        };

        onMove(movePayload);
    };

    const parsedData = processes.map((item) => ({
        ...item,
        data: typeof item.data === 'string' ? JSON.parse(item.data) : item.data,
    }));

    const langKey = langMap[processDefaultlanguage_id] || "en";

    const translatedData = parsedData.map((item) => {
        const { translations = {}, label = "" } = item.data || {};
        const newLabel = translations[langKey] || label;

        return {
            ...item,
            data: {
                ...item.data,
                label: newLabel,
            },
        };
    });

    // Filter by search query
    const searchFilteredData = translatedData.filter((item) =>
        item.data.label && item.data.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Build Tree
    const buildTree = (nodes) => {
        const nodeMap = {};
        const roots = [];

        // Initialize map
        nodes.forEach(node => {
            node.children = [];
            nodeMap[node.node_id] = node;
        });

        nodes.forEach(node => {
            const levelStr = node.level || "";
            // Regex to extract everything after the first underscore: level{N}_{ParentID}
            const match = levelStr.match(/^level\d+_(.+)$/);

            let parentId = null;
            if (match) {
                // match[1] contains the Parent ID
                parentId = match[1];
            }

            if (parentId && nodeMap[parentId]) {
                nodeMap[parentId].children.push(node);
            } else {
                roots.push(node);
            }
        });

        return roots;
    };

    const treeData = buildTree(searchFilteredData);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '500px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div className="popup-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <h3 style={{ margin: 0 }}>Move Model to Another Process Map</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                </div>

                <div className="popup-body" style={{ flex: 1, overflowY: 'auto', marginBottom: '15px' }}>
                    {loading ? (
                        <div>Loading processes...</div>
                    ) : (
                        <div className="process-list" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {treeData.length > 0 ? (
                                treeData.map((node) => (
                                    <TreeNode
                                        key={node.node_id}
                                        node={node}
                                        level={0}
                                        onToggle={handleCheckboxChange}
                                        selectedId={selectedTarget?.node_id}
                                    />
                                ))
                            ) : (
                                <div style={{ padding: '10px', color: '#666' }}>No process maps found.</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="popup-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button onClick={onClose} className="global-btn cancel">Cancel</button>
                    <button
                        onClick={handleMoveClick}
                        className="global-btn save"
                        disabled={!selectedTarget}
                    >
                        Move
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoveNodePopup;

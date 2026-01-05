import React, { useState, useEffect } from 'react';
import api from "../API/api";
import { useLangMap } from '../hooks/useLangMap';

const MoveNodePopup = ({ isOpen, onClose, onMove, ProcessId, userId, currentParentId,processDefaultlanguage_id }) => {
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

            const filteredNodes = data.nodes.filter(
                (node) => node.type !== "StickyNote" && node.node_id !== currentParentId
            );
            setProcesses(filteredNodes);
            // if (response && response.nodes) {
            //     const parsedNodes = response.nodes.map(node => ({
            //         ...node,
            //         data: typeof node.data === 'string' ? JSON.parse(node.data) : node.data
            //     }));

            //     // Filter out current process logic if needed. 
            //     // For now, filtering out if process_id matches and it's the root or same context?
            //     // The user said "exclude current".
            //     // We'll filter by process_id just to be safe, if that's the desired behavior.
            //     const filtered = parsedNodes.filter(node => String(node.process_id) !== String(currentProcessId));
            //     setProcesses(filtered);
            // } else {
            //     setProcesses([]);
            // }
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

        // Calculate Target Level
        // Logic: Moving INTO the selected node.
        // New Level = Current Level of Target Node + 1 (and append Target Node ID)

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

    // const filteredData = processes.filter((node) =>
    //     node.data && node.data.label && node.data.label.toLowerCase().includes(searchQuery.toLowerCase())
    // );


    const parsedData = processes.map((item) => ({
        ...item,
        data: JSON.parse(item.data), // Parse the data field
    }));

    const langKey = langMap[processDefaultlanguage_id] || "en";

    const translatedData = parsedData.map((item) => {
        const { translations = {}, label = "" } = item.data || {};
        const newLabel = translations[langKey] || label;

        return {
            ...item,
            data: {
                ...item.data,
                label: newLabel, // ✅ override label with translation
            },
        };
    });
    // console.log("translatedData",translatedData)
    const filteredData = translatedData.filter((item) =>
        item.data.label && item.data.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
                            {filteredData.length > 0 ? (
                                filteredData.map((node) => (
                                    <label
                                        key={node.node_id || node.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '8px',
                                            cursor: 'pointer',
                                            backgroundColor: selectedTarget && selectedTarget.node_id === node.node_id ? '#f0f8ff' : 'transparent',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedTarget && selectedTarget.node_id === node.node_id}
                                            onChange={() => handleCheckboxChange(node)}
                                            style={{ marginRight: '10px' }}
                                        />
                                        {node.data.label || "Untitled Process"}
                                    </label>
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

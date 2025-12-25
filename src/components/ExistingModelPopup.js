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
    if (!isOpen) return null;

    return (
        <div style={popupStyle.container} className="swimlanepopup global_popup_modal">
            <div style={popupStyle.header}>
                <span>{t("existing_model")}</span>
            </div>

            <input
                type="text"
                style={styles.searchInput}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div style={popupStyle.body}>
                {filteredData.map((node) => (
                    <label
                        key={node.node_id}
                        style={{
                            ...popupStyle.label,
                            backgroundColor:
                                selectedId === node.node_id ? "#f0f8ff" : "transparent",
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={selectedId === node.node_id}
                            onChange={() =>
                                onCheckboxChange(node.node_id, node.data.label)
                            }
                            style={popupStyle.checkbox}
                        />
                        {node.data.label}
                    </label>
                ))}
            </div>

            <div style={popupStyle.footer}>
                <button onClick={onSave} className="global-btn">
                    {t("Save")}
                </button>
            </div>
        </div>
    );
};

export default ExistingModelPopup;

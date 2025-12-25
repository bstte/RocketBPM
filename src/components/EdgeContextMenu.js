const EdgeContextMenu = ({
    visible,
    position,
    t,
    onAction,
    onDelete,
}) => {
    if (!visible) return null;

    return (
        <div
            className="dropdown_1"
            style={{
                position: "absolute",
                top: position.y,
                left: position.x,
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                zIndex: 10,
                minWidth: "180px",
            }}
        >
            {[
                { label: t("add_yes_label"), action: "Yes" },
                { label: t("add_no_label"), action: "No" },
                { label: t("add_free_text"), action: "addFreeText" },
            ].map((item, index) => (
                <div
                    key={index}
                    className="menuitems"
                    onClick={() => onAction(item.action)}
                >
                    {item.label}
                </div>
            ))}

            <div
                className="menuitems"
                onClick={() => {
                    if (window.confirm("Are you sure you want to delete this arrow?")) {
                        onDelete();
                    }
                }}
            >
                {t("delete_arrow")}
            </div>
        </div>
    );
};

export default EdgeContextMenu;

import React, { useEffect, useRef } from 'react';

const ExistingRolePopup = ({
  isOpen,
  t,
  popupStyle,
  styles,
  searchQuery,
  setSearchQuery,
  data,
  selectedId,
  onSelect,
  onSave,
}) => {
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={popupStyle.container} className="swimlanepopup global_popup_modal">
      <div style={popupStyle.header}>
        <span>{t("add_existing_role")}</span>
      </div>

      <input
        type="text"
        ref={searchInputRef}
        style={styles.searchInput}
        placeholder={t("search")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div style={popupStyle.body}>
        {data.map((node) => {
          const isSelected = selectedId === node.node_id;
          const title = node?.data?.details?.title || "Untitled";

          return (
            <div
              key={node.node_id}
              onClick={() => onSelect(node.node_id)}
              style={{
                ...popupStyle.label,
                cursor: "pointer",
                backgroundColor: isSelected ? "#f0f8ff" : "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#e6f7ff")
              }
              onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor =
                isSelected ? "#f0f8ff" : "transparent")
              }
            >
              {title}
            </div>
          );
        })}
      </div>

      <div style={popupStyle.footer}>
        <button onClick={onSave} className="global-btn">
          {t("Save")}
        </button>
      </div>
    </div>
  );
};

export default ExistingRolePopup;

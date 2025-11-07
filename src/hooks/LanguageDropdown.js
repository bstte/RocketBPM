import React, { useState, useRef, useEffect } from "react";
import { useLangMap } from "../hooks/useLangMap"; // adjust path
import { getFlagUrl } from "./useFlagMap";

const LanguageDropdown = ({
  supportedLanguages = [],
  selectedLanguage,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langMap = useLangMap();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSelect = (langId) => {
    onSelect?.(langId);
    setIsOpen(false);
  };
  const currentLangName = langMap[selectedLanguage] || "loading...";
  const currentFlag = getFlagUrl(currentLangName);
  return (
    <div
      ref={dropdownRef}
      style={{ position: "relative", cursor: "pointer" }}
      onClick={() => setIsOpen(!isOpen)}
      className="headericons"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 6px",
          borderRadius: 4,
          background: "#fff",
        }}
      >
        <img
          src={currentFlag}
          alt={currentLangName}
          style={{
            width: 20,
            height: 15,
            minHeight: 10,
            borderRadius: 2,
          }}
        />
        <span style={{ fontSize: 14, fontWeight: 500 }}>{currentLangName}</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>▼</span>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 0,
            zIndex: 999,
            minWidth: 120,
          }}
          className="dropdown_menu"
        >
          {supportedLanguages.map((langId) => {
            const langName = langMap[langId] || `Lang ${langId}`;
            const isSelected = Number(selectedLanguage) === Number(langId);

            return (
              <div
                key={langId}
                onClick={() => handleSelect(langId)}
                className="dropdown-item"
                style={{
                  background: isSelected ? "#ff364a" : "",
                  color: isSelected ? "#fff" : "",
                }}
              >
                <img
                  src={getFlagUrl(langName)}
                  alt={langId}
                  style={{
                    width: 20,
                    height: 10,
                    minHeight: 10,
                    borderRadius: 2,
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 500 }}>
                  {langName}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;

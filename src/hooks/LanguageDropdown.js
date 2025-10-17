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

  return (
    <div
      ref={dropdownRef}
      style={{ position: "relative", cursor: "pointer" }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <img
        src={`${process.env.PUBLIC_URL}/img/globe-solid.svg`}
        alt="Select Language"
        style={{ width: 24, height: 24 }}
      />
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 6,
            zIndex: 999,
            minWidth: 120,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {supportedLanguages.map((langId) => {
            const langName = langMap[langId] || `Lang ${langId}`;
            const isSelected = Number(selectedLanguage) === Number(langId);

            return (
              <div
                key={langId}
                onClick={() => handleSelect(langId)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  background: isSelected ? "#f5f5f5" : "#fff",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f9f9f9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = isSelected
                    ? "#f5f5f5"
                    : "#fff")
                }
              >
                <img
                  src={getFlagUrl(langName)}
                  alt={langId}
                  style={{ width: 20, height: 14, borderRadius: 2 }}
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

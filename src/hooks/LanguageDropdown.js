import React, { useState, useRef, useEffect } from "react";
import { useLangMap } from "../hooks/useLangMap"; // adjust path

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
                  padding: "8px 12px",
                  background: isSelected ? "#f0f0f0" : "#fff",
                  cursor: "pointer",
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {langName}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;

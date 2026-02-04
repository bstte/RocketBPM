import React, { useState, useRef, useEffect } from "react";
import { useLangMap } from "../hooks/useLangMap"; // adjust path
import { useLanguages } from "../hooks/useLanguages";

const LanguageDropdown = ({
  supportedLanguages = [],
  selectedLanguage,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const langMap = useLangMap();
  const { languages } = useLanguages();


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
  const currentLangObj = languages.find(l => l.id == selectedLanguage);
  const currentFlag = currentLangObj?.flag || "https://flagcdn.com/w20/un.png";
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

            // Assuming we can access the full language object here. 
            // Since 'supportedLanguages' is an array of IDs, we need to find the language object from 'languages' list if available, 
            // or pass full objects to this component.
            // However, based on 'useLanguages' hook, 'languages' is available globally or passed down?
            // Let's assume 'langMap' only maps ID to Code. 
            // We need the flag URL. 
            // In the current architecture, 'supportedLanguages' seems to be just IDs.
            // I need to fetch the flag URL. 
            // Let's rely on a helper or similar if we don't have the object.
            // BUT, the goal is to use the backend flag.

            // Wait, I need access to the full language list to get the flag.
            // 'useLangMap' gives ID -> Code. 
            // 'LanguageDropdown' receives 'supportedLanguages' (likely IDs).

            // I should use the 'useLanguages' hook here to get the full list and find the flag.

            const currentLangObj = languages.find(l => l.id == langId);
            const flagUrl = currentLangObj?.flag || "https://flagcdn.com/w20/un.png"; // Fallback

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
                  src={flagUrl}
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

import React, { useState, useRef, useEffect } from "react";
import { copyLinkToClipboard, copyNameAndLinkToClipboard } from "../utils/shareHelper";

const ShareDropdown = ({ processId, processName, t, iconClass = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleCopyLink = (e) => {
    e.stopPropagation();
    copyLinkToClipboard(processId);
    setIsOpen(false);
  };

  const handleCopyNameAndLink = (e) => {
    e.stopPropagation();
    copyNameAndLinkToClipboard(processName, processId);
    setIsOpen(false);
  };

  return (
    <div className={`headericons ${iconClass}`} ref={dropdownRef} onClick={() => setIsOpen(!isOpen)}>
      <img src={`${process.env.PUBLIC_URL}/img/share.png`} alt="Share" />
      <div className={`dropdown-content ${isOpen ? "active" : ""}`}>
        <button onClick={handleCopyLink}>{t("copy_link_to_clipboard")}</button>
        <button onClick={handleCopyNameAndLink}>{t("copy_process_name_and_link")}</button>
      </div>
    </div>
  );
};

export default ShareDropdown;

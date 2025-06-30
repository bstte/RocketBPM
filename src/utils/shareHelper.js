// utils/shareHelper.js

export const copyLinkToClipboard = (processId) => {
    const link = window.location.href; 
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };
  
  export const copyNameAndLinkToClipboard = (processName, processId) => {
    const link = window.location.href;
    const text = `${processName}:\n${link}`;
    navigator.clipboard.writeText(text);
    alert("Name and link copied to clipboard!");
  };
  
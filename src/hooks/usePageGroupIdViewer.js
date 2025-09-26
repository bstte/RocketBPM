import React from "react";

export function usePageGroupIdViewer(array) {
  const nodeWithPageGroupId = array?.find(
    (n) => n.PageGroupId !== undefined && n.PageGroupId !== null
  );
  return (
    <div
    className="am_page-group-id-viewer"
      style={{
        position: "absolute",
        bottom: "0px",
        left: "5px",
        margin: "20px",
        color: "#002060",
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <img
        src={`${process.env.PUBLIC_URL}/img/rocket-solid.svg`}
        alt="Rocket"
       className="am_rocket-icon"

      />

      <span>ID {nodeWithPageGroupId ? nodeWithPageGroupId.PageGroupId : ""}</span>
    </div>
  );
}

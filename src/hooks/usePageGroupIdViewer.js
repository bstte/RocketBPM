import React from "react";

export function usePageGroupIdViewer(array) {
  const nodeWithPageGroupId = array?.find(
    (n) => n.PageGroupId !== undefined && n.PageGroupId !== null
  );
  return (
    <div
      style={{
        position: "absolute",
        bottom: "0px",
        left: "5px",
        margin: "20px",
        fontSize: "18px",
        color: "#002060",
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <img
        src={`${process.env.PUBLIC_URL}/img/rocket-solid.svg`}
        alt="Rocket"
        style={{ width: "25px", height: "25px" }}
      />

      <span>ID {nodeWithPageGroupId ? nodeWithPageGroupId.PageGroupId : ""}</span>
    </div>
  );
}

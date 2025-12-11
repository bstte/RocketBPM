import React from "react";

export function usePageGroupIdViewer(array) {
  const nodeWithPageGroupId = array?.find(
    (n) => n.page_group_id !== undefined && n.page_group_id !== null
  );
  return (
    <div
    className="am_page-group-id-viewer"
   
    >
      <img
        src={`${process.env.PUBLIC_URL}/img/rocket-solid.svg`}
        alt="Rocket"
       className="am_rocket-icon"

      />

      <span>ID {nodeWithPageGroupId ? nodeWithPageGroupId.page_group_id : ""}</span>
    </div>
  );
}

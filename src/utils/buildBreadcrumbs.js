import { buildProcessPath } from "../routes/buildProcessPath";

// utils/buildBreadcrumbs.js
export const buildBreadcrumbs = (allNodes, ids, processId, pathstatus = "draft") => {
  if (!Array.isArray(allNodes) || !Array.isArray(ids)) return [];

  const breadcrumbs = [];
  const orderedIds = [...ids].reverse(); // Level0 → Level1 → Level2 → ...

  orderedIds.forEach((nodeId, index) => {
    // Find matching node in allNodes
    const node = allNodes.find(n => n.node_id === nodeId);
    if (!node) return;

    // Extract label from node.data JSON
    let label = "Untitled";
    let TitleTranslation = "";

    try {
      const parsedData = JSON.parse(node.data || "{}");

      if (parsedData?.label) label = parsedData.label;

      // 👉 ADD YOUR NEW LINE
      TitleTranslation = parsedData?.translations || "";
    } catch {
      console.warn("Invalid JSON in node.data for", nodeId);
    }


    // Extract current level number
    const match = nodeId.match(/^level(\d+)/);
    const currentLevel = match ? parseInt(match[1], 10) : 0;

    // New level = currentLevel + 1
    const nextLevel = currentLevel + 1;

    const mode = pathstatus==="Publish"?"Published":"draft"
    const view = "map"

    const path = buildProcessPath({
      mode,
      view,
      processId: processId,
      level: nextLevel,
      parentId: nextLevel === 0 ? undefined : nodeId,
    });
    // Build path → "/Draft-Process-View/{nextLevel}/{currentNodeId}/{processId}"
    // const path =
    //   pathstatus === "Publish"
    //     ? `/published/map/${processId}/${nextLevel}/${nodeId}`
    //     : `/draft/map/${processId}/${nextLevel}/${nodeId}`;

    const state = { processId, label, path, TitleTranslation };
    breadcrumbs.push({ label, path, state });
  });

  return breadcrumbs;
};

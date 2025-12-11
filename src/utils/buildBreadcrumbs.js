// utils/buildBreadcrumbs.js
export const buildBreadcrumbs = (allNodes, ids, processId,pathstatus = "draft") => {
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
    const match = nodeId.match(/^Level(\d+)/);
    const currentLevel = match ? parseInt(match[1], 10) : 0;

    // New level = currentLevel + 1
    const nextLevel = currentLevel + 1;
    

    // Build path → "/Draft-Process-View/{nextLevel}/{currentNodeId}/{processId}"
  const path =
      pathstatus === "Publish"
        ? `/published-map-level/${nextLevel}/${nodeId}/${processId}`
        : `/draft-process-view/${nextLevel}/${nodeId}/${processId}`;

  const state = { processId, label, path, TitleTranslation };
    breadcrumbs.push({ label, path,state });
  });

  return breadcrumbs;
};

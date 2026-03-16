import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BreadcrumbsContext } from "../context/BreadcrumbsContext";
import { checkRecordWithGetLinkDraftData, checkRecordWithGetLinkPublishData } from "../API/api";
import { buildBreadcrumbs } from "../utils/buildBreadcrumbs";
import { useSelector } from "react-redux";

/**
 * Hook to reconstruct breadcrumbs for direct links (e.g., from email).
 * It ensures Home and parent levels are present in the breadcrumb trail.
 */
export const useReconstructBreadcrumbs = (mode = "draft") => {
    const { processId, level, parentId } = useParams();
    const { breadcrumbs, addBreadcrumb, setBreadcrumbs } = useContext(BreadcrumbsContext);
    const user = useSelector((state) => state.user.user);
    const currentLevel = level ? parseInt(level, 10) : 0;

    useEffect(() => {
        const reconstruct = async () => {
            // Logic: If Home is missing, or if we are at a deep level and intermediate breadcrumbs are missing
            const hasHome = breadcrumbs.some(b => b.path === "/dashboard");

            // Check if the current breadcrumbs belong to the current process
            // Use string comparison to be safe with IDs
            const processBreadcrumb = breadcrumbs.find(b => String(b.state?.Process_id || b.state?.id || b.state?.processId) === String(processId));
            const isWrongProcess = breadcrumbs.length > 1 && !processBreadcrumb;

            // If we only have Home (length 1) and we are at Level 1 or deeper, we definitely need reconstruction
            const needsReconstruction = !hasHome || isWrongProcess || (currentLevel > 0 && breadcrumbs.length <= 2);

            if (needsReconstruction) {
                console.log(`Reconstructing breadcrumbs for process ${processId} at level ${currentLevel}...`);

                try {
                    const apiMode = mode === "publish" ? "Publish" : "draft";
                    const finalLevelParam = parentId ? `level${currentLevel}_${parentId}` : `level${currentLevel}`;

                    console.log(`Calling API with levelParam: ${finalLevelParam}, user_id: ${user?.id}, processId: ${processId}`);

                    const apiCall = mode === "publish" ? checkRecordWithGetLinkPublishData : checkRecordWithGetLinkDraftData;

                    // Note: Using parentId as LinkLevel if it exists, else null (Level 0)
                    const nodeData = await apiCall(finalLevelParam, user?.id, processId, parentId);

                    if (nodeData.status) {
                        const newBreadcrumbs = [];

                        // 1. Add Home
                        newBreadcrumbs.push({ label: "Home", path: "/dashboard", state: {} });

                        // 2. Add Level 0 (Process Title)
                        const processTitle = nodeData.processTitle?.process_title || "Untitled Process";
                        const TitleTranslation = JSON.parse(nodeData.processTitle?.translations || "{}");
                        const basePath = mode === "publish" ? `/published/map/${processId}` : `/draft/map/${processId}`;
                        
                        // Use Process_id and processTitle to match Dashboard state structure
                        newBreadcrumbs.push({
                            label: processTitle,
                            path: basePath,
                            state: { Process_id: processId, processTitle, TitleTranslation }
                        });

                        // 3. Add Intermediate sub-levels if any
                        if (currentLevel > 0) {
                            const intermediary = buildBreadcrumbs(
                                nodeData.allNodes,
                                nodeData.ids,
                                processId,
                                apiMode === "Publish" ? "Publish" : "draft"
                            );

                            intermediary.forEach(b => {
                                if (!newBreadcrumbs.some(nb => nb.path === b.path)) {
                                    newBreadcrumbs.push(b);
                                }
                            });
                        }

                        console.log("New constructed breadcrumbs:", newBreadcrumbs);

                        // Update context if breadcrumbs have actually changed to avoid infinite loops
                        if (JSON.stringify(newBreadcrumbs) !== JSON.stringify(breadcrumbs)) {
                            setBreadcrumbs(newBreadcrumbs);
                        }
                    } else {
                        console.warn("API returned status false for tree reconstruction:", nodeData.message);
                    }
                } catch (error) {
                    console.error("Failed to reconstruct breadcrumbs:", error);
                    // Fallback: at least try to add Home if missing and empty
                    if (breadcrumbs.length === 0) {
                        addBreadcrumb("Home", "/dashboard", {});
                    }
                }
            }
        };

        if (processId && user?.id) {
            reconstruct();
        }
    }, [processId, level, parentId, user?.id, mode, setBreadcrumbs, breadcrumbs]);
};

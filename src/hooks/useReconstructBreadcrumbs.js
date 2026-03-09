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

            // If we only have Home (length 1) and we are at Level 1 or deeper, we definitely need reconstruction.
            // If breadcrumbs are completely empty, we need reconstruction.
            const needsReconstruction = !hasHome || (currentLevel > 0 && breadcrumbs.length <= 2);

            if (needsReconstruction) {
                console.log("Reconstructing breadcrumbs for direct link...");

                try {
                    const apiMode = mode === "publish" ? "Publish" : "draft";
                    const levelParam = parentId || `level${currentLevel}`;
                    const finalLevelParam = parentId ? `level${currentLevel}_${parentId}` : `level${currentLevel}`;

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
                        newBreadcrumbs.push({
                            label: processTitle,
                            path: basePath,
                            state: { id: processId, title: processTitle, TitleTranslation }
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

                        // Update context
                        setBreadcrumbs(newBreadcrumbs);
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
    }, [processId, level, parentId, user?.id, mode, setBreadcrumbs]);
};

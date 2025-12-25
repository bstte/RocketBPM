import { useCallback } from "react";
import api, { addFavProcess, removeFavProcess, checkRecord, checkPublishRecord } from "../../../API/api";
import { buildProcessPath } from "../../../routes/buildProcessPath";

export const useMapLevelViewHandlers = ({
    state,
    nodes,
    currentLevel,
    currentParentId,
    processId,
    LoginUser,
    fetchNodes,
    goToProcess,
    addBreadcrumb,
    setBreadcrumbs,
    breadcrumbs,
    viewMode // "draft" or "publish"
}) => {
    const {
        setIsFavorite,
        setIsNavigating,
        setShowVersionPopup,
    } = state;

    const handleSupportViewlangugeId = useCallback((langId) => {
        localStorage.setItem("selectedLanguageId", langId);
        fetchNodes(langId);
    }, [fetchNodes]);

    const handleFav = useCallback(async () => {
        const user_id = LoginUser ? LoginUser.id : null;
        const type = state.user ? state.user.type : null;

        if (!user_id || !processId || !type) return;

        const PageGroupId = nodes[0]?.page_group_id;

        try {
            if (state.isFavorite) {
                await removeFavProcess(user_id, processId, PageGroupId);
                setIsFavorite(false);
            } else {
                await addFavProcess(user_id, processId, type, PageGroupId, currentParentId);
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Favorite toggle error:", error);
        }
    }, [LoginUser, processId, state.user, nodes, state.isFavorite, setIsFavorite, currentParentId]);

    const handlenodeClick = useCallback(async (event, node) => {
        if (node?.type === "StickyNote") return;
        event.preventDefault();

        const selectedLabel = node.data.label || "";
        const newLevel = currentLevel + 1;
        const levelParam = `level${newLevel}_${node.id}`;

        let data;
        if (viewMode === "draft") {
            data = await checkRecord(levelParam, processId);
        } else {
            data = await checkPublishRecord(levelParam, processId);
        }

        if (data.status === true) {
            const TitleTranslation = node.data.translations || "";
            const stateData = { id: processId, selectedLabel, TitleTranslation };
            const mode = viewMode === "draft" ? "draft" : "published";
            const view = data.Page_Title === "Swimlane" ? "swimlane" : "map";

            const path = buildProcessPath({
                mode,
                view,
                processId,
                level: newLevel,
                parentId: node.id,
            });

            addBreadcrumb(`${selectedLabel}`, path, stateData);
            goToProcess({
                mode,
                view,
                processId,
                level: newLevel,
                parentId: node.id,
            });
        } else {
            alert(`Next level not ${viewMode === "draft" ? "exist" : "Published"}`);
        }
    }, [currentLevel, processId, viewMode, addBreadcrumb, goToProcess]);

    const navigateOnDraft = useCallback((page) => {
        const user_id = LoginUser ? LoginUser.id : null;
        if (!processId || !state.user) {
            alert("Currently not navigate on draft mode");
            return;
        }

        const targetMode = page === "editdraft" ? "edit" : (viewMode === "publish" ? "draft" : "published");

        const updatedBreadcrumbs = breadcrumbs.map((crumb, index) => {
            if (index === 0 || !crumb.path) return crumb;

            let newPath = crumb.path;
            if (viewMode === "publish") {
                newPath = crumb.path.replace("/published/", "/draft/");
            } else if (page === "editdraft") {
                // Custom logic if needed
            } else {
                newPath = crumb.path.replace("/draft/", "/published/");
            }

            return { ...crumb, path: newPath };
        });

        setBreadcrumbs(updatedBreadcrumbs);
        goToProcess({
            mode: targetMode,
            view: "map",
            processId,
            level: currentLevel,
            parentId: currentLevel === 0 ? undefined : currentParentId,
        });
    }, [processId, state.user, viewMode, breadcrumbs, setBreadcrumbs, goToProcess, currentLevel, currentParentId, LoginUser]);

    const navigateToVersion = useCallback((pid, lvl, v) => {
        const user_id = LoginUser ? LoginUser.id : null;
        window.location.href = `/process-version/${pid}/${lvl}/${v}/ProcessMap/${user_id}/${currentParentId}`;
    }, [LoginUser, currentParentId]);

    return {
        handleSupportViewlangugeId,
        handleFav,
        handlenodeClick,
        navigateOnDraft,
        navigateToVersion,
    };
};

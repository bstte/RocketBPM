import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import api, {
    addFavProcess,
    removeFavProcess,
    saveProcessInfo,
    editorialPublishAPI,
    contentChangeRequest,
    filter_draft,
    getNextPageGroupId,
} from "../../../API/api";
import CustomAlert from "../../../components/CustomAlert";
import { buildProcessPath } from "../../../routes/buildProcessPath";

export const useMapLevelHandlers = ({
    state,
    nodes,
    setNodes,
    edges,
    setEdges,
    currentLevel,
    currentParentId,
    processId,
    LoginUser,
    fetchNodes,
    handleLabelChange,
    goToProcess,
    addBreadcrumb,
    langMap,
}) => {
    const {
        setSelectedNodeId,
        setSelectedNode,
        setHasUnsavedChanges,
        setShowPopup,
        setPopupTitle,
        setPopupPosition,
        setIsFavorite,
        setcheckRecord,
        setShowVersionPopup,
        setShowPublishPopup,
        setShowEditorialPopup,
        setShowContentPopup,
        setrevisionData,
        setTranslationDefaults,
        setShowTranslationPopup,
    } = state;

    const addNode = useCallback(async (type, position, label = "") => {
        const flowContainer = document.querySelector(".flow-container");
        const containerRect = flowContainer?.getBoundingClientRect();

        let finalX = position.x;
        let finalY = position.y;

        if (containerRect) {
            finalX = position.x - containerRect.left;
            finalY = position.y - containerRect.top;

            const nodeWidth = type === "StickyNote" ? 240 : 326;
            const nodeHeight = type === "StickyNote" ? 180 : 90;

            if (finalX < 0) finalX = 0;
            if (finalY < 0) finalY = 0;

            if (finalX + nodeWidth > containerRect.width)
                finalX = containerRect.width - nodeWidth - 10;

            if (finalY + nodeHeight > containerRect.height)
                finalY = containerRect.height - nodeHeight - 10;
        }

        const GRID_SIZE = 20;
        const snap = (value) => Math.round(value / GRID_SIZE) * GRID_SIZE;
        finalX = snap(finalX);
        finalY = snap(finalY);

        const newNodeId = uuidv4().replace(/-/g, "").substring(0, 6);
        const Page_Title = "ProcessMap";
        let PageGroupId;

        if (!nodes[0]?.page_group_id) {
            const response = await getNextPageGroupId(Page_Title);
            PageGroupId = response.next_PageGroupId;
        } else {
            PageGroupId = nodes[0]?.page_group_id;
        }

        const newNode = {
            id: currentParentId !== null
                ? `level${currentLevel}_${newNodeId}_${currentParentId}`
                : `level${currentLevel}_${newNodeId}`,
            data: {
                label: type === "StickyNote" ? label : "",
                shape: type,
                onLabelChange: (newLabel) =>
                    handleLabelChange(
                        currentParentId !== null
                            ? `level${currentLevel}_${newNodeId}_${currentParentId}`
                            : `level${currentLevel}_${newNodeId}`,
                        newLabel
                    ),
                defaultwidt: 326,
                defaultheight: 90,
                width_height:
                    type === "StickyNote"
                        ? { width: 240, height: 180 }
                        : { width: 320, height: 98 },
                nodeResize: true,
                autoFocus: true,
                isClickable: true,
                updateWidthHeight: (id, size) => {
                    setNodes((prevNodes) =>
                        prevNodes.map((node) =>
                            node.id === id
                                ? { ...node, data: { ...node.data, width_height: size } }
                                : node
                        )
                    );
                },
            },
            type: type,
            status: "draft",
            position: { x: finalX, y: finalY },
            draggable: true,
            isNew: true,
            animated: true,
            page_title: "ProcessMap",
            page_group_id: PageGroupId,
        };

        setNodes((nds) => nds.concat(newNode));
        setHasUnsavedChanges(true);
        setSelectedNodeId(newNode.id);
        setTimeout(() => {
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === newNode.id ? { ...node, isNew: false } : node
                )
            );
        }, 1000);
    }, [nodes, currentParentId, currentLevel, handleLabelChange, setNodes, setHasUnsavedChanges, setSelectedNodeId]);

    const deleteNode = useCallback(() => {
        if (state.selectedNode) {
            const selectedNodeData = nodes.find((node) => node.id === state.selectedNode);

            if (selectedNodeData?.data?.LinkToStatus === true) {
                CustomAlert.warning(
                    "Cannot Delete",
                    "This node is already linked. You cannot delete a linked node."
                );
                return;
            }
            if (state.checkRecord?.status === true) {
                CustomAlert.warning(
                    "Cannot Delete",
                    "This node has objects inside. Please delete them first."
                );
                return;
            }
            CustomAlert.confirm(
                "Delete Node",
                "Are you sure you want to delete this node?",
                () => {
                    setNodes((nds) => nds.filter((node) => node.id !== state.selectedNode));
                    setEdges((eds) =>
                        eds.filter(
                            (edge) =>
                                edge.source !== state.selectedNode && edge.target !== state.selectedNode
                        )
                    );
                    setSelectedNode(null);
                    setShowPopup(false);
                    setHasUnsavedChanges(true);
                }
            );
        }
    }, [state.selectedNode, state.checkRecord, nodes, setNodes, setEdges, setSelectedNode, setShowPopup, setHasUnsavedChanges]);

    const handleSaveNodes = useCallback(async (savetype) => {
        if (savetype === "Published" && currentLevel !== 0) {
            try {
                const response = await filter_draft(state.ParentPageGroupId);
                if (response.data === true) {
                    alert("Publish all parent models first");
                    return false;
                }
            } catch (error) {
                console.error("filter draft error", error);
            }
        }

        const payload = {
            savetype,
            ...state.versionPopupPayload,
        };

        const Level = `level${currentLevel}${currentParentId ? `_${currentParentId}` : ""}`;
        const user_id = state.user && state.user.id;
        const Process_id = processId;
        const datasavetype = savetype;
        const LoginUserId = LoginUser ? LoginUser.id : null;

        try {
            if (state.versionPopupPayload) {
                await saveProcessInfo(payload);
            }

            await api.saveNodes({
                Level,
                user_id,
                Process_id,
                LoginUserId,
                datasavetype,
                nodes: nodes.map(({ id, data, type, position, draggable, animated, measured, page_title, status, page_group_id }) => ({
                    id, data, type, position, draggable, animated, measured, page_title, status, page_group_id
                })),
                edges: edges.map(({ id, source, target, markerEnd, animated, sourceHandle, targetHandle, page_title }) => ({
                    id, source, sourceHandle, target, targetHandle, markerEnd, animated, page_title
                })),
            });
            CustomAlert.success("Success", "Nodes saved successfully");
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Error saving nodes:", error);
        }
    }, [currentLevel, state.ParentPageGroupId, state.versionPopupPayload, state.user, processId, LoginUser, nodes, edges, setHasUnsavedChanges]);

    const handleBack = useCallback(async () => {
        if (!state.hasUnsavedChanges) return true;

        return new Promise((resolve) => {
            CustomAlert.confirmExit(
                async () => {
                    await handleSaveNodes("draft");
                    resolve(true);
                },
                () => resolve(true),
                () => resolve(false)
            );
        });
    }, [state.hasUnsavedChanges, handleSaveNodes]);

    const handleNodeRightClick = useCallback(async (event, node) => {
        event.preventDefault();
        setShowPopup(false);

        const newLevel = currentLevel + 1;
        const levelParam = `level${newLevel}_${node.id}`;
        const Process_id = processId;

        const data = await api.checkRecord(levelParam, Process_id);
        setcheckRecord(data);
        setSelectedNode(node.id);
        setPopupTitle(node.data.label || "Node Actions");

        const flowContainer = document.querySelector(".flow-container");
        const containerRect = flowContainer.getBoundingClientRect();
        setPopupPosition({
            x: event.clientX - containerRect.left,
            y: event.clientY - containerRect.top,
        });
        setShowPopup(true);
    }, [currentLevel, processId, setcheckRecord, setSelectedNode, setPopupTitle, setPopupPosition, setShowPopup]);

    const handleCreateNewNode = useCallback(async (type) => {
        if (state.selectedNode) {
            const selectedNodeData = nodes.find((node) => node.id === state.selectedNode);
            const selectedLabel = selectedNodeData?.data?.label || "";
            const TitleTranslation = selectedNodeData.data.translations || "";
            const newLevel = currentLevel + 1;

            setShowPopup(false);
            const confirmcondition = await handleBack();

            if (confirmcondition) {
                const stateData = { id: processId, selectedLabel, TitleTranslation };
                const mode = state.checkRecord?.status === true ? "draft" : "edit";
                const view = type === "Swimlane" ? "swimlane" : "map";

                const path = buildProcessPath({
                    mode: "draft",
                    view,
                    processId,
                    level: newLevel,
                    parentId: state.selectedNode,
                });

                addBreadcrumb(`${selectedLabel}`, path, stateData);
                goToProcess({
                    mode,
                    view,
                    processId,
                    level: newLevel,
                    parentId: state.selectedNode,
                });
            }
        }
    }, [state.selectedNode, state.checkRecord, nodes, currentLevel, processId, handleBack, addBreadcrumb, goToProcess, setShowPopup]);

    const handleLanguageSwitch = useCallback(async (langId) => {
        if (!state.hasUnsavedChanges) {
            localStorage.setItem("selectedLanguageId", langId);
            fetchNodes(langId);
            return;
        }

        CustomAlert.confirmLanguageSwitch(
            async () => {
                await handleSaveNodes("draft");
                localStorage.setItem("selectedLanguageId", langId);
                fetchNodes(langId);
            },
            () => {
                localStorage.setItem("selectedLanguageId", langId);
                fetchNodes(langId);
            }
        );
    }, [state.hasUnsavedChanges, fetchNodes, handleSaveNodes]);

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

    const handleNodeDragStop = useCallback((event, node) => {
        setHasUnsavedChanges(true);
        const flowContainer = document.querySelector(".flow-container");
        if (!flowContainer) return;
        const { left, top, right, bottom } = flowContainer.getBoundingClientRect();
        const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
        if (!nodeElement) return;
        const nodeRect = nodeElement.getBoundingClientRect();
        const isOutOfBounds =
            nodeRect.left < left ||
            nodeRect.top < top ||
            nodeRect.right > right ||
            nodeRect.bottom > bottom;
        if (isOutOfBounds) {
            setNodes((nodes) =>
                nodes.map((n) =>
                    n.id === node.id ? { ...n, position: { ...n.originalPosition } } : n
                )
            );
        }
    }, [setHasUnsavedChanges, setNodes]);

    const translation = useCallback(() => {
        const node = nodes.find((n) => n.id === state.selectedNode);
        if (node) {
            const defaults = state.supportedLanguages.reduce((acc, langId) => {
                const langKey = langMap[langId] || `lang_${langId}`;
                acc[langKey] = node.data?.translations?.[langKey] || "";
                return acc;
            }, {});
            setTranslationDefaults(defaults);
            setShowTranslationPopup(true);
        }
    }, [nodes, state.selectedNode, state.supportedLanguages, langMap, setTranslationDefaults, setShowTranslationPopup]);

    const updateNodeTranslations = useCallback((nodeId, translations) => {
        setNodes((nds) =>
            nds.map((n) => {
                if (n.id !== nodeId) return n;
                const langKey = langMap[state.processDefaultlanguage_id] || "en";
                const newLabel = translations[langKey] || n.data.label;
                return {
                    ...n,
                    data: {
                        ...n.data,
                        translations,
                        label: newLabel,
                    },
                };
            })
        );
        setHasUnsavedChanges(true);
    }, [setNodes, langMap, state.processDefaultlanguage_id, setHasUnsavedChanges]);

    const handleNext = useCallback((data) => {
        setrevisionData(data);
        if (data.editorialChange) {
            setShowPublishPopup(false);
            setShowEditorialPopup(true);
        }
        if (data.classificationChange) {
            setShowPublishPopup(false);
            setShowContentPopup(true);
        }
    }, [setrevisionData, setShowPublishPopup, setShowEditorialPopup, setShowContentPopup]);

    const editorialPublish = useCallback(async (data) => {
        setShowEditorialPopup(false);
        const Level = `level${currentLevel}${currentParentId ? `_${currentParentId}` : ""}`;
        const payload = {
            process_id: processId,
            level: Level,
            revision_text: state.revisionData?.revisionText,
            requested_by: LoginUser ? LoginUser.id : null,
            schedule_type: data.scheduleType,
            scheduled_date: data.date
        };
        await editorialPublishAPI(payload);
    }, [currentLevel, currentParentId, processId, state.revisionData, LoginUser, setShowEditorialPopup]);

    const handleContentSubmit = useCallback(async (data) => {
        setShowContentPopup(false);
        const Level = `level${currentLevel}${currentParentId ? `_${currentParentId}` : ""}`;
        const payload = {
            process_id: processId,
            level: Level,
            revision_text: state.revisionData?.revisionText,
            requested_by: LoginUser ? LoginUser.id : null,
            owner_email: data.owner.email,
            cc_architect: data.ccRoles.architect,
            cc_manager: data.ccRoles.manager,
            planned_publish_date: data.date,
            personal_message: data.personalMessage
        };
        await contentChangeRequest(payload);
    }, [currentLevel, currentParentId, processId, state.revisionData, LoginUser, setShowContentPopup]);

    return {
        addNode,
        deleteNode,
        handleSaveNodes,
        handleBack,
        handleNodeRightClick,
        handleCreateNewNode,
        handleLanguageSwitch,
        handleFav,
        handleNodeDragStop,
        translation,
        updateNodeTranslations,
        handleNext,
        editorialPublish,
        handleContentSubmit,
        goToProcess,
    };
};

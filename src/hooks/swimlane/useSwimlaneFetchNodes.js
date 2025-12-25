import { processDraftNodes } from "./processDraftNodes";
import { processEditNodes } from "./processEditNodes";
import { processPublishNodes } from "./processPublishNodes";
import { getSwimlaneApiByMode } from "../../services/swimlaneApiMode";
import { getProcessDates } from "../../utils/getProcessDates";

export const useSwimlaneFetchNodes = ({
    api,
    mode,
    getLevelKey,
    currentLevel,
    currentParentId,
    LoginUser,
    id,
    windowSize,
    setters = {},
    // setters
    handleLabelChange,
}) => {


    const {
        setUser,
        setChiledNodes,
        setEdges,
        setprocess_img,
        Settitle,
        SetParentPageGroupId,
        setprocessDefaultlanguage_id,
        setOriginalDefaultlanguge_id,
        setSupportedLanguages,
        setgetPublishedDate,
        setDraftedDate,
    } = setters;

    const fetchNodes = async (language_id = null) => {
        const levelParam = getLevelKey(currentLevel, currentParentId);
        const user_id = LoginUser?.id ?? null;
        const Process_id = id ?? null;

        // ✅ SINGLE SOURCE OF API
        const apiCaller = getSwimlaneApiByMode(api, mode);

        const data = await apiCaller([
            levelParam,
            parseInt(user_id),
            Process_id,
            currentParentId,
            language_id,
            mode === "edit" ? "Editmode" : undefined,
        ]);
       

        if (Process_id && data?.nodes?.[0]?.page_group_id) {
            const dates = await getProcessDates(Process_id, data?.nodes[0].page_group_id);
            setgetPublishedDate?.(dates.publishedDate);
            setDraftedDate?.(dates.draftDate);

        }
        // ✅ common meta setters
        if (data?.user_id) {
            setUser({
                id: data.actual_user_id,
                role: data.role || "self",
                type: data.type || "self",
                OwnId: data.user_id,
                actual_user_id: data.actual_user_id,
            });
        }

        setprocess_img?.(data.process_img);
        Settitle?.(data.title);
        SetParentPageGroupId?.(data.PageGroupId);
        setprocessDefaultlanguage_id?.(data.processDefaultlanguage_id);
        setOriginalDefaultlanguge_id?.(data.OriginalDefaultlanguge_id);
        setSupportedLanguages?.(data.ProcessSupportLanguage);

        // ✅ mode-based processing ONLY
        let result;

        if (mode === "edit") {
            result = await processEditNodes({
                data,
                api,
                windowSize,
                currentLevel,
                Process_id,
                handleLabelChange,
                getLevelKey
            });
             console.log("edit result", result)
        } else if (mode === "publish") {
            result = await processPublishNodes({
                data,
                api,
                currentLevel,
                Process_id,
                getLevelKey
            });
        } else {
            result = await processDraftNodes({
                data,
                api,
                currentLevel,
                Process_id,
                getLevelKey
            });

             console.log("draft result", result)
        }
        setChiledNodes(result.parsedNodes);
        setEdges(result.parsedEdges);
    };

    return { fetchNodes };
};

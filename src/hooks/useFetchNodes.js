import { MarkerType } from "reactflow";
import api from "../API/api";
import { getSwimlaneApiByMode } from "../services/swimlaneApiMode";
import { getProcessDates } from "../utils/getProcessDates";
export const useFetchNodes = ({
  getLevelKey,
  currentLevel,
  currentParentId,
  LoginUser,
  id,
  setNodes,
  setEdges,
  setUser,
  setters = {},
  mode = "edit", // "edit" | "draft" | "publish"
  handleLabelChange,
}) => {
  const fetchNodes = async (language_id = null) => {
    try {
      const levelParam = getLevelKey(currentLevel, currentParentId);

      const user_id = LoginUser ? LoginUser.id : null;
      const Process_id = id ? id : null;


      const apiCaller = getSwimlaneApiByMode(api, mode);

      const data = await apiCaller([
        levelParam,
        parseInt(user_id),
        Process_id,
        currentParentId,
        language_id,
        mode === "edit" ? "Editmode" : undefined,
      ]);
      // =============================
      // MODE BASED API
      // =============================
      // let data = null;

      // if (mode === "edit") {
      //   data = await api.getNodes(levelParam, parseInt(user_id), Process_id, currentParentId, language_id, "Editmode");
      // }

      // if (mode === "draft") {
      //   data = await api.getNodes(levelParam, parseInt(user_id), Process_id, currentParentId, language_id);
      // }

      // if (mode === "publish") {
      //   data = await api.getPublishedNodes(levelParam, parseInt(user_id), Process_id, currentParentId, language_id);
      // }

      // =============================
      // COMMON SETTER VALUES
      // =============================
      const {
        Settitle,
        SetTitleTranslation,
        setprocess_img,
        setprocessDefaultlanguage_id,
        setOriginalDefaultlanguge_id,
        setSupportedLanguages,

        SetParentPageGroupId,
        setgetPublishedDate,
        setDraftedDate,
      } = setters;

      if (Process_id && data?.nodes?.[0]?.page_group_id) {
        const dates = await getProcessDates(Process_id, data?.nodes[0].page_group_id);
        setgetPublishedDate?.(dates.publishedDate);
        setDraftedDate?.(dates.draftDate);

      }

      if (data?.user_id) {
        setUser({
          id: data.actual_user_id,
          type: data.type || "self",
          role: data.role || "self",
          OwnId: data.user_id,
          actual_user_id: data.actual_user_id,
        });
      }

      // =============================
      // SET BASIC PROCESS DATA
      // =============================
      Settitle?.(data.title);
      SetTitleTranslation?.(data.TitleTranslation);
      setprocess_img?.(data.process_img);
      setprocessDefaultlanguage_id?.(data.processDefaultlanguage_id);
      setOriginalDefaultlanguge_id?.(data.OriginalDefaultlanguge_id);
      setSupportedLanguages?.(data.ProcessSupportLanguage);

      SetParentPageGroupId?.(data.PageGroupId);

      // =============================
      // NODES PROCESS
      // =============================
      const parsedNodes = await Promise.all(
        data.nodes
          .filter((node) => (mode === "publish" ? node.type !== "StickyNote" : true))
          .map(async (node) => {
            const parsedData = JSON.parse(node.data);
            const parsedPosition = JSON.parse(node.position);
            const parsedMeasured = JSON.parse(node.measured);

            // NEXT LEVEL CHECK
            const newLevel = currentLevel + 1;
            const levelParam =
              node.node_id !== null ? `level${newLevel}_${node.node_id}` : `level${currentLevel}`;

            let hasNextLevel = false;
            try {
              const check =
                mode === "publish"
                  ? await api.checkPublishRecord(levelParam, Process_id)
                  : await api.checkRecord(levelParam, Process_id);

              hasNextLevel = check?.status === true;
            } catch (e) {
              console.error("check error", e);
            }

            return {
              ...node,
              data: {
                ...parsedData,
                onLabelChange: (newLabel) => handleLabelChange(node.node_id, newLabel),
                width_height: parsedMeasured,
                node_id: node.node_id,
                LinkToStatus: node.LinkToStatus,
                hasNextLevel,
              },
              type: node.type,
              id: node.node_id,
              measured: parsedMeasured,
              position: parsedPosition,
              draggable: mode === "edit",
            };
          })
      );

      const parsedEdges = data.edges.map((edge) => ({
        ...edge,
        animated: Boolean(edge.animated),
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: "#002060", strokeWidth: 2 },
        type: "step",
      }));

      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } catch (error) {
      console.error("Error fetching nodes:", error);
      alert("Failed to fetch nodes. Please refresh this page.");
    }
  };

  return { fetchNodes };
};

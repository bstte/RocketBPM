import { useCallback } from "react";

export const useSwimlaneLabelChange = ({
  setChiledNodes,
  setHasUnsavedChanges,
  processLangRef,
  langMapRef,
  isInitialLoad,
}) => {
  const handleLabelChange = useCallback(
    (nodeId, newLabel) => {
      setChiledNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            const currentLangId = processLangRef.current;
            const langKey = langMapRef.current[Number(currentLangId)] || "en";

            return {
              ...node,
              data: {
                ...node.data,
                ...(node.type === "StickyNote"
                  ? {
                      label: newLabel,
                      translations: {
                        ...(node.data.translations || {}),
                        [langKey]: newLabel,
                      },
                    }
                  : {
                      details: {
                        ...node.data.details,
                        title: newLabel,
                      },
                      translations: {
                        ...(node.data.translations || {}),
                        [langKey]: newLabel,
                      },
                    }),
              },
            };
          }
          return node;
        })
      );

      if (!isInitialLoad.current) {
        setHasUnsavedChanges(true);
      }
    },
    [setChiledNodes, setHasUnsavedChanges]
  );

  return { handleLabelChange };
};

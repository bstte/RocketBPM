import { useCallback } from "react";

export const useLabelChange = (setNodes, setHasUnsavedChanges = null, processLangRef = null, langMapRef = null) => {
  const handleLabelChange = useCallback(
    (nodeId, newLabel) => {
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) => {
          if (node.id !== nodeId) return node;

          // ⚡ For Edit Mode (multi-language)
          if (processLangRef && langMapRef) {
            const currentLangId = processLangRef.current;
            const langKey = langMapRef.current[Number(currentLangId)] || "en";

            return {
              ...node,
              data: {
                ...node.data,
                translations: {
                  ...(node.data.translations || {}),
                  [langKey]: newLabel,
                },
                label: newLabel,
              },
            };
          }

          // ⚡ For Draft & Publish (single field)
          return {
            ...node,
            data: { ...node.data, label: newLabel },
          };
        });

        // Set unsaved changes (Edit Mode only)
        if (setHasUnsavedChanges) {
          const changedNode = prevNodes.find((n) => n.id === nodeId);
          if (changedNode && changedNode.data.label !== newLabel) {
            setHasUnsavedChanges(true);
          }
        }

        return updatedNodes;
      });
    },
    [setNodes]
  );

  return { handleLabelChange };
};

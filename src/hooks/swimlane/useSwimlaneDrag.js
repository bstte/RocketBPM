import { useCallback } from "react";
import { centerChildInParent, getNearestParentNode } from "../../utils/swimlaneUtils";

export const useSwimlaneDrag = ({
    setChiledNodes,
    setKeepOldPosition,
    KeepOldPosition,
    nodes, // The grid nodes (parents)
    ChildNodes,
    setHasUnsavedChanges
}) => {

    const handleNodeDragStart = useCallback((event, node) => {
        setChiledNodes((prev) =>
            prev.map((child) =>
                child.id === node.id ? { ...child, parentId: undefined } : child
            )
        );

        setKeepOldPosition(node.position);
    }, [setChiledNodes, setKeepOldPosition]);

    const handleNodeDragStop = useCallback((event, node) => {
        // console.log("old nodes ", node);

        if (node.id.startsWith("level")) {
            // Find the nearest parent node
            const nearestParentNode = getNearestParentNode(node, nodes);

            if (node.type === "SwimlineRightsideBox") {
                const [, row, col] =
                    nearestParentNode?.row_id.split("_").map(Number) || [];
                if (!nearestParentNode || col !== 0 || row >= 6) {
                    setChiledNodes((prev) =>
                        prev.map((child) =>
                            child.id === node.id
                                ? { ...child, position: KeepOldPosition }
                                : child
                        )
                    );
                    return;
                }
            }

            if (node.type === "progressArrow") {
                const [, row, col] =
                    nearestParentNode?.row_id.split("_").map(Number) || [];

                // Ensure the node can only drop in the last row (row 6) and not in the first column (col !== 0)
                if (!nearestParentNode || row !== 6 || col === 0) {
                    setChiledNodes((prev) =>
                        prev.map((child) =>
                            child.id === node.id
                                ? { ...child, position: KeepOldPosition }
                                : child
                        )
                    );
                    return;
                }
            }

            if (node.type === "diamond" || node.type === "box") {
                const [, row, col] =
                    nearestParentNode?.row_id.split("_").map(Number) || [];

                // Ensure the node can drop in any row except the last row and not in the first column
                if (!nearestParentNode || row === 6 || col === 0) {
                    setChiledNodes((prev) =>
                        prev.map((child) =>
                            child.id === node.id
                                ? { ...child, position: KeepOldPosition }
                                : child
                        )
                    );
                    return;
                }
            }

            if (
                node.type === "StickyNote" ||
                node.type === "Yes" ||
                node.type === "No" ||
                node.type === "FreeText"
            ) {
                const flowContainer = document.querySelector(".publishcontainer");
                if (!flowContainer) return;

                const { left, top, right, bottom } =
                    flowContainer.getBoundingClientRect();
                const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
                if (!nodeElement) return;

                const nodeRect = nodeElement.getBoundingClientRect();
                const isOutOfBounds =
                    nodeRect.left < left ||
                    nodeRect.top < top ||
                    nodeRect.right > right ||
                    nodeRect.bottom > bottom;

                if (isOutOfBounds) {
                    setChiledNodes((prev) =>
                        prev.map((child) =>
                            child.id === node.id
                                ? { ...child, position: KeepOldPosition } // revert if out of bounds
                                : child
                        )
                    );
                }
                return;
            }

            if (nearestParentNode) {
                const updatedPosition = centerChildInParent(nearestParentNode, node);
                setHasUnsavedChanges(true);
                setChiledNodes((prev) =>
                    prev.map((child) =>
                        child.id === node.id
                            ? {
                                ...child,
                                parentNode: nearestParentNode.id,
                                position: updatedPosition,
                            }
                            : child
                    )
                );
            }
        } else {
            // Handle parent node dragging and adjust children
            const affectedChildren = ChildNodes.filter(
                (child) => child.parentNode === node.id
            );

            const updatedChildren = affectedChildren.map((child) => ({
                ...child,
                position: centerChildInParent(node, child),
            }));

            setChiledNodes((prev) =>
                prev.map(
                    (child) =>
                        updatedChildren.find((updated) => updated.id === child.id) || child
                )
            );
        }
    }, [ChildNodes, KeepOldPosition, nodes, setChiledNodes, setHasUnsavedChanges]);

    return { handleNodeDragStart, handleNodeDragStop };
};

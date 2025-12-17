import { MarkerType } from "@xyflow/react";

export const processDraftNodes = async ({
    data,
    currentLevel,
    api,
    Process_id,
    getLevelKey
}) => {
    const nodebgwidth = document.querySelector(".react-flow__node");
    const nodebgwidths = nodebgwidth
        ? nodebgwidth.getBoundingClientRect().width
        : 0;

    const nodebgheight = document.querySelector(".react-flow__node");
    const nodebgheights = nodebgheight
        ? nodebgheight.getBoundingClientRect().height
        : 0;
    const groupWidth = nodebgwidths;
    const groupHeight = nodebgheights;
    const childWidth = groupWidth * 0.9;
    const childHeight = groupHeight * 0.9;

    const parsedNodes = await Promise.all(
        data.nodes.map(async (node) => {
            const parsedData = JSON.parse(node.data || "{}");
            const parsedPosition = JSON.parse(node.position || '{"x":0,"y":0}');
            const parsedMeasured = JSON.parse(
                node.measured || '{"width":40,"height":40}'
            );

            let centeredPosition = parsedPosition;

            // Parent node positioning
            if (node.parent_id) {
                const parentNode = data.nodes.find(
                    (n) => n.node_id === node.parent_id
                );
                if (parentNode && parentNode.position) {
                    const parentPos = JSON.parse(parentNode.position);
                    const parentWidth = groupWidth;
                    const parentHeight = groupHeight;

                    // Center child relative to parent
                    centeredPosition = {
                        x: parentPos.x + parentWidth / 2 - childWidth / 2,
                        y: parentPos.y + parentHeight / 2 - childHeight / 2,
                    };
                }
            }
            let hasNextLevel = false;

            if (
                node.type === "progressArrow" &&
                parsedData?.processlink &&
                parsedData.processlink !== null &&
                parsedData.processlink !== ""
            ) {
                const match = parsedData.processlink.match(/level(\d+)/i);
                const extractedLevel = match ? parseInt(match[1]) : currentLevel;

                // 🔹 Increment level
                const newLevel = extractedLevel + 1;
                   const levelParam = getLevelKey(newLevel, parsedData.processlink);
                // const levelParam = `level${newLevel}_${parsedData.processlink}`;
                try {
                    const check = await api.checkRecord(levelParam, Process_id);

                    hasNextLevel = check?.status === true;
                } catch (e) {
                    console.error("checkRecord error", e);
                }
            }
            // Conditional styling
            const nodeStyle =
                node.type === "Yes" ||
                    node.type === "No" ||
                    node.type === "FreeText"
                    ? {} // No styles applied for these node types
                    : {
                        width: groupWidth,
                        height: groupHeight,
                        childWidth: childWidth,
                        childHeight: childHeight,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    };

            return {
                ...node,
                data: {
                    ...parsedData,
                    width_height: parsedMeasured,
                    defaultwidt: "40px",
                    defaultheight: "40px",
                    nodeResize: false,
                    hasNextLevel,
                },
                type: node.type,
                id: node.node_id,
                parentId: node.parent_id,
                extent: "parent",
                measured: parsedMeasured,
                position: centeredPosition,
                draggable: Boolean(node.draggable),
                animated: Boolean(node.animated),
                style: nodeStyle,
            };
        })
    );

    const parsedEdges = data.edges.map((edge) => {

        return {
            ...edge,
            animated: Boolean(edge.animated),
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#002060",
                width: 12,
                height: 12,
            },
            style: { stroke: "#002060", strokeWidth: 2 },
            type: "step",
        };
    });

    return { parsedNodes, parsedEdges };
};

import { MarkerType } from "@xyflow/react";

export const processEditNodes = async ({
  data,
  windowSize,
  currentLevel,
  api,
  Process_id,
  handleLabelChange,
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

      // Centralized size calculation
      const totalRows = 7;
      const totalColumns = 11;
      const groupWidth = nodebgwidths;
      const groupHeight = nodebgheights;
      const childWidth = groupWidth * 0.9;
      const childHeight = groupHeight * 0.9;

      const parsedNodes = await Promise.all(
        data.nodes.map(async (node) => {
          const { parent_id, ...remainingNodeProps } = node;
          const parsedData = JSON.parse(node.data);
          const parsedPosition = JSON.parse(node.position);
          const parsedMeasured = JSON.parse(node.measured);
          // console.log('parsedMeasured: ' + parsedMeasured);
          let centeredPosition = parsedPosition || { x: 0, y: 0 };

          // Parent node positioning
          if (parent_id) {
            const parentNode = data.nodes.find((n) => n.node_id === parent_id);
            if (parentNode && parentNode.position) {
              const parentPos = JSON.parse(parentNode.position);
              const parentWidth = windowSize.width / totalColumns - 14;
              const parentHeight = windowSize.height / totalRows - 14;
              const childWidth = parentWidth * 0.9;
              const childHeight = parentHeight * 0.9;

              // Proper center calculation
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
            // console.log("hasnect level",levelParam)
            //  console.log("hasnect level by genrate key",getLevelKeyby)
            try {
              const check = await api.checkRecord(levelParam, Process_id);

              hasNextLevel = check?.status === true;
            } catch (e) {
              console.error("checkRecord error", e);
            }
          }

          const nodeStyle =
            node.type === "Yes" ||
              node.type === "No" ||
              node.type === "FreeText" ||
              node.type === "StickyNote"
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
            ...remainingNodeProps,
            id: node.node_id,
            parentNode: parent_id,
            parentId: parent_id,
            data: {
              ...parsedData,
              onLabelChange: (newLabel) =>
                handleLabelChange(node.node_id, newLabel),
              width_height: parsedMeasured,
              defaultwidt: "40px",
              defaultheight: "40px",
              nodeResize: false,
              hasNextLevel,
            },
            type: node.type,
            extent: "parent",
            measured: parsedMeasured,
            position: centeredPosition,
            draggable: true,
            isNew: true,

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
    //   console.log("swimalne data", parsedNodes);

 
  return { parsedNodes, parsedEdges };
};

import { v4 as uuidv4 } from "uuid";
import { getNextPageGroupId } from "../../API/api";

export const useSwimlaneAddNode = ({
    ChildNodes,
    setChiledNodes,
    nodes, // grid nodes
    currentParentId,
    currentLevel,
    setHasUnsavedChanges,
    handleLabelChange,
    selectedGroupId,
    selectedexistigrolenodeId,
    langMapRef,
    processLangRef
}) => {

    const addNode = async (
        type,
        position,
        label = "",
        existingNodeData = null
    ) => {
        let PageGroupId;
        const Page_Title = "Swimlane";
        if (!ChildNodes[0]?.page_group_id) {
            try {
                const response = await getNextPageGroupId(Page_Title);
                PageGroupId = response.next_PageGroupId;
            } catch (error) {
                console.error("next id error", error)
            }

        } else {

            PageGroupId = ChildNodes[0]?.page_group_id;
        }

        if (
            type === "Yes" ||
            type === "No" ||
            type === "FreeText" ||
            type === "StickyNote"
        ) {
            if (!position) {
                alert("Position not defind");
                return;
            }

            const newNodeId = uuidv4().replace(/-/g, "").substring(0, 6);
            const newNode = {
                id:
                    currentParentId !== null
                        ? `level${currentLevel}_${newNodeId}_${currentParentId}`
                        : `level${currentLevel}_${newNodeId}`,

                data: {
                    label: type === "FreeText" || type === "StickyNote" ? label : "",
                    shape: type,
                    onLabelChange: (newLabel) =>
                        handleLabelChange(
                            currentParentId !== null
                                ? `level${currentLevel}_${newNodeId}_${currentParentId}`
                                : `level${currentLevel}_${newNodeId}`,
                            newLabel
                        ),
                    defaultwidt: "40px",
                    defaultheight: "40px",
                    translations:
                        type === "FreeText"
                            ? existingNodeData?.translations || {
                                [langMapRef.current[Number(processLangRef.current)] || "en"]:
                                    label,
                            }
                            : {},
                    width_height:
                        type === "StickyNote"
                            ? { width: 240, height: 180 }
                            : { width: 326, height: 90 },
                    autoFocus: true,

                    nodeResize: false,

                    updateWidthHeight: (id, size) => {
                        setChiledNodes((prevNodes) =>
                            prevNodes.map((node) =>
                                node.id === id
                                    ? {
                                        ...node,
                                        data: {
                                            ...node.data,
                                            width_height: size,
                                        },
                                    }
                                    : node
                            )
                        );
                    },
                },
                type: type,
                position: position,
                draggable: true,
                isNew: true,
                animated: true,
                page_title: "Swimlane",
                status: "draft",
                page_group_id: PageGroupId,
            };

            setChiledNodes((nds) => [...nds, newNode]);
            setHasUnsavedChanges(true);
        } else if (selectedGroupId) {
            const selectedGroup = nodes.find((node) => node.id === selectedGroupId);

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
            const centeredPosition = {
                x: selectedGroup.position.x + (groupWidth - childWidth) / 14 - 1,
                y: selectedGroup.position.y + (groupHeight - childHeight) / 14 - 0.5,
            };

            const newNodeId = uuidv4();
            const newNode = {
                id:
                    currentParentId !== null
                        ? `level${currentLevel}_${newNodeId}_${currentParentId}`
                        : `level${currentLevel}_${newNodeId}`,
                node_id:
                    currentParentId !== null
                        ? `level${currentLevel}_${newNodeId}_${currentParentId}`
                        : `level${currentLevel}_${newNodeId}`,

                parentNode: selectedGroupId,
                extent: "parent",
                data: existingNodeData
                    ? {
                        ...existingNodeData,
                        onLabelChange: (newLabel) =>
                            handleLabelChange(
                                currentParentId !== null
                                    ? `level${currentLevel}_${newNodeId}_${currentParentId}`
                                    : `level${currentLevel}_${newNodeId}`,
                                newLabel
                            ),
                    }
                    : {
                        label: label,
                        details: { title: label, content: "" },
                        link: selectedexistigrolenodeId ? selectedexistigrolenodeId : "",
                        autoFocus: true,
                        shape: type,
                        onLabelChange: (newLabel) =>
                            handleLabelChange(
                                currentParentId !== null
                                    ? `level${currentLevel}_${newNodeId}_${currentParentId}`
                                    : `level${currentLevel}_${newNodeId}`,
                                newLabel
                            ),

                        defaultwidt: "40px",
                        defaultheight: "40px",
                        nodeResize: false,
                    },
                type: type,
                position: centeredPosition,
                draggable: true,
                isNew: true,
                animated: true,
                page_title: "Swimlane",
                status: "draft",
                page_group_id: PageGroupId,
                style: {
                    width: nodebgwidths,
                    childWidth: nodebgwidths,
                    childHeight: nodebgheights,
                    height: nodebgheights,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                },
            };

            setChiledNodes((nds) => [...nds, newNode]);
            setHasUnsavedChanges(true);
        } else {
            alert("Please select a group node first!");
        }
    };

    return { addNode };
};

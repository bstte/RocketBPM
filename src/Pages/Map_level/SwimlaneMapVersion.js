

import React, {
    useMemo,
    useState,
    useEffect,
} from "react";
import {
    ReactFlow,
    ReactFlowProvider,
    SmoothStepEdge,
    BezierEdge,
    StraightEdge,
    Background,
    MarkerType,
    ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Header from "../../components/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import generateNodesAndEdges from "../../AllNode/SwimlineNodes/generateNodesAndEdges";
import styles from "./SwimlaneStyles";
import '../../Css/Swimlane.css';
import { useDynamicHeight } from "../../hooks/useDynamicHeight";
import PublishNodeType from "./PublishedProcess/PublishNodeType";
import { getVersionViewData } from "../../API/api";



const SwimlaneMapVersion = () => {

    const { height, appHeaderHeight, remainingHeight } = useDynamicHeight();


    const [windowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const { processId, level, version, pageTitle } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [Title, SetTitle] = useState("")
    const ParentPageGroupId = queryParams.get("ParentPageGroupId");
    const user = useMemo(() => {
        try {
            const queryParams = new URLSearchParams(location.search);
            const userParam = queryParams.get("user");
            return userParam ? JSON.parse(decodeURIComponent(userParam)) : null;
        } catch (e) {
            console.error("Failed to parse user from query", e);
            return null;
        }
    }, [location.search]);


    const { nodes: initialNodes } = useMemo(
        () => generateNodesAndEdges(windowSize.width, windowSize.height, 'viewmode', height + 10, appHeaderHeight, remainingHeight),
        [windowSize, height, appHeaderHeight, remainingHeight]
    );
    useEffect(() => {
        setNodes(initialNodes);
    }, [initialNodes]);

    const navigate = useNavigate();
    const [ChildNodes, setChiledNodes] = useState([]);
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState([]);

    const nodeTypes = PublishNodeType;
    const edgeTypes = useMemo(
        () => ({
            smoothstep: SmoothStepEdge,
            bezier: BezierEdge,
            straight: StraightEdge,
        }),
        []
    );


    useEffect(() => {
        const fetchVersionData = async () => {
            try {
                const response = await getVersionViewData(processId, level, version, pageTitle);
                const { nodes, edges } = response;
                SetTitle(nodes[0]?.version)
                const nodebgwidth = document.querySelector(".react-flow__node");
                const nodebgwidths = nodebgwidth ? nodebgwidth.getBoundingClientRect().width : 0;

                const nodebgheight = document.querySelector(".react-flow__node");
                const nodebgheights = nodebgheight ? nodebgheight.getBoundingClientRect().height : 0;

                const groupWidth = nodebgwidths;
                const groupHeight = nodebgheights;
                const childWidth = groupWidth * 0.9;
                const childHeight = groupHeight * 0.9;

                const parsedNodes = nodes.map((node) => {
                    const parsedData = JSON.parse(node.data || "{}");
                    const parsedPosition = JSON.parse(node.position || "{\"x\":0,\"y\":0}");
                    const parsedMeasured = JSON.parse(node.measured || "{\"width\":40,\"height\":40}");

                    let centeredPosition = parsedPosition;

                    if (node.parentId) {
                      const parentNode = nodes.find((n) => n.node_id === node.parentId);
                      if (parentNode && parentNode.position) {
                        const parentPos = JSON.parse(parentNode.position);
                        const parentWidth = groupWidth;
                        const parentHeight = groupHeight;
                    
                        centeredPosition = {
                          x: parentPos.x + parentWidth / 2 - childWidth / 2,
                          y: parentPos.y + parentHeight / 2 - childHeight / 2,
                        };
                      }
                    }
                    
                    // Parent node positioning
                    const nodeStyle =
                        node.type === "Yes" || node.type === "No" || node.type === "FreeText"
                            ? {} // No styles applied for these node types
                            : {
                                width: groupWidth,
                                height: groupHeight,
                                childWidth: childWidth,
                                childHeight: childHeight,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            };

                    return {
                        ...node,
                        data: {
                            ...parsedData,
                            width_height: parsedMeasured,
                            defaultwidt: "40px",
                            defaultheight: "40px",
                            nodeResize: false,
                        },
                        type: node.type,
                        id: node.node_id,
                        parentId: node.parentId,
                        extent: "parent",
                        measured: parsedMeasured,
                        position: centeredPosition,
                        draggable: Boolean(node.draggable),
                        animated: Boolean(node.animated),
                        style: nodeStyle,

                    };

                });

                const parsedEdges = edges.map((edge) => {
                    const sourceNode = nodes.find((node) => node.node_id === edge.source);
                    const targetNode = nodes.find((node) => node.node_id === edge.target);

                    const sourcePosition = sourceNode ? JSON.parse(sourceNode.position || '{"x":0,"y":0}') : { x: 0, y: 0 };
                    const targetPosition = targetNode ? JSON.parse(targetNode.position || '{"x":0,"y":0}') : { x: 0, y: 0 };
                    // Check if in same row or same column
                    const isSameRow = Math.abs(sourcePosition.y - targetPosition.y) < 10; // 10px tolerance
                    const isSameColumn = Math.abs(sourcePosition.x - targetPosition.x) < 10;

                    const edgeType = (isSameRow || isSameColumn) ? "default" : "step";

                    return {
                        ...edge,
                        animated: Boolean(edge.animated),
                        markerEnd: { type: MarkerType.ArrowClosed, color: "#002060", width: 12, height: 12 },
                        style: { stroke: "#002060", strokeWidth: 2 },
                        type: edgeType,
                    };
                });

                console.log("parsedEdges version",parsedEdges)
                setChiledNodes(parsedNodes);
                setEdges(parsedEdges);
            } catch (error) {
                console.error("Error fetching version data:", error);
                alert("Error fetching versioned data");
            }
        };

        fetchVersionData();
    }, [processId, level, version, pageTitle]);


    const memoizedNodeTypes = useMemo(() => nodeTypes, [nodeTypes]);
    const memoizedEdgeTypes = useMemo(() => edgeTypes, [edgeTypes]);





    return (
        <div>
            <Header
                title={`Version: ${Title}`}
                Page={"ViewProcessmapVersion"}
                iconNames={{}}
                onSave={() => { }}
                onPublish={() => { }}
                handleBackdata={() => {
                    navigate(-1);
                }}
            />
            <div class="maincontainer" style={{ ...styles.appContainer, height: remainingHeight }}>
                <ReactFlowProvider>
                    <div className="ss_publish_border" style={styles.scrollableWrapper}>
                    <ReactFlow
              nodes={[...nodes, ...ChildNodes]}
              edges={edges}

              connectionMode={ConnectionMode.Loose}

              proOptions={{ hideAttribution: true }}
              nodeTypes={memoizedNodeTypes}
              edgeTypes={memoizedEdgeTypes}
              minZoom={0}
              zoomOnScroll={false}
              zoomOnPinch={false}
              panOnDrag={false}
              panOnScroll={false}
              zoomOnDoubleClick={false}
              maxZoom={1}
              translateExtent={[
                [0, 0],
                [windowSize.width, windowSize.height],
              ]}
              defaultEdgeOptions={{ zIndex: 1 }}
              style={styles.rfStyle}
            >
              <Background color="#fff" gap={16} />
            </ReactFlow>
                    </div>

                </ReactFlowProvider>
            </div>
        </div>
    );
};

export default SwimlaneMapVersion;

import React, { useMemo, useState, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import generateNodesAndEdges from "../../AllNode/SwimlineNodes/generateNodesAndEdges";
import styles from "./SwimlaneStyles";
import "../../Css/Swimlane.css";
import { useDynamicHeight } from "../../hooks/useDynamicHeight";
import PublishNodeType from "./PublishedProcess/PublishNodeType";
import { getVersionViewData } from "../../API/api";
import YesNode from "../../AllNode/YesNode";
import NoNode from "../../AllNode/NoNode";
import VersionPopupView from "../../components/VersionPopupView";
import { useSelector } from "react-redux";
import { usePageGroupIdViewer } from "../../hooks/usePageGroupIdViewer";

const SwimlaneMapVersion = () => {
  const user = useSelector((state) => state.user.user);
  const { height, appHeaderHeight, remainingHeight } = useDynamicHeight();
  const safeRemainingHeight = Math.min(Math.max(remainingHeight, 588), 588);
  const [windowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { processId, level, version, pageTitle, user_id, currentParentId } =
    useParams();
  const [Title, SetTitle] = useState("");
  const [currentModeltitle, SetcurrentModeltitle] = useState("");

  const [showVersionPopup, setShowVersionPopup] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [revisionInfo, setRevisionInfo] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [versionStatus, setVersionStatus] = useState(null);
  const [versionDate, setVersionDate] = useState(null);
  const [processImg, setProcessImg] = useState(null);


  const { nodes: initialNodes } = useMemo(
    () =>
      generateNodesAndEdges(
        windowSize.width,
        windowSize.height,
        "viewmode",
        height + 10,
        appHeaderHeight,
        safeRemainingHeight
      ),
    [windowSize, height, appHeaderHeight, safeRemainingHeight]
  );
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  const navigate = useNavigate();
  const [ChildNodes, setChiledNodes] = useState([]);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [processDefaultlanguage_id, setprocessDefaultlanguage_id] =
    useState(null);
  const nodeTypes = PublishNodeType;
  const edgeTypes = useMemo(
    () => ({
      smoothstep: SmoothStepEdge,
      bezier: BezierEdge,
      straight: StraightEdge,
    }),
    []
  );

  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [originalDefaultLanguageId, setOriginalDefaultLanguageId] = useState(null);

  const fetchVersionData = async (language_id = null) => {
    try {
      const response = await getVersionViewData(
        processId,
        level,
        version,
        pageTitle,
        user_id,
        currentParentId,
        language_id
      );

      const {
        nodes,
        edges,
        title,
        processDefaultlanguage_id,
        supportedLanguages,
        OriginalDefaultlanguge_id,
        contact_info,
        revision_info,
        assigned_users
      } = response;
      SetcurrentModeltitle(title);
      setprocessDefaultlanguage_id(processDefaultlanguage_id);
      setSupportedLanguages(supportedLanguages || []);
      setOriginalDefaultLanguageId(OriginalDefaultlanguge_id);
      SetTitle(nodes[0]?.version);

      setContactInfo(contact_info);
      setRevisionInfo(revision_info);
      setAssignedUsers(assigned_users || []);
      setVersionStatus(response.status);
      setVersionDate(response.created_at);
      setProcessImg(response.Process_img);


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

      const parsedNodes = nodes.map((node) => {
        const parsedData = JSON.parse(node.data || "{}");
        const parsedPosition = JSON.parse(node.position || '{"x":0,"y":0}');
        const parsedMeasured = JSON.parse(
          node.measured || '{"width":40,"height":40}'
        );

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

        const sourcePosition = sourceNode
          ? JSON.parse(sourceNode.position || '{"x":0,"y":0}')
          : { x: 0, y: 0 };
        const targetPosition = targetNode
          ? JSON.parse(targetNode.position || '{"x":0,"y":0}')
          : { x: 0, y: 0 };
        // Check if in same row or same column
        const isSameRow = Math.abs(sourcePosition.y - targetPosition.y) < 10; // 10px tolerance
        const isSameColumn =
          Math.abs(sourcePosition.x - targetPosition.x) < 10;

        const edgeType = isSameRow || isSameColumn ? "default" : "step";

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
          type: edgeType,
        };
      });

      setChiledNodes(parsedNodes);
      setEdges(parsedEdges);
    } catch (error) {
      console.error("Error fetching version data:", error);
      alert("Error fetching versioned data");
    }
  };

  useEffect(() => {
    fetchVersionData();
  }, [processId, level, version, pageTitle]);

  const handleLanguageSwitch = (langId) => {
    fetchVersionData(langId);
  };

  const onShowVersion = () => {
    setShowVersionPopup(true);
  };

  const viewVersion = (pid, lvl, v) => {
    navigate(
      `/process/view/${pid}/${lvl}/${v}/${pageTitle}/${user_id}/${currentParentId}`
    );
    setShowVersionPopup(false);
  };

  const memoizedNodeTypes = useMemo(
    () => ({
      ...nodeTypes,
      Yes: (props) => (
        <YesNode
          {...props}
          processDefaultlanguage_id={processDefaultlanguage_id}
        />
      ),
      No: (props) => (
        <NoNode
          {...props}
          processDefaultlanguage_id={processDefaultlanguage_id}
        />
      ),
    }),
    [processDefaultlanguage_id]
  );
  const memoizedEdgeTypes = useMemo(() => edgeTypes, [edgeTypes]);

  return (
    <div>
      {showVersionPopup && (
        <VersionPopupView
          processId={processId}
          currentLevel={level}
          currentParentId={currentParentId}
          onClose={() => setShowVersionPopup(false)}
          viewVersion={viewVersion}
          LoginUser={user}
          title={currentModeltitle}
          type={pageTitle?.toLowerCase() === "swimlane" ? "Swimlane" : "ProcessMaps"}
          selectedLanguage={processDefaultlanguage_id}
          OriginalDefaultlanguge_id={originalDefaultLanguageId}
          contact_info={contactInfo}
          revision_info={revisionInfo}
          assigned_users={assignedUsers}
          status="Published"
          hideVersionTab={true}
        />
      )}
      <Header
        title={`${currentModeltitle} (Version: ${Title})`}
        Page={"ViewProcessmapVersion"}
        iconNames={{}}
        onSave={() => { }}
        onPublish={() => { }}
        onShowVersion={onShowVersion}
        handleBackdata={() => {
          navigate(-1);
        }}
        supportedLanguages={supportedLanguages}
        selectedLanguage={processDefaultlanguage_id}
        OriginalDefaultlanguge_id={originalDefaultLanguageId}
        handleSupportViewlangugeId={handleLanguageSwitch}
        getPublishedDate={versionStatus === "Published" ? versionDate : null}
        getDraftedDate={versionStatus !== "Published" ? versionDate : null}
        Process_img={processImg}
        status={versionStatus}
        processId={processId}
      />

      <div
        class="maincontainer"
        style={{ ...styles.appContainer, height: safeRemainingHeight }}
      >
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
            {usePageGroupIdViewer(ChildNodes)}
          </div>

        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default SwimlaneMapVersion;

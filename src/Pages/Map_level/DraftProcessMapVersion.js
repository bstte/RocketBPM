import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useMemo, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  SmoothStepEdge,
  BezierEdge,
  StraightEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "@xyflow/react/dist/style.css";
import PublishArrowBoxNode from "../../AllNode/PublishAllNode/PublishArrowBoxNode";
import PublishPentagonNode from "../../AllNode/PublishAllNode/PublishPentagonNode";
import StickyNote from "../../AllNode/StickyNote";
import Header from "../../components/Header";
import { getVersionViewData } from "../../API/api";
import { useDynamicHeight } from "../../hooks/useDynamicHeight";
import VersionPopupView from "../../components/VersionPopupView";
import { useSelector } from "react-redux";

const DraftProcessMapVersion = () => {
  const user = useSelector((state) => state.user.user);
  const { processId, level, version, pageTitle, user_id, currentParentId } =
    useParams();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [Title, SetTitle] = useState("");
  const [currentModeltitle, SetcurrentModeltitle] = useState("");

  const [showVersionPopup, setShowVersionPopup] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [revisionInfo, setRevisionInfo] = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);

  // const windowHeight = window.innerHeight;
  // const totalHeight = 0;

  const windowSize = {
    width: window.innerWidth - 300,
    height: window.innerHeight - 300,
  };

  const { remainingHeight } = useDynamicHeight();

  const memoizedNodeTypes = useMemo(
    () => ({
      progressArrow: PublishArrowBoxNode,
      pentagon: PublishPentagonNode,
      StickyNote: StickyNote,
    }),
    []
  );

  const memoizedEdgeTypes = useMemo(
    () => ({
      smoothstep: SmoothStepEdge,
      bezier: BezierEdge,
      straight: StraightEdge,
    }),
    []
  );
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const savedLang = localStorage.getItem("selectedLanguageId");
    return savedLang ? parseInt(savedLang) : null;
  });
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
      SetTitle(nodes[0]?.version);
      setSupportedLanguages(supportedLanguages || []);
      setSelectedLanguage(processDefaultlanguage_id);
      setOriginalDefaultLanguageId(OriginalDefaultlanguge_id);

      setContactInfo(contact_info);
      setRevisionInfo(revision_info);
      setAssignedUsers(assigned_users || []);

      const parsedNodes = nodes.map((node) => ({
        ...node,
        data: {
          ...JSON.parse(node.data),
          width_height: JSON.parse(node.measured),
        },
        id: node.node_id,
        position: JSON.parse(node.position),
        draggable: false,
      }));

      const parsedEdges = edges.map((edge) => ({
        ...edge,
        id: edge.edge_id,
        source: edge.source,
        target: edge.target,
        animated: edge.animated,
        style: { stroke: "#002060", strokeWidth: 2 },
        type: "step",
      }));
      console.log("parsedNodes", parsedNodes)


      setNodes(parsedNodes);
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
    localStorage.setItem("selectedLanguageId", langId);
    setSelectedLanguage(langId);
    console.log("langId", langId);
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

  const styles = {
    appContainer: {
      display: "flex",
      flexDirection: "column",
      // height: totalHeight > 0 ? `${windowHeight - totalHeight}px` : "auto",
      marginTop: "0px",
      backgroundColor: "#f8f9fa",
    },
    contentWrapper: {
      display: "flex",
      flex: 1,
      borderLeft: "1px solid #002060",
      borderRight: "1px solid #002060",
      borderBottom: "1px solid #002060",
    },
    flowContainer: {
      flex: 1,
      backgroundColor: "#ffffff",
      position: "relative",
    },
    reactFlowStyle: {
      width: "100%",
      height: "100%",
    },
  };
  const navigate = useNavigate();

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
          // Pass overridden data from API
          type={pageTitle === "Swimlane" ? "Swimlane" : "ProcessMaps"}
          selectedLanguage={selectedLanguage}
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
        iconNames={{}} // ✅ prevent crash if Header uses Object.keys
        onSave={() => { }} // optional stub functions
        onPublish={() => { }}
        onShowVersion={onShowVersion}
        handleBackdata={() => {
          navigate(-1);
        }}
        supportedLanguages={supportedLanguages}
        selectedLanguage={selectedLanguage}
        OriginalDefaultlanguge_id={originalDefaultLanguageId}
        handleSupportViewlangugeId={handleLanguageSwitch}
      />
      <ReactFlowProvider>
        <div
          className="app-container"
          style={{ ...styles.appContainer, height: remainingHeight }}
        >
          <div className="content-wrapper" style={styles.contentWrapper}>
            <div className="flow-container" style={styles.flowContainer}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={memoizedNodeTypes}
                edgeTypes={memoizedEdgeTypes}
                minZoom={0.1}
                fitView
                translateExtent={[
                  [1240, 410],
                  [windowSize.width, windowSize.height],
                ]}
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnDrag={false}
                panOnScroll={false}
                proOptions={{ hideAttribution: true }}
                maxZoom={0.6}
                style={styles.reactFlowStyle}
              ></ReactFlow>
            </div>
          </div>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default DraftProcessMapVersion;

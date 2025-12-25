import React, { useMemo, useEffect, useContext } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  SmoothStepEdge,
  BezierEdge,
  StraightEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams } from "react-router-dom";
import Header from "../../../components/Header";
import apiExports from "../../../API/api";
import { BreadcrumbsContext } from "../../../context/BreadcrumbsContext";
import PublishArrowBoxNode from "../../../AllNode/PublishAllNode/PublishArrowBoxNode";
import PublishPentagonNode from "../../../AllNode/PublishAllNode/PublishPentagonNode";
import { useSelector } from "react-redux";
import StickyNote from "../../../AllNode/StickyNote";
import VersionPopupView from "../../../components/VersionPopupView";
import { useDynamicHeight } from "../../../hooks/useDynamicHeight";
import useCheckFavorite from "../../../hooks/useCheckFavorite";
import { usePageGroupIdViewer } from "../../../hooks/usePageGroupIdViewer";
import { useTranslation } from "../../../hooks/useTranslation";
import { getLevelKey } from "../../../utils/getLevel";
import { useLabelChange } from "../../../hooks/useLabelChange";
import { useFetchNodes } from "../../../hooks/useFetchNodes";
import { useProcessNavigation } from "../../../hooks/useProcessNavigation";
import { buildProcessPath } from "../../../routes/buildProcessPath";

// Custom Hooks
import { useMapLevelViewState } from "../hooks/useMapLevelViewState";
import { useMapLevelViewHandlers } from "../hooks/useMapLevelViewHandlers";

const DraftProcesMapLevel = () => {
  const state = useMapLevelViewState();
  const {
    process_img, setprocess_img,
    showVersionPopup, setShowVersionPopup,
    checkpublish, Setcheckpublish,
    title, Settitle,
    TitleTranslation, SetTitleTranslation,
    setUser,
    setSupportedLanguages,
    setprocessDefaultlanguage_id,
    setOriginalDefaultlanguge_id,
    getDraftedDate, setDraftedDate,
    isFavorite, setIsFavorite,
    setIsNavigating,
    headerTitle, setHeaderTitle,
  } = state;

  const t = useTranslation();
  const { remainingHeight } = useDynamicHeight();
  const safeRemainingHeight = Math.min(Math.max(remainingHeight, 588), 588);
  const { goToProcess } = useProcessNavigation();
  const { level, parentId, processId } = useParams();
  const LoginUser = useSelector((state) => state.user.user);
  const currentLevel = level ? parseInt(level, 10) : 0;
  const currentParentId = parentId || null;
  const { addBreadcrumb, removeBreadcrumbsAfter, breadcrumbs, setBreadcrumbs } = useContext(BreadcrumbsContext);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const memoizedNodeTypes = useMemo(() => ({
    progressArrow: PublishArrowBoxNode,
    pentagon: PublishPentagonNode,
    StickyNote: StickyNote,
  }), []);

  const memoizedEdgeTypes = useMemo(() => ({
    smoothstep: SmoothStepEdge,
    bezier: BezierEdge,
    straight: StraightEdge,
  }), []);

  const { handleLabelChange } = useLabelChange(setNodes);

  const { fetchNodes } = useFetchNodes({
    getLevelKey,
    currentLevel,
    currentParentId,
    LoginUser,
    id: processId,
    setNodes,
    setEdges,
    setUser,
    setters: {
      Settitle,
      SetTitleTranslation,
      setprocess_img,
      setprocessDefaultlanguage_id,
      setOriginalDefaultlanguge_id,
      setSupportedLanguages,
      setDraftedDate
    },
    mode: "draft",
    handleLabelChange,
  });

  const handlers = useMapLevelViewHandlers({
    state,
    nodes,
    currentLevel,
    currentParentId,
    processId,
    LoginUser,
    fetchNodes,
    goToProcess,
    addBreadcrumb,
    setBreadcrumbs,
    breadcrumbs,
    viewMode: "draft"
  });

  useEffect(() => {
    const checkpublishfunction = async () => {
      const data = await apiExports.checkPublishRecord(getLevelKey(currentLevel, currentParentId), processId);
      Setcheckpublish(data?.status);
    };
    checkpublishfunction();
  }, [currentLevel, currentParentId, processId, Setcheckpublish]);

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguageId");
    fetchNodes(savedLang ? parseInt(savedLang) : state.processDefaultlanguage_id);
  }, [currentLevel]);

  useCheckFavorite({ id: processId, nodes, setIsFavorite });

  useEffect(() => {
    if (!title) return;
    const path = buildProcessPath({
      mode: "draft",
      view: "map",
      processId,
      level: currentLevel,
      parentId: currentLevel === 0 ? undefined : currentParentId,
    });
    const stateData = { id: processId, title, TitleTranslation };

    if (!breadcrumbs.some((b) => b.path === path)) {
      if (currentLevel >= 0 && state.isNavigating) {
        removeBreadcrumbsAfter(Math.max(1, currentLevel - 1));
      }
      addBreadcrumb(title, path, stateData);
    }
    setIsNavigating(false);
  }, [currentLevel, state.isNavigating, title, breadcrumbs]);

  useEffect(() => {
    setHeaderTitle(`${title}`);
  }, [title, setHeaderTitle]);

  return (
    <div>
      <Header
        title={headerTitle}
        onSave={handlers.navigateOnDraft}
        onPublish={() => console.log("save publish")}
        addNode={() => console.log("add node")}
        handleBackdata={() => console.log("handle back")}
        iconNames={{}}
        currentLevel={currentLevel}
        getDraftedDate={getDraftedDate}
        setIsNavigating={setIsNavigating}
        Page={"ViewDraftmodel"}
        isFavorite={isFavorite}
        Process_img={process_img}
        Procesuser={state.user || { id: null, role: "self", type: "self" }}
        checkpublish={checkpublish}
        onShowVersion={() => setShowVersionPopup(true)}
        savefav={handlers.handleFav}
        handleSupportViewlangugeId={handlers.handleSupportViewlangugeId}
        supportedLanguages={state.supportedLanguages}
        selectedLanguage={state.processDefaultlanguage_id}
        OriginalDefaultlanguge_id={state.OriginalDefaultlanguge_id}
        processId={processId}
      />
      <ReactFlowProvider>
        <div className="app-container" style={{ display: "flex", flexDirection: "column", height: safeRemainingHeight, backgroundColor: "#f8f9fa" }}>
          <div className="content-wrapper" style={{ display: "flex", flex: 1, border: "1px solid #002060", borderTop: "none" }}>
            <div className="flow-container" style={{ flex: 1, backgroundColor: "#ffffff", position: "relative" }}>
              <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(-35deg)",
                fontSize: "144px", fontWeight: "bold", color: "#ff364a0f", fontFamily: "'Poppins', sans-serif",
                zIndex: 0, pointerEvents: "none", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "4px",
              }}>
                {t("Draft")}
              </div>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handlers.handlenodeClick}
                nodeTypes={memoizedNodeTypes}
                edgeTypes={memoizedEdgeTypes}
                minZoom={0.1}
                fitView
                zoomOnScroll={false}
                zoomOnPinch={false}
                panOnDrag={false}
                panOnScroll={false}
                proOptions={{ hideAttribution: true }}
                maxZoom={0.6}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            {usePageGroupIdViewer(nodes)}
          </div>
        </div>
        {showVersionPopup && (
          <VersionPopupView
            processId={processId}
            currentLevel={currentLevel}
            onClose={() => setShowVersionPopup(false)}
            currentParentId={currentParentId}
            viewVersion={handlers.navigateToVersion}
            LoginUser={LoginUser}
            title={headerTitle}
            status={"draft"}
            type={"ProcessMaps"}
            selectedLanguage={state.processDefaultlanguage_id}
            OriginalDefaultlanguge_id={state.OriginalDefaultlanguge_id}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default DraftProcesMapLevel;

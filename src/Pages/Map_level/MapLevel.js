import React, { useCallback, useMemo, useEffect, useContext, useRef } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  SmoothStepEdge,
  BezierEdge,
  StraightEdge,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useLocation, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Popup from "../../components/Popup";
import ArrowBoxNode from "../../AllNode/ArrowBoxNode";
import PentagonNode from "../../AllNode/PentagonNode";
import { getLevelKey } from "../../utils/getLevel";
import { filter_draft } from "../../API/api";
import { BreadcrumbsContext } from "../../context/BreadcrumbsContext";
import CustomContextMenu from "../../components/CustomContextMenu";
import { useSelector } from "react-redux";
import "../../Css/MapLevel.css";
import StickyNote from "../../AllNode/StickyNote";
import VersionPopup from "./VersionPopup";
import { useDynamicHeight } from "../../hooks/useDynamicHeight";
import useCheckFavorite from "../../hooks/useCheckFavorite";
import { usePageGroupIdViewer } from "../../hooks/usePageGroupIdViewer";
import TranslationPopup from "../../hooks/TranslationPopup";
import { useLangMap } from "../../hooks/useLangMap";
import PublishPopup from "../../components/PublishPopup";
import EditorialChangePopup from "../../components/EditorialChangePopup";
import { useFetchVersions } from "../../hooks/useFetchVersions";
import ContentChangePopup from "../../components/ContentChangePopup";
import { useFetchNodes } from "../../hooks/useFetchNodes";
import { useLabelChange } from "../../hooks/useLabelChange";
import { useProcessNavigation } from "../../hooks/useProcessNavigation";
import { buildProcessPath } from "../../routes/buildProcessPath";

// Custom Hooks
import { useMapLevelState } from "./hooks/useMapLevelState";
import { useMapLevelHandlers } from "./hooks/useMapLevelHandlers";

const MapLevel = () => {
  const state = useMapLevelState();
  const {
    selectedNodeId, setSelectedNodeId,
    checkpublish, Setcheckpublish,
    showPublishPopup, setShowPublishPopup,
    showEditorialPopup, setShowEditorialPopup,
    showContentPopup, setShowContentPopup,
    showTranslationPopup, setShowTranslationPopup,
    showVersionPopup, setShowVersionPopup,
    showContextMenu, setShowContextMenu,
    showPopup, setShowPopup,
    selectedNode, setSelectedNode,
    popupTitle, setPopupTitle,
    checkRecord, setcheckRecord,
    getPublishedDate, setgetPublishedDate,
    getDraftedDate, setDraftedDate,
    process_img, setprocess_img,
    processDefaultlanguage_id, setprocessDefaultlanguage_id,
    OriginalDefaultlanguge_id, setOriginalDefaultlanguge_id,
    versionPopupPayload, setversionPopupPayload,
    ParentPageGroupId, SetParentPageGroupId,
    title, Settitle,
    TitleTranslation, SetTitleTranslation,
    isFavorite, setIsFavorite,
    isNavigating, setIsNavigating,
    supportedLanguages, setSupportedLanguages,
    user, setUser,
    contextMenuPosition, setContextMenuPosition,
    OriginalPosition, setOriginalPosition,
    popupPosition, setPopupPosition,
    translationDefaults, setTranslationDefaults,
    hasUnsavedChanges, setHasUnsavedChanges
  } = state;

  const { remainingHeight } = useDynamicHeight();
  const safeRemainingHeight = Math.min(Math.max(remainingHeight, 588), 588);
  const { level, parentId, processId } = useParams();
  const location = useLocation();
  const LoginUser = useSelector((state) => state.user.user);
  const langMap = useLangMap();
  const { goToProcess } = useProcessNavigation();
  const currentLevel = level ? parseInt(level, 10) : 0;
  const currentParentId = parentId || null;
  const { addBreadcrumb, removeBreadcrumbsAfter, breadcrumbs } = useContext(BreadcrumbsContext);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const memoizedNodeTypes = useMemo(() => ({
    progressArrow: (props) => <ArrowBoxNode {...props} selectedNodeId={selectedNodeId} />,
    pentagon: (props) => <PentagonNode {...props} selectedNodeId={selectedNodeId} />,
    StickyNote: (props) => <StickyNote {...props} selectedNodeId={selectedNodeId} editable={true} />,
  }), [selectedNodeId]);

  const memoizedEdgeTypes = useMemo(() => ({
    smoothstep: SmoothStepEdge,
    bezier: BezierEdge,
    straight: StraightEdge,
  }), []);

  const processLangRef = useRef(processDefaultlanguage_id);
  const langMapRef = useRef(langMap);

  useEffect(() => {
    processLangRef.current = processDefaultlanguage_id;
    langMapRef.current = langMap;
  }, [processDefaultlanguage_id, langMap]);

  const { handleLabelChange } = useLabelChange(setNodes, setHasUnsavedChanges, processLangRef, langMapRef);

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
      setgetPublishedDate,
      setDraftedDate,
      Settitle,
      SetTitleTranslation,
      setprocess_img,
      setSupportedLanguages,
      setprocessDefaultlanguage_id,
      setOriginalDefaultlanguge_id,
      SetParentPageGroupId
    },
    mode: "edit",
    handleLabelChange,
  });

  const handlers = useMapLevelHandlers({
    state,
    nodes,
    setNodes,
    edges,
    setEdges,
    currentLevel,
    currentParentId,
    processId,
    LoginUser,
    fetchNodes,
    handleLabelChange,
    goToProcess,
    addBreadcrumb,
    langMap,
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguageId");
    fetchNodes(savedLang ? parseInt(savedLang) : processDefaultlanguage_id);
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
      if (currentLevel >= 0 && isNavigating) {
        removeBreadcrumbsAfter(Math.max(1, currentLevel - 1));
      }
      addBreadcrumb(title, path, stateData);
    }
    setIsNavigating(false);
  }, [currentLevel, isNavigating, currentParentId, title, processId, breadcrumbs]);

  useEffect(() => {
    const checkpublishfunction = async () => {
      if (currentLevel !== 0 && ParentPageGroupId) {
        try {
          const response = await filter_draft(ParentPageGroupId);
          Setcheckpublish(!response?.data);
        } catch (error) {
          console.error("filter draft error", error);
        }
      }
    };
    checkpublishfunction();
  }, [ParentPageGroupId, currentLevel]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Delete" && selectedNode) handlers.deleteNode();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedNode, handlers.deleteNode]);

  const handleGlobalContextMenu = (event) => {
    if (event.target.closest(".react-flow__node")) return;
    event.preventDefault();
    setShowContextMenu(true);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setOriginalPosition({ x: event.clientX - 90, y: event.clientY - 90 });
    setShowPopup(false);
  };

  const handlePageClick = useCallback(() => {
    setShowPopup(false);
    setShowContextMenu(false);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handlePageClick);
    return () => document.removeEventListener("click", handlePageClick);
  }, [handlePageClick]);

  const { responseData: revisionresponse, refetch } = useFetchVersions({
    processId, currentLevel, currentParentId, LoginUser, status: "draft"
  });

  const handleSavePublish = async () => {
    const latestData = await refetch();
    const contact = latestData?.contact_info;
    if (!contact || Object.values(contact).every(list => !list || list.length === 0)) {
      alert("Please assign Process Owner / Process Domain Owner and Process Modeler to publish the model.");
      return;
    }
    setShowPublishPopup(true);
  };

  return (
    <div>
      <Header
        title={title}
        onSave={() => handlers.handleSaveNodes("draft")}
        onPublish={handleSavePublish}
        addNode={(type) => handlers.addNode(type, { x: 200, y: 200 })}
        handleBackdata={handlers.handleBack}
        iconNames={{}}
        currentLevel={currentLevel}
        getPublishedDate={getPublishedDate}
        getDraftedDate={getDraftedDate}
        setIsNavigating={setIsNavigating}
        Page={"Draft"}
        onExit={(type) => type === "exit" ? handlers.handleBack().then(res => res && handlers.goToProcess({ mode: "draft", view: "map", processId, level: currentLevel, parentId: currentLevel === 0 ? undefined : currentParentId })) : null}
        savefav={handlers.handleFav}
        isFavorite={isFavorite}
        Process_img={process_img}
        Procesuser={user || {}}
        checkpublish={checkpublish}
        onShowVersion={() => setShowVersionPopup(true)}
        processId={processId}
        handleSupportViewlangugeId={handlers.handleLanguageSwitch}
        supportedLanguages={supportedLanguages}
        selectedLanguage={processDefaultlanguage_id}
        OriginalDefaultlanguge_id={OriginalDefaultlanguge_id}
      />
      <ReactFlowProvider>
        <div className="app-container" style={{ display: "flex", flexDirection: "column", height: safeRemainingHeight, backgroundColor: "#f8f9fa" }}>
          <div className="content-wrapper" style={{ display: "flex", flex: 1, border: "1px solid #002060", borderTop: "none" }}>
            <div className="flow-container" style={{ flex: 1, backgroundColor: "#ffffff", position: "relative" }} onContextMenu={handleGlobalContextMenu}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={(e, node) => setSelectedNodeId(node.id)}
                nodeTypes={memoizedNodeTypes}
                edgeTypes={memoizedEdgeTypes}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                panOnDrag={false}
                onNodeDragStop={handlers.handleNodeDragStop}
                onNodeContextMenu={handlers.handleNodeRightClick}
                proOptions={{ hideAttribution: true }}
                snapToGrid={true}
                snapGrid={[20, 20]}
                style={{ width: "100%", height: "100%" }}
              >
                <Background variant={BackgroundVariant.Lines} gap={20} size={1} color="rgba(0,0,0,0.15)" />
              </ReactFlow>
              <CustomContextMenu
                showContextMenu={showContextMenu}
                contextMenuPosition={contextMenuPosition}
                handleContextMenuOptionClick={(type) => handlers.addNode(type, { x: OriginalPosition.x, y: OriginalPosition.y })}
              />
              <Popup
                showPopup={showPopup}
                popupPosition={popupPosition}
                popupTitle={popupTitle}
                selectedNodeType={nodes.find((node) => node.id === selectedNode)?.type}
                switchNodeType={(type) => {
                  setNodes(nds => nds.map(n => n.id === selectedNode ? { ...n, type, data: { ...n.data, shape: type } } : n));
                  setHasUnsavedChanges(true);
                  setShowPopup(false);
                }}
                handleCreateNewNode={handlers.handleCreateNewNode}
                deleteNode={handlers.deleteNode}
                translation={handlers.translation}
                condition={checkRecord}
              />
            </div>
            {usePageGroupIdViewer(nodes)}
          </div>
        </div>
        <TranslationPopup
          isOpen={showTranslationPopup}
          onClose={() => setShowTranslationPopup(false)}
          defaultValues={translationDefaults}
          onSubmit={(values) => {
            handlers.updateNodeTranslations(selectedNode, values);
            setShowTranslationPopup(false);
          }}
          supportedLanguages={supportedLanguages}
        />
        <PublishPopup
          isOpen={showPublishPopup}
          onClose={() => setShowPublishPopup(false)}
          onNext={handlers.handleNext}
          revisionresponse={revisionresponse}
          selectedLanguage={processDefaultlanguage_id}
        />
        <EditorialChangePopup
          isOpen={showEditorialPopup}
          onBack={() => { setShowEditorialPopup(false); setShowPublishPopup(true); }}
          onPublish={handlers.editorialPublish}
        />
        <ContentChangePopup
          isOpen={showContentPopup}
          type={"ProcessMaps"}
          onBack={() => { setShowContentPopup(false); setShowPublishPopup(true); }}
          onStartApproval={handlers.handleContentSubmit}
          revisionresponse={revisionresponse}
        />
        {showVersionPopup && (
          <VersionPopup
            processId={processId}
            currentLevel={currentLevel}
            onClose={() => setShowVersionPopup(false)}
            currentParentId={currentParentId}
            viewVersion={(pid, lvl, v) => window.location.href = `/process-version/${pid}/${lvl}/${v}/ProcessMap/${LoginUser?.id}/${currentParentId}`}
            LoginUser={LoginUser}
            title={title}
            handleSaveVersionDetails={(p) => { setversionPopupPayload(p); setShowVersionPopup(false); }}
            status={"draft"}
            type={"ProcessMaps"}
            versionPopupPayload={versionPopupPayload}
            supportedLanguages={supportedLanguages}
            selectedLanguage={processDefaultlanguage_id}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default MapLevel;

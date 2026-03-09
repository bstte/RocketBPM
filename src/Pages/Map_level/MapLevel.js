import React, { useCallback, useMemo, useEffect, useContext, useRef, useState } from "react";
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
import CustomAlert from "../../components/CustomAlert";
import ArrowBoxNode from "../../AllNode/ArrowBoxNode";
import PentagonNode from "../../AllNode/PentagonNode";
import { getLevelKey } from "../../utils/getLevel";
import { filter_draft, moveNode, publishMovedNode, contectApprovalStatus } from "../../API/api";
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
import { isRTLLanguage, getDirection } from "../../utils/rtlUtils";
import { useLanguages } from "../../hooks/useLanguages";
import MoveNodePopup from "../../components/MoveNodePopup";
import { useApprovalStatus } from "../../hooks/useApprovalStatus";
import { useTranslation } from "../../hooks/useTranslation";

// Custom Hooks
import { useMapLevelState } from "./hooks/useMapLevelState";
import { useMapLevelHandlers } from "./hooks/useMapLevelHandlers";
import { useReconstructBreadcrumbs } from "../../hooks/useReconstructBreadcrumbs";

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
  const t = useTranslation();
  const { goToProcess } = useProcessNavigation();
  const currentLevel = level ? parseInt(level, 10) : 0;
  const currentParentId = parentId || null;
  const { addBreadcrumb, removeBreadcrumbsAfter, breadcrumbs } = useContext(BreadcrumbsContext);
  const { mode } = useParams();

  // Reconstruct breadcrumbs for direct links
  useReconstructBreadcrumbs("draft");

  // Use custom hook for approval status
  const { pendingApproval } = useApprovalStatus({
    processId,
    currentLevel,
    currentParentId
  });

  // Access control: Redirect to draft if request is pending and user tries to access edit mode
  const approvalStatus = pendingApproval?.approval?.status;

  useEffect(() => {
    if (mode === "edit" && approvalStatus === 0) {
      goToProcess({
        mode: "draft",
        view: "map",
        processId,
        level: currentLevel,
        parentId: currentParentId || undefined,
      });
    }
  }, [mode, approvalStatus, goToProcess, processId, currentLevel, currentParentId]);

  // Local RTL state based on process language (not profile language)
  const [isRTL, setIsRTL] = useState(false);
  const [direction, setDirection] = useState('ltr');

  const { languages } = useLanguages();

  // Move Node State
  const [isLoading, setIsLoading] = useState(false);

  const [showMovePopup, setShowMovePopup] = useState(false);

  const handleMoveNodeClick = () => {
    setShowPopup(false);
    setShowMovePopup(true);
  };



  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const memoizedNodeTypes = useMemo(() => ({
    progressArrow: (props) => <ArrowBoxNode {...props} isRTL={isRTL} />,
    pentagon: (props) => <PentagonNode {...props} isRTL={isRTL} />,
    StickyNote: (props) => <StickyNote {...props} editable={true} />,
  }), [isRTL]);

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
    t
  });

  const handleMoveConfirm = async (target) => {
    try {
      const response = await moveNode({
        node_id: selectedNode,
        target_process_id: target.processId,
        target_level: target.levelKey,
        target_parent_id: null,
        position: { x: 0, y: 0 },
      });

      // Clear cache for current level so the moved node disappears
      handlers.invalidateCache();

      // Clear cache for target level if target exists
      if (target.processId && target.levelKey) {
        handlers.invalidateCache(target.processId, target.levelKey);
      }

      setShowMovePopup(false);

      // If the node was published, ask if they want to publish it in the new location
      if (response && response.was_published) {
        CustomAlert.confirmAction({
          title: "Object Was Published",
          text: "The object you moved was published. Do you want to publish it here too?",
          confirmBtnText: "Yes, Publish",
          cancelBtnText: "No, Keep as Draft",
          confirmCallback: async () => {
            try {
              setIsLoading(true);
              await publishMovedNode({
                node_id: response.node_id,
                process_id: target.processId,
                level: target.levelKey
              });

              // Clear cache for target level AGAIN after publishing
              handlers.invalidateCache(target.processId, target.levelKey);

              CustomAlert.success("Success", "Node moved and published successfully");
              await fetchNodes(processDefaultlanguage_id);
            } catch (err) {
              console.error("Failed to publish moved node", err);
              CustomAlert.error("Error", "Failed to publish moved node");
            } finally {
              setIsLoading(false);
            }
          },
          cancelCallback: () => {
            CustomAlert.success("Success", "Node moved successfully as Draft");
          }
        });
      } else {
        CustomAlert.success("Success", "Node moved successfully");
      }

      // Refetch to update UI
      setIsLoading(true);
      await fetchNodes(processDefaultlanguage_id);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to move node", error);
      CustomAlert.error("Error", "Failed to move node");
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const savedLang = localStorage.getItem("selectedLanguageId");
      // Only fetch data on mount or level change
      await fetchNodes(savedLang ? parseInt(savedLang) : undefined);
      // console.log("calling")
      setIsLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    try {
      const response = await filter_draft(state.ParentPageGroupId);
      if (response.data === true) {
        CustomAlert.warning(t("Warning"), t("Publish all parent models first"));
        return false;
      }
    } catch (error) {
      console.error("filter draft error", error);
    }
    const latestData = await refetch();
    const contact = latestData?.contact_info;
    if (!contact || Object.values(contact).every(list => !list || list.length === 0)) {
      CustomAlert.info(t("Information"), t("Please assign Process Owner / Process Domain Owner and Process Modeler to publish the model."));
      return;
    }
    setShowPublishPopup(true);
  };


  return (
    <div dir="ltr">
      <Header
        title={title}
        onSave={() => handlers.handleSaveNodes("draft")}
        onPublish={() => handleSavePublish()}
        // onPublish={() => handlers.handleSaveNodes("Published")}
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
      /* New Props for Approval Flow */
      // revisionresponse={revisionresponse}
      // onApproveProcess={handlers.approveProcess}
      // onRequestChange={handlers.requestChange}
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
                className={isRTL ? 'rtl-flow' : ''}
              >
                <Background variant={BackgroundVariant.Lines} gap={20} size={1} color="rgba(0,0,0,0.15)" />
              </ReactFlow>
              {isLoading && (
                <div className="loading-overlay">
                  <div className="spinner"></div>
                  <div>Loading...</div>
                </div>
              )}
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
                duplicateNode={handlers.handleDuplicateNode}
                condition={checkRecord}
                moveNode={handleMoveNodeClick}
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
        <MoveNodePopup
          isOpen={showMovePopup}
          onClose={() => setShowMovePopup(false)}
          onMove={handleMoveConfirm}
          ProcessId={processId}
          currentParentId={currentParentId}
          processDefaultlanguage_id={processDefaultlanguage_id}
          currentLevel={currentLevel}
          userId={LoginUser?.id}
          selectedNodeId={selectedNode}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default MapLevel;

import React, { useMemo, useEffect, useContext, useState } from "react";
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
import { BreadcrumbsContext } from "../../../context/BreadcrumbsContext";
import PublishArrowBoxNode from "../../../AllNode/PublishAllNode/PublishArrowBoxNode";
import PublishPentagonNode from "../../../AllNode/PublishAllNode/PublishPentagonNode";
import { useSelector } from "react-redux";
import VersionPopupView from "../../../components/VersionPopupView";
import useCheckFavorite from "../../../hooks/useCheckFavorite";
import { usePageGroupIdViewer } from "../../../hooks/usePageGroupIdViewer";
import { getLevelKey } from "../../../utils/getLevel";
import { useLabelChange } from "../../../hooks/useLabelChange";
import { useFetchNodes } from "../../../hooks/useFetchNodes";
import { useProcessNavigation } from "../../../hooks/useProcessNavigation";
import { buildProcessPath } from "../../../routes/buildProcessPath";
import { isRTLLanguage, getDirection } from "../../../utils/rtlUtils";
import { useLanguages } from "../../../hooks/useLanguages";

// Custom Hooks
import { useMapLevelViewState } from "../hooks/useMapLevelViewState";
import { useMapLevelViewHandlers } from "../hooks/useMapLevelViewHandlers";

const PublishedMapLevel = () => {
  const state = useMapLevelViewState();
  const {
    process_img, setprocess_img,
    showVersionPopup, setShowVersionPopup,
    title, Settitle,
    TitleTranslation, SetTitleTranslation,
    setUser,
    setSupportedLanguages,
    setprocessDefaultlanguage_id,
    setOriginalDefaultlanguge_id,
    getPublishedDate, setgetPublishedDate,
    isFavorite, setIsFavorite,
    setIsNavigating,
    headerTitle, setHeaderTitle,
  } = state;

  const [remainingHeight, setRemainingHeight] = useState(0);
  const safeRemainingHeight = Math.min(Math.max(remainingHeight, 588), 588);
  const { goToProcess } = useProcessNavigation();
  const { level, parentId, processId } = useParams();
  const LoginUser = useSelector((state) => state.user.user);
  const currentLevel = level ? parseInt(level, 10) : 0;
  const currentParentId = parentId || null;
  const { addBreadcrumb, removeBreadcrumbsAfter, breadcrumbs, setBreadcrumbs } = useContext(BreadcrumbsContext);

  // Local RTL state based on process language
  const [isRTL, setIsRTL] = useState(false);
  const [direction, setDirection] = useState('ltr');
  const { languages } = useLanguages();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const memoizedNodeTypes = useMemo(() => ({
    progressArrow: (props) => <PublishArrowBoxNode {...props} isRTL={isRTL} />,
    pentagon: (props) => <PublishPentagonNode {...props} isRTL={isRTL} />,
  }), [isRTL]);

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
      setgetPublishedDate,
    },
    mode: "publish",
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
    viewMode: "publish"
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("selectedLanguageId");
    fetchNodes(savedLang ? parseInt(savedLang) : state.processDefaultlanguage_id);

    // Also set RTL on initial load
    if (languages.length > 0) {
      const langId = savedLang ? parseInt(savedLang) : state.processDefaultlanguage_id;
      if (langId) {
        const currentLang = languages.find(l => l.id === langId);
        if (currentLang?.code) {
          const rtl = isRTLLanguage(currentLang.code);
          const dir = getDirection(currentLang.code);
          setIsRTL(rtl);
          setDirection(dir);
        }
      }
    }
  }, [currentLevel, languages, state.processDefaultlanguage_id]);

  useCheckFavorite({ id: processId, nodes, setIsFavorite });

  // Update RTL based on process language
  useEffect(() => {
    if (state.processDefaultlanguage_id && languages.length > 0) {
      const currentLang = languages.find(l => l.id === state.processDefaultlanguage_id);
      if (currentLang?.code) {
        const rtl = isRTLLanguage(currentLang.code);
        const dir = getDirection(currentLang.code);
        setIsRTL(rtl);
        setDirection(dir);
      }
    }
  }, [state.processDefaultlanguage_id, languages]);

  // Listen for language switcher changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const savedLangId = localStorage.getItem("selectedLanguageId");
      if (savedLangId && languages.length > 0) {
        const currentLang = languages.find(l => l.id === parseInt(savedLangId));
        if (currentLang?.code) {
          const rtl = isRTLLanguage(currentLang.code);
          const dir = getDirection(currentLang.code);
          setIsRTL(rtl);
          setDirection(dir);
        }
      }
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, [languages]);

  useEffect(() => {
    if (!title) return;
    const path = buildProcessPath({
      mode: "published",
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
    <div dir="ltr">
      <Header
        title={headerTitle}
        onSave={handlers.navigateOnDraft}
        onPublish={() => console.log("save publish")}
        addNode={() => console.log("add node")}
        handleBackdata={() => console.log("handle back")}
        iconNames={{}}
        currentLevel={currentLevel}
        getPublishedDate={getPublishedDate}
        setIsNavigating={setIsNavigating}
        Page={"Published"}
        isFavorite={isFavorite}
        Process_img={process_img}
        Procesuser={state.user}
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
                className={isRTL ? 'rtl-flow' : ''}
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
            status={"Published"}
            type={"ProcessMaps"}
            selectedLanguage={state.processDefaultlanguage_id}
            OriginalDefaultlanguge_id={state.OriginalDefaultlanguge_id}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default PublishedMapLevel;

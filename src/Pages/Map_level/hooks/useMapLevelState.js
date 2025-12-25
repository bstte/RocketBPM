import { useState } from "react";

export const useMapLevelState = () => {
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [checkpublish, Setcheckpublish] = useState(true);
    const [revisionData, setrevisionData] = useState(null);
    const [showPublishPopup, setShowPublishPopup] = useState(false);
    const [showEditorialPopup, setShowEditorialPopup] = useState(false);
    const [showContentPopup, setShowContentPopup] = useState(false);
    const [showTranslationPopup, setShowTranslationPopup] = useState(false);
    const [showVersionPopup, setShowVersionPopup] = useState(false);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [selectedNode, setSelectedNode] = useState(null);
    const [popupTitle, setPopupTitle] = useState("");
    const [checkRecord, setcheckRecord] = useState(null);
    const [getPublishedDate, setgetPublishedDate] = useState("");
    const [getDraftedDate, setDraftedDate] = useState("");
    const [process_img, setprocess_img] = useState("");
    const [processDefaultlanguage_id, setprocessDefaultlanguage_id] = useState(null);
    const [OriginalDefaultlanguge_id, setOriginalDefaultlanguge_id] = useState(null);
    const [versionPopupPayload, setversionPopupPayload] = useState("");
    const [ParentPageGroupId, SetParentPageGroupId] = useState(null);
    const [title, Settitle] = useState("");
    const [TitleTranslation, SetTitleTranslation] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [supportedLanguages, setSupportedLanguages] = useState([]);
    const [user, setUser] = useState(null);

    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [OriginalPosition, setOriginalPosition] = useState({ x: 0, y: 0 });
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

    const [translationDefaults, setTranslationDefaults] = useState({
        en: "",
        de: "",
        es: "",
    });

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    return {
        selectedNodeId, setSelectedNodeId,
        checkpublish, Setcheckpublish,
        revisionData, setrevisionData,
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
    };
};

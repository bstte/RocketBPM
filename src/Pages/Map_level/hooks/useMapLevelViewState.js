import { useState } from "react";

export const useMapLevelViewState = () => {
    const [process_img, setprocess_img] = useState("");
    const [showVersionPopup, setShowVersionPopup] = useState(false);
    const [checkpublish, Setcheckpublish] = useState(false);
    const [title, Settitle] = useState("");
    const [TitleTranslation, SetTitleTranslation] = useState("");
    const [user, setUser] = useState(null);
    const [supportedLanguages, setSupportedLanguages] = useState([]);
    const [processDefaultlanguage_id, setprocessDefaultlanguage_id] = useState(null);
    const [OriginalDefaultlanguge_id, setOriginalDefaultlanguge_id] = useState(null);
    const [getDraftedDate, setDraftedDate] = useState("");
    const [getPublishedDate, setgetPublishedDate] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const [headerTitle, setHeaderTitle] = useState("");

    return {
        process_img, setprocess_img,
        showVersionPopup, setShowVersionPopup,
        checkpublish, Setcheckpublish,
        title, Settitle,
        TitleTranslation, SetTitleTranslation,
        user, setUser,
        supportedLanguages, setSupportedLanguages,
        processDefaultlanguage_id, setprocessDefaultlanguage_id,
        OriginalDefaultlanguge_id, setOriginalDefaultlanguge_id,
        getDraftedDate, setDraftedDate,
        getPublishedDate, setgetPublishedDate,
        isFavorite, setIsFavorite,
        isNavigating, setIsNavigating,
        headerTitle, setHeaderTitle,
    };
};

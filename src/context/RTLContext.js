import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isRTLLanguage, getDirection, getLanguageCode } from '../utils/rtlUtils';
import { useLanguages } from '../hooks/useLanguages';
import { setTranslations } from '../redux/userSlice';
import { getPublicTranslations } from '../API/api';

// Create RTL Context
// NOTE: This context is kept for future use but currently NOT setting global dir attribute
// RTL is only applied to specific process pages (Map/Swimlane views)
const RTLContext = createContext({
    isRTL: false,
    direction: 'ltr',
    languageCode: 'en',
});

// RTL Provider Component
export const RTLProvider = ({ children }) => {
    const user = useSelector((state) => state.user.user);
    const { languages } = useLanguages();
    const [isRTL, setIsRTL] = useState(false);
    const [direction, setDirection] = useState('ltr');
    const [languageCode, setLanguageCode] = useState('en');
    const [isLoaded, setIsLoaded] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const initialize = async () => {
            // Get language from user settings or localStorage
            const savedLangId = localStorage.getItem('selectedLanguageId');
            const userLangId = user?.language_id;
            const currentLangId = savedLangId ? parseInt(savedLangId) : userLangId;

            if (currentLangId && languages.length > 0) {
                // Find language code from ID
                const code = getLanguageCode(currentLangId, languages);

                if (code) {
                    const rtl = isRTLLanguage(code);
                    const dir = getDirection(code);

                    setIsRTL(rtl);
                    setDirection(dir);
                    setLanguageCode(code);

                    document.documentElement.setAttribute('dir', dir);
                    document.body.setAttribute('dir', dir);
                    localStorage.setItem('appDirection', dir);
                }
                setIsLoaded(true);
            } else {
                // Default to browser language if no language is set
                const browserLang = navigator.language.split('-')[0];
                const rtl = isRTLLanguage(browserLang);
                const dir = getDirection(browserLang);

                setIsRTL(rtl);
                setDirection(dir);
                setLanguageCode(browserLang);
                document.documentElement.setAttribute('dir', dir);
                document.body.setAttribute('dir', dir);
                localStorage.setItem('appDirection', dir);

                // ✅ Fetch public translations from backend
                const token = localStorage.getItem('token');
                if (!token) {
                    try {
                        const trans = await getPublicTranslations(browserLang);
                        dispatch(setTranslations(trans));
                    } catch (error) {
                        console.error("Failed to fetch public translations:", error);
                    }
                }
                setIsLoaded(true);
            }
        };

        initialize();
    }, [user?.language_id, languages, dispatch]);

    // Also listen to localStorage changes (for language switching)
    useEffect(() => {
        const handleStorageChange = () => {
            const savedLangId = localStorage.getItem('selectedLanguageId');
            if (savedLangId && languages.length > 0) {
                const code = getLanguageCode(parseInt(savedLangId), languages);
                if (code) {
                    const rtl = isRTLLanguage(code);
                    const dir = getDirection(code);

                    setIsRTL(rtl);
                    setDirection(dir);
                    setLanguageCode(code);

                    // Set global dir attribute
                    document.documentElement.setAttribute('dir', dir);
                    document.body.setAttribute('dir', dir);
                    localStorage.setItem('appDirection', dir);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [languages]);

    const value = {
        isRTL,
        direction,
        languageCode,
    };

    if (!isLoaded) return null; // 🚀 Prevent flash of keys

    return <RTLContext.Provider value={value}>{children}</RTLContext.Provider>;
};

// Custom hook to use RTL context
export const useRTL = () => {
    const context = useContext(RTLContext);
    if (!context) {
        throw new Error('useRTL must be used within RTLProvider');
    }
    return context;
};

export default RTLContext;

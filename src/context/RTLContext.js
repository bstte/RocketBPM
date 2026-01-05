import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isRTLLanguage, getDirection, getLanguageCode } from '../utils/rtlUtils';
import { useLanguages } from '../hooks/useLanguages';

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

    useEffect(() => {
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

                // Set global dir attribute for non-process pages
                // Process pages (Map/Swimlane) manage their own local RTL
                document.documentElement.setAttribute('dir', dir);
                document.body.setAttribute('dir', dir);

                // Store in localStorage for persistence
                localStorage.setItem('appDirection', dir);
            }
        } else {
            // Default to LTR if no language is set
            setIsRTL(false);
            setDirection('ltr');
            setLanguageCode('en');
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.setAttribute('dir', 'ltr');
        }
    }, [user?.language_id, languages]);

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

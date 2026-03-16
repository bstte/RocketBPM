// src/hooks/useTranslation.js
import { useSelector } from 'react-redux';

export const useTranslation = () => {
  const translations = useSelector((state) => state.user.translations);

  const t = (key) => {
    // Return translation if exists, otherwise return the key itself
    if (translations && translations[key]) {
      return translations[key];
    }
    return key;
  };

  return t;
};

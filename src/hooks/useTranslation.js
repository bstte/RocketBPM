// src/hooks/useTranslation.js
import { useSelector } from 'react-redux';

export const useTranslation = () => {
  const translations = useSelector((state) => state.user.translations);

  const t = (key) => {
    return translations[key] || key; // fallback to key
  };

  return t;
};

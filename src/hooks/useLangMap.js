// src/hooks/useLangMap.js
import { useMemo } from "react";
import { useLanguages } from "./useLanguages";

export const useLangMap = () => {
  const { languages } = useLanguages();

  const langMap = useMemo(() => {
    return languages.reduce((acc, lang) => {
      acc[lang.id] = lang.code;
      return acc;
    }, {});
  }, [languages]);

  return langMap;
};
